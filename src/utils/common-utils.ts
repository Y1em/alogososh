import { TArrLetter, TSortArr } from "../types/element-states";

export function swap(arr: TArrLetter | TSortArr, start: number, end: number) {
  const temp = arr[start].element;
  arr[start].element = arr[end].element;
  arr[end].element = temp;
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}




