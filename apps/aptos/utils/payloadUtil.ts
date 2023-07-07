export function payloadArgs(amount_in: number, token: any, minimumOut: number) {
  const allRoutes = token.route
  let functionName
  let TYPE_ARGS = []

  const payloadReturn = {}

  console.log(allRoutes)
  switch (allRoutes.length) {
    case 2:
      return {
        type: 'entry_function_payload',
        type_arguments: [token.route[0], token.route[1]],
        arguments: [amount_in, minimumOut],
        function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::router::swap_exact_input`,
      }
      break
    case 3:
      return {
        type: 'entry_function_payload',
        type_arguments: [token.route[0], token.route[1], token.route[2]],
        arguments: [amount_in, minimumOut],
        function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::router::swap_exact_input_doublehop`,
      }
      break
    case 4:
      return {
        type: 'entry_function_payload',
        type_arguments: [token.route[0], token.route[1], token.route[2], token.route[3]],
        arguments: [amount_in, minimumOut],
        function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::router::swap_exact_input_triplehop`,
      }
      break
    case 5:
      return {
        type: 'entry_function_payload',
        type_arguments: [token.route[0], token.route[1], token.route[2], token.route[3], token.route[4]],
        arguments: [amount_in, minimumOut],
        function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::router::swap_exact_input_quadruplehop`,
      }
      break
    default:
      return undefined
  }
  return undefined
}
