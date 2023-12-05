import { getDayInput } from "../utils/getDayInput.mjs";

function getReferences() {
  const fileResult = getDayInput(import.meta)
  const baseArray = fileResult.split('\n');
  const matrixArray = baseArray.map(i => i.split(''));
  return { baseArray, matrixArray };
}

function getPart1Answer({ baseArray, matrixArray }) {
  let baseSum = 0;
  for (let arrayLine = 0; arrayLine < baseArray.length; arrayLine++) {
    let lineValue = baseArray[arrayLine]
    lineValue.match(/\d+/gm)?.forEach(numberOnLine => {
      const numberStart = lineValue.indexOf(numberOnLine);

      const leftBoundary = Math.max(numberStart - 1, 0);
      const rightBoundary = numberStart + numberOnLine.length;

      const topBoundary = Math.max(arrayLine - 1, 0);
      const bottomBoundary = arrayLine + 1;

      let numberFound = false;
      for (let squareY = topBoundary; squareY <= bottomBoundary && !numberFound; squareY++) {
        for (let squareX = leftBoundary; squareX <= rightBoundary && !numberFound; squareX++) {
          const selectedDigit = matrixArray?.[squareY]?.[squareX];
          if (selectedDigit && !/\.|\d+/.test(selectedDigit)) {
            baseSum += Number(numberOnLine);
            numberFound = true;
          }
        }
      }

      lineValue = lineValue.replace(numberOnLine, '.'.repeat(numberOnLine.length));
    });
  }

  return baseSum;
}

export default function getAnswer() {
  const { baseArray, matrixArray } = getReferences();
  const part1Result = getPart1Answer({ baseArray, matrixArray });

  return `Part 1: ${part1Result} Part 2: ${part1Result}`;
}
