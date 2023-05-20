import { ElementStates, TArrLetter, TSortArr } from "../types/element-states";

export function createObjArr(arr: string[]) {
  const objArr: TArrLetter = [];
  arr.forEach((el) => {
    const obj = {
      "element": el,
      "status": ElementStates.Default,
    }
    objArr.push(obj);
  })
  return objArr;
};

export function swap(arr: TArrLetter | TSortArr, start: number, end: number) {
  const temp = arr[start].element;
  arr[start].element = arr[end].element;
  arr[end].element = temp;
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
};


export function randomArr() {
  let columns: number = Math.round(Math.random()*17);
  if (columns < 3) {
    columns = 3;
  }
  const arr = [];
  for (let i = 0; i < columns; i++) {
    arr.push({
      "element": Math.round(Math.random()*100),
      "status": ElementStates.Default,
    })
  }
  return arr
}
