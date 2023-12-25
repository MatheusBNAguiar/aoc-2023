import { getDayInput } from "../utils/getDayInput.mjs";

const DIRECTIONS_ARRAY = [
  [1, 0],
  [-1, 0],
  [0, -1],
  [0, 1],
] as const;

type FileArrayCharacters = Array<Array<string>>;

function getStartIndex(lineArray): [number, number] {
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

function getAnswerOnInteractions(fileArraycharacters: FileArrayCharacters, LIMIT_STEPS) {
  const sPosition = getStartIndex(fileArraycharacters);

  const queue = [[sPosition, 1]] as Array<[[number, number], number]>;
  const possibleGardenPlots = new Set();
  const visitedGardenPlots = new Set();

  const xLength = fileArraycharacters[0].length;
  const yLength = fileArraycharacters.length;

  const getFileSequenceCharacter = (xPos, yPos) => {
    const adjustedX = xPos < 0 ? Math.abs((xPos % xLength) + xLength) : xPos;
    const adjustedY = yPos < 0 ? Math.abs((yPos % yLength) + yLength) : yPos;
    return fileArraycharacters[adjustedY % yLength][adjustedX % xLength];
  };

  while (queue.length > 0) {
    // @ts-ignore
    const [[initialX, initialY], numberOfSteps] = queue.shift();

    DIRECTIONS_ARRAY.forEach(([xOffset, yOffset]) => {
      const newXPosition = initialX + xOffset;
      const newYPosition = initialY + yOffset;
      if (!visitedGardenPlots.has(`[${newXPosition}]-[${newYPosition}-${numberOfSteps}]`) && getFileSequenceCharacter(newXPosition, newYPosition) !== "#" && numberOfSteps <= LIMIT_STEPS) {
        visitedGardenPlots.add(`[${newXPosition}]-[${newYPosition}-${numberOfSteps}]`);
        queue.push([[newXPosition, newYPosition], numberOfSteps + 1]);
        if (numberOfSteps === LIMIT_STEPS) {
          possibleGardenPlots.add(`[${newXPosition}]-[${newYPosition}]`);
        }
      }
    });
  }

  return possibleGardenPlots.size;
}

function getPart1Answer(fileArraycharacters: FileArrayCharacters) {
  return getAnswerOnInteractions(fileArraycharacters, 64);
}

// Based on Day 9 algorithm
const diffs = row => row.map((v, i) => v - row[i - 1]).slice(1);
const run = arr =>
  arr.map(step => {
    while (step.some(v => v !== 0)) {
      step = diffs(step);
      arr.push(step);
    }
    return arr.map(v => v[0]);
  });

function getPart2Answer(fileArraycharacters: FileArrayCharacters) {
  const b0 = getAnswerOnInteractions(fileArraycharacters, 65);
  const b1 = getAnswerOnInteractions(fileArraycharacters, 65 + 131);
  const b2 = getAnswerOnInteractions(fileArraycharacters, 65 + 2 * 131);
  let ks = run([[b0, b1, b2]])[0];
  let steps = (26501365 - 65) / 131;
  return ks[0] + ks[1] * steps + (steps * (steps - 1) * ks[2]) / 2;
}

export default function getAnswer() {
  const fileResult = getDayInput(import.meta)
    .split("\n")
    .filter(Boolean)
    .map(str => str.split("")) as FileArrayCharacters;

  return `Part 1: ${getPart1Answer(fileResult)} Part 2: ${getPart2Answer(fileResult)}`;
}
