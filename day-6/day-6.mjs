import { getDayInput } from "../utils/getDayInput.mjs";
import { getArrayPower } from "../utils/getArrayPower.mjs";

function getInequationIntervals(timeLimit, timeToSurpass) {
  /*
  Equation
  Space = Tp * (Tl-Tp) => Tp*Tl - Tp^2 
  Tp => Time Pressing
  Tl => Time Limit

  Proofs: For Tl = 7 => 7Tp - Tp^2 
  Space(Tp=1) = 7 - 1 = 6
  Space(Tp=2) = 14 - 4 = 10
  Space(Tp=3) = 21 - 9 = 12
  Space(Tp=4) = 28 - 16 = 12
  Space(Tp=5) = 35 - 25 = 10
  Space(Tp=6) = 42 - 36 = 6
  Space(Tp=7) = 0

  Inequation for breaking record
  Sp > Tp*Tl - Tp^2 => 0 > Tp*Tl - Tp^2 - Sp => 0 < Tp^2 - TpTl +Sp
  Root => (Tl +- sqrt(Tl^2 - 4*Sp ))/2

  Tl= 7 Sp=9
  Rt= (7 +- sqrt(49-36))/2 Rt1=1.7 Rt2=5.3
  To the example the intervals would be [2,5]
*/

  const discriminant = Math.sqrt(Math.pow(timeLimit, 2) - 4 * timeToSurpass);
  return [Math.floor((timeLimit - discriminant) / 2), Math.ceil((timeLimit + discriminant) / 2)];
}

function getTestsPair(fileString) {
  return fileString
    .split("\n")
    .map(string => string.match(/\d+/g))
    .filter(Boolean)
    .reduce((acc, items) => {
      for (let index = 0; index < items.length; index++) {
        const number = Number(items[index]);
        acc[index] = (acc[index] || []).concat(number);
      }
      return acc;
    }, []);
}

function getPart1Answer(fileResult) {
  return getArrayPower(
    getTestsPair(fileResult)
      .map(([timeLimit, timeToSurpass]) => getInequationIntervals(timeLimit, timeToSurpass))
      .map(([tpMin, tpMax]) => tpMax - tpMin - 1),
  );
}

function getPart2Answer(fileResult) {
  const [timeLimit, timeToSurpass] = fileResult
    .split("\n")
    .filter(Boolean)
    .map(string => Number(string.replace(/\D/g, "")));
  const [tpMin, tpMax] = getInequationIntervals(timeLimit, timeToSurpass);
  return tpMax - tpMin - 1;
}

export default function getAnswer() {
  const fileResult = getDayInput(import.meta);
  return `Part 1: ${getPart1Answer(fileResult)} Part 2: ${getPart2Answer(fileResult)}`;
}
