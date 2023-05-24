import React, { SyntheticEvent } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import style from "./string.module.css";
import { Circle } from "../ui/circle/circle";
import { DELAY_IN_MS } from "../../constants/common-const";
import { swap, delay } from "../../utils/common-utils";
import { createObjArr } from "./utils";
import { ElementStates, TArrLetter } from "../../types/element-states";
import { MAX_LENGHT } from "./const";

export const StringComponent: React.FC = () => {
  const [inputValue, setInputValue] = React.useState<string>("");
  const [display, setDisplay] = React.useState<boolean>(false);
  const letterArray = inputValue.split("");
  const letterObjArray = createObjArr(letterArray);
  const [arr, setArr] = React.useState<TArrLetter>([]);
  const [isLoad, setLoad] = React.useState<boolean>(false);

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onFormSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (letterArray.length > 0) {
      setDisplay(true);
      reverse(letterObjArray);
    }
  };

  async function reverse(arr: TArrLetter) {
    setLoad(true);
    for (let i = 0; i < Math.floor(arr.length) / 2; i++) {
      const start = i;
      const end = arr.length - 1 - i;
      arr[start].status = ElementStates.Changing;
      arr[end].status = ElementStates.Changing;
      setArr([...arr]);
      await delay(DELAY_IN_MS);
      swap(arr, start, end);
      arr[start].status = ElementStates.Modified;
      arr[end].status = ElementStates.Modified;
      setArr([...arr]);
    }
    setLoad(false);
  }

  return (
    <SolutionLayout title="Строка">
      <form className={style.container} onSubmit={onFormSubmit}>
        <Input
          maxLength={MAX_LENGHT}
          isLimitText={true}
          extraClass={style.input}
          value={inputValue}
          onChange={onValueChange}
          disabled={isLoad}
        />
        <Button text={"Развернуть"} type="submit" isLoader={isLoad} />
      </form>
      <div className={style.letterContainer}>
        {display &&
          arr.map((el, index) => {
            return (
              <Circle
                state={el.status}
                letter={el.element}
                extraClass={style.letter}
                key={index}
              />
            );
          })}
      </div>
    </SolutionLayout>
  );
};
