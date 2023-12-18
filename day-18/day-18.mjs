import { getDayInput } from "../utils/getDayInput.mjs";

function getTransposedPositions(directionsArray) {
  const positions = [[0, 0]];
  let minYPos = Number.MAX_SAFE_INTEGER;
  let maxYPos = Number.MIN_SAFE_INTEGER;
  let minXPos = Number.MAX_SAFE_INTEGER;
  let maxXPos = Number.MIN_SAFE_INTEGER;
  let stepsTaken = 0;

  directionsArray.forEach(strMapping => {
    const [direction, steps] = strMapping;
    const lastStep = positions.slice(-1)[0];
    let newPosition;
    if (direction === "D") {
      newPosition = [lastStep[0], lastStep[1] + Number(steps)];
    }
    if (direction === "L") {
      newPosition = [lastStep[0] - Number(steps), lastStep[1]];
    }
    if (direction === "R") {
      newPosition = [lastStep[0] + Number(steps), lastStep[1]];
    }
    if (direction === "U") {
      newPosition = [lastStep[0], lastStep[1] - Number(steps)];
    }
    minXPos = Math.min(newPosition[0], minXPos);
    minYPos = Math.min(newPosition[1], minYPos);

    maxXPos = Math.max(newPosition[0], maxXPos);
    maxYPos = Math.max(newPosition[1], maxYPos);
    stepsTaken += Number(steps);
    positions.push(newPosition);
  });

  return [positions.map(oldPosition => [oldPosition[0] - minXPos, oldPosition[1] - minYPos, oldPosition[2]]), stepsTaken];
}

function getAreaQuandrilateral([positions, stepsTaken]) {
  return (
    Math.abs(
      positions.slice(1).reduce((acc, [x, y], index, selfArray) => {
        const [x2, y2] = selfArray?.[index + 1] ? selfArray[index + 1] : selfArray[0];
        return acc + (x * y2 - x2 * y);
      }, 0),
    ) /
      2 +
    stepsTaken / 2 +
    1
  );
}

function getPart1Answer(directionsArray) {
  return getAreaQuandrilateral(getTransposedPositions(directionsArray));
}

function getPart2Answer(directionsArray) {
  const newMapping = directionsArray.map(([direction, steps, hash]) => [{ 0: "R", 1: "D", 2: "L", 3: "U" }[hash[7]], parseInt(hash.slice(2, 7), 16)]);
  return getAreaQuandrilateral(getTransposedPositions(newMapping));
}

export default function getAnswer() {
  const directionsArray = getDayInput(import.meta)
    .split("\n")
    .filter(Boolean)
    .map(str => str.split(" "));
  return `Part 1: ${getPart1Answer(directionsArray)} Part 2: ${getPart2Answer(directionsArray)}`;
}
