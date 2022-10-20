import splitCurve from './split';

const commandTokenRegex = /[MLCSTQAHVZmlcstqahv]|-?[\d.e+-]+/g;
/**
 * List of params for each command type in a path `d` attribute
 */
const typeMap = {
  M: ['x', 'y'],
  L: ['x', 'y'],
  H: ['x'],
  V: ['y'],
  C: ['x1', 'y1', 'x2', 'y2', 'x', 'y'],
  S: ['x2', 'y2', 'x', 'y'],
  Q: ['x1', 'y1', 'x', 'y'],
  T: ['x', 'y'],
  A: ['rx', 'ry', 'xAxisRotation', 'largeArcFlag', 'sweepFlag', 'x', 'y'],
  Z: [],
};

// Add lower case entries too matching uppercase (e.g. 'm' == 'M')
Object.keys(typeMap).forEach((key) => {
  typeMap[key.toLowerCase()] = typeMap[key];
});

function arrayOfLength(length, value) {
  const array = Array(length);
  for (let i = 0; i < length; i++) {
    array[i] = value;
  }

  return array;
}

/**
 * Converts a command object to a string to be used in a `d` attribute
 * @param {Object} command A command object
 * @return {String} The string for the `d` attribute
 */
function commandToString(command) {
  return `${command.type}${typeMap[command.type]
    .map((p) => command[p])
    .join(',')}`;
}

/**
 * Converts command A to have the same type as command B.
 *
 * e.g., L0,5 -> C0,5,0,5,0,5
 *
 * Uses these rules:
 * x1 <- x
 * x2 <- x
 * y1 <- y
 * y2 <- y
 * rx <- 0
 * ry <- 0
 * xAxisRotation <- read from B
 * largeArcFlag <- read from B
 * sweepflag <- read from B
 *
 * @param {Object} aCommand Command object from path `d` attribute
 * @param {Object} bCommand Command object from path `d` attribute to match against
 * @return {Object} aCommand converted to type of bCommand
 */
function convertToSameType(aCommand, bCommand) {
  const conversionMap = {
    x1: 'x',
    y1: 'y',
    x2: 'x',
    y2: 'y',
  };

  const readFromBKeys = ['xAxisRotation', 'largeArcFlag', 'sweepFlag'];

  // convert (but ignore M types)
  if (aCommand.type !== bCommand.type && bCommand.type.toUpperCase() !== 'M') {
    const aConverted = {};
    Object.keys(bCommand).forEach((bKey) => {
      const bValue = bCommand[bKey];
      // first read from the A command
      let aValue = aCommand[bKey];

      // if it is one of these values, read from B no matter what
      if (aValue === undefined) {
        if (readFromBKeys.includes(bKey)) {
          aValue = bValue;
        } else {
          // if it wasn't in the A command, see if an equivalent was
          if (aValue === undefined && conversionMap[bKey]) {
            aValue = aCommand[conversionMap[bKey]];
          }

          // if it doesn't have a converted value, use 0
          if (aValue === undefined) {
            aValue = 0;
          }
        }
      }

      aConverted[bKey] = aValue;
    });

    // update the type to match B
    aConverted.type = bCommand.type;
    aCommand = aConverted;
  }

  return aCommand;
}

/**
 * Interpolate between command objects commandStart and commandEnd segmentCount times.
 * If the types are L, Q, or C then the curves are split as per de Casteljau's algorithm.
 * Otherwise we just copy commandStart segmentCount - 1 times, finally ending with commandEnd.
 *
 * @param {Object} commandStart Command object at the beginning of the segment
 * @param {Object} commandEnd Command object at the end of the segment
 * @param {Number} segmentCount The number of segments to split this into. If only 1
 *   Then [commandEnd] is returned.
 * @return {Object[]} Array of ~segmentCount command objects between commandStart and
 *   commandEnd. (Can be segmentCount+1 objects if commandStart is type M).
 */
function splitSegment(commandStart, commandEnd, segmentCount) {
  let segments = [];

  // line, quadratic bezier, or cubic bezier
  if (
    commandEnd.type === 'L' ||
    commandEnd.type === 'Q' ||
    commandEnd.type === 'C'
  ) {
    segments = segments.concat(
      splitCurve(commandStart, commandEnd, segmentCount)
    );

    // general case - just copy the same point
  } else {
    const copyCommand = Object.assign({}, commandStart);

    // convert M to L
    if (copyCommand.type === 'M') {
      copyCommand.type = 'L';
    }

    segments = segments.concat(
      arrayOfLength(segmentCount - 1).map(() => copyCommand)
    );
    segments.push(commandEnd);
  }

  return segments;
}
/**
 * Extends an array of commandsToExtend to the length of the referenceCommands by
 * splitting segments until the number of commands match. Ensures all the actual
 * points of commandsToExtend are in the extended array.
 *
 * @param {Object[]} commandsToExtend The command object array to extend
 * @param {Object[]} referenceCommands The command object array to match in length
 * @param {Function} excludeSegment a function that takes a start command object and
 *   end command object and returns true if the segment should be excluded from splitting.
 * @return {Object[]} The extended commandsToExtend array
 */
function extend(commandsToExtend, referenceCommands, excludeSegment) {
  // compute insertion points:
  // number of segments in the path to extend
  const numSegmentsToExtend = commandsToExtend.length - 1;

  // number of segments in the reference path.
  const numReferenceSegments = referenceCommands.length - 1;

  // this value is always between [0, 1].
  const segmentRatio = numSegmentsToExtend / numReferenceSegments;

  // create a map, mapping segments in referenceCommands to how many points
  // should be added in that segment (should always be >= 1 since we need each
  // point itself).
  // 0 = segment 0-1, 1 = segment 1-2, n-1 = last vertex
  const countPointsPerSegment = arrayOfLength(numReferenceSegments).reduce(
    (accum, d, i) => {
      let insertIndex = Math.floor(segmentRatio * i);

      // handle excluding segments
      if (
        excludeSegment &&
        insertIndex < commandsToExtend.length - 1 &&
        excludeSegment(
          commandsToExtend[insertIndex],
          commandsToExtend[insertIndex + 1]
        )
      ) {
        // set the insertIndex to the segment that this point should be added to:

        // round the insertIndex essentially so we split half and half on
        // neighbouring segments. hence the segmentRatio * i < 0.5
        const addToPriorSegment = (segmentRatio * i) % 1 < 0.5;

        // only skip segment if we already have 1 point in it (can't entirely remove a segment)
        if (accum[insertIndex]) {
          // TODO - Note this is a naive algorithm that should work for most d3-area use cases
          // but if two adjacent segments are supposed to be skipped, this will not perform as
          // expected. Could be updated to search for nearest segment to place the point in, but
          // will only do that if necessary.

          // add to the prior segment
          if (addToPriorSegment) {
            if (insertIndex > 0) {
              insertIndex -= 1;

              // not possible to add to previous so adding to next
            } else if (insertIndex < commandsToExtend.length - 1) {
              insertIndex += 1;
            }
            // add to next segment
          } else if (insertIndex < commandsToExtend.length - 1) {
            insertIndex += 1;

            // not possible to add to next so adding to previous
          } else if (insertIndex > 0) {
            insertIndex -= 1;
          }
        }
      }

      accum[insertIndex] = (accum[insertIndex] || 0) + 1;

      return accum;
    },
    []
  );

  // extend each segment to have the correct number of points for a smooth interpolation
  const extended = countPointsPerSegment.reduce((extended, segmentCount, i) => {
    // if last command, just add `segmentCount` number of times
    if (i === commandsToExtend.length - 1) {
      const lastCommandCopies = arrayOfLength(
        segmentCount,
        Object.assign({}, commandsToExtend[commandsToExtend.length - 1])
      );

      // convert M to L
      if (lastCommandCopies[0].type === 'M') {
        lastCommandCopies.forEach((d) => {
          d.type = 'L';
        });
      }
      return extended.concat(lastCommandCopies);
    }

    // otherwise, split the segment segmentCount times.
    return extended.concat(
      splitSegment(commandsToExtend[i], commandsToExtend[i + 1], segmentCount)
    );
  }, []);

  // add in the very first point since splitSegment only adds in the ones after it
  extended.unshift(commandsToExtend[0]);

  return extended;
}

/**
 * Takes a path `d` string and converts it into an array of command
 * objects. Drops the `Z` character.
 *
 * @param {String|null} d A path `d` string
 */
export function pathCommandsFromString(d) {
  // split into valid tokens
  const tokens = (d || '').match(commandTokenRegex) || [];
  const commands = [];
  let commandArgs;
  let command;

  // iterate over each token, checking if we are at a new command
  // by presence in the typeMap
  for (let i = 0; i < tokens.length; ++i) {
    commandArgs = typeMap[tokens[i]];

    // new command found:
    if (commandArgs) {
      command = {
        type: tokens[i],
      };

      // add each of the expected args for this command:
      for (let a = 0; a < commandArgs.length; ++a) {
        command[commandArgs[a]] = +tokens[i + a + 1];
      }

      // need to increment our token index appropriately since
      // we consumed token args
      i += commandArgs.length;

      commands.push(command);
    }
  }
  return commands;
}

/**
 * Interpolate from A to B by extending A and B during interpolation to have
 * the same number of points. This allows for a smooth transition when they
 * have a different number of points.
 *
 * Ignores the `Z` command in paths unless both A and B end with it.
 *
 * This function works directly with arrays of command objects instead of with
 * path `d` strings (see interpolatePath for working with `d` strings).
 *
 * @param {Object[]} aCommandsInput Array of path commands
 * @param {Object[]} bCommandsInput Array of path commands
 * @param {Function} excludeSegment a function that takes a start command object and
 *   end command object and returns true if the segment should be excluded from splitting.
 * @returns {Function} Interpolation function that maps t ([0, 1]) to an array of path commands.
 */
export function interpolatePathCommands(
  aCommandsInput,
  bCommandsInput,
  excludeSegment
) {
  // make a copy so we don't mess with the input arrays
  let aCommands = aCommandsInput == null ? [] : aCommandsInput.slice();
  let bCommands = bCommandsInput == null ? [] : bCommandsInput.slice();

  // both input sets are empty, so we don't interpolate
  if (!aCommands.length && !bCommands.length) {
    return function nullInterpolator() {
      return [];
    };
  }

  // do we add Z during interpolation? yes if both have it. (we'd expect both to have it or not)
  const addZ =
    (aCommands.length === 0 || aCommands[aCommands.length - 1].type === 'Z') &&
    (bCommands.length === 0 || bCommands[bCommands.length - 1].type === 'Z');

  // we temporarily remove Z
  if (aCommands.length > 0 && aCommands[aCommands.length - 1].type === 'Z') {
    aCommands.pop();
  }
  if (bCommands.length > 0 && bCommands[bCommands.length - 1].type === 'Z') {
    bCommands.pop();
  }

  // if A is empty, treat it as if it used to contain just the first point
  // of B. This makes it so the line extends out of from that first point.
  if (!aCommands.length) {
    aCommands.push(bCommands[0]);

    // otherwise if B is empty, treat it as if it contains the first point
    // of A. This makes it so the line retracts into the first point.
  } else if (!bCommands.length) {
    bCommands.push(aCommands[0]);
  }

  // extend to match equal size
  const numPointsToExtend = Math.abs(bCommands.length - aCommands.length);

  if (numPointsToExtend !== 0) {
    // B has more points than A, so add points to A before interpolating
    if (bCommands.length > aCommands.length) {
      aCommands = extend(aCommands, bCommands, excludeSegment);

      // else if A has more points than B, add more points to B
    } else if (bCommands.length < aCommands.length) {
      bCommands = extend(bCommands, aCommands, excludeSegment);
    }
  }

  // commands have same length now.
  // convert commands in A to the same type as those in B
  aCommands = aCommands.map((aCommand, i) =>
    convertToSameType(aCommand, bCommands[i])
  );

  // create mutable interpolated command objects
  const interpolatedCommands = aCommands.map((aCommand) => ({ ...aCommand }));

  if (addZ) {
    interpolatedCommands.push({ type: 'Z' });
  }

  return function pathCommandInterpolator(t) {
    // at 1 return the final value without the extensions used during interpolation
    if (t === 1) {
      return bCommandsInput == null ? [] : bCommandsInput;
    }

    // interpolate the commands using the mutable interpolated command objs
    // we can skip at t=0 since we copied aCommands to begin
    if (t > 0) {
      for (let i = 0; i < interpolatedCommands.length; ++i) {
        // if (interpolatedCommands[i].type === 'Z') continue;

        const aCommand = aCommands[i];
        const bCommand = bCommands[i];
        const interpolatedCommand = interpolatedCommands[i];
        for (const arg of typeMap[interpolatedCommand.type]) {
          interpolatedCommand[arg] =
            (1 - t) * aCommand[arg] + t * bCommand[arg];

          // do not use floats for flags (#27), round to integer
          if (arg === 'largeArcFlag' || arg === 'sweepFlag') {
            interpolatedCommand[arg] = Math.round(interpolatedCommand[arg]);
          }
        }
      }
    }

    return interpolatedCommands;
  };
}

/**
 * Interpolate from A to B by extending A and B during interpolation to have
 * the same number of points. This allows for a smooth transition when they
 * have a different number of points.
 *
 * Ignores the `Z` character in paths unless both A and B end with it.
 *
 * @param {String} a The `d` attribute for a path
 * @param {String} b The `d` attribute for a path
 * @param {Function} excludeSegment a function that takes a start command object and
 *   end command object and returns true if the segment should be excluded from splitting.
 * @returns {Function} Interpolation function that maps t ([0, 1]) to a path `d` string.
 */
export default function interpolatePath(a, b, excludeSegment) {
  let aCommands = pathCommandsFromString(a);
  let bCommands = pathCommandsFromString(b);

  if (!aCommands.length && !bCommands.length) {
    return function nullInterpolator() {
      return '';
    };
  }

  const commandInterpolator = interpolatePathCommands(
    aCommands,
    bCommands,
    excludeSegment
  );

  return function pathStringInterpolator(t) {
    // at 1 return the final value without the extensions used during interpolation
    if (t === 1) {
      return b == null ? '' : b;
    }

    const interpolatedCommands = commandInterpolator(t);

    // convert to a string (fastest concat: https://jsperf.com/join-concat/150)
    let interpolatedString = '';
    for (const interpolatedCommand of interpolatedCommands) {
      interpolatedString += commandToString(interpolatedCommand);
    }

    return interpolatedString;
  };
}
