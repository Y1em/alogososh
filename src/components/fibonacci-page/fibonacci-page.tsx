import React, { SyntheticEvent } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import style from "./fibonacci-page.module.css";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { delay } from "../../utils/utils";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";

export const FibonacciPage: React.FC = () => {
  const [inputValue, setInputValue] = React.useState<string>("");
  const [display, setDisplay] = React.useState<boolean>(false);
  const [arr, setArr] = React.useState<number[]>([]);
  const [isLoad, setLoad] = React.useState<boolean>(false);

  const onFormSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (inputValue) {
      setDisplay(true);
      getFibArr(Number(inputValue));
    } else {
      setDisplay(false);
    }
  };

  async function getFibArr(n: number) {
    setLoad(true);
    const initArr = [1, 1];
    if (n == 0) {
      setArr([initArr[0]]);
    } else if (n == 1) {
      setArr([initArr[0]]);
      await delay(SHORT_DELAY_IN_MS);
      setArr([...initArr]);
    } else if (n > 1) {
      setArr([initArr[0]]);
      await delay(SHORT_DELAY_IN_MS);
      setArr([...initArr]);
      for (let i = 0; i <= n - 2; i++) {
        await delay(SHORT_DELAY_IN_MS);
        initArr.push(initArr[i] + initArr[i + 1]);
        setArr([...initArr]);
      }
    } else {
      setArr([]);
    }
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
          max={19}
          min={0}
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
