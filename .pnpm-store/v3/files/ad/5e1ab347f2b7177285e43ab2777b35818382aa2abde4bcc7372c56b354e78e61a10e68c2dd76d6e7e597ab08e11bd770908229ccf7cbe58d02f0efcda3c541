declare class Layer {
    protected options: {
        url?: any;
        text?: string;
        fontAntialiasing?: string;
        fontHinting?: string;
        lineSpacing?: string;
        letterSpacing?: string;
        stroke?: string;
        textAlign?: string;
        textDecoration?: string;
        fontStyle?: string;
        fontWeight?: string;
        fontSize?: string | number;
        fontFamily?: string;
        format?: any;
        publicId?: string;
        type?: string;
        resourceType?: string;
        key?: string;
    };
    /**
     * Layer
     * @constructor Layer
     * @param {Object} options - layer parameters
     */
    constructor(options?: {});
    resourceType(value: string): this;
    type(value: string): this;
    publicId(value: string): this;
    /**
     * Get the public ID, formatted for layer parameter
     * @function Layer#getPublicId
     * @return {String} public ID
     */
    getPublicId(): string;
    /**
     * Get the public ID, with format if present
     * @function Layer#getFullPublicId
     * @return {String} public ID
     */
    getFullPublicId(): string;
    format(value: any): this | void;
    /**
     * generate the string representation of the layer
     * @function Layer#toString
     */
    toString(): string;
    clone(): Layer;
}
export default Layer;
