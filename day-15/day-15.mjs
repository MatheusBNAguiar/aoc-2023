import { getDayInput } from "../utils/getDayInput.mjs";
import { getArraySum } from "../utils/getArraySum.mjs";

function getCharHash(str) {
  return str.split("").reduce((acc, char) => ((acc + char.charCodeAt(0)) * 17) % 256, 0);
}

function getPart1Answer(stringArray) {
  return getArraySum(stringArray.map(getCharHash));
}

function getStringsOnBoxes(stringArray) {
  return stringArray.reduce((acc, item) => {
    const [signal] = item.match(/[-|=]/);
    const [label, value] = item.split(/[-|=]/);
    const labelHash = getCharHash(label);

    if (!acc[labelHash]) {
      if (signal !== "-") {
        acc[labelHash] = [[label, value]];
      }
    } else {
      if (signal === "-") {
        acc[labelHash] = acc[labelHash].filter(([itemLabel]) => itemLabel !== label);
      } else {
        const boxItemLocation = acc[labelHash].findIndex(([itemLabel]) => itemLabel === label);
        if (boxItemLocation === -1) {
          acc[labelHash].push([label, value]);
        } else {
          acc[labelHash][boxItemLocation] = [label, value];
        }
      }
    }
    return acc;
  }, {});
}

function getPart2Answer(stringArray) {
  return getArraySum(
    Object.entries(getStringsOnBoxes(stringArray)).map(([boxIndex, items]) => items.reduce((acc, item, slotIndex) => acc + (Number(boxIndex) + 1) * (slotIndex + 1) * Number(item[1]), 0)),
  );
}

export default function getAnswer() {
  const stringArray = getDayInput(import.meta)
    .replace("\n", "")
    .split(",");
  return `Part 1: ${getPart1Answer(stringArray)} Part 2: ${getPart2Answer(stringArray)}`;
}
