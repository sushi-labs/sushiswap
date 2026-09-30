// Invoke the deployed WASM binaries using minimal clients for their public ABI.
// No contract implementation or liquidity formula is linked into this harness.
use soroban_sdk::{
    testutils::{Address as _, Ledger},
    token, Address, Env, U256,
};
mod factory {
    use soroban_sdk::{contractclient, Address, Env, U256};
    #[contractclient(name = "Client")]
    #[allow(dead_code)]
    pub trait Contract {
        fn create_and_initialize_pool(
            env: Env,
            token_a: Address,
            token_b: Address,
            fee: u32,
            sqrt_price_x96: U256,
        ) -> Address;
        fn get_pool(env: Env, token_a: Address, token_b: Address, fee: u32) -> Option<Address>;
    }
}
mod manager {
    use soroban_sdk::{contractclient, contracttype, Address, Env, U256};
    #[contracttype]
    #[derive(Clone, Debug)]
    pub struct OracleHints {
        pub slot: u128,
        pub checkpoint: u32,
        pub checkpoint_min: u32,
    }
    #[contracttype]
    #[derive(Clone, Debug)]
    pub struct MintParams {
        pub token0: Address,
        pub token1: Address,
        pub fee: u32,
        pub sender: Address,
        pub recipient: Address,
        pub tick_lower: i32,
        pub tick_upper: i32,
        pub amount0_desired: u128,
        pub amount1_desired: u128,
        pub amount0_min: u128,
        pub amount1_min: u128,
        pub deadline: u64,
    }
    #[contractclient(name = "Client")]
    #[allow(dead_code)]
    pub trait Contract {
        fn init(
            env: Env,
            admin: Address,
            factory: Address,
            xlm_address: Address,
            token_descriptor: Address,
        );
        fn mint_with_hints(
            env: Env,
            params: MintParams,
            hints: OracleHints,
        ) -> (u32, u128, u128, u128);
        fn positions(
            env: Env,
            token_id: u32,
        ) -> (
            u64,
            Address,
            Address,
            u32,
            i32,
            i32,
            u128,
            U256,
            U256,
            u128,
            u128,
        );
        fn owner_of(env: Env, token_id: u32) -> Address;
        fn exists(env: Env, token_id: u32) -> bool;
    }
}
mod pool {
    use soroban_sdk::{contractclient, contracttype, Address, Env, U256};
    #[contracttype]
    #[derive(Clone, Debug)]
    pub struct Slot0 {
        pub sqrt_price_x96: U256,
        pub tick: i32,
    }
    #[contracttype]
    #[derive(Clone, Debug)]
    pub struct FixedPoint128(pub U256);
    #[contracttype]
    #[derive(Clone, Debug)]
    pub struct PositionData {
        pub liquidity: u128,
        pub fee_growth_inside_0_last_x128: FixedPoint128,
        pub fee_growth_inside_1_last_x128: FixedPoint128,
        pub tokens_owed_0: u128,
        pub tokens_owed_1: u128,
    }
    #[contractclient(name = "Client")]
    #[allow(dead_code)]
    pub trait Contract {
        fn get_oracle_hints(env: Env) -> crate::manager::OracleHints;
        fn slot0(env: Env) -> Slot0;
        fn liquidity(env: Env) -> u128;
        fn positions(
            env: Env,
            recipient: Address,
            tick_lower: i32,
            tick_upper: i32,
        ) -> PositionData;
    }
}
#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct Vector {
    name: String,
    fee: u32,
    sqrt_price_x96: String,
    tick_lower: i32,
    tick_upper: i32,
    amount0: String,
    amount1: String,
    liquidity: String,
    charge0: String,
    charge1: String,
    #[serde(default)]
    expect_error: bool,
    error_code: Option<u32>,
}
fn price(env: &Env, value: &str) -> U256 {
    value.bytes().fold(U256::from_u32(env, 0), |n, c| {
        n.mul(&U256::from_u32(env, 10))
            .add(&U256::from_u32(env, (c - b'0') as u32))
    })
}
fn run(
    v: &Vector,
    factory_wasm: &[u8],
    manager_wasm: &[u8],
    pool_wasm: &[u8],
) -> serde_json::Value {
    let env = Env::default();
    env.cost_estimate().budget().reset_unlimited();
    // Auth is deliberately mocked: this is an isolated execution, never a signed transaction.
    env.mock_all_auths();
    env.ledger().with_mut(|l| {
        l.timestamp = 1720000000;
        l.sequence_number = 100;
    });
    let admin = Address::generate(&env);
    let sender = Address::generate(&env);
    let a = env
        .register_stellar_asset_contract_v2(admin.clone())
        .address();
    let b = env
        .register_stellar_asset_contract_v2(admin.clone())
        .address();
    let (a, b) = if a < b { (a, b) } else { (b, a) };
    token::StellarAssetClient::new(&env, &a).mint(&sender, &i128::MAX);
    token::StellarAssetClient::new(&env, &b).mint(&sender, &i128::MAX);
    let hash = env.deployer().upload_contract_wasm(pool_wasm);
    let fid = env.register(factory_wasm, (&admin, &hash, &admin));
    let mid = env.register(manager_wasm, ());
    let f = factory::Client::new(&env, &fid);
    let m = manager::Client::new(&env, &mid);
    m.init(&admin, &fid, &a, &admin);
    let sqrt = price(&env, &v.sqrt_price_x96);
    let pid = f.create_and_initialize_pool(&b, &a, &v.fee, &sqrt);
    let p = pool::Client::new(&env, &pid);
    assert_eq!(f.get_pool(&a, &b, &v.fee), Some(pid.clone()));
    assert_eq!(p.slot0().sqrt_price_x96, sqrt);
    assert_eq!(
        f.create_and_initialize_pool(&a, &b, &v.fee, &sqrt.add(&U256::from_u32(&env, 1))),
        pid
    );
    assert_eq!(
        p.slot0().sqrt_price_x96,
        sqrt,
        "existing pool price changed"
    );
    let h = p.get_oracle_hints();
    let result = m.try_mint_with_hints(
        &manager::MintParams {
            token0: a.clone(),
            token1: b.clone(),
            fee: v.fee,
            sender: sender.clone(),
            recipient: sender.clone(),
            tick_lower: v.tick_lower,
            tick_upper: v.tick_upper,
            amount0_desired: v.amount0.parse::<u128>().unwrap(),
            amount1_desired: v.amount1.parse::<u128>().unwrap(),
            amount0_min: 0,
            amount1_min: 0,
            deadline: 1720001000,
        },
        &h,
    );
    if v.expect_error {
        assert!(
            result.is_err(),
            "{} should revert but got {result:?}",
            v.name
        );
        let code = v.error_code.expect("revert vectors must specify errorCode");
        assert_eq!(
            result.unwrap_err().unwrap(),
            soroban_sdk::Error::from_contract_error(code),
            "{} wrong error",
            v.name
        );
        assert!(!m.exists(&0));
        assert!(m.try_positions(&0).is_err());
        assert!(p.try_positions(&mid, &v.tick_lower, &v.tick_upper).is_err());
        assert_eq!(token::Client::new(&env, &a).balance(&sender), i128::MAX);
        assert_eq!(token::Client::new(&env, &b).balance(&sender), i128::MAX);
        assert_eq!(p.liquidity(), 0);
        return serde_json::json!({"name":v.name,"pass":true,"revert":format!("{result:?}")});
    }
    let (id, l, amount0, amount1) = result.unwrap().unwrap();
    assert_eq!(
        l,
        v.liquidity.parse::<u128>().unwrap(),
        "{} liquidity",
        v.name
    );
    assert_eq!(
        amount0,
        v.charge0.parse::<u128>().unwrap(),
        "{} token0",
        v.name
    );
    assert_eq!(
        amount1,
        v.charge1.parse::<u128>().unwrap(),
        "{} token1",
        v.name
    );
    assert!(amount0 <= v.amount0.parse::<u128>().unwrap());
    assert!(amount1 <= v.amount1.parse::<u128>().unwrap());
    assert_eq!(
        i128::MAX - token::Client::new(&env, &a).balance(&sender),
        amount0 as i128
    );
    assert_eq!(
        i128::MAX - token::Client::new(&env, &b).balance(&sender),
        amount1 as i128
    );
    assert_eq!(token::Client::new(&env, &a).balance(&pid), amount0 as i128);
    assert_eq!(token::Client::new(&env, &b).balance(&pid), amount1 as i128);
    assert_eq!(m.owner_of(&id), sender);
    let position = m.positions(&id);
    assert_eq!(
        (position.1, position.2, position.3, position.4, position.5, position.6),
        (a, b, v.fee, v.tick_lower, v.tick_upper, l)
    );
    assert_eq!(p.positions(&mid, &v.tick_lower, &v.tick_upper).liquidity, l);
    let current = p.slot0();
    assert_eq!(
        p.liquidity(),
        if current.tick >= v.tick_lower && current.tick < v.tick_upper {
            l
        } else {
            0
        }
    );
    serde_json::json!({"name":v.name,"pass":true,"liquidity":l.to_string(),"amount0":amount0.to_string(),"amount1":amount1.to_string(),"tick":current.tick})
}
fn main() {
    let mut args = std::env::args().skip(1);
    let wasm_dir = std::path::PathBuf::from(args.next().expect("WASM directory"));
    let path = args.next().expect("vector JSON path");
    let output = args.next().expect("results JSON path");
    let factory_wasm = std::fs::read(wasm_dir.join("factory.wasm")).unwrap();
    let manager_wasm = std::fs::read(wasm_dir.join("manager.wasm")).unwrap();
    let pool_wasm = std::fs::read(wasm_dir.join("pool.wasm")).unwrap();
    let vectors: Vec<Vector> =
        serde_json::from_str(&std::fs::read_to_string(path).unwrap()).unwrap();
    let mut results = Vec::new();
    for v in &vectors {
        let result = run(v, &factory_wasm, &manager_wasm, &pool_wasm);
        println!("{result}");
        results.push(result);
    }
    std::fs::write(output, serde_json::to_string_pretty(&results).unwrap()).unwrap();
    println!(
        "All {} exact deployed-WASM create/mint simulations passed",
        results.len()
    );
}
