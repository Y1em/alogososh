import React, { SyntheticEvent } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Button } from "../ui/button/button";
import { Input } from "../ui/input/input";
import style from "./stack-page.module.css";
import { Circle } from "../ui/circle/circle";
import { ElementStates, TLetter, TArrLetter } from "../../types/element-states";
import { delay } from "../../utils/utils";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { Stack } from "../classes/stack";

export const StackPage: React.FC = () => {
  const stack = React.useMemo(() => new Stack<TLetter>(), []);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [arr, setArr] = React.useState<TArrLetter>([]);
  const [disabled, setDisabled] = React.useState<boolean>(false);

  async function onFormSubmit(e: SyntheticEvent) {
    e.preventDefault();
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
  }

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  function onClean() {
    stack.clear();
    setArr([...stack.getArray()]);
  }

  async function onDelete() {
    if (arr.length > 0) {
      setDisabled(true);
      setArr((prev) => {
        prev[prev.length - 1].status = ElementStates.Changing;
        return [...prev];
      });
      await delay(SHORT_DELAY_IN_MS);
      stack.pop();
      setArr([...stack.getArray()]);
      setDisabled(false);
    }
  }

  return (
    <SolutionLayout title="Стек">
      <form className={style.form} onSubmit={onFormSubmit}>
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

      <div className={style.stackContainer}>
        {arr &&
          arr.map((el, index, array) => {
            return (
              <Circle
                state={el.status}
                letter={el.element}
                extraClass={style.letter}
                key={index}
                head={index === array.length - 1 ? "top" : ""}
                index={index}
              />
            );
          })}
      </div>
    </SolutionLayout>
  );
};
