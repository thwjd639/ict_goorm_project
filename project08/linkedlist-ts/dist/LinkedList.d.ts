interface Iterable<T> {
    [Symbol.iterator](): IterableIterator<T>;
}
export declare class MyLinkedList<T> implements Iterable<T> {
    private head;
    private size;
    constructor();
    add(data: T): void;
    get(index: number): T;
    delete(index: number): T;
    getSize(): number;
    isEmpty(): boolean;
    [Symbol.iterator](): IterableIterator<T>;
    toString(): string;
}
export declare class MyQueue<T> {
    private list;
    constructor();
    enqueue(data: T): void;
    dequeue(): T;
    peek(): T;
    isEmpty(): boolean;
    size(): number;
    toString(): string;
}
export declare class MyStack<T> {
    private list;
    constructor();
    push(data: T): void;
    pop(): T;
    peek(): T;
    isEmpty(): boolean;
    size(): number;
    toString(): string;
}
export {};
//# sourceMappingURL=LinkedList.d.ts.map