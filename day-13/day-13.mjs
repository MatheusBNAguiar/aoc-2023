import { getDayInput } from "../utils/getDayInput.mjs";
import { getArraySum } from "../utils/getArraySum.mjs";
import { getTransposedMatrix } from "../utils/getTransposedMatrix.mjs";

const subtractStrings = (str1, str2) =>
  str1
    .split("")
    .map((str, index) => (str !== str2[index] ? str : undefined))
    .filter(Boolean)
    .join("");

function getReflectionPosition(stringArray, onlySmudge = false) {
  const hasSmudge = (str1, str2) => Boolean(str1) && Boolean(str2) && onlySmudge && subtractStrings(str1, str2).length === 1;

  let reflectionIndex = 0;
  let isReflection = false;

  while (reflectionIndex < stringArray.length - 1 && !isReflection) {
    const centerLeft = stringArray[reflectionIndex];
    const centerRight = stringArray[reflectionIndex + 1];
    let smudgeCount = hasSmudge(centerLeft, centerRight) ? 1 : 0;

    if (centerLeft === centerRight || hasSmudge(centerLeft, centerRight)) {
      for (let comparisonIndex = 1; reflectionIndex + comparisonIndex < stringArray.length; comparisonIndex++) {
        const firstItemToCompare = stringArray[reflectionIndex - comparisonIndex];
        const secondItemToCompare = stringArray[reflectionIndex + 1 + comparisonIndex];
        if (
          firstItemToCompare === secondItemToCompare ||
          (!firstItemToCompare && Boolean(secondItemToCompare)) ||
          (Boolean(firstItemToCompare) && !secondItemToCompare) ||
          (hasSmudge(firstItemToCompare, secondItemToCompare) && smudgeCount < 1)
        ) {
          if (hasSmudge(firstItemToCompare, secondItemToCompare)) {
            smudgeCount += 1;
          }
          isReflection = true;
        } else {
          isReflection = false;
          break;
        }
      }
    }
    if (onlySmudge && smudgeCount !== 1) {
      isReflection = false;
    }

    reflectionIndex += 1;
  }

  if (isReflection) {
    return reflectionIndex;
  }
  return 0;
}

function getReflectionPositionSum(groupLines, onlySmudge = false) {
  const horizontalLine = getReflectionPosition(groupLines, onlySmudge);
  if (horizontalLine) {
    return horizontalLine * 100;
  }
  const verticalLinePosition = getReflectionPosition(
    getTransposedMatrix(groupLines.map(line => line.split(""))).map(line => line.join("")),
    onlySmudge,
  );
  if (verticalLinePosition) {
    return verticalLinePosition;
  }

  return 0;
}

function getPart1Answer(fileArrayGroup) {
  return getArraySum(fileArrayGroup.map(groupLines => getReflectionPositionSum(groupLines)));
}

function getPart2Answer(fileArrayGroup) {
  return getArraySum(fileArrayGroup.map(groupLines => getReflectionPositionSum(groupLines, true)));
}

export default function getAnswer() {
  const fileArrayGroup = getDayInput(import.meta)
    .split("\n\n")
    .filter(Boolean)
    .map(strGroup => strGroup.split("\n").filter(Boolean));

  return `Part 1: ${getPart1Answer(fileArrayGroup)} Part 2: ${getPart2Answer(fileArrayGroup)}`;
}
