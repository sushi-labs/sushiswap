"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_IMPORTS = exports.EVENT_METHOD_OVERRIDES = exports.generateGetEvent = exports.generateEventArgType = exports.generateEventInputs = exports.generateEventSignature = exports.generateInterfaceEventDescription = exports.generateEventTypeExport = exports.generateEventTypeExports = exports.generateEventFilters = void 0;
const typechain_1 = require("typechain");
const types_1 = require("./types");
function generateEventFilters(events) {
    if (events.length === 1) {
        const event = events[0];
        const typedEventFilter = `${generateEventIdentifier(event, { includeArgTypes: false })}Filter`;
        return `
      '${generateEventSignature(event)}'(${generateEventInputs(event.inputs)}): ${typedEventFilter};
      ${event.name}(${generateEventInputs(event.inputs)}): ${typedEventFilter};
    `;
    }
    else {
        return events
            .map((event) => {
            const typedEventFilter = `${generateEventIdentifier(event, { includeArgTypes: true })}Filter`;
            return `'${generateEventSignature(event)}'(${generateEventInputs(event.inputs)}): ${typedEventFilter};`;
        })
            .join('\n');
    }
}
exports.generateEventFilters = generateEventFilters;
function generateEventTypeExports(events) {
    if (events.length === 1) {
        return generateEventTypeExport(events[0], false);
    }
    else {
        return events.map((e) => generateEventTypeExport(e, true)).join('\n');
    }
}
exports.generateEventTypeExports = generateEventTypeExports;
function generateEventTypeExport(event, includeArgTypes) {
    const components = event.inputs.map((input, i) => { var _a; return ({ name: (_a = input.name) !== null && _a !== void 0 ? _a : `arg${i.toString()}`, type: input.type }); });
    const arrayOutput = (0, types_1.generateOutputComplexTypeAsArray)(components, { useStructs: true });
    const objectOutput = (0, types_1.generateOutputComplexTypesAsObject)(components, { useStructs: true }) || '{}';
    const identifier = generateEventIdentifier(event, { includeArgTypes });
    return `
    export interface ${identifier}Object ${objectOutput};
    export type ${identifier} = TypedEvent<${arrayOutput}, ${identifier}Object>;

    export type ${identifier}Filter = TypedEventFilter<${identifier}>;
  `;
}
exports.generateEventTypeExport = generateEventTypeExport;
function generateInterfaceEventDescription(event) {
    return `'${generateEventSignature(event)}': EventFragment;`;
}
exports.generateInterfaceEventDescription = generateInterfaceEventDescription;
function generateEventSignature(event) {
    return `${event.name}(${event.inputs.map((input) => input.type.originalType).join(',')})`;
}
exports.generateEventSignature = generateEventSignature;
function generateEventInputs(eventArgs) {
    if (eventArgs.length === 0) {
        return '';
    }
    return (eventArgs
        .map((arg, index) => {
        return `${arg.name ? (0, typechain_1.createPositionalIdentifier)(arg.name) : `arg${index}`}?: ${generateEventArgType(arg)}`;
    })
        .join(', ') + ', ');
}
exports.generateEventInputs = generateEventInputs;
function generateEventArgType(eventArg) {
    return eventArg.isIndexed ? `${(0, types_1.generateInputType)({ useStructs: true }, eventArg.type)} | null` : 'null';
}
exports.generateEventArgType = generateEventArgType;
function generateGetEvent(event, useSignature) {
    return `getEvent(nameOrSignatureOrTopic: '${useSignature ? generateEventSignature(event) : event.name}'): EventFragment;`;
}
exports.generateGetEvent = generateGetEvent;
function generateEventIdentifier(event, { includeArgTypes } = {}) {
    if (includeArgTypes) {
        return (0, typechain_1.getFullSignatureAsSymbolForEvent)(event) + '_Event';
    }
    else {
        return event.name + 'Event';
    }
}
exports.EVENT_METHOD_OVERRIDES = `
  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TEvent>>

  listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>
  listeners(eventName?: string): Array<Listener>
  removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this
  removeAllListeners(eventName?: string): this
  off: OnEvent<this>
  on: OnEvent<this>
  once: OnEvent<this>
  removeListener: OnEvent<this>
`;
exports.EVENT_IMPORTS = ['TypedEventFilter', 'TypedEvent', 'TypedListener', 'OnEvent'];
//# sourceMappingURL=events.js.map