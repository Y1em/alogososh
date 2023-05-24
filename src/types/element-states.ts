export enum ElementStates {
  Default = "default",
  Changing = "changing",
  Modified = "modified",
}

export type TLetter = {
  element: string;
  status: ElementStates;
}

export type TArrLetter = TLetter[];

type TSortEl = Omit<TLetter, 'element'> & {element: number};

export type TSortArr = TSortEl[];
