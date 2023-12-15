import { getArraySum } from "../utils/getArraySum.mjs";
import { getDayInput } from "../utils/getDayInput.mjs";
import { memoize } from "../utils/memoize.mjs";

const getNumberOfCombinations = memoize((stringToMatch, targetedCombination) => {
  if (stringToMatch.length === 0) {
    if (targetedCombination.length === 0) {
      return 1;
    }
    return 0;
  }
  if (targetedCombination.length === 0) {
    for (let i = 0; i < stringToMatch.length; i++) {
      if (stringToMatch[i] === "#") {
        return 0;
      }
    }
    return 1;
  }

  if (stringToMatch.length < getArraySum(targetedCombination) + targetedCombination.length - 1) {
    // The line is not long enough for all runs
    return 0;
  }

  // Reduce subset to work with
  if (stringToMatch[0] === ".") {
    return getNumberOfCombinations(stringToMatch.slice(1), targetedCombination);
  }

  if (stringToMatch[0] === "#") {
    const [run, ...leftoverRuns] = targetedCombination;
    for (let i = 0; i < run; i++) {
      // Does not complete the number of runs required
      if (stringToMatch[i] === ".") {
        return 0;
      }
    }
    // Went too far on the combination
    if (stringToMatch[run] === "#") {
      return 0;
    }

    return getNumberOfCombinations(stringToMatch.slice(run + 1), leftoverRuns);
  }

  // Is a ? and we will fill the next ones
  return getNumberOfCombinations(`#${stringToMatch.slice(1)}`, targetedCombination) + getNumberOfCombinations(`.${stringToMatch.slice(1)}`, targetedCombination);
});

function getPart1Answer(fileArray) {
  return getArraySum(
    fileArray.map(str => {
      const [pattern, combination] = str.split(" ");
      const numberCombinations = getNumberOfCombinations(pattern, combination.split(",").map(Number));
      return numberCombinations;
    }),
  );
}

function unfoldString(str) {
  const [pattern, combination] = str.split(" ");
  return [Array(5).fill(pattern).join("?"), Array(5).fill(combination).join(",").split(",").map(Number)];
}

function getPart2Answer(fileArray) {
  return getArraySum(
    fileArray.map((str, index) => {
      const [pattern, combination] = unfoldString(str);
      console.log(index);
      return getNumberOfCombinations(pattern, combination);
    }),
  );
}

export default function getAnswer() {
  const fileArray = getDayInput(import.meta)
    .split("\n")
    .filter(Boolean);
  return `Part 1: ${getPart1Answer(fileArray)} Part 2: ${getPart2Answer(fileArray)}`;
}
