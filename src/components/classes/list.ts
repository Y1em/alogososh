import { ElementStates } from "../../types/element-states";

export class Node<T> {
  value: T;
  next: Node<T> | null;
  status: ElementStates;
  constructor(value: T, status: ElementStates, next?: Node<T> | null) {
    this.value = value;
    this.next = next === undefined ? null : next;
    this.status = status;
  }
}

interface ILinkedList<T> {
  append: (element: T, status: ElementStates) => void;
  getSize: () => number;
  getArray: () => Node<T>[];
  getTailIndex: () => number;
}

export class LinkedList<T> implements ILinkedList<T> {
  private head: Node<T> | null;
  private size: number;
  constructor(initArray: T[]) {
    this.head = null;
    this.size = 0;
    initArray.forEach((node) => {
      this.append(node, ElementStates.Default);
    });
  }

  append(element: T, status: ElementStates) {
    const node = new Node(element, ElementStates.Default);
    if (this.size === 0) {
      this.head = node;
    } else {
      let current = this.head;
      while (current?.next) {
        current = current.next;
      }
      if (current) {
        current.next = new Node(element, status);
      }
    }
    this.size++;
  }

  prepend(element: T, status: ElementStates) {
    const node = new Node(element, status, this.head);
    this.head = node;
    this.size++;
  }

  shift() {
    this.head = this.getArray()[1];
    this.size--;
  }

  pop() {
    if (this.size === 1) {
      this.head = null;
    } else {
      this.getArray()[this.getTailIndex() - 1].next = null;
    }
    this.size--;
  }

  add(index: number, element: T, status: ElementStates) {
    if (index <= this.size) {
      if (index === 0) {
        this.prepend(element, status);
      } else if (index === 1) {
        let current = this.head;
        if (current) {
          const node = new Node(element, status, current.next);
          current.next = node;
        }
        this.size++;
      } else {
        let current = this.head;
        while (current?.next) {
          current = current.next;
          if (current === this.getArray()[index - 1]) {
            const node = new Node(element, status, current.next);
            current.next = node;
          }
        }
        this.size++;
      }
    }
  }

  delete(index: number) {
    if (this.size > 0) {
      if (index === 0) {
        this.shift();
      } else if (this.size - 1 === index) {
        this.pop();
      } else if (index > 0) {
        this.getArray()[index - 1].next = this.getArray()[index + 1];
        this.size--;
      }
    }
  }

  getTailIndex = () => this.getArray().length - 1;

  getTail = () => this.getArray()[this.getTailIndex()];

  getArray = () => {
    const arr: Node<T>[] = [];
    if (this.head) {
      arr.push(this.head);
      let current = this.head;
      while (current?.next) {
        current = current.next;
        arr.push(current);
      }
    }
    return arr;
  };

  getSize = () => this.size;
}
