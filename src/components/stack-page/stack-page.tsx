import React, { SyntheticEvent } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Button } from "../ui/button/button";
import { Input } from "../ui/input/input";
import style from "./stack-page.module.css";
import { Circle } from "../ui/circle/circle";
import { ElementStates, TLetter, TArrLetter } from "../../types/element-states";
import { delay } from "../../utils/utils";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";

export const StackPage: React.FC = () => {
  const [inputValue, setInputValue] = React.useState<string>("");
  const [arr, setArr] = React.useState<TArrLetter>([]);
  const [disabled, setDisabled] = React.useState<boolean>(false);

  async function push(array: TArrLetter, item: TLetter) {
    setDisabled(true);
    array.push(item);
    await delay(SHORT_DELAY_IN_MS);
    setArr((prev) => {
      prev[prev.length - 1].status = ElementStates.Default;
      return [...prev]
    })
    setDisabled(false);
  };

  async function pop(array: TArrLetter) {
    setDisabled(true);
    array[array.length - 1].status = ElementStates.Changing;
    await delay(SHORT_DELAY_IN_MS);
    array.pop();
    setDisabled(false);
  };

  function onFormSubmit (e: SyntheticEvent) {
    e.preventDefault();
    if (inputValue !== "" && arr.length < 20) {
      const item: TLetter = {
        element: inputValue,
        status: ElementStates.Changing
      }
      push(arr, item);
    }
    setInputValue("")
  }

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  function onClean() {
    setArr([])
  }

  function onDelete() {
    if (arr.length > 0) {
      pop(arr);
    }
  }

  return (
    <SolutionLayout title="Стек">

      <form
        className={style.form}
        onSubmit={onFormSubmit}
      >
        <Input
          maxLength={4}
          isLimitText={true}
          extraClass={style.input}
          value={inputValue}
          onChange={onValueChange}
          disabled={arr.length === 20}
        />
        <Button
          text={"Добавить"}
          type="submit"
          extraClass={style.button}
          isLoader={disabled}
        />
        <Button
          text={"Удалить"}
          type="button"
          extraClass={style.button}
          onClick={onDelete}
          isLoader={disabled}
        />
        <Button
          text={"Очистить"}
          type="button"
          extraClass={style.button}
          onClick={onClean}
          disabled={arr.length === 0}
        />
      </form>

      <div className={style.stackContainer} >
        {arr && arr.map((el, index, array) => {
          return (
            <Circle
              state={el.status}
              letter={el.element}
              extraClass={style.letter}
              key={index}
              head={index === array.length - 1 ? "top" : ""}
              index={index}
            />
          )
        })}
      </div>

    </SolutionLayout>
  );
};
