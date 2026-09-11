type ProvisionPrivyWalletOptions = {
  authenticated: boolean
  createWallet(): Promise<unknown>
  login(): Promise<void>
}

export async function provisionPrivyWallet({
  authenticated,
  createWallet,
  login,
}: ProvisionPrivyWalletOptions): Promise<void> {
  if (authenticated) {
    await createWallet()
    return
  }

  await login()
}
