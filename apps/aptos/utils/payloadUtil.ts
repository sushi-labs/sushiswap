export function payloadArgs(
  contractAddress: string,
  amount_in: number,
  routes: any,
  minimumOut: number,
) {
  switch (routes.length) {
    case 2:
      return {
        type: 'entry_function_payload',
        type_arguments: [routes[0], routes[1]],
        arguments: [amount_in, minimumOut],
        function: `${contractAddress}::router::swap_exact_input`,
      }
    case 3:
      return {
        type: 'entry_function_payload',
        type_arguments: [routes[0], routes[1], routes[2]],
        arguments: [amount_in, minimumOut],
        function: `${contractAddress}::router::swap_exact_input_doublehop`,
      }
    case 4:
      return {
        type: 'entry_function_payload',
        type_arguments: [routes[0], routes[1], routes[2], routes[3]],
        arguments: [amount_in, minimumOut],
        function: `${contractAddress}::router::swap_exact_input_triplehop`,
      }
    case 5:
      return {
        type: 'entry_function_payload',
        type_arguments: [routes[0], routes[1], routes[2], routes[3], routes[4]],
        arguments: [amount_in, minimumOut],
        function: `${contractAddress}::router::swap_exact_input_quadruplehop`,
      }
    default:
      return undefined
  }
}
