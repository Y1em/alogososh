interface IQueue<T> {
  enqueue: (item: T) => void;
  dequeue: () => void;
  clear: () => void;
}

export class Queue<T> implements IQueue<T> {
  private container: (T | undefined)[] = [];
  private head: number = -1;
  private tail: number = -1;
  private readonly size: number = 0;
  private length: number = 0;
  private tailVisibility: boolean = false;

  constructor(size: number) {
    this.size = size;
    this.container = Array(size);
  }

  addTailIndex = () => {
    if (!this.tailVisibility) {
      this.head = this.head + 1;
    }
    this.tail = this.tail + 1;
  };

  enqueue = (item: T) => {
    if (this.length >= this.size) {
      throw new Error("Maximum length exceeded");
    }
    if (this.tail === 0) {
      this.head = 0;
    }
    this.length = this.length + 1;
    this.container[this.tail] = item;
    this.tailVisibility = true;
  };

  dequeue = () => {
    if (this.isEmpty()) {
      throw new Error("No elements in the queue");
    }
    if (this.head < this.tail) {
      this.container[this.head] = undefined;
      this.length = this.length - 1;
      this.head = this.head + 1;
    } else if (this.head === this.tail) {
      this.container[this.head] = undefined;
      this.length = this.length - 1;
      this.tailVisibility = false;
    }
  };

  clear = () => {
    this.container = Array(this.size);
    this.length = 0;
    this.tail = -1;
    this.head = -1;
  };

  isEmpty = () => this.length === 0;
  getArray = () => this.container;
  getTail = () => this.container[this.tail];
  getHead = () => this.container[this.head];
  getTailIndex = () => this.tail;
  getHeadIndex = () => this.head;
  getTailVisibility = () => this.tailVisibility;
}
