import { getDayInput } from "../utils/getDayInput.mjs";
import { getArraySum } from "../utils/getArraySum.mjs";

function getNumberDifference({ xPos, yPos, numbersArray, diffsArray }) {
  if (!diffsArray[yPos + 1]) {
    diffsArray[yPos + 1] = [];
  }

  let differenceOnNumbers;
  if (yPos === 0) {
    differenceOnNumbers = numbersArray[xPos] - numbersArray[xPos + 1];
    diffsArray[0][xPos] = numbersArray[xPos];
    diffsArray[0][xPos + 1] = numbersArray[xPos + 1];
  } else {
    const secondCharacter = diffsArray[yPos][xPos + 1] ? diffsArray[yPos][xPos + 1] : getNumberDifference({ xPos: xPos + 1, yPos: yPos - 1, numbersArray, diffsArray });
    differenceOnNumbers = diffsArray[yPos][xPos] - secondCharacter;
  }

  diffsArray[yPos + 1][xPos] = differenceOnNumbers;
  return differenceOnNumbers;
}

function getPart1Answer(fileArray) {
  const charactersMapping = fileArray.filter(Boolean).map(str => str.split(" ").map(Number).reverse());
  return getArraySum(
    charactersMapping
      .map(numbersArray => {
        let diffsArray = [[]];

        let returnedDifference = 1;
        let xPos = 0;
        let yPos = 0;

        while (returnedDifference !== 0) {
          returnedDifference = getNumberDifference({ xPos, yPos, numbersArray, diffsArray });
          yPos += 1;
        }

        return diffsArray;
      })
      .map(diffArray => diffArray.reduce((acc, arrayLine) => acc + arrayLine[0], 0)),
  );
}

function getPart2Answer(fileArray) {
  const charactersMapping = fileArray.filter(Boolean).map(str => str.split(" ").map(Number));

  return getArraySum(
    charactersMapping
      .map(numbersArray => {
        const lineLength = numbersArray.length;
        let diffsArray = [[]];

        let xPos = 0;
        let yPos = 0;

        while (yPos < lineLength - 1) {
          getNumberDifference({ xPos, yPos, numbersArray, diffsArray });
          yPos += 1;
        }

        return diffsArray;
      })
      .map(diffArray => diffArray.reduce((acc, arrayLine) => acc + arrayLine[0], 0)),
  );
}

export default function getAnswer() {
  const fileArray = getDayInput(import.meta).split("\n");

  return `Part 1: ${getPart1Answer(fileArray)} Part 2: ${getPart2Answer(fileArray)}`;
}
