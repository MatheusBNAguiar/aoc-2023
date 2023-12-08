import { getDayInput } from "../utils/getDayInput.mjs";

function getInstructionsAndMap() {
  const fileString = getDayInput(import.meta);
  const fileArray = fileString.split('\n').filter(Boolean);
  const instructions = fileArray.shift()
  const regex = /(\w+) = \((\w+), (\w+)\)/gm;

  const patternMap = new Map();
  let matchValues;

  while ((matchValues = regex.exec(fileArray)) !== null) {
    if (matchValues.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    const [_original, key, leftValue, rightValue] = matchValues;
    patternMap.set(`${key}L`, leftValue);
    patternMap.set(`${key}R`, rightValue);
  }

  return { instructions, patternMap, fileString };
}

function getStepsToAchieveBreakCondition({ initValue, instructions, patternMap, getBreakCondition = (x) => true }) {
  let lookupValue = initValue;
  let directionsIndex = 0;
  let lookupCount = 0;

  while (getBreakCondition(lookupValue)) {
    lookupCount += 1;
    lookupValue = patternMap.get(`${lookupValue}${instructions[directionsIndex]}`);
    directionsIndex += 1;
    if (directionsIndex >= instructions.length) {
      directionsIndex = 0;
    }
  }

  return lookupCount;
}

function getLCMFromArray(numberArray) {
  function gcd(a, b) {
    for (let temp = b; b !== 0;) {
      b = a % b;
      a = temp;
      temp = b;
    }
    return a;
  }

  function lcmFunction(a, b) {
    const gcdValue = gcd(a, b);
    return (a * b) / gcdValue;
  }

  return numberArray.reduce((acc, b) => lcmFunction(acc, b), numberArray[0]);
}

function getPart1Answer(instructions, patternMap) {
  return getStepsToAchieveBreakCondition({
    initValue: 'AAA',
    instructions,
    patternMap,
    getBreakCondition(x) {
      return x !== 'ZZZ';
    }
  });
}

function getPart2Answer(instructions, patternMap, fileString) {
  return getLCMFromArray(
    fileString
      .match(/^(\w\wA)/gm)
      .map((initValue) =>
        getStepsToAchieveBreakCondition({
          initValue,
          instructions,
          patternMap,
          getBreakCondition(x) {
            return x[2] !== 'Z';
          }
        }))
  );
}

export default function getAnswer() {
  const { instructions, patternMap, fileString } = getInstructionsAndMap();
  return `Part 1: ${getPart1Answer(instructions, patternMap)} Part 2: ${getPart2Answer(instructions, patternMap, fileString)}`;
}
