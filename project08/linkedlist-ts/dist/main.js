"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LinkedList_1 = require("./LinkedList");
function testLinkedList() {
    console.log("=".repeat(50));
    console.log("        LinkedList 자료구조 학습 시작!");
    console.log("=".repeat(50));
    // MyLinkedList 테스트
    console.log("\n🔗 === MyLinkedList 테스트 ===");
    const list = new LinkedList_1.MyLinkedList();
    // 데이터 추가 테스트
    console.log("\n📝 데이터 추가 테스트:");
    list.add(10);
    console.log(`10 추가: ${list.toString()}`);
    list.add(20);
    console.log(`20 추가: ${list.toString()}`);
    list.add(30);
    console.log(`30 추가: ${list.toString()}`);
    // 데이터 조회 테스트
    console.log("\n🔍 데이터 조회 테스트:");
    console.log(`인덱스 0: ${list.get(0)}`);
    console.log(`인덱스 1: ${list.get(1)}`);
    console.log(`인덱스 2: ${list.get(2)}`);
    // 데이터 삭제 테스트
    console.log("\n🗑️ 데이터 삭제 테스트:");
    const deleted = list.delete(1);
    console.log(`인덱스 1 삭제된 값: ${deleted}`);
    console.log(`삭제 후 리스트: ${list.toString()}`);
    // for-each 순회 테스트
    console.log("\n🔄 for-each 순회 테스트:");
    let i = 0;
    for (const item of list) {
        console.log(`  인덱스 ${i}: ${item}`);
        i++;
    }
    console.log(`\n📊 리스트 크기: ${list.getSize()}`);
    console.log(`📊 비어있는가: ${list.isEmpty()}`);
}
function testQueue() {
    console.log("\n📥 === Queue 테스트 (FIFO - 선입선출) ===");
    const queue = new LinkedList_1.MyQueue();
    console.log("\n➕ 큐에 데이터 추가:");
    queue.enqueue("첫번째 손님");
    console.log(`첫번째 손님 추가: ${queue.toString()}`);
    queue.enqueue("두번째 손님");
    console.log(`두번째 손님 추가: ${queue.toString()}`);
    queue.enqueue("세번째 손님");
    console.log(`세번째 손님 추가: ${queue.toString()}`);
    console.log("\n🔍 큐 상태 확인:");
    console.log(`다음 순서: ${queue.peek()}`);
    console.log(`큐 크기: ${queue.size()}`);
    console.log("\n➖ 큐에서 데이터 제거:");
    console.log(`서비스 완료: ${queue.dequeue()}`);
    console.log(`현재 큐 상태: ${queue.toString()}`);
    console.log(`서비스 완료: ${queue.dequeue()}`);
    console.log(`현재 큐 상태: ${queue.toString()}`);
}
function testStack() {
    console.log("\n📚 === Stack 테스트 (LIFO - 후입선출) ===");
    const stack = new LinkedList_1.MyStack();
    console.log("\n➕ 스택에 데이터 추가:");
    stack.push("접시 1");
    console.log(`접시 1 추가: ${stack.toString()}`);
    stack.push("접시 2");
    console.log(`접시 2 추가: ${stack.toString()}`);
    stack.push("접시 3");
    console.log(`접시 3 추가: ${stack.toString()}`);
    console.log("\n🔍 스택 상태 확인:");
    console.log(`맨 위 접시: ${stack.peek()}`);
    console.log(`스택 크기: ${stack.size()}`);
    console.log("\n➖ 스택에서 데이터 제거:");
    console.log(`꺼낸 접시: ${stack.pop()}`);
    console.log(`현재 스택 상태: ${stack.toString()}`);
    console.log(`꺼낸 접시: ${stack.pop()}`);
    console.log(`현재 스택 상태: ${stack.toString()}`);
}
function testGenerics() {
    console.log("\n🎯 === 제네릭 테스트 ===");
    console.log("\n📝 문자열 리스트:");
    const stringList = new LinkedList_1.MyLinkedList();
    stringList.add("Hello");
    stringList.add("World");
    stringList.add("TypeScript");
    console.log(`문자열 리스트: ${stringList.toString()}`);
    console.log("\n✅ 불린 리스트:");
    const booleanList = new LinkedList_1.MyLinkedList();
    booleanList.add(true);
    booleanList.add(false);
    booleanList.add(true);
    console.log(`불린 리스트: ${booleanList.toString()}`);
    console.log("\n👤 객체 리스트:");
    const personList = new LinkedList_1.MyLinkedList();
    personList.add({ name: "김철수", age: 25 });
    personList.add({ name: "이영희", age: 30 });
    console.log("사람 리스트:");
    for (const person of personList) {
        console.log(`  - ${person.name} (${person.age}세)`);
    }
}
// 메인 실행 함수
function main() {
    try {
        testLinkedList();
        testQueue();
        testStack();
        testGenerics();
        console.log("\n" + "=".repeat(50));
        console.log("        🎉 모든 테스트 완료!");
        console.log("=".repeat(50));
    }
    catch (error) {
        console.error("❌ 오류 발생:", error);
    }
}
// 프로그램 시작
main();
//# sourceMappingURL=main.js.map