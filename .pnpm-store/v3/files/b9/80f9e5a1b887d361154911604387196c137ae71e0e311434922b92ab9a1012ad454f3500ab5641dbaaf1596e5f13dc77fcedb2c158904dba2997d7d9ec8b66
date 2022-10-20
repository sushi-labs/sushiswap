// The `fvar` table stores font variation axes and instances.
// https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6fvar.html

import check from '../check';
import parse from '../parse';

function parseFvarAxis(data, start, names) {
    const axis = {};
    const p = new parse.Parser(data, start);
    axis.tag = p.parseTag();
    axis.minValue = p.parseFixed();
    axis.defaultValue = p.parseFixed();
    axis.maxValue = p.parseFixed();
    p.skip('uShort', 1); // reserved for flags; no values defined
    axis.name = names[p.parseUShort()] || {};
    return axis;
}

function parseFvarInstance(data, start, axes, names) {
    const inst = {};
    const p = new parse.Parser(data, start);
    inst.name = names[p.parseUShort()] || {};
    p.skip('uShort', 1); // reserved for flags; no values defined

    inst.coordinates = {};
    for (let i = 0; i < axes.length; ++i) {
        inst.coordinates[axes[i].tag] = p.parseFixed();
    }

    return inst;
}

function parseFvarTable(data, start, names) {
    const p = new parse.Parser(data, start);
    const tableVersion = p.parseULong();
    check.argument(
        tableVersion === 0x00010000,
        'Unsupported fvar table version.'
    );
    const offsetToData = p.parseOffset16();
    // Skip countSizePairs.
    p.skip('uShort', 1);
    const axisCount = p.parseUShort();
    const axisSize = p.parseUShort();
    const instanceCount = p.parseUShort();
    const instanceSize = p.parseUShort();

    const axes = [];
    for (let i = 0; i < axisCount; i++) {
        axes.push(
            parseFvarAxis(data, start + offsetToData + i * axisSize, names)
        );
    }

    const instances = [];
    const instanceStart = start + offsetToData + axisCount * axisSize;
    for (let j = 0; j < instanceCount; j++) {
        instances.push(
            parseFvarInstance(
                data,
                instanceStart + j * instanceSize,
                axes,
                names
            )
        );
    }

    return { axes: axes, instances: instances };
}

export default { parse: parseFvarTable };
