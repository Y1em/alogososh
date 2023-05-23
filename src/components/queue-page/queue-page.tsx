import React, { SyntheticEvent } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import style from "./queue-page.module.css";
import { Button } from "../ui/button/button";
import { Input } from "../ui/input/input";
import { Circle } from "../ui/circle/circle";
import { delay } from "../../utils/utils";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { ElementStates } from "../../types/element-states";
import { TArrLetter, TLetter } from "../../types/element-states";
import { Queue } from "../classes/queue";

export const QueuePage: React.FC = () => {
  const queueLengthMax = 7;
  const initArr: TArrLetter = [];
  for (let i = 0; i < queueLengthMax; i++) {
    initArr.push({
      element: "",
      status: ElementStates.Default,
    });
  }
  const queue = React.useMemo(() => new Queue<TLetter>(queueLengthMax), []);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [arr, setArr] = React.useState<(TLetter | undefined)[]>(initArr);
  const [isLoad, setLoad] = React.useState<boolean>(false);

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  function onClean() {
    queue.clear();
    setArr([...queue.getArray()]);
  }

  async function onDelete() {
    setLoad(true);
    queue.getHead()!.status = ElementStates.Changing;
    setArr([...queue.getArray()]);
    await delay(SHORT_DELAY_IN_MS);
    queue.dequeue();
    setArr([...queue.getArray()]);
    setLoad(false);
  }

  async function onFormSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setLoad(true);
    const item: TLetter = {
      element: "",
      status: ElementStates.Changing,
    };
    queue.addTailIndex();
    queue.enqueue(item);
    setArr([...queue.getArray()]);
    await delay(SHORT_DELAY_IN_MS);
    queue.getTail()!.element = inputValue;
    setArr([...queue.getArray()]);
    await delay(SHORT_DELAY_IN_MS);
    queue.getTail()!.status = ElementStates.Default;
    setArr([...queue.getArray()]);
    setInputValue("");
    setLoad(false);
  }

  return (
    <SolutionLayout title="Очередь">
      <form className={style.form} onSubmit={onFormSubmit}>
        <Input
          maxLength={4}
          isLimitText={true}
          extraClass={style.input}
          value={inputValue}
          onChange={onValueChange}
        />
        <Button
          text={"Добавить"}
          type="submit"
          extraClass={style.button}
          isLoader={isLoad}
          disabled={queue.getTailIndex() === 6 || inputValue.length === 0}
        />
        <Button
          text={"Удалить"}
          type="button"
          extraClass={style.button}
          onClick={onDelete}
          isLoader={isLoad}
          disabled={queue.getTailIndex() === -1 || !queue.getTailVisibility()}
        />
        <Button
          text={"Очистить"}
          type="button"
          extraClass={style.button}
          onClick={onClean}
          disabled={queue.getTailIndex() === -1}
        />
      </form>

      <div className={style.stackContainer}>
        {arr.map((el, index) => {
          return (
            <Circle
              letter={el?.element}
              state={el?.status}
              extraClass={style.letter}
              key={index}
              index={index}
              tail={
                queue.getTailIndex() === index && queue.getTailVisibility()
                  ? "tail"
                  : ""
              }
              head={queue.getHeadIndex() === index ? "head" : ""}
            />
          );
        })}
      </div>
    </SolutionLayout>
  );
};
