import { getDayInput } from "../utils/getDayInput.mjs";

function getTrailLength(lineArray, offsetDirectionPosition = [-1, 0], startPosition = [0, 0]) {
  const lineQuantity = lineArray.length;
  const lineLength = lineArray[0].length;
  const arrayAcc = Array(lineQuantity)
    .fill([])
    .map(item => Array(lineLength).fill("."));

  function moveOnMap(lastPosition, newPosition) {
    const [xPos, yPos] = newPosition;
    const [lastXPos, lastYPos] = lastPosition;

    if (xPos < 0 || yPos < 0 || lineLength <= xPos || lineQuantity <= yPos) {
      return;
    }

    const lineArrayItem = lineArray[yPos][xPos];
    if (arrayAcc[yPos][xPos] !== "#" && Boolean(lineArrayItem)) {
      if (lineArrayItem === "|" || lineArrayItem === "-") {
        arrayAcc[yPos][xPos] = "#";
      } else {
        arrayAcc[yPos][xPos] = "2";
      }

      if (lineArrayItem === ".") {
        moveOnMap(newPosition, [2 * xPos - lastXPos, 2 * yPos - lastYPos]);
      } else if (lineArrayItem === "|") {
        moveOnMap(newPosition, [xPos, yPos - 1]);
        moveOnMap(newPosition, [xPos, yPos + 1]);
      } else if (lineArrayItem === "-") {
        moveOnMap(newPosition, [xPos - 1, yPos]);
        moveOnMap(newPosition, [xPos + 1, yPos]);
      } else if (lineArrayItem === "/") {
        if (lastXPos === xPos) {
          if (yPos > lastYPos) {
            // From top
            moveOnMap(newPosition, [xPos - 1, yPos]);
          } else {
            // From bottom
            moveOnMap(newPosition, [xPos + 1, yPos]);
          }
        } else {
          if (xPos < lastXPos) {
            // From Right
            moveOnMap(newPosition, [xPos, yPos + 1]);
          } else {
            // From Left
            moveOnMap(newPosition, [xPos, yPos - 1]);
          }
        }
      } else if (lineArrayItem === "\\") {
        if (lastXPos === xPos) {
          if (yPos > lastYPos) {
            // From top
            moveOnMap(newPosition, [xPos + 1, yPos]);
          } else {
            // From bottom
            moveOnMap(newPosition, [xPos - 1, yPos]);
          }
        } else {
          if (xPos < lastXPos) {
            // From Right
            moveOnMap(newPosition, [xPos, yPos - 1]);
          } else {
            // From Left
            moveOnMap(newPosition, [xPos, yPos + 1]);
          }
        }
      }
    }
  }

  moveOnMap(offsetDirectionPosition, startPosition);

  return arrayAcc.map(str => str.filter(str => str !== ".").join("")).join("").length;
}

function getPart1Answer(lineArray) {
  return getTrailLength(lineArray);
}

function getPart2Answer(lineArray) {
  const lineQuantity = lineArray.length;
  const lineLength = lineArray[0].length;
  let maxTrails = 0;
  for (let topIndex = 0; topIndex < lineQuantity; topIndex++) {
    maxTrails = Math.max(maxTrails, getTrailLength(lineArray, [-1, topIndex], [0, topIndex]));
    maxTrails = Math.max(maxTrails, getTrailLength(lineArray, [lineLength, topIndex], [lineLength - 1, topIndex]));
  }

  for (let leftIndex = 0; leftIndex < lineLength; leftIndex++) {
    maxTrails = Math.max(maxTrails, getTrailLength(lineArray, [leftIndex, -1], [leftIndex, 0]));
    maxTrails = Math.max(maxTrails, getTrailLength(lineArray, [leftIndex, lineQuantity], [leftIndex, lineQuantity - 1]));
  }

  return maxTrails;
}

export default function getAnswer() {
  const fileResult = getDayInput(import.meta)
    .split("\n")
    .filter(Boolean)
    .map(str => str.split(""));

  return `Part 1: ${getPart1Answer(fileResult)} Part 2: ${getPart2Answer(fileResult)}`;
}
