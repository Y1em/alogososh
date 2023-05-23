import React, { SyntheticEvent } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Circle } from "../ui/circle/circle";
import { Button } from "../ui/button/button";
import style from "./list-page.module.css";
import { ArrowIcon } from "../ui/icons/arrow-icon";
import { LinkedList } from "../classes/list";
import { ElementStates } from "../../types/element-states";
import { delay } from "../../utils/utils";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import {
  HEAD,
  TAIL,
  initArr,
  maxListLength,
} from "../../constants/element-captions";
import { Node } from "../classes/list";
import { fillArrow } from "../../utils/utils";

export const ListPage: React.FC = () => {
  const list = React.useMemo(() => new LinkedList<string>(initArr), []);
  const listArr = list.getArray();
  const [inputValue, setInputValue] = React.useState<string>("");
  const [inputIndex, setInputIndex] = React.useState<string>("");
  const [arr, setArr] = React.useState<Node<string>[]>(listArr);
  const [changeTail, setChangeTail] = React.useState<boolean>(false);
  const [changeHead, setChangeHead] = React.useState<boolean>(false);
  const [isLoad, setLoad] = React.useState<boolean>(false);
  const [targetLoader, setLoader] = React.useState<string>("");
  const [valueOfEnd, setValueOfEnd] = React.useState<string>("");
  const [circleIndex, setCircleIndex] = React.useState<number>(-1);
  const [coloredArrowArr, setColoredArrowArr] = React.useState<number[]>([]);
  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const onIndexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputIndex(e.target.value);
  };

  function getHead(index: number) {
    function getCircleHead() {
      if (changeHead) {
        return (
          <Circle
            letter={valueOfEnd}
            state={ElementStates.Changing}
            isSmall={true}
          />
        );
      } else {
        return HEAD;
      }
    }
    const circle = getCircleHead();
    if (0 === Number(inputIndex) && index === 0) {
      return circle;
    } else if (
      index === Number(inputIndex) &&
      inputIndex !== "" &&
      circleIndex < 0
    ) {
      if (changeHead) {
        return circle;
      }
    } else if (inputIndex === "" && inputValue && index === 0) {
      return circle;
    } else if (inputIndex === "" && inputValue === "" && index === 0) {
      return circle;
    } else if (circleIndex === index) {
      if (changeHead) {
        return circle;
      }
    } else if (index === 0) {
      return HEAD;
    }
  }

  function getTail(index: number) {
    function getCircleTail() {
      if (changeTail) {
        return (
          <Circle
            letter={valueOfEnd}
            state={ElementStates.Changing}
            isSmall={true}
          />
        );
      } else {
        return TAIL;
      }
    }
    const circle = getCircleTail();
    if (arr.length - 1 === Number(inputIndex) && index === arr.length - 1) {
      return circle;
    } else if (index === Number(inputIndex) && inputIndex !== "") {
      if (changeTail) {
        return circle;
      }
    } else if (inputIndex === "" && inputValue && index === arr.length - 1) {
      return circle;
    } else if (
      inputIndex === "" &&
      inputValue === "" &&
      index === arr.length - 1
    ) {
      return circle;
    } else if (index === arr.length - 1) {
      return TAIL;
    }
  }

  async function addToEnds(
    e: SyntheticEvent,
    end: typeof HEAD | typeof TAIL,
    setTrigger: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    const target = (e.currentTarget as HTMLInputElement).value;
    setLoader(target);
    setLoad(true);
    setValueOfEnd(inputValue);
    setTrigger(true);
    await delay(SHORT_DELAY_IN_MS);
    end === HEAD
      ? list.prepend(inputValue, ElementStates.Modified)
      : list.append(inputValue, ElementStates.Modified);
    setArr([...list.getArray()]);
    setInputValue("");
    setTrigger(false);
    await delay(SHORT_DELAY_IN_MS);
    end === HEAD
      ? (list.getArray()[0].status = ElementStates.Default)
      : (list.getTail().status = ElementStates.Default);
    setArr([...list.getArray()]);
    setLoad(false);
    setLoader("");
  }

  async function deleteFromEnds(
    e: SyntheticEvent,
    end: typeof HEAD | typeof TAIL,
    setTrigger: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    const target = (e.currentTarget as HTMLInputElement).value;
    setLoader(target);
    setLoad(true);
    end === TAIL
      ? setValueOfEnd(list.getTail().value)
      : setValueOfEnd(list.getArray()[0].value);
    end === TAIL
      ? (list.getTail().value = "")
      : (list.getArray()[0].value = "");
    setTrigger(true);
    await delay(SHORT_DELAY_IN_MS);
    setTrigger(false);
    end === TAIL ? list.pop() : list.shift();
    setArr([...list.getArray()]);
    setLoad(false);
    setLoader("");
  }

  async function addByIndex(e: SyntheticEvent, index: number) {
    const target = (e.currentTarget as HTMLInputElement).value;
    setLoader(target);
    setLoad(true);
    setValueOfEnd(inputValue);
    setChangeHead(true);
    for (let i = 0; i < index; i++) {
      setCircleIndex(i);
      await delay(SHORT_DELAY_IN_MS);
      setColoredArrowArr((prev) => {
        prev.push(i);
        return [...prev];
      });
      list.getArray()[i].status = ElementStates.Changing;
      setArr([...list.getArray()]);
    }
    setCircleIndex(-1);
    await delay(SHORT_DELAY_IN_MS);
    setChangeHead(false);
    list.add(index, inputValue, ElementStates.Modified);
    setArr([...list.getArray()]);
    await delay(SHORT_DELAY_IN_MS);
    setColoredArrowArr([]);
    for (let i = 0; i < index; i++) {
      list.getArray()[i].status = ElementStates.Default;
    }
    setInputIndex("");
    setInputValue("");
    setArr([...list.getArray()]);
    await delay(SHORT_DELAY_IN_MS);
    list.getArray()[index].status = ElementStates.Default;
    setLoad(false);
    setLoader("");
  }

  async function deleteByIndex(e: SyntheticEvent, index: number) {
    const target = (e.currentTarget as HTMLInputElement).value;
    setLoader(target);
    setLoad(true);
    if (index !== undefined) {
      for (let i = 0; i <= index; i++) {
        list.getArray()[i].status = ElementStates.Changing;
        setArr([...list.getArray()]);
        setColoredArrowArr((prev) => {
          prev.push(i - 1);
          return [...prev];
        });
        await delay(SHORT_DELAY_IN_MS);
      }
      list.getArray()[index].status = ElementStates.Default;
      setValueOfEnd(list.getArray()[index].value);
      list.getArray()[index].value = "";
      setChangeTail(true);
      setArr([...list.getArray()]);
      await delay(SHORT_DELAY_IN_MS);
      setChangeTail(false);
      setArr([...list.getArray()]);
      list.delete(index);
      setColoredArrowArr([]);
      for (let i = 0; i < index; i++) {
        list.getArray()[i].status = ElementStates.Default;
      }
      setArr([...list.getArray()]);
      setInputIndex("");
    }
    setLoad(false);
    setLoader("");
  }

  return (
    <SolutionLayout title="Связный список">
      <form className={style.form}>
        <Input
          maxLength={4}
          isLimitText={true}
          extraClass={style.input}
          value={inputValue}
          onChange={onValueChange}
        />
        <Button
          text={"Добавить в head"}
          type="button"
          extraClass={style.button}
          isLoader={targetLoader === "addToHead"}
          onClick={(e) => addToEnds(e, HEAD, setChangeHead)}
          disabled={
            list.getSize() > maxListLength || inputValue === "" || isLoad
          }
          value="addToHead"
        />
        <Button
          text={"Добавить в tail"}
          type="button"
          extraClass={style.button}
          isLoader={targetLoader === "addToTail"}
          onClick={(e) => addToEnds(e, TAIL, setChangeTail)}
          disabled={
            list.getSize() > maxListLength || inputValue === "" || isLoad
          }
          value="addToTail"
        />
        <Button
          text={"Удалить из head"}
          type="button"
          extraClass={style.button}
          onClick={(e) => deleteFromEnds(e, HEAD, setChangeHead)}
          isLoader={targetLoader === "removeFromHead"}
          disabled={list.getSize() === 0 || isLoad}
          value="removeFromHead"
        />
        <Button
          text={"Удалить из tail"}
          type="button"
          extraClass={style.button}
          onClick={(e) => deleteFromEnds(e, TAIL, setChangeTail)}
          isLoader={targetLoader === "removeFromTail"}
          disabled={list.getSize() === 0 || isLoad}
          value="removeFromTail"
        />
        <Input
          placeholder="Введите индекс"
          extraClass={style.input}
          type="number"
          value={inputIndex}
          onChange={onIndexChange}
        />
        <Button
          text={"Добавить по индексу"}
          type="button"
          extraClass={`${style.button} ${style.button_wide}`}
          onClick={(e) => addByIndex(e, Number(inputIndex))}
          disabled={
            inputIndex === "" ||
            Number(inputIndex) >= list.getSize() ||
            inputValue === "" ||
            isLoad
          }
          value="addByIndex"
          isLoader={targetLoader === "addByIndex"}
        />
        <Button
          text={"Удалить по индексу"}
          type="button"
          extraClass={`${style.button} ${style.button_wide}`}
          onClick={(e) => deleteByIndex(e, Number(inputIndex))}
          disabled={
            inputIndex === "" || Number(inputIndex) >= list.getSize() || isLoad
          }
          value="removeByIndex"
          isLoader={targetLoader === "removeByIndex"}
        />
      </form>

      <div className={style.stackContainer}>
        {list.getSize() !== 0 &&
          arr.map((el, index, array) => {
            return (
              <div className={style.circle} key={index}>
                <Circle
                  letter={el?.value.toString()}
                  extraClass={style.letter}
                  index={index}
                  head={getHead(index)}
                  tail={getTail(index)}
                  state={el?.status}
                />

                {index !== array.length - 1 && (
                  <>
                    <div className={style.space} />
                    <ArrowIcon fill={fillArrow(index, coloredArrowArr)} />
                  </>
                )}
              </div>
            );
          })}
      </div>
    </SolutionLayout>
  );
};
