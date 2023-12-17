import { getDayInput } from "../utils/getDayInput.mjs";

const DIRECTIONS = {
  RIGHT: [1, 0],
  LEFT: [-1, 0],
  TOP: [0, -1],
  DOWN: [0, 1],
};

const DIRECTIONS_ARRAY = Object.values(DIRECTIONS);

const PIPE_MAPPING = {
  "|": [DIRECTIONS.TOP, DIRECTIONS.DOWN],
  "-": [DIRECTIONS.LEFT, DIRECTIONS.RIGHT],
  L: [DIRECTIONS.TOP, DIRECTIONS.RIGHT],
  J: [DIRECTIONS.TOP, DIRECTIONS.LEFT],
  F: [DIRECTIONS.DOWN, DIRECTIONS.RIGHT],
  7: [DIRECTIONS.DOWN, DIRECTIONS.LEFT],
};

function getStartIndex(lineArray) {
  let xLocation;
  const yLocation = lineArray.findIndex(line => {
    const startLocation = line.indexOf("S");
    if (startLocation !== -1) {
      xLocation = startLocation;
    }
    return startLocation !== -1;
  });
  return [xLocation, yLocation];
}

function getClosedLoopArray(lineArray) {
  const lineQuantity = lineArray.length;
  const lineLength = lineArray[0].length;
  const arrayAcc = Array(lineQuantity)
    .fill([])
    .map(item => Array(lineLength).fill(undefined));

  const startCoordinates = getStartIndex(lineArray);

  const queue = DIRECTIONS_ARRAY.map(([xOffset, yOffset]) => [[startCoordinates[0] + xOffset, startCoordinates[1] + yOffset], 0, startCoordinates]);

  while (queue.length > 0) {
    const [initCoordinates, counter, origin] = queue.shift();

    const [currentXPos, currentYPos] = initCoordinates;
    const pipeCharacter = lineArray?.[currentYPos]?.[currentXPos];

    if (pipeCharacter && pipeCharacter !== "." && pipeCharacter !== "S") {
      const pipeIndex = PIPE_MAPPING[pipeCharacter].findIndex(([xOrigin, yOrigin]) => initCoordinates[0] + xOrigin === origin[0] && initCoordinates[1] + yOrigin === origin[1]);
      if (pipeIndex !== -1 && !arrayAcc[currentYPos][currentXPos]) {
        arrayAcc[currentYPos][currentXPos] = counter + 1;
        const [constraintXPos, constraintYPos] = PIPE_MAPPING[pipeCharacter].find((item, index) => index !== pipeIndex);
        queue.push([[currentXPos + constraintXPos, currentYPos + constraintYPos], counter + 1, initCoordinates]);
      }
    }
  }

  return arrayAcc;
}

function getPart1Answer(getClosedLoopArray) {
  return Math.ceil(getClosedLoopArray.reduce((acc, items) => Math.max(acc, ...items.filter(Boolean)), Number.MIN_VALUE));
}

const OUTSIDE_CHARACTER = "_";
const INSIDE_CHARACTER = "I";
const OUTSIDE_LOOP_CHARACTER = "O";

function getInLoopValues(pipedList) {
  let acc = 0;
  for (let lineIndex = 0; lineIndex < pipedList.length; lineIndex++) {
    const line = pipedList[lineIndex];
    let inRegion = false;
    let lastCorner;

    for (let characterIndex = 0; characterIndex < line.length; characterIndex++) {
      let character = line[characterIndex];
      if (character === OUTSIDE_CHARACTER) {
        inRegion = false;
        lastCorner = undefined;
        continue;
      }

      if (character === "S") {
        character = "F";
      }

      if (character === "|") {
        lastCorner = undefined;
        inRegion = !inRegion;
      }

      if (["L", "J", "F", "7"].includes(character)) {
        if (lastCorner) {
          if (!(lastCorner === "L" && character === "J") && !(lastCorner === "F" && character === "7")) {
            inRegion = !inRegion;
          }
          lastCorner = undefined;
        } else {
          lastCorner = character;
        }
      }

      if (character === INSIDE_CHARACTER) {
        if (inRegion) {
          acc += 1;
        } else {
          pipedList[lineIndex][characterIndex] = OUTSIDE_LOOP_CHARACTER;
        }
      }
    }
  }

  return acc;
}

function getPart2Answer(closedLoop, fileResult) {
  return getInLoopValues(
    closedLoop
      .map(str => str.map(value => (value === undefined ? INSIDE_CHARACTER : "*")).join(""))
      .map(str => str.replace(/^\s+|\s+$/g, match => OUTSIDE_CHARACTER.repeat(match.length)))
      .map(str => str.split(""))
      .map((str, lineIndex) => str.map((value, charIndex) => (value === "*" ? fileResult[lineIndex][charIndex] : value))),
  );
}

export default function getAnswer() {
  const fileResult = getDayInput(import.meta)
    .split("\n")
    .filter(Boolean);
  const closedLoop = getClosedLoopArray(fileResult);

  return `Part 1: ${getPart1Answer(closedLoop)} Part 2: ${getPart2Answer(closedLoop, fileResult)}`;
}

console.log(getAnswer());
