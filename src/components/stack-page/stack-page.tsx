import React, { SyntheticEvent } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Button } from "../ui/button/button";
import { Input } from "../ui/input/input";
import style from "./stack-page.module.css";
import { Circle } from "../ui/circle/circle";
import { ElementStates, TLetter, TArrLetter } from "../../types/element-states";
import { delay } from "../../utils/common-utils";
import { SHORT_DELAY_IN_MS } from "../../constants/common-const";
import { Stack } from "./class-stack";
import {
  MAX_STACK_LENGTH,
  TOP,
  ADD,
  REMOVE
} from "./const";
import { INPUT_LENGHTH_MAX } from "../../constants/common-const";

export const StackPage: React.FC = () => {
  const stack = React.useMemo(() => new Stack<TLetter>(), []);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [arr, setArr] = React.useState<TArrLetter>([]);
  const [disabled, setDisabled] = React.useState<boolean>(false);
  const [targetLoader, setLoader] = React.useState<string>("");

  async function onFormSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setLoader(ADD);
    setDisabled(true);
    if (inputValue !== "" && arr.length < 20) {
      const item: TLetter = {
        element: inputValue,
        status: ElementStates.Changing,
      };
      stack.push(item);
      setArr([...stack.getArray()]);
      await delay(SHORT_DELAY_IN_MS);
      setArr((prev) => {
        prev[prev.length - 1].status = ElementStates.Default;
        return [...prev];
      });
    }
    setInputValue("");
    setDisabled(false);
    setLoader("");
  }

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  function onClean() {
    stack.clear();
    setArr([...stack.getArray()]);
  }

  async function onDelete(e: SyntheticEvent) {
    const target = (e.currentTarget as HTMLInputElement).name;
    if (arr.length > 0) {
      setLoader(target);
      setDisabled(true);
      setArr((prev) => {
        prev[prev.length - 1].status = ElementStates.Changing;
        return [...prev];
      });
      await delay(SHORT_DELAY_IN_MS);
      stack.pop();
      setArr([...stack.getArray()]);
      setDisabled(false);
      setLoader("");
    }
  }

  return (
    <SolutionLayout title="Стек">
      <form className={style.form} onSubmit={onFormSubmit}>
        <Input
          maxLength={INPUT_LENGHTH_MAX}
          isLimitText={true}
          extraClass={style.input}
          value={inputValue}
          onChange={onValueChange}
          disabled={arr.length === MAX_STACK_LENGTH || disabled}
        />
        <Button
          text={"Добавить"}
          type="submit"
          extraClass={style.button}
          isLoader={targetLoader === ADD}
          disabled={arr.length === MAX_STACK_LENGTH || disabled}
        />
        <Button
          text={"Удалить"}
          type="button"
          extraClass={style.button}
          onClick={onDelete}
          isLoader={targetLoader === REMOVE}
          disabled={arr.length === 0 || disabled}
          name={REMOVE}
        />
        <Button
          text={"Очистить"}
          type="button"
          extraClass={style.button}
          onClick={onClean}
          disabled={arr.length === 0 || disabled}
        />
      </form>

      <div className={style.stackContainer}>
        {arr &&
          arr.map((el, index, array) => {
            return (
              <Circle
                state={el.status}
                letter={el.element}
                extraClass={style.letter}
                key={index}
                head={index === array.length - 1 ? TOP : ""}
                index={index}
              />
            );
          })}
      </div>
    </SolutionLayout>
  );
};
