import { getArraySum } from "../utils/getArraySum.mjs";
import { getDayInput } from "../utils/getDayInput.mjs";

export default function getAnswer() {
  const fileResult = getDayInput(import.meta)
  const baseArray = fileResult.split('\n');
  const matrixArray = baseArray.map(i => i.split(''));

  const numbersNextToDigits = [];

  for (let arrayLine = 0; arrayLine < baseArray.length; arrayLine++) {
    const lineValue = baseArray[arrayLine]
    lineValue.match(/\d+/gm)?.forEach(numberOnLine => {
      const numberStart = lineValue.indexOf(numberOnLine);

      let numberFound = false;
      const leftBoundary = Math.max(numberStart - 1, 0);
      const rightBoundary = numberStart + numberOnLine.length + 1;

      const topBoundary = Math.max(arrayLine - 1, 0);
      const bottomBoundary = arrayLine + 1;

      for (let squareX = leftBoundary; squareX <= rightBoundary; squareX++) {
        for (let squareY = topBoundary; squareY <= bottomBoundary; squareY++) {
          const selectedDigit = matrixArray?.[squareY]?.[squareX];
          if (selectedDigit && selectedDigit !== '.' && !/\.|\d+/.test(selectedDigit)) {
            numberFound = true;
            numbersNextToDigits.push(numberOnLine);
            break;
          }
        }
        if (numberFound) {
          break;
        }
      }
    });
  }

  return getArraySum(numbersNextToDigits);
}
