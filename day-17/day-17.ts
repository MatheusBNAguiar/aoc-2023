import { getDayInput } from "../utils/getDayInput.mjs";

const DIRECTIONS = {
  RIGHT: [1, 0],
  LEFT: [-1, 0],
  TOP: [0, -1],
  DOWN: [0, 1],
} as const;
type LineNumberArray = Array<Array<number>>;

type NodeDescriptor = {
  x: number;
  y: number;
  currentScore: number;
  costValue: number;
  consecutiveDirectionCount: number;
  lastDirection?: keyof typeof DIRECTIONS;
  previous?: NodeDescriptor;
  previousSteps?: [number, number][];
};

function getPath(endNode: NodeDescriptor) {
  const path = [] as NodeDescriptor[];
  let current = endNode;
  while (current.previous) {
    path.unshift(current);
    current = current.previous;
  }
  return path;
}

function findLowestCostNode(set: Array<NodeDescriptor>) {
  let lowestIndex = 0;
  for (let i = 1; i < set.length; i++) {
    if (set[i].costValue < set[lowestIndex].costValue) {
      lowestIndex = i;
    }
  }
  return set[lowestIndex];
}

function getPart1Answer(lineNumberArray: LineNumberArray) {
  const getScore = (x: number, y: number): number | undefined => lineNumberArray?.[y]?.[x];
  const getStringIdentifier = (node: NodeDescriptor) => `${node.x}-${node.y}-${node.lastDirection}-${node.consecutiveDirectionCount}`;

  const getCostValue = (nodeA, nodeB) => {
    return Math.abs(nodeA.x - nodeB.x) + Math.abs(nodeA.y - nodeB.y);
  };

  const endNode = { x: lineNumberArray[0].length - 1, y: lineNumberArray.length - 1 } as NodeDescriptor;
  const startNode = {
    x: 0,
    y: 0,
    currentScore: getScore(0, 0),
    costValue: getCostValue({ x: 0, y: 0 } as NodeDescriptor, endNode),
  } as NodeDescriptor;

  function getNeighbors(node: NodeDescriptor) {
    const { x, y, lastDirection, consecutiveDirectionCount, currentScore, previousSteps = [] } = node;

    return Object.entries(DIRECTIONS).reduce<Array<NodeDescriptor>>((acc, [DIRECTION_KEY, DIRECTION_OFFSETS]) => {
      if (lastDirection === DIRECTION_KEY && consecutiveDirectionCount + 1 > 3) {
        return acc;
      }
      const newX = x + DIRECTION_OFFSETS[0];
      const newY = y + DIRECTION_OFFSETS[1];
      const newDirectionScore = getScore(newX, newY);
      if (newDirectionScore !== undefined && !previousSteps.find(([oldX, oldY]) => x === oldX && oldY === y)) {
        return acc.concat({
          x: newX,
          y: newY,
          currentScore: newDirectionScore + currentScore,
          costValue: currentScore + getCostValue({ x: newX, y: newY }, endNode),
          lastDirection: DIRECTION_KEY as keyof typeof DIRECTIONS,
          consecutiveDirectionCount: lastDirection === DIRECTION_KEY ? consecutiveDirectionCount + 1 : 1,
          previousSteps: previousSteps.concat([[x, y]]),
          previous: node,
        });
      }
      return acc;
    }, []);
  }

  const openSet = [startNode];
  const closedSet = new Set();

  while (openSet.length > 0) {
    let currentNode = findLowestCostNode(openSet);

    if (currentNode.x === endNode.x && currentNode.y === endNode.y) {
      console.log(getPath(currentNode));
      return;
    }

    openSet.splice(openSet.indexOf(currentNode), 1);
    closedSet.add(getStringIdentifier(currentNode));

    const neighbors = getNeighbors(currentNode);

    for (let neighbor of neighbors) {
      if (!closedSet.has(getStringIdentifier(neighbor))) {
        openSet.push(neighbor);
      }
    }
  }

  return null; // No path found
}

function getPart2Answer() {}
export default function getAnswer() {
  const fileResult = getDayInput(import.meta)
    .split("\n")
    .filter(Boolean)
    .map(str => str.split("").map(Number)) as LineNumberArray;
  return `Part 1: ${getPart1Answer(fileResult)} Part 2: ${getPart2Answer()}`;
}

console.log(getAnswer());
