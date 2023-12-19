import { unescapeLeadingUnderscores } from "../node_modules/typescript/lib/typescript";
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
  previousSteps?: string[];
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

function getLessMinimumHeatlossPath(lineNumberArray: LineNumberArray, minimumSequence: number = 0, maxSequence: number = 3) {
  const getScore = (x: number, y: number): number | undefined => lineNumberArray?.[y]?.[x];
  const getStringIdentifier = (node: NodeDescriptor) => `${node.x}-${node.y}-${node.lastDirection}-${node.consecutiveDirectionCount}`;

  const getCostValue = (nodeA, nodeB) => {
    return Math.abs(nodeA.x - nodeB.x) + Math.abs(nodeA.y - nodeB.y);
  };

  const endNode = { x: lineNumberArray[0].length - 1, y: lineNumberArray.length - 1 } as NodeDescriptor;
  const startNode = {
    x: 0,
    y: 0,
    currentScore: 0,
    costValue: getCostValue({ x: 0, y: 0 } as NodeDescriptor, endNode),
  } as NodeDescriptor;

  function getNeighbors(node: NodeDescriptor) {
    const { x, y, lastDirection, consecutiveDirectionCount, currentScore, previousSteps = [] } = node;

    return Object.entries(DIRECTIONS).reduce<Array<NodeDescriptor>>((acc, [DIRECTION_KEY, DIRECTION_OFFSETS]) => {
      if (lastDirection === DIRECTION_KEY && consecutiveDirectionCount + 1 > maxSequence) {
        return acc;
      }

      if (lastDirection !== DIRECTION_KEY && consecutiveDirectionCount && consecutiveDirectionCount < minimumSequence) {
        return acc;
      }

      const newX = x + DIRECTION_OFFSETS[0];
      const newY = y + DIRECTION_OFFSETS[1];
      const newDirectionScore = getScore(newX, newY);
      if (newDirectionScore !== undefined && !previousSteps.includes(`${newX}-${newY}`)) {
        return acc.concat({
          x: newX,
          y: newY,
          currentScore: newDirectionScore + currentScore,
          costValue: currentScore + getCostValue({ x: newX, y: newY }, endNode),
          lastDirection: DIRECTION_KEY as keyof typeof DIRECTIONS,
          consecutiveDirectionCount: lastDirection === DIRECTION_KEY ? consecutiveDirectionCount + 1 : 1,
          previousSteps: previousSteps.concat(`${x}-${y}`),
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

    if (currentNode.x === endNode.x && currentNode.y === endNode.y && currentNode.consecutiveDirectionCount >= minimumSequence) {
      // Uncomment this to print the path
      // const pathToDraw = Array(lineNumberArray.length).fill(1).map(() => Array(lineNumberArray[0].length).fill('.').map(str => '.'))
      // getPath(currentNode).forEach(({ x, y }) => {
      //   pathToDraw[y][x] = 'X'
      // })
      // console.log(pathToDraw.map(str => str.join('')).join('\n'))
      return currentNode.currentScore;
    }

    openSet.splice(openSet.indexOf(currentNode), 1);
    closedSet.add(getStringIdentifier(currentNode));

    const neighbors = getNeighbors(currentNode);

    const isNeighborOnList = (node: NodeDescriptor) => (nodeOnList: NodeDescriptor) =>
      node.x === nodeOnList.x && node.y === nodeOnList.y && node.lastDirection === nodeOnList.lastDirection && node.consecutiveDirectionCount === nodeOnList.consecutiveDirectionCount;
    for (let neighbor of neighbors) {
      if (!closedSet.has(getStringIdentifier(neighbor))) {
        if (!openSet.find(isNeighborOnList(neighbor)) || currentNode.currentScore < neighbor.currentScore) {
          if (!openSet.find(isNeighborOnList(neighbor))) {
            openSet.push(neighbor);
          }
        }
      }
    }
  }

  return null; // No path found
}

function getPart1Answer(lineNumberArray: LineNumberArray) {
  return getLessMinimumHeatlossPath(lineNumberArray);
}

function getPart2Answer(lineNumberArray: LineNumberArray) {
  return getLessMinimumHeatlossPath(lineNumberArray, 4, 10);
}

export default function getAnswer() {
  const fileResult = getDayInput(import.meta)
    .split("\n")
    .filter(Boolean)
    .map(str => str.split("").map(Number)) as LineNumberArray;
  return `Part 1: ${getPart1Answer(fileResult)} Part 2: ${getPart2Answer(fileResult)}`;
}

console.log(getAnswer());
