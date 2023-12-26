import { getDayInput } from "../utils/getDayInput.mjs";

const DIRECTIONS = {
  RIGHT: [1, 0],
  LEFT: [-1, 0],
  TOP: [0, -1],
  DOWN: [0, 1],
} as const;
const ALLOWED_DIRECTION = {
  RIGHT: ">",
  LEFT: "<",
  TOP: "^",
  DOWN: "v",
} as const;
type CharacterLineArray = Array<Array<string>>;

type StepDistance = number;
type NodeKey = `${number}-${number}`;
type PreviousSteps = Array<NodeKey>;
type NodeMountObject = {
  start: [number, number];
  steps: StepDistance;
  direction: [number, number];
  previousSteps: PreviousSteps;
};

type NodeGraphNetworks = {
  [key: NodeKey]: { [key: NodeKey]: [StepDistance, PreviousSteps] };
};

function getGraphNetwork(characterLineArray: CharacterLineArray, checkSlopes = true): NodeGraphNetworks {
  const isAllowedPath = (x: number, y: number): boolean => Boolean(characterLineArray?.[y]?.[x]) && characterLineArray?.[y]?.[x] !== "#";
  const isDirectionAllowed = (x: number, y: number, direction: keyof typeof DIRECTIONS) =>
    isAllowedPath(x, y) && (characterLineArray?.[y]?.[x] === "." || characterLineArray?.[y]?.[x] === ALLOWED_DIRECTION[direction]);

  const openSet = [
    {
      start: [1, 0],
      steps: 1,
      direction: [1, 1],
      previousSteps: ["1-0"],
    },
  ] as NodeMountObject[];

  const getComposedKey = (x1, y1, x2, y2) => `[${x1}-${y1}]=>${x2}-${y2}`;
  const visited = new Set();

  const graphStructure = {};

  while (openSet.length > 0) {
    const { start, steps, direction, previousSteps } = openSet.pop() as NodeMountObject;
    const possiblePositions = Object.entries(DIRECTIONS).reduce<Array<[number, number]>>((acc, [DIRECTION_KEY, DIRECTION_OFFSETS]) => {
      const newX = direction[0] + DIRECTION_OFFSETS[0];
      const newY = direction[1] + DIRECTION_OFFSETS[1];
      const isAllowedPathToGo = checkSlopes ? isDirectionAllowed(newX, newY, DIRECTION_KEY as keyof typeof DIRECTIONS) : isAllowedPath(newX, newY);
      if (isAllowedPathToGo && !previousSteps.includes(`${newX}-${newY}`)) {
        acc.push([newX, newY]);
      }
      return acc;
    }, []);

    if (possiblePositions.length === 1) {
      if (visited.has(getComposedKey(start[0], start[1], possiblePositions[0][0], possiblePositions[0][1]))) {
        continue;
      }
      visited.add(getComposedKey(start[0], start[1], possiblePositions[0][0], possiblePositions[0][1]));
      openSet.push({
        start: start,
        steps: steps + 1,
        direction: possiblePositions[0],
        previousSteps: previousSteps.concat(`${direction[0]}-${direction[1]}`),
      });
    } else {
      if (!graphStructure[`${start[0]}-${start[1]}`]) {
        graphStructure[`${start[0]}-${start[1]}`] = {};
      }
      graphStructure[`${start[0]}-${start[1]}`][`${direction[0]}-${direction[1]}`] = [steps, previousSteps];
      visited.add(getComposedKey(start[0], start[1], direction[0], direction[1]));

      possiblePositions.forEach(nextPosition => {
        if (visited.has(getComposedKey(direction[0], direction[1], nextPosition[0], nextPosition[1]))) {
          return;
        }
        openSet.push({
          start: direction,
          steps: 1,
          direction: nextPosition,
          previousSteps: [`${direction[0]}-${direction[1]}`],
        });
      });
    }
  }

  return graphStructure;
}

type SearchValueEntry = [NodeKey, NodeKey[], number, PreviousSteps];

function getBiggestPath(characterLineArray: CharacterLineArray, checkSlopes = true) {
  const graphStructure = getGraphNetwork(characterLineArray, checkSlopes);
  const queue = [["1-0", [], 0, ["1-0"]]] as SearchValueEntry[];
  let highestNodeSequence;
  while (queue.length > 0) {
    const [currentPosition, previousSteps, stepCount, trajectory] = queue.pop() as SearchValueEntry;
    if (currentPosition === "139-140") {
      if (highestNodeSequence?.[2] < stepCount || !highestNodeSequence) {
        highestNodeSequence = [currentPosition, previousSteps, stepCount];
      }
      continue;
    }

    Object.entries(graphStructure[currentPosition]).forEach(([nextStepPositon, [stepsToNextPosition, stepsNeededForNextPosition]]) => {
      if (!trajectory.includes(nextStepPositon as NodeKey)) {
        const newTrajectory = trajectory.concat(nextStepPositon as NodeKey);
        const totalScore = stepCount + stepsToNextPosition;
        const totalSteps = previousSteps.concat(stepsNeededForNextPosition);
        //@ts-ignore
        queue.push([nextStepPositon, totalSteps, totalScore, newTrajectory]);
      }
    });
  }

  return highestNodeSequence?.[2]; // No path found
}

function getPart1Answer(characterLineArray: Array<Array<string>>) {
  return getBiggestPath(characterLineArray);
}

function getPart2Answer(characterLineArray) {
  return getBiggestPath(characterLineArray, false);
}

export default function getAnswer() {
  const fileResult = getDayInput(import.meta)
    .split("\n")
    .filter(Boolean)
    .map(str => str.split(""));

  console.time("Answer 1");
  const answer1 = getPart1Answer(fileResult);
  console.timeEnd("Answer 1");

  console.time("Answer 2");
  const answer2 = getPart2Answer(fileResult);
  console.timeEnd("Answer 2");

  return `Part 1: ${answer1} Part 2:${answer2}`;
}

console.log(getAnswer());
