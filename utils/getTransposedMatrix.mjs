export const getTransposedMatrix = matrix => matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
