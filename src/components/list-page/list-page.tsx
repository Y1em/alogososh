import React, { SyntheticEvent } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Circle } from "../ui/circle/circle";
import { Button } from "../ui/button/button";
import style from "./list-page.module.css";
import { ArrowIcon } from "../ui/icons/arrow-icon";
import { LinkedList } from "./class-list";
import { ElementStates } from "../../types/element-states";
import { delay } from "../../utils/common-utils";
import {
  HEAD,
  TAIL,
  SHORT_DELAY_IN_MS,
  INPUT_LENGHTH_MAX
} from "../../constants/common-const";
import { Node } from "./class-list";
import { fillArrow } from "./utils";
import {
  MAX_LIST_LENGTH,
  REMOVE_BY_INDEX,
  REMOVE_FROM_TAIL,
  REMOVE_FROM_HEAD,
  ADD_BY_INDEX,
  ADD_TO_HEAD,
  ADD_TO_TAIL
} from "./const";

export const ListPage: React.FC = () => {
  const initArr = ["0", "34", "8", "1"];
  const list = React.useMemo(() => new LinkedList<string>(initArr), []); // eslint-disable-line
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

  function getCircleEnd(trigger: boolean, end?: typeof HEAD | typeof TAIL, ) {
    if (trigger) {
      return (
        <Circle
          letter={valueOfEnd}
          state={ElementStates.Changing}
          isSmall={true}
        />
      );
    } else {
      return end ? end : "";
    }
  }

  function getHead(index: number) {
    const circleHead = getCircleEnd(changeHead, HEAD);
    const circleTail = getCircleEnd(changeTail);
    if (targetLoader === ADD_TO_HEAD && index === 0) {
      return circleHead
    } else if (targetLoader === ADD_TO_TAIL && index === arr.length - 1) {
      return circleTail
    } else if (targetLoader === ADD_BY_INDEX && index === Number(inputIndex) && circleIndex < 0) {
      return circleHead;
    } else if (circleIndex === index) {
      return circleHead;
    } else if (index === 0) {
      return HEAD;
    }
  }

  function getTail(index: number) {
    const circleHead = getCircleEnd(changeHead);
    const circleTail = getCircleEnd(changeTail, TAIL);
    if (targetLoader === REMOVE_FROM_TAIL && index === arr.length - 1) {
      return circleTail
    } else if (targetLoader === REMOVE_FROM_HEAD && index === 0) {
      return circleHead
    } else if (targetLoader === REMOVE_BY_INDEX && index === Number(inputIndex)) {
      return circleTail
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
          maxLength={INPUT_LENGHTH_MAX}
          isLimitText={true}
          extraClass={style.input}
          value={inputValue}
          onChange={onValueChange}
        />
        <Button
          text={"Добавить в head"}
          type="button"
          extraClass={style.button}
          isLoader={targetLoader === ADD_TO_HEAD}
          onClick={(e) => addToEnds(e, HEAD, setChangeHead)}
          disabled={
            list.getSize() > MAX_LIST_LENGTH || inputValue === "" || isLoad
          }
          value={ADD_TO_HEAD}
        />
        <Button
          text={"Добавить в tail"}
          type="button"
          extraClass={style.button}
          isLoader={targetLoader === ADD_TO_TAIL}
          onClick={(e) => addToEnds(e, TAIL, setChangeTail)}
          disabled={
            list.getSize() > MAX_LIST_LENGTH || inputValue === "" || isLoad
          }
          value={ADD_TO_TAIL}
        />
        <Button
          text={"Удалить из head"}
          type="button"
          extraClass={style.button}
          onClick={(e) => deleteFromEnds(e, HEAD, setChangeHead)}
          isLoader={targetLoader === REMOVE_FROM_HEAD}
          disabled={list.getSize() === 0 || isLoad}
          value={REMOVE_FROM_HEAD}
        />
        <Button
          text={"Удалить из tail"}
          type="button"
          extraClass={style.button}
          onClick={(e) => deleteFromEnds(e, TAIL, setChangeTail)}
          isLoader={targetLoader === REMOVE_FROM_TAIL}
          disabled={list.getSize() === 0 || isLoad}
          value={REMOVE_FROM_TAIL}
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
          value={ADD_BY_INDEX}
          isLoader={targetLoader === ADD_BY_INDEX}
        />
        <Button
          text={"Удалить по индексу"}
          type="button"
          extraClass={`${style.button} ${style.button_wide}`}
          onClick={(e) => deleteByIndex(e, Number(inputIndex))}
          disabled={
            inputIndex === "" || Number(inputIndex) >= list.getSize() || isLoad
          }
          value={REMOVE_BY_INDEX}
          isLoader={targetLoader === REMOVE_BY_INDEX}
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
