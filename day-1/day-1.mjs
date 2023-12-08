import { getDayInput } from "../utils/getDayInput.mjs";

function getAllPossibleStringCombinations(str) {
  let combinations = [];
  for (let i = 0; i < str.length; i++) {
    for (let j = i + 1; j < str.length + 1; j++) {
      combinations.push(str.slice(i, j));
    }
  }
  return combinations;
}

function getStringWithConvertedNumbers(string) {
  const numberMapping = {
    one: 1,
    two: 2,
    three: 3,
    fourteen: 14,
    four: 4,
    five: 5,
    sixteen: 16,
    six: 6,
    seventeen: 17,
    seven: 7,
    eighteen: 18,
    eight: 8,
    nineteen: 19,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
    thirteen: 13,
    fifteen: 15,
    twenty: 20,
    twentyone: 21,
    twentytwo: 22,
    twentythree: 23,
    twentyfour: 24,
    twentyfive: 25,
    twentysix: 26,
    twentyseven: 27,
    twentyeight: 28,
    twentynine: 29,
    thirty: 30,
    thirtyone: 31,
    thirtytwo: 32,
    thirtythree: 33,
    thirtyfour: 34,
    thirtyfive: 35,
    thirtysix: 36,
    thirtyseven: 37,
    thirtyeight: 38,
    thirtynine: 39,
    forty: 40,
    fortyone: 41,
    fortytwo: 42,
    fortythree: 43,
    fortyfour: 44,
    fortyfive: 45,
    fortysix: 46,
    fortyseven: 47,
    fortyeight: 48,
    fortynine: 49,
    fifty: 50,
    fiftyone: 51,
    fiftytwo: 52,
    fiftythree: 53,
    fiftyfour: 54,
    fiftyfive: 55,
    fiftysix: 56,
    fiftyseven: 57,
    fiftyeight: 58,
    fiftynine: 59,
    sixty: 60,
    sixtyone: 61,
    sixtytwo: 62,
    sixtythree: 63,
    sixtyfour: 64,
    sixtyfive: 65,
    sixtysix: 66,
    sixtyseven: 67,
    sixtysix: 66,
    sixtyeight: 68,
    sixtynine: 69,
    seventy: 70,
    seventyone: 71,
    seventytwo: 72,
    seventythree: 73,
    seventyfour: 74,
    seventyfive: 75,
    seventysix: 76,
    seventyseven: 77,
    seventyeight: 78,
    seventynine: 79,
    eighty: 80,
    eightyone: 81,
    eightytwo: 82,
    eightythree: 83,
    eightyfour: 84,
    eightyfive: 85,
    eightysix: 86,
    eightyseven: 87,
    eightyeight: 88,
    eightynine: 89,
    ninety: 90,
    ninetyone: 91,
    ninetytwo: 92,
    ninetythree: 93,
    ninetyfour: 94,
    ninetyfive: 95,
    ninetysix: 96,
    ninetyseven: 97,
    ninetyeight: 98,
    ninetynine: 99,
    hundred: 100,
  };
  return getAllPossibleStringCombinations(string)
    .map(partialString => Number(partialString) || Number(numberMapping[partialString]))
    .join("");
}

function getStringFinalSum(string) {
  return string
    .split("\n")
    .map(string => getStringWithConvertedNumbers(string).replace(/[a-zA-Z]+/gi, ""))
    .map(item => Number(`${item.slice(0, 1)}${item.slice(-1)}`))
    .reduce((acc, item) => acc + item, 0);
}

export default function getAnswer() {
  const fileResult = getDayInput(import.meta);
  return getStringFinalSum(fileResult);
}
