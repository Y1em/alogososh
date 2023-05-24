import { ElementStates, TArrLetter } from "../../types/element-states";

export function createObjArr(arr: string[]) {
  const objArr: TArrLetter = [];
  arr.forEach((el) => {
    const obj = {
      element: el,
      status: ElementStates.Default,
    };
    objArr.push(obj);
  });
  return objArr;
}
