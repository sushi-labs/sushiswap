import { AutoGravity } from "../../qualifiers/gravity/autoGravity/AutoGravity.js";
import { FocusOnGravity } from "../../qualifiers/gravity/focusOnGravity/FocusOnGravity.js";
import { autoGravity } from "../../qualifiers/gravity.js";
import { FocusOnValue } from "../../qualifiers/focusOn.js";
/**
 * true if gravity starts with 'auto' or 'auto:'
 * @param gravity
 */
function isIAutoGravityString(gravity) {
    return gravity && `${gravity}`.split(':')[0] === 'auto';
}
/**
 * Validate that given val is an ICompassGravity
 * @param gravity
 */
function isCompassGravity(gravity) {
    //const gravityString = `${(typeof gravity === "string" ? gravity : gravity.qualifierValue)}`;
    const gravityValue = getGravityValue(gravity);
    return ['north', 'center', 'east', 'west', 'south', 'north_west', 'south_east', 'south_west', 'north_east'].includes(gravityValue);
}
/**
 * Get the value of given gravity
 * @param gravity
 */
function getGravityValue(gravity) {
    return `${gravity}`.replace('g_', '');
}
/**
 * Creates a compassGravity model
 * @param gravity
 */
function createCompassGravityModel(gravity) {
    return {
        compass: getGravityValue(gravity),
        gravityType: 'direction'
    };
}
/**
 * Validate that given gravity is an instance of ocr gravity
 * @param gravity
 */
function isOcrGravity(gravity) {
    return getGravityValue(gravity) === 'ocr_text';
}
/**
 * Creates an ocr gravity model
 */
function createOcrGravityModel() {
    return {
        gravityType: 'ocr'
    };
}
/**
 * Validate that given gravity is an instance of AutoGravity
 * @param gravity
 */
function isAutoGravity(gravity) {
    return `${gravity.qualifierValue}`.split(':')[0] === 'auto';
}
/**
 * Create an instance of IAutoGravityObjectModel
 * @param gravity
 */
function createIAutoFocusObject(gravity) {
    const gravityString = gravity.toString();
    const values = gravityString.split('_');
    const result = {
        object: values[0]
    };
    if (values.length > 1) {
        if (values[1] === 'avoid') {
            result.avoid = true;
        }
        else {
            result.weight = +values[1];
        }
    }
    return result;
}
/**
 * Creates an auto gravity model from given AutoGravity
 * @param gravity
 */
function createAutoGravityModel(gravity) {
    let values;
    const gravityQualifier = gravity === 'auto' ? new AutoGravity() : gravity;
    if (`${gravity}`.startsWith('auto:')) {
        values = `${gravity}`.split(':').filter((v) => v !== 'auto');
    }
    else {
        values = gravityQualifier.qualifierValue.values.filter((v) => v !== 'auto');
    }
    const autoFocus = values.map(createIAutoFocusObject);
    return {
        gravityType: 'auto',
        autoFocus
    };
}
/**
 * Create IFocusOnGravityModel from FocusOnGravity
 * @param gravity
 */
function createFocusOnGravityModel(gravity) {
    const hasAutoGravity = `${gravity}`.split(':').includes('auto');
    const values = gravity.qualifierValue.values;
    const focusOnValues = hasAutoGravity ? values.slice(0, values.length - 1) : values;
    const result = {
        gravityType: 'object',
        focusOnObjects: focusOnValues.map((v) => `${v}`)
    };
    if (hasAutoGravity) {
        // Remove the first 'auto' value by slicing it, because it's added by autoGravity()
        const autoFocusObjects = values[values.length - 1].values.slice(1);
        const autoGravityInstance = autoGravity().autoFocus(...autoFocusObjects);
        result.fallbackGravity = createAutoGravityModel(autoGravityInstance);
    }
    return result;
}
/**
 * Creates a FocusOnGravity from given string
 * @param gravity
 */
function createFocusOnGravity(gravity) {
    const values = gravity.split(':');
    const focusOnValues = values.map((g) => new FocusOnValue(g));
    return new FocusOnGravity(focusOnValues);
}
/**
 * Create a model of given gravity
 * @param gravity
 */
export function createGravityModel(gravity) {
    if (isCompassGravity(gravity)) {
        return createCompassGravityModel(gravity);
    }
    if (isOcrGravity(gravity)) {
        return createOcrGravityModel();
    }
    if (isIAutoGravityString(gravity) || isAutoGravity(gravity)) {
        return createAutoGravityModel(gravity);
    }
    return createFocusOnGravityModel(typeof gravity === 'string' ? createFocusOnGravity(gravity) : gravity);
}
