export function getArraySum(array) {
  return array.reduce((acc, item) => acc + Number(item), 0);
}
