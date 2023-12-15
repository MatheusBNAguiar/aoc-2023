import { getDayInput } from "../utils/getDayInput.mjs";
import { getTransposedMatrix } from "../utils/getTransposedMatrix.mjs";
import { memoize } from "../utils/memoize.mjs";

const moveCircleToWest = memoize(arrayLine => {
  let lastHashLocation = -1;
  let lastCircleLocation = -1;

  let newLine = arrayLine.concat([]);

  for (let lineCharacterIndex = 0; lineCharacterIndex < newLine.length; lineCharacterIndex++) {
    const lineCharacter = newLine[lineCharacterIndex];
    if (lineCharacter === "O") {
      const newCircleLocation = Math.max(lastHashLocation, lastCircleLocation) + 1;

      if (lineCharacterIndex !== newCircleLocation) {
        newLine[newCircleLocation] = lineCharacter;
        newLine[lineCharacterIndex] = ".";
      }

      lastCircleLocation = newCircleLocation;
    } else {
      if (lineCharacter === "#") {
        lastHashLocation = lineCharacterIndex;
      }
    }
  }
  return newLine;
});

function getMappedLineToWest(arrayLine) {
  return moveCircleToWest(arrayLine);
}

function getMovedNorthArray(fileArray) {
  return getTransposedMatrix(getTransposedMatrix(fileArray).map(getMappedLineToWest));
}

function getReversedLine(array) {
  return array.concat([]).reverse();
}

const getCycledArray = fileArray => {
  const movedNorthArray = getTransposedMatrix(getTransposedMatrix(fileArray).map(getMappedLineToWest));
  const movedWestArray = movedNorthArray.map(getMappedLineToWest);
  const movedSouthArray = getTransposedMatrix(getTransposedMatrix(movedWestArray).map(getReversedLine).map(getMappedLineToWest).map(getReversedLine));
  return movedSouthArray.map(getReversedLine).map(getMappedLineToWest).map(getReversedLine);
};

function getMovedArraySum(movedArray) {
  const fileArraySize = movedArray.length;
  let acc = 0;
  for (let index = 0; index < movedArray.length; index++) {
    acc += movedArray[index].filter(str => str === "O").length * (fileArraySize - index);
  }
  return acc;
}

function getPart1Answer(fileArray) {
  const movedArray = getMovedNorthArray(fileArray);
  return getMovedArraySum(movedArray);
}

function getPlainString(fileArray) {
  return fileArray.map(a => a.join("")).join("");
}
function getPart2Answer(fileArray) {
  const MAX_ITERATION = 1000000000;
  let arrayToCycle = fileArray;

  let repeatStart;
  let repeatStep;

  const valueIndexMap = {};

  for (let index = 1; index <= MAX_ITERATION; index++) {
    const newCycleArray = getCycledArray(arrayToCycle);
    arrayToCycle = newCycleArray;
    const hashIndex = getPlainString(arrayToCycle);
    if (valueIndexMap[hashIndex]) {
      repeatStart = valueIndexMap[hashIndex];
      repeatStep = index - repeatStart;
      break;
    }
    valueIndexMap[hashIndex] = index;
  }

  console.log(`Detected cycle starting at ${repeatStart} of length ${repeatStep}`);
  const remainingSteps = (MAX_ITERATION - repeatStart) % repeatStep;

  for (let stepIndex = 0; stepIndex < remainingSteps; ++stepIndex) {
    arrayToCycle = getCycledArray(arrayToCycle);
  }

  return getMovedArraySum(arrayToCycle);
}

export default function getAnswer() {
  const fileArray = getDayInput(import.meta)
    .split("\n")
    .filter(Boolean)
    .map(str => str.split(""));

  return `Part 1: ${getPart1Answer(fileArray)} Part 2: ${getPart2Answer(fileArray)}`;
}

console.log(getAnswer());
