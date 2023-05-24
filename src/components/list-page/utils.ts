import { ARROW_COLORS } from "./const";

export function fillArrow(index: number, arrowArray: number[]) {
  for (let i = 0; i < arrowArray.length - 1; i++) {
    if (index === arrowArray[i]) {
      return ARROW_COLORS.changing;
    }
  }
}
