export function getArrayPower(array) {
  return array.reduce((acc, item) => acc * Number(item), 1);
}
