import { LeveledEffectAction } from "./LeveledEffectAction.js";
/**
 * @description A class for all effects that include a strength method
 * @extends {Actions.Effect.LeveledEffectAction}
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
class EffectActionWithStrength extends LeveledEffectAction {
    constructor() {
        super(...arguments);
        this.LEVEL_NAME = 'strength';
    }
    strength(value) {
        return this.setLevel(value);
    }
}
export { EffectActionWithStrength };
