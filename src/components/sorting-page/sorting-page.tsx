import React from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Button } from "../ui/button/button";
import { Column } from "../ui/column/column";
import { RadioInput } from "../ui/radio-input/radio-input";
import style from "./sorting-page.module.css";
import { ElementStates, TSortArr } from "../../types/element-states";
import { swap, delay } from "../../utils/common-utils";
import { randomArr } from "./utils";
import { SHORT_DELAY_IN_MS } from "../../constants/common-const";
import { Direction } from "../../types/direction";
import {
  TO_LOW,
  TO_HIGH,
  SORT_BUBBLE,
  SORT_SELECTION
 } from "./const";

export const SortingPage: React.FC = () => {
  const [arr, setArr] = React.useState<TSortArr>([]);
  const [sortType, setType] = React.useState<string>(SORT_BUBBLE);
  const [isLoad, setLoad] = React.useState<boolean>(false);
  const [sortDirection, setDirection] = React.useState<typeof TO_LOW | typeof TO_HIGH | "">("");

  async function bubbleSort(array: TSortArr, direction: string) {
    setLoad(true);
    let condition = undefined;
    for (let i = array.length - 1; i >= 0; i--) {
      for (let j = 0; j < i; j++) {
        array[j].status = ElementStates.Changing;
        array[j + 1].status = ElementStates.Changing;
        setArr([...arr]);
        await delay(SHORT_DELAY_IN_MS);
        direction === TO_HIGH
          ? (condition = array[j].element > array[j + 1].element)
          : (condition = array[j].element < array[j + 1].element);
        if (condition) {
          swap(array, j, j + 1);
        }
        array[j].status = ElementStates.Default;
      }
      array[i].status = ElementStates.Modified;
    }
    setLoad(false);
  }

  async function selectionSort(array: TSortArr, direction: string) {
    setLoad(true);
    let condition = undefined;
    for (let i = 0; i <= array.length - 1; i++) {
      let maxInd = i;
      for (let j = i + 1; j < array.length; j++) {
        array[i].status = ElementStates.Changing;
        array[j].status = ElementStates.Changing;
        setArr([...arr]);
        await delay(SHORT_DELAY_IN_MS);
        array[j].status = ElementStates.Default;
        direction === TO_HIGH
          ? (condition = array[maxInd].element > array[j].element)
          : (condition = array[maxInd].element < array[j].element);
        if (condition) {
          array[maxInd].status = ElementStates.Default;
          maxInd = j;
        }
      }
      swap(array, i, maxInd);
      array[i].status = ElementStates.Modified;
    }
    setLoad(false);
  }

  function newArrButtonClick() {
    setArr(randomArr());
  }

  function resetStatusAfterSort(array: TSortArr) {
    if (array[0].status === ElementStates.Modified) {
      array.forEach((el) => (el.status = ElementStates.Default));
    }
  }

  function sortClick(direction: typeof TO_LOW | typeof TO_HIGH | "") {
    setDirection(direction);
    if (arr.length > 0 && sortType === SORT_BUBBLE) {
      resetStatusAfterSort(arr);
      bubbleSort(arr, direction);
    } else if (arr.length > 0 && sortType === SORT_SELECTION) {
      resetStatusAfterSort(arr);
      selectionSort(arr, direction);
    }
  }

  function changeType(e: React.ChangeEvent<HTMLInputElement>) {
    setType(e.target.value);
  }

  return (
    <SolutionLayout title="Сортировка массива" extraClass={style.container}>
      <form className={style.form}>
        <RadioInput
          label="Выбор"
          name="sortType"
          value={SORT_SELECTION}
          defaultChecked
          onChange={changeType}
          disabled={isLoad}
          extraClass={style.input}
        />

        <RadioInput
          label="Пузырёк"
          name="sortType"
          value={SORT_BUBBLE}
          onChange={changeType}
          disabled={isLoad}
          extraClass={style.input}
        />

        <Button
          type="button"
          text="По возрастанию"
          onClick={() => sortClick(TO_HIGH)}
          disabled={isLoad}
          isLoader={isLoad && sortDirection === TO_HIGH ? true : false}
          sorting={Direction.Ascending}
          extraClass={style.button}
        />

        <Button
          type="button"
          text="По убыванию"
          onClick={() => sortClick(TO_LOW)}
          disabled={isLoad}
          isLoader={isLoad && sortDirection === TO_LOW ? true : false}
          sorting={Direction.Descending}
          extraClass={style.button}
        />

        <Button
          type="button"
          text="Новый массив"
          onClick={newArrButtonClick}
          disabled={isLoad}
          extraClass={style.button}
        />
      </form>

      <div className={style.array}>
        {arr &&
          arr.map((n, index) => {
            return <Column index={n.element} state={n.status} key={index} />;
          })}
      </div>
    </SolutionLayout>
  );
};
