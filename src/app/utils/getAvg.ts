const getAvg = (array: number[]) => {
  return Math.ceil(array.reduce((a, b) => a + b, 0) / array.length);
};

export default getAvg;
