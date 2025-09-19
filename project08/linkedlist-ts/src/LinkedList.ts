// Node 클래스: LinkedList의 각 노드를 표현
class ListNode<T> {
    data: T;
    next: ListNode<T> | null;

    constructor(data: T) {
        this.data = data;
        this.next = null;
    }
}

// Iterator 인터페이스 정의
interface Iterator<T> {
    hasNext(): boolean;
    next(): T;
}

// MyLinkedList에서 사용할 Iterator 구현
class LinkedListIterator<T> implements Iterator<T> {
    private current: ListNode<T> | null;

    constructor(head: ListNode<T> | null) {
        this.current = head;
    }

    hasNext(): boolean {
        return this.current !== null;
    }

    next(): T {
        if (!this.hasNext()) {
            throw new Error("No more elements");
        }
        const data = this.current!.data;
        this.current = this.current!.next;
        return data;
    }
}

// Iterable 인터페이스 정의 (for-each를 위해)
interface Iterable<T> {
    [Symbol.iterator](): IterableIterator<T>;
}

// 메인 MyLinkedList 클래스
export class MyLinkedList<T> implements Iterable<T> {
    private head: ListNode<T> | null;
    private size: number;

    constructor() {
        this.head = null;
        this.size = 0;
    }

    // 마지막에 데이터 추가
    add(data: T): void {
        const newNode = new ListNode(data);
        
        if (this.head === null) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next !== null) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
    }

    // 특정 인덱스의 데이터 반환
    get(index: number): T {
        if (index < 0 || index >= this.size) {
            throw new Error(`Index ${index} is out of bounds`);
        }

        let current = this.head;
        for (let i = 0; i < index; i++) {
            current = current!.next;
        }
        return current!.data;
    }

    // 특정 인덱스의 데이터 삭제
    delete(index: number): T {
        if (index < 0 || index >= this.size) {
            throw new Error(`Index ${index} is out of bounds`);
        }

        if (index === 0) {
            const deletedData = this.head!.data;
            this.head = this.head!.next;
            this.size--;
            return deletedData;
        }

        let current = this.head;
        for (let i = 0; i < index - 1; i++) {
            current = current!.next;
        }

        const deletedData = current!.next!.data;
        current!.next = current!.next!.next;
        this.size--;
        return deletedData;
    }

    // 리스트 크기 반환
    getSize(): number {
        return this.size;
    }

    // 리스트가 비어있는지 확인
    isEmpty(): boolean {
        return this.size === 0;
    }

    // for-each를 위한 Symbol.iterator 구현
    [Symbol.iterator](): IterableIterator<T> {
        let current = this.head;
        
        return {
            next(): IteratorResult<T> {
                if (current === null) {
                    return { done: true, value: undefined };
                }
                const value = current.data;
                current = current.next;
                return { done: false, value };
            },
            [Symbol.iterator](): IterableIterator<T> {
                return this;
            }
        };
    }

    // 디버깅을 위한 toString 메서드
    toString(): string {
        const elements: T[] = [];
        for (const element of this) {
            elements.push(element);
        }
        return `[${elements.join(', ')}]`;
    }
}

// =========================
// Queue 구현
// =========================
export class MyQueue<T> {
    private list: MyLinkedList<T>;

    constructor() {
        this.list = new MyLinkedList<T>();
    }

    // 큐에 요소 추가 (enqueue)
    enqueue(data: T): void {
        this.list.add(data);
    }

    // 큐에서 요소 제거 (dequeue)
    dequeue(): T {
        if (this.isEmpty()) {
            throw new Error("Queue is empty");
        }
        return this.list.delete(0);
    }

    // 큐의 첫 번째 요소 확인 (peek)
    peek(): T {
        if (this.isEmpty()) {
            throw new Error("Queue is empty");
        }
        return this.list.get(0);
    }

    isEmpty(): boolean {
        return this.list.isEmpty();
    }

    size(): number {
        return this.list.getSize();
    }

    toString(): string {
        return `Queue: ${this.list.toString()}`;
    }
}

// =========================
// Stack 구현
// =========================
export class MyStack<T> {
    private list: MyLinkedList<T>;

    constructor() {
        this.list = new MyLinkedList<T>();
    }

    // 스택에 요소 추가 (push)
    push(data: T): void {
        this.list.add(data);
    }

    // 스택에서 요소 제거 (pop)
    pop(): T {
        if (this.isEmpty()) {
            throw new Error("Stack is empty");
        }
        const lastIndex = this.list.getSize() - 1;
        return this.list.delete(lastIndex);
    }

    // 스택의 마지막 요소 확인 (peek)
    peek(): T {
        if (this.isEmpty()) {
            throw new Error("Stack is empty");
        }
        const lastIndex = this.list.getSize() - 1;
        return this.list.get(lastIndex);
    }

    isEmpty(): boolean {
        return this.list.isEmpty();
    }

    size(): number {
        return this.list.getSize();
    }

    toString(): string {
        return `Stack: ${this.list.toString()}`;
    }
}