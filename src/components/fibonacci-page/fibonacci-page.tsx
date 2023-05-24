import React, { SyntheticEvent } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import style from "./fibonacci-page.module.css";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { delay } from "../../utils/common-utils";
import { SHORT_DELAY_IN_MS } from "../../constants/common-const";
import { getFibonacciNumbers } from "./utils";
import { MIN_NUMBER, MAX_NUMBER } from "./const";

export const FibonacciPage: React.FC = () => {
  const [inputValue, setInputValue] = React.useState<string>("");
  const [display, setDisplay] = React.useState<boolean>(false);
  const [arr, setArr] = React.useState<number[]>([]);
  const [isLoad, setLoad] = React.useState<boolean>(false);
  const fibArr = getFibonacciNumbers(Number(inputValue));

  const onFormSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (inputValue) {
      setDisplay(true);
      putArray(fibArr);
    } else {
      setDisplay(false);
    }
  };

  async function putArray(array: number[]) {
    const tempArr = [];
    setLoad(true);
    for (let i = 0; i <= array.length - 1; i++) {
      if (i > 0) {
        await delay(SHORT_DELAY_IN_MS)
      }
      tempArr.push(array[i]);
      setArr([...tempArr]);
    }
    setInputValue('');
    setLoad(false);
  }

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <form className={style.form} onSubmit={onFormSubmit}>
        <Input
          type="number"
          max={MAX_NUMBER}
          min={MIN_NUMBER}
          isLimitText={true}
          extraClass={style.input}
          value={inputValue}
          onChange={onValueChange}
          disabled={isLoad}
        />
        <Button text={"Рассчитать"} type="submit" isLoader={isLoad} />
      </form>
      <div className={style.numberContainer}>
        {display &&
          arr.map((el, index) => {
            return (
              <Circle
                extraClass={style.number}
                letter={el.toString()}
                key={index}
                index={index}
              />
            );
          })}
      </div>
    </SolutionLayout>
  );
};
