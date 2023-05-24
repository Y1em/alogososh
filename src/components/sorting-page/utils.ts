import { ElementStates } from "../../types/element-states";

export function randomArr() {
  let columns: number = Math.round(Math.random() * 17);
  if (columns < 3) {
    columns = 3;
  }
  const arr = [];
  for (let i = 0; i < columns; i++) {
    arr.push({
      element: Math.round(Math.random() * 100),
      status: ElementStates.Default,
    });
  }
  return arr;
}
