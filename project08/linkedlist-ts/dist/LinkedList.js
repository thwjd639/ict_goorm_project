"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyStack = exports.MyQueue = exports.MyLinkedList = void 0;
// Node 클래스: LinkedList의 각 노드를 표현
class ListNode {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}
// MyLinkedList에서 사용할 Iterator 구현
class LinkedListIterator {
    constructor(head) {
        this.current = head;
    }
    hasNext() {
        return this.current !== null;
    }
    next() {
        if (!this.hasNext()) {
            throw new Error("No more elements");
        }
        const data = this.current.data;
        this.current = this.current.next;
        return data;
    }
}
// 메인 MyLinkedList 클래스
class MyLinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }
    // 마지막에 데이터 추가
    add(data) {
        const newNode = new ListNode(data);
        if (this.head === null) {
            this.head = newNode;
        }
        else {
            let current = this.head;
            while (current.next !== null) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
    }
    // 특정 인덱스의 데이터 반환
    get(index) {
        if (index < 0 || index >= this.size) {
            throw new Error(`Index ${index} is out of bounds`);
        }
        let current = this.head;
        for (let i = 0; i < index; i++) {
            current = current.next;
        }
        return current.data;
    }
    // 특정 인덱스의 데이터 삭제
    delete(index) {
        if (index < 0 || index >= this.size) {
            throw new Error(`Index ${index} is out of bounds`);
        }
        if (index === 0) {
            const deletedData = this.head.data;
            this.head = this.head.next;
            this.size--;
            return deletedData;
        }
        let current = this.head;
        for (let i = 0; i < index - 1; i++) {
            current = current.next;
        }
        const deletedData = current.next.data;
        current.next = current.next.next;
        this.size--;
        return deletedData;
    }
    // 리스트 크기 반환
    getSize() {
        return this.size;
    }
    // 리스트가 비어있는지 확인
    isEmpty() {
        return this.size === 0;
    }
    // for-each를 위한 Symbol.iterator 구현
    [Symbol.iterator]() {
        let current = this.head;
        return {
            next() {
                if (current === null) {
                    return { done: true, value: undefined };
                }
                const value = current.data;
                current = current.next;
                return { done: false, value };
            },
            [Symbol.iterator]() {
                return this;
            }
        };
    }
    // 디버깅을 위한 toString 메서드
    toString() {
        const elements = [];
        for (const element of this) {
            elements.push(element);
        }
        return `[${elements.join(', ')}]`;
    }
}
exports.MyLinkedList = MyLinkedList;
// =========================
// Queue 구현
// =========================
class MyQueue {
    constructor() {
        this.list = new MyLinkedList();
    }
    // 큐에 요소 추가 (enqueue)
    enqueue(data) {
        this.list.add(data);
    }
    // 큐에서 요소 제거 (dequeue)
    dequeue() {
        if (this.isEmpty()) {
            throw new Error("Queue is empty");
        }
        return this.list.delete(0);
    }
    // 큐의 첫 번째 요소 확인 (peek)
    peek() {
        if (this.isEmpty()) {
            throw new Error("Queue is empty");
        }
        return this.list.get(0);
    }
    isEmpty() {
        return this.list.isEmpty();
    }
    size() {
        return this.list.getSize();
    }
    toString() {
        return `Queue: ${this.list.toString()}`;
    }
}
exports.MyQueue = MyQueue;
// =========================
// Stack 구현
// =========================
class MyStack {
    constructor() {
        this.list = new MyLinkedList();
    }
    // 스택에 요소 추가 (push)
    push(data) {
        this.list.add(data);
    }
    // 스택에서 요소 제거 (pop)
    pop() {
        if (this.isEmpty()) {
            throw new Error("Stack is empty");
        }
        const lastIndex = this.list.getSize() - 1;
        return this.list.delete(lastIndex);
    }
    // 스택의 마지막 요소 확인 (peek)
    peek() {
        if (this.isEmpty()) {
            throw new Error("Stack is empty");
        }
        const lastIndex = this.list.getSize() - 1;
        return this.list.get(lastIndex);
    }
    isEmpty() {
        return this.list.isEmpty();
    }
    size() {
        return this.list.getSize();
    }
    toString() {
        return `Stack: ${this.list.toString()}`;
    }
}
exports.MyStack = MyStack;
//# sourceMappingURL=LinkedList.js.map