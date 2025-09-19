import React, { useState } from 'react';

// Node 클래스
class ListNode<T> {
  data: T;
  next: ListNode<T> | null;

  constructor(data: T) {
    this.data = data;
    this.next = null;
  }
}

// MyLinkedList 클래스 (React에서 사용하기 위해 간소화)
class MyLinkedList<T> {
  private head: ListNode<T> | null;
  private size: number;

  constructor() {
    this.head = null;
    this.size = 0;
  }

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

  getSize(): number {
    return this.size;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current !== null) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }
}

// Queue 클래스
class MyQueue<T> {
  private list: MyLinkedList<T>;

  constructor() {
    this.list = new MyLinkedList<T>();
  }

  enqueue(data: T): void {
    this.list.add(data);
  }

  dequeue(): T {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    return this.list.delete(0);
  }

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

  toArray(): T[] {
    return this.list.toArray();
  }
}

// Stack 클래스
class MyStack<T> {
  private list: MyLinkedList<T>;

  constructor() {
    this.list = new MyLinkedList<T>();
  }

  push(data: T): void {
    this.list.add(data);
  }

  pop(): T {
    if (this.isEmpty()) {
      throw new Error("Stack is empty");
    }
    const lastIndex = this.list.getSize() - 1;
    return this.list.delete(lastIndex);
  }

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

  toArray(): T[] {
    return this.list.toArray();
  }
}

// React 컴포넌트
const LinkedListDemo = () => {
  const [list] = useState(() => new MyLinkedList<number>());
  const [queue] = useState(() => new MyQueue<string>());
  const [stack] = useState(() => new MyStack<string>());
  const [listData, setListData] = useState<number[]>([]);
  const [queueData, setQueueData] = useState<string[]>([]);
  const [stackData, setStackData] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const updateListDisplay = () => {
    setListData(list.toArray());
  };

  const updateQueueDisplay = () => {
    setQueueData(queue.toArray());
  };

  const updateStackDisplay = () => {
    setStackData(stack.toArray());
  };

  // LinkedList 작업들
  const addToList = (value: number) => {
    try {
      list.add(value);
      updateListDisplay();
      addLog(`LinkedList에 ${value} 추가`);
    } catch (error) {
      addLog(`오류: ${error}`);
    }
  };

  const getFromList = (index: number) => {
    try {
      const value = list.get(index);
      addLog(`LinkedList[${index}] = ${value}`);
    } catch (error) {
      addLog(`오류: ${error}`);
    }
  };

  const deleteFromList = (index: number) => {
    try {
      const deleted = list.delete(index);
      updateListDisplay();
      addLog(`LinkedList[${index}] 삭제: ${deleted}`);
    } catch (error) {
      addLog(`오류: ${error}`);
    }
  };

  // Queue 작업들
  const enqueueItem = (item: string) => {
    try {
      queue.enqueue(item);
      updateQueueDisplay();
      addLog(`Queue에 "${item}" 추가`);
    } catch (error) {
      addLog(`오류: ${error}`);
    }
  };

  const dequeueItem = () => {
    try {
      const item = queue.dequeue();
      updateQueueDisplay();
      addLog(`Queue에서 "${item}" 제거`);
    } catch (error) {
      addLog(`오류: ${error}`);
    }
  };

  // Stack 작업들
  const pushItem = (item: string) => {
    try {
      stack.push(item);
      updateStackDisplay();
      addLog(`Stack에 "${item}" 추가`);
    } catch (error) {
      addLog(`오류: ${error}`);
    }
  };

  const popItem = () => {
    try {
      const item = stack.pop();
      updateStackDisplay();
      addLog(`Stack에서 "${item}" 제거`);
    } catch (error) {
      addLog(`오류: ${error}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const runDemo = () => {
    clearLogs();
    
    // LinkedList 데모
    addToList(10);
    setTimeout(() => addToList(20), 300);
    setTimeout(() => addToList(30), 600);
    setTimeout(() => getFromList(1), 900);
    setTimeout(() => deleteFromList(1), 1200);
    
    // Queue 데모
    setTimeout(() => enqueueItem("첫번째"), 1500);
    setTimeout(() => enqueueItem("두번째"), 1800);
    setTimeout(() => enqueueItem("세번째"), 2100);
    setTimeout(() => dequeueItem(), 2400);
    
    // Stack 데모
    setTimeout(() => pushItem("A"), 2700);
    setTimeout(() => pushItem("B"), 3000);
    setTimeout(() => pushItem("C"), 3300);
    setTimeout(() => popItem(), 3600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          🔗 LinkedList 자료구조 시각화
        </h1>

        {/* 데모 실행 버튼 */}
        <div className="text-center mb-8">
          <button
            onClick={runDemo}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
          >
            🎯 자동 데모 실행
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* LinkedList Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">🔗 LinkedList</h2>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2">현재 상태:</h3>
              <div className="flex items-center space-x-2 mb-2">
                {listData.length === 0 ? (
                  <span className="text-gray-400">비어있음</span>
                ) : (
                  listData.map((item, index) => (
                    <React.Fragment key={index}>
                      <div className="bg-blue-100 border-2 border-blue-300 px-3 py-1 rounded">
                        {item}
                      </div>
                      {index < listData.length - 1 && (
                        <span className="text-blue-500">→</span>
                      )}
                    </React.Fragment>
                  ))
                )}
              </div>
              <p className="text-sm text-gray-600">크기: {listData.length}</p>
            </div>

            <div className="space-y-2">
              <div className="flex space-x-2">
                <button
                  onClick={() => addToList(Math.floor(Math.random() * 100))}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  추가
                </button>
                <button
                  onClick={() => getFromList(0)}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  disabled={listData.length === 0}
                >
                  조회[0]
                </button>
                <button
                  onClick={() => deleteFromList(0)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  disabled={listData.length === 0}
                >
                  삭제[0]
                </button>
              </div>
            </div>
          </div>

          {/* Queue Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-green-600">📥 Queue (FIFO)</h2>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2">현재 상태:</h3>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-gray-600">OUT ←</span>
                {queueData.length === 0 ? (
                  <span className="text-gray-400">비어있음</span>
                ) : (
                  queueData.map((item, index) => (
                    <div key={index} className="bg-green-100 border-2 border-green-300 px-3 py-1 rounded">
                      {item}
                    </div>
                  ))
                )}
                <span className="text-sm text-gray-600">← IN</span>
              </div>
              <p className="text-sm text-gray-600">크기: {queueData.length}</p>
            </div>

            <div className="space-y-2">
              <div className="flex space-x-2">
                <button
                  onClick={() => enqueueItem(`Item${queueData.length + 1}`)}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  Enqueue
                </button>
                <button
                  onClick={dequeueItem}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  disabled={queueData.length === 0}
                >
                  Dequeue
                </button>
              </div>
            </div>
          </div>

          {/* Stack Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-purple-600">📚 Stack (LIFO)</h2>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2">현재 상태:</h3>
              <div className="flex flex-col items-center space-y-1 mb-2">
                <span className="text-sm text-gray-600">↑ TOP</span>
                {stackData.length === 0 ? (
                  <span className="text-gray-400">비어있음</span>
                ) : (
                  stackData.slice().reverse().map((item, index) => (
                    <div key={index} className="bg-purple-100 border-2 border-purple-300 px-3 py-1 rounded w-20 text-center">
                      {item}
                    </div>
                  ))
                )}
                <span className="text-sm text-gray-600">↓ BOTTOM</span>
              </div>
              <p className="text-sm text-gray-600">크기: {stackData.length}</p>
            </div>

            <div className="space-y-2">
              <div className="flex space-x-2">
                <button
                  onClick={() => pushItem(`Item${stackData.length + 1}`)}
                  className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
                >
                  Push
                </button>
                <button
                  onClick={popItem}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  disabled={stackData.length === 0}
                >
                  Pop
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 로그 섹션 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">📋 실행 로그</h2>
            <button
              onClick={clearLogs}
              className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600"
            >
              로그 지우기
            </button>
          </div>
          
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-64 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-gray-500">실행 로그가 여기에 표시됩니다...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 설명 섹션 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">📚 자료구조 설명</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-bold text-blue-600 mb-2">LinkedList</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 노드들이 연결된 구조</li>
                <li>• 동적 크기 조정 가능</li>
                <li>• 순차적 접근 필요 O(n)</li>
                <li>• 삽입/삭제 효율적</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-lg font-bold text-green-600 mb-2">Queue (큐)</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• FIFO (First In, First Out)</li>
                <li>• 선입선출 구조</li>
                <li>• enqueue: 뒤에 추가</li>
                <li>• dequeue: 앞에서 제거</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-lg font-bold text-purple-600 mb-2">Stack (스택)</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• LIFO (Last In, First Out)</li>
                <li>• 후입선출 구조</li>
                <li>• push: 위에 추가</li>
                <li>• pop: 위에서 제거</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 코드 예제 섹션 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">💻 사용 예제</h2>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-sm text-gray-800">
{`// LinkedList 사용 예제
const list = new MyLinkedList<number>();
list.add(10);          // [10]
list.add(20);          // [10, 20]
list.get(1);           // 20 반환
list.delete(0);        // 10 삭제, [20]

// Queue 사용 예제  
const queue = new MyQueue<string>();
queue.enqueue("첫번째");  // 큐에 추가
queue.enqueue("두번째");  // 큐에 추가
queue.dequeue();         // "첫번째" 반환 및 제거

// Stack 사용 예제
const stack = new MyStack<string>();
stack.push("A");         // 스택에 추가
stack.push("B");         // 스택에 추가  
stack.pop();             // "B" 반환 및 제거`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedListDemo;