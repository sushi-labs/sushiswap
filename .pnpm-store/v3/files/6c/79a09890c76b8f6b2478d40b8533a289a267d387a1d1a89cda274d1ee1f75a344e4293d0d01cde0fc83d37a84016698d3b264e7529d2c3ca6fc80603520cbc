import Expression from './expression.js';
/**
 * A list of keys used by the url() function.
 * @private
 */
export declare const URL_KEYS: string[];
/**
 * TransformationBase
 * Depends on 'configuration', 'parameters','util'
 * @internal
 */
declare class TransformationBase {
    private toOptions;
    private otherOptions;
    protected chained: any;
    private setParent;
    private getParent;
    protected param?: (value?: any, name?: any, abbr?: any, defaultValue?: any, process?: any) => this;
    protected rawParam?: (value?: any, name?: any, abbr?: any, defaultValue?: any, process?: any) => TransformationBase;
    protected rangeParam?: (value?: any, name?: any, abbr?: any, defaultValue?: any, process?: any) => TransformationBase;
    protected arrayParam: (value?: any, name?: any, abbr?: any, sep?: string, defaultValue?: any, process?: any) => TransformationBase;
    protected transformationParam: (value?: any, name?: any, abbr?: any, sep?: string, defaultValue?: any, process?: any) => TransformationBase;
    protected layerParam: (value?: any, name?: any, abbr?: any) => TransformationBase;
    protected getValue: (name: any) => any;
    protected get: (name: any) => any;
    private remove;
    private keys;
    private toPlainObject;
    private resetTransformations;
    chain: () => Transformation;
    /**
     * The base class for transformations.
     * Members of this class are documented as belonging to the {@link Transformation} class for convenience.
     * @class TransformationBase
     */
    constructor(options: any);
    /**
     * Merge the provided options with own's options
     * @param {Object} [options={}] key-value list of options
     * @returns {Transformation} Returns this instance for chaining
     */
    fromOptions(options?: {}): this;
    fromTransformation(other: any): this;
    /**
     * Set a parameter.
     * The parameter name `key` is converted to
     * @param {string} key - the name of the parameter
     * @param {*} values - the value of the parameter
     * @returns {Transformation} Returns this instance for chaining
     */
    set(key: string, ...values: string[]): this;
    hasLayer(): any;
    /**
     * Generate a string representation of the transformation.
     * @function Transformation#serialize
     * @return {string} Returns the transformation as a string
     */
    serialize(): any;
    /**
     * Provide a list of all the valid transformation option names
     * @function Transformation#listNames
     * @private
     * @return {Array<string>} a array of all the valid option names
     */
    static listNames(): string[];
    /**
     * Returns the attributes for an HTML tag.
     * @function Cloudinary.toHtmlAttributes
     * @return PlainObject
     */
    toHtmlAttributes(): any;
    static isValidParamName(name: string): boolean;
    /**
     * Delegate to the parent (up the call chain) to produce HTML
     * @function Transformation#toHtml
     * @return {string} HTML representation of the parent if possible.
     * @example
     * tag = cloudinary.ImageTag.new("sample", {cloud_name: "demo"})
     * // ImageTag {name: "img", publicId: "sample"}
     * tag.toHtml()
     * // <img src="http://res.cloudinary.com/demo/image/upload/sample">
     * tag.transformation().crop("fit").width(300).toHtml()
     * // <img src="http://res.cloudinary.com/demo/image/upload/c_fit,w_300/sample">
     */
    toHtml(): any;
    toString(): any;
    clone(): TransformationBase;
}
/**
 * Transformation Class methods.
 * This is a list of the parameters defined in Transformation.
 * Values are camelCased.
 * @const Transformation.methods
 * @private
 * @ignore
 * @type {Array<string>}
 */
/**
 * Parameters that are filtered out before passing the options to an HTML tag.
 *
 * The list of parameters is a combination of `Transformation::methods` and `Configuration::CONFIG_PARAMS`
 * @const {Array<string>} Transformation.PARAM_NAMES
 * @private
 * @ignore
 * @see toHtmlAttributes
 */
declare class Transformation extends TransformationBase {
    /**
     * Represents a single transformation.
     * @class Transformation
     * @example
     * t = new cloudinary.Transformation();
     * t.angle(20).crop("scale").width("auto");
     *
     * // or
     *
     * t = new cloudinary.Transformation( {angle: 20, crop: "scale", width: "auto"});
     * @see <a href="https://cloudinary.com/documentation/image_transformation_reference"
     *  target="_blank">Available image transformations</a>
     * @see <a href="https://cloudinary.com/documentation/video_transformation_reference"
     *  target="_blank">Available video transformations</a>
     */
    constructor(options?: {});
    /**
     * Convenience constructor
     * @param {Object} options
     * @return {Transformation}
     * @example cl = cloudinary.Transformation.new( {angle: 20, crop: "scale", width: "auto"})
     */
    static new(options?: {
        serialize?: () => any;
    }): Transformation;
    angle(value: string | number): this;
    audioCodec(value: string | number): this;
    audioFrequency(value: string | number): this;
    aspectRatio(value: string | number): this;
    background(value: string | number): this;
    bitRate(value: string | number): this;
    border(value: string | number): this;
    color(value: string | number): this;
    colorSpace(value: string | number): this;
    crop(value: string | number): this;
    customFunction(value: any): this;
    customPreFunction(value: any): TransformationBase;
    defaultImage(value: string): this;
    delay(value: string | number): this;
    density(value: string | number): this;
    duration(value: string | number): this;
    dpr(value: string | number): this;
    effect(value: string | Array<string | number>): this;
    else(): Expression | this;
    endIf(): Expression | this;
    endOffset(value: string | number): this;
    fallbackContent(value: string): this;
    fetchFormat(value: string): this;
    format(value: string): this;
    flags(value: string): this;
    gravity(value: any): this;
    fps(value: string | Array<string | number>): this;
    height(value: string | number): this;
    htmlHeight(value: string): this;
    htmlWidth(value: string): this;
    if(value?: string): Expression | this;
    keyframeInterval(value: number): this;
    ocr(value: any): this;
    offset(value: any): this;
    opacity(value: number): this;
    overlay(value: string | object): this;
    page(value: number): this;
    poster(value: string | object): this;
    prefix(value: string): this;
    quality(value: string | number): this;
    radius(value: "max" | number): this;
    rawTransformation(value: any): this;
    size(value: string): this;
    sourceTypes(value: object): this;
    sourceTransformation(value: any): this;
    startOffset(value: string | number): this;
    streamingProfile(value: string): this;
    transformation(value: any): this;
    underlay(value: string): this;
    variable(name: string, value: any): this;
    variables(values: Array<[string, any]>): this;
    videoCodec(value: string | number | Object): this;
    videoSampling(value: string | number): this;
    width(value: string | number): this;
    x(value: number): this;
    y(value: number): this;
    zoom(value: number | string): this;
}
export default Transformation;
