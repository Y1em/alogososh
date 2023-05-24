import React, { SyntheticEvent } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import style from "./queue-page.module.css";
import { Button } from "../ui/button/button";
import { Input } from "../ui/input/input";
import { Circle } from "../ui/circle/circle";
import { delay } from "../../utils/common-utils";
import { SHORT_DELAY_IN_MS } from "../../constants/common-const";
import { ElementStates } from "../../types/element-states";
import { TArrLetter, TLetter } from "../../types/element-states";
import { Queue } from "./class-queue";
import { QUEUE_LENGHTH_MAX, ADD, REMOVE } from "./const";
import { INPUT_LENGHTH_MAX } from "../../constants/common-const";
import { TAIL, HEAD } from "../../constants/common-const";

export const QueuePage: React.FC = () => {

  const initArr: TArrLetter = [];
  for (let i = 0; i < QUEUE_LENGHTH_MAX; i++) {
    initArr.push({
      element: "",
      status: ElementStates.Default,
    });
  }
  const queue = React.useMemo(() => new Queue<TLetter>(QUEUE_LENGHTH_MAX), []);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [arr, setArr] = React.useState<(TLetter | undefined)[]>(initArr);
  const [isLoad, setLoad] = React.useState<boolean>(false);
  const [targetLoader, setLoader] = React.useState<string>("");

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  function onClean() {
    queue.clear();
    setArr([...queue.getArray()]);
  }

  async function onDelete() {
    setLoad(true);
    setLoader(REMOVE)
    queue.getHead()!.status = ElementStates.Changing;
    setArr([...queue.getArray()]);
    await delay(SHORT_DELAY_IN_MS);
    queue.dequeue();
    setArr([...queue.getArray()]);
    setLoad(false);
    setLoader("")
  }

  async function onFormSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setLoader(ADD)
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
    setLoader("")
  }

  return (
    <SolutionLayout title="Очередь">
      <form className={style.form} onSubmit={onFormSubmit}>
        <Input
          maxLength={INPUT_LENGHTH_MAX}
          isLimitText={true}
          extraClass={style.input}
          value={inputValue}
          onChange={onValueChange}
          disabled={isLoad}
        />
        <Button
          text={"Добавить"}
          type="submit"
          extraClass={style.button}
          isLoader={targetLoader === ADD}
          disabled={queue.getTailIndex() === QUEUE_LENGHTH_MAX - 1 || inputValue.length === 0 || isLoad}
        />
        <Button
          text={"Удалить"}
          type="button"
          extraClass={style.button}
          onClick={onDelete}
          isLoader={targetLoader === REMOVE}
          disabled={queue.getTailIndex() === -1 || !queue.getTailVisibility() || isLoad}
        />
        <Button
          text={"Очистить"}
          type="button"
          extraClass={style.button}
          onClick={onClean}
          disabled={queue.getTailIndex() === -1 || isLoad}
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
                  ? TAIL
                  : ""
              }
              head={queue.getHeadIndex() === index ? HEAD : ""}
            />
          );
        })}
      </div>
    </SolutionLayout>
  );
};
