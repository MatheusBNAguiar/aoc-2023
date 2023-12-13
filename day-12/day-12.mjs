import { getArraySum } from "../utils/getArraySum.mjs";
import { getDayInput } from "../utils/getDayInput.mjs";

function areArraysEquals(arr1, arr2) {
  if (arr1.length != arr2.length) {
    return false;
  }
  return !arr1.find((value, index) => value !== arr2[index]);
}

function getShouldProgressWithNextIteration(newString, targetedCombination) {
  const matchesWithWildcard = newString.match(/(\#)+/gm)?.map(str => str.length);
  if (matchesWithWildcard?.find((value, index) => value > targetedCombination[index])) {
    return false;
  }
  if (matchesWithWildcard?.filter((value, index) => value !== targetedCombination[index]).length > 2) {
    return false;
  }

  return true;
}

function isAlreadyMatched(newString, targetedCombination) {
  const matchesWithWildcard = newString.match(/(\#)+/gm)?.map(str => str.length);
  return matchesWithWildcard && areArraysEquals(targetedCombination, matchesWithWildcard);
}

function getNumberOfCombinations(stringToMatch, targetedCombination) {
  let counter = 0;
  const iterateOverCombinationMatch = wildcardString => {
    const indexOfWildcard = wildcardString.indexOf("?");
    if (indexOfWildcard === -1) {
      if (
        wildcardString.match(/(\#)+/gm) &&
        areArraysEquals(
          targetedCombination,
          wildcardString.match(/(\#)+/gm).map(str => str.length),
        )
      ) {
        counter += 1;
        return;
      }
    } else {
      const partialString = wildcardString.slice(0, indexOfWildcard);
      if (getShouldProgressWithNextIteration(`${partialString}`, targetedCombination)) {
        iterateOverCombinationMatch(`${partialString}#${wildcardString.slice(indexOfWildcard + 1)}`);
        iterateOverCombinationMatch(`${partialString}.${wildcardString.slice(indexOfWildcard + 1)}`);
      }
    }
  };
  iterateOverCombinationMatch(stringToMatch);
  return counter;
}

function getPart1Answer(fileArray) {
  const t0 = performance.now();
  const sumValue = getArraySum(
    fileArray.map(str => {
      const [pattern, combination] = str.split(" ");
      const numberCombinations = getNumberOfCombinations(pattern, combination.split(",").map(Number));
      return numberCombinations;
    }),
  );
  const t1 = performance.now();
  console.log("getPart1Answer took " + (t1 - t0) + " milliseconds.");
  return sumValue;
}

function unfoldString(str) {
  const [pattern, combination] = str.split(" ");
  return [Array(5).fill(pattern).join("?"), Array(5).fill(combination).join(",").split(",").map(Number)];
}

function getPart2Answer(fileArray) {
  const t0 = performance.now();

  const finalSum = getArraySum(
    fileArray.map((str, index) => {
      const [pattern, combination] = unfoldString(str);
      console.log(index);
      return getNumberOfCombinations(pattern, combination);
    }),
  );
  const t1 = performance.now();
  console.log("getPart2Answer took " + (t1 - t0) + " milliseconds.");
  return finalSum;
}

export default function getAnswer() {
  const fileArray = getDayInput(import.meta)
    .split("\n")
    .filter(Boolean);
  return `Part 1: ${getPart1Answer(fileArray)} Part 2: ${getPart2Answer(fileArray)}`;
}

console.log(getAnswer());

// ???.### 1, 1, 3

//   ???.### ????.### ????.### ????.### ????.### 1, 1, 3, 1, 1, 3, 1, 1, 3, 1, 1, 3, 1, 1, 3
