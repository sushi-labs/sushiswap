/**
 * The two-step review -> confirm transaction flow.
 *
 * This is app domain logic, not a UI primitive: `DialogConfirm` resolves
 * explorer links via `getChainById`, and `confirm()` hardcodes the transition
 * between the two steps. The generic Radix wrappers it builds on (`Dialog`,
 * `DialogContent`, `DialogTitle`, ...) stay in `@sushiswap/ui`.
 */
export { DialogConfirm } from './dialog-confirm'
export {
  DialogProvider,
  DialogType,
  type UseDialog,
  useDialog,
} from './dialog-provider'
export { DialogReview } from './dialog-review'
