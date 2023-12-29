import { getDayInput } from "../utils/getDayInput.mjs";
import { init } from "z3-solver";

type HailstoneLine = [[number, number, number], [number, number, number]];

const getAngularCoeficient = (deltaA: number, deltaB: number) => deltaB / deltaA;
const isCrossGoingToHappen = (angularCoeficientA: number, angularCoeficientB: number) => angularCoeficientA - angularCoeficientB !== 0;
const getConstantValue = (angularCoeficient: number, initA: number, initB: number) => -1 * angularCoeficient * initA + initB;
const getValueA = (firstConstant: number, secondConstant: number, firstAngular: number, secondAngular: number) => (secondConstant - firstConstant) / (firstAngular - secondAngular);
const getValueB = (angularCoeficient: number, constantValue: number, valueA: number) => angularCoeficient * valueA + constantValue;
const isValueOnBoundaries = (value, lowerBoundary, higherBoundary) => value >= lowerBoundary && value <= higherBoundary;
const isValueBeforeTime = (valueInit, valueObtained, coeficitent) => (coeficitent > 0 ? valueObtained - valueInit : valueInit - valueObtained) < 0;
function isLineCrossingOnBoundary(hailstoneA: HailstoneLine, hailstoneB: HailstoneLine, lowerBoundary: number, higherBoundary: number) {
  const [[xA, yA], [deltaXA, deltaYA]] = hailstoneA;
  const [[xB, yB], [deltaXB, deltaYB]] = hailstoneB;

  const angularCoeficientA = getAngularCoeficient(deltaXA, deltaYA);
  const angularCoeficientB = getAngularCoeficient(deltaXB, deltaYB);
  if (!isCrossGoingToHappen(angularCoeficientA, angularCoeficientB)) {
    return false;
  }

  const constantValueA = getConstantValue(angularCoeficientA, xA, yA);
  const constantValueB = getConstantValue(angularCoeficientB, xB, yB);
  const xCross = getValueA(constantValueA, constantValueB, angularCoeficientA, angularCoeficientB);
  if (isValueBeforeTime(xA, xCross, deltaXA) || isValueBeforeTime(xB, xCross, deltaXB) || !isValueOnBoundaries(xCross, lowerBoundary, higherBoundary)) {
    return false;
  }
  const yCross = getValueB(angularCoeficientA, constantValueA, xCross);
  return !isValueBeforeTime(yA, yCross, deltaYA) && !isValueBeforeTime(yB, yCross, deltaYB) && isValueOnBoundaries(yCross, lowerBoundary, higherBoundary);
}

function getPart1Answer(hailstoneArray: HailstoneLine[]) {
  let crossCount = 0;
  const LOWER_BOUNDARY = 200000000000000;
  const HIGHER_BOUNDARY = 400000000000000;

  for (let hailStoneAIndex = 0; hailStoneAIndex < hailstoneArray.length; hailStoneAIndex++) {
    const hailStoneA = hailstoneArray[hailStoneAIndex];
    for (let hailStoneBIndex = hailStoneAIndex + 1; hailStoneBIndex < hailstoneArray.length; hailStoneBIndex++) {
      const hailStoneB = hailstoneArray[hailStoneBIndex];
      if (isLineCrossingOnBoundary(hailStoneA, hailStoneB, LOWER_BOUNDARY, HIGHER_BOUNDARY)) {
        crossCount += 1;
      }
    }
  }
  return crossCount;
}

async function getPart2Answer(hailstoneArray: HailstoneLine[]) {
  const { Context } = await init();
  const Z3 = Context("main");

  const x = Z3.Real.const("x");
  const y = Z3.Real.const("y");
  const z = Z3.Real.const("z");

  const vx = Z3.Real.const("vx");
  const vy = Z3.Real.const("vy");
  const vz = Z3.Real.const("vz");

  const solver = new Z3.Solver();

  hailstoneArray.forEach((stone, index) => {
    const [[xS, yS, zS], [vXS, vYS, vZS]] = stone;
    const t = Z3.Real.const(`t${index}`);

    solver.add(t.ge(0));
    solver.add(x.add(vx.mul(t)).eq(t.mul(vXS).add(xS)));
    solver.add(y.add(vy.mul(t)).eq(t.mul(vYS).add(yS)));
    solver.add(z.add(vz.mul(t)).eq(t.mul(vZS).add(zS)));
  });

  const isSat = await solver.check();

  if (isSat !== "sat") return -1;

  const model = solver.model();
  const rx = Number(model.eval(x));
  const ry = Number(model.eval(y));
  const rz = Number(model.eval(z));

  return rx + ry + rz;
}

export default async function getAnswer() {
  const fileResult = getDayInput(import.meta)
    .split("\n")
    .reduce<HailstoneLine[]>((acc, str) => {
      if (str) {
        const [coordinates, velocities] = str.trim().split("@");
        acc.push([coordinates.split(",").map(str => Number(str.trim())), velocities.split(",").map(str => Number(str.trim()))]);
      }
      return acc;
    }, []);

  return `Part 1: ${getPart1Answer(fileResult)} Part 2: ${await getPart2Answer(fileResult)}`;
}
