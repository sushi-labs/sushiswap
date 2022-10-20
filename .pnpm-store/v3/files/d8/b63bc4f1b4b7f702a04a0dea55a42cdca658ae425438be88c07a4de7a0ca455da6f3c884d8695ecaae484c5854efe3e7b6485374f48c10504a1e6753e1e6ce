// The `GPOS` table contains kerning pairs, among other things.
// https://www.microsoft.com/typography/OTSPEC/gpos.htm

import check from '../check';
import { decode } from '../types';
import parse from '../parse';

// Parse the metadata `meta` table.
// https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6meta.html
function parseMetaTable(data, start) {
    const p = new parse.Parser(data, start);
    const tableVersion = p.parseULong();
    check.argument(tableVersion === 1, 'Unsupported META table version.');
    p.parseULong(); // flags - currently unused and set to 0
    p.parseULong(); // tableOffset
    const numDataMaps = p.parseULong();

    const tags = {};
    for (let i = 0; i < numDataMaps; i++) {
        const tag = p.parseTag();
        const dataOffset = p.parseULong();
        const dataLength = p.parseULong();
        const text = decode.UTF8(data, start + dataOffset, dataLength);

        tags[tag] = text;
    }
    return tags;
}

export default { parse: parseMetaTable };
