import React, { SyntheticEvent, useCallback } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import style from "./string.module.css"
import { Circle } from "../ui/circle/circle";

export const StringComponent: React.FC = () => {
  const [inputValue, setInputValue] = React.useState<string>("");

  const [display, setDisplay] = React.useState<boolean>(false);
  const letterArray = inputValue.split("");
  const letterObjArray = createObjArr(letterArray);
  const [arr, setArr] = React.useState<any>([]);

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onFormSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (letterArray.length > 0) {
      setDisplay(true);
      reverse(letterObjArray);
    }


  }

  const delay = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };


  function createObjArr(arr: string[]) {
    const objArr: any = [];
    arr.forEach((el) => {
      const obj = {
        "letter": el,
        "status": "default",
      }
      objArr.push(obj);
    })
    return objArr;
  };

  function swap(arr: any, start: number, end: number) {

    const temp = arr[start].letter;
    arr[start].letter = arr[end].letter;
    arr[end].letter = temp;

  }

  async function reverse(arr: any) {

    // const newArr: any = JSON.parse(JSON.stringify(arr));

    for (let i = 0; i < Math.floor(arr.length) / 2; i++) {
      arr[i].status = "changing";
      arr[arr.length - 1 - i].status = "changing";
      setArr([...arr]);
      await delay(1000);
      swap(arr, i, arr.length - 1 - i);
      arr[i].status = "modified";
      arr[arr.length - 1 - i].status = "modified";
      setArr([...arr]);
    }

    return arr

  }

  return (
    <SolutionLayout title="Строка" >
      <form
        className={style.container}
        onSubmit={onFormSubmit}
      >
        <Input
          maxLength={11}
          isLimitText={true}
          extraClass={style.input}
          value={inputValue}
          onChange={onValueChange}
        />
        <Button
          text={"Развернуть"}
          type="submit"
        />
      </form>
      <div className={style.letterContainer} >
        {display && arr.map((el: any, index: any) => {
          return (
            <Circle
              state={el.status}
              letter={el.letter}
              extraClass={style.letter}
              key={index}
            />
          )
        })}
      </div>

    </SolutionLayout>
  );
};
