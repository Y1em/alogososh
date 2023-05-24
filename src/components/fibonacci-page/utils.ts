export function getFibonacciNumbers(n: number) {
  const initArr = [1, 1];
  if (n === 0) {
    return [initArr[0]];
  } else if (n === 1) {
    return initArr;
  } else if (n > 1) {
    for (let i = 0; i <= n - 2; i++) {
      initArr.push(initArr[i] + initArr[i + 1]);
    };
    return initArr;
  } else {
    return [];
  }
}
