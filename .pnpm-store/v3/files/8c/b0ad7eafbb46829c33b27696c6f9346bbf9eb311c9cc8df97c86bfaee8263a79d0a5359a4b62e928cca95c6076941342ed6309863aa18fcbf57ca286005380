import { LeveledEffectAction } from "./LeveledEffectAction.js";
/**
 * @description A class that provides a built in level() method that sets the level of the effect
 * @extends {Actions.Effect.LeveledEffectAction}
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
class EffectActionWithLevel extends LeveledEffectAction {
    level(value) {
        this._actionModel.level = value;
        return this.setLevel(value);
    }
}
export { EffectActionWithLevel };
