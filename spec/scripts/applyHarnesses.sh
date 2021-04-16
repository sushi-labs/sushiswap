# Perl Documentation
# # 's/search/replace/g'

##################################################
#            Changes to MasterChefV2             #
##################################################

# SafeTransfer simplification
perl -0777 -i -pe 's/safeT/t/g' contracts/MasterChefV2.sol

# Adding public to totalAllocPoint
perl -0777 -i -pe 's/uint256 totalAllocPoint/uint256 public totalAllocPoint/g' contracts/MasterChefV2.sol

# Adding virtual to sushiPerBlock()
perl -0777 -i -pe 's/function sushiPerBlock\(\) public view returns/function sushiPerBlock\(\) public view virtual returns/g' contracts/MasterChefV2.sol

perl -0777 -i -pe 's/\) external payable returns\(/\) external virtual payable returns\(/g' node_modules/@boringcrypto/boring-solidity/contracts/BoringBatchable.sol

# Add transfer function declaration 
perl -0777 -i -pe 's/\}/function transfer\(address to, uint256 amount\) external;\n function transferFrom\(address from, address to, uint256 amount\) external;\n\}/g' node_modules/@boringcrypto/boring-solidity/contracts/interfaces/IERC20.sol