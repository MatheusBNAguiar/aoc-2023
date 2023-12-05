import { getDayInput } from "../utils/getDayInput.mjs";
import { getArrayPower } from "../utils/getArrayPower.mjs";

function getReferences() {
  const fileResult = getDayInput(import.meta)
  const baseArray = fileResult.split('\n');
  const matrixArray = baseArray.map(i => i.split(''));
  return { baseArray, matrixArray };
}

function getMatrixBoundaries(characterXPos, characterYPos, characterLength = 1) {
  return {
    xMin: Math.max(characterXPos - 1, 0),
    xMax: characterXPos + characterLength,
    yMin: Math.max(characterYPos - 1, 0),
    yMax: characterYPos + 1,
  };
}

function getPart1Answer({ baseArray, matrixArray }) {
  let baseSum = 0;
  for (let arrayLine = 0; arrayLine < baseArray.length; arrayLine++) {
    let lineValue = baseArray[arrayLine]
    lineValue.match(/\d+/gm)?.forEach(numberOnLine => {
      const numberStart = lineValue.indexOf(numberOnLine);
      const { xMin, xMax, yMin, yMax } = getMatrixBoundaries(numberStart, arrayLine, numberOnLine.length);

      let numberFound = false;
      for (let squareY = yMin; squareY <= yMax && !numberFound; squareY++) {
        for (let squareX = xMin; squareX <= xMax && !numberFound; squareX++) {
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

function isNumber(digit) {
  return digit && /\d/.test(digit);
}

function getPart2Answer({ baseArray, matrixArray }) {
  let baseSum = 0;
  for (let arrayLine = 0; arrayLine < baseArray.length; arrayLine++) {
    let lineValue = baseArray[arrayLine];

    lineValue.match(/\*+/gm)?.forEach(gearOnLine => {
      const gearPosition = lineValue.indexOf(gearOnLine);
      const { xMin, xMax, yMin, yMax } = getMatrixBoundaries(gearPosition, arrayLine);

      const numbersOnGear = [];
      for (let squareY = yMin; squareY <= yMax; squareY++) {
        for (let squareX = xMin; squareX <= xMax; squareX++) {
          const selectedDigit = matrixArray?.[squareY]?.[squareX];
          if (isNumber(selectedDigit)) {

            //Lookup for number
            let baseNumber = selectedDigit;
            const numberLine = matrixArray?.[squareY];

            for (let leftIndex = squareX - 1; leftIndex >= 0; leftIndex--) {
              const leftDigit = numberLine[leftIndex];
              if (isNumber(leftDigit)) {
                baseNumber = `${leftDigit}${baseNumber}`;
              } else {
                break;
              }
            }

            for (let rightIndex = squareX + 1; rightIndex <= numberLine.length; rightIndex++) {
              const rightDigit = numberLine[rightIndex];
              if (isNumber(rightDigit)) {
                baseNumber = `${baseNumber}${rightDigit}`;
              } else {
                break;
              }
            }

            if (!numbersOnGear.includes(baseNumber)) {
              numbersOnGear.push(baseNumber);
            }
          }
        }
      }

      if (numbersOnGear.length > 1) {
        baseSum += getArrayPower(numbersOnGear);
      }

      lineValue = lineValue.replace(gearOnLine, '.');
    });
  }
  return baseSum;
}

export default function getAnswer() {
  const { baseArray, matrixArray } = getReferences();
  const part1Result = getPart1Answer({ baseArray, matrixArray });
  const part2Result = getPart2Answer({ baseArray, matrixArray });

  return `Part 1: ${part1Result} Part 2: ${part2Result}`;
}
