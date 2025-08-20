const list = document.getElementById('list');
const createBtn = document.getElementById('create-btn');

let todos = [];

createBtn.addEventListener('click', createNewTodo);

function createNewTodo() {
    //새로운 객체 생성
    const item = {
        id: new Date().getTime(),
        text: '',
        complete: false
    }

    // 배열에 새로운 item을 추가
    todos.unshift(item);

    //요소 생성하기
    const { itemEl, inputEl, editBtnEl, removeBtnEl } = createTodoElement(item);


    // list에 아이템 요소 추가 (정렬 후 렌더링)
    renderSortedTodos();

    // 새로 추가된 항목에 포커스
    const newItemEl = list.querySelector(`[data-id="${item.id}"]`);
    const newInputEl = newItemEl.querySelector('textarea');
    newInputEl.removeAttribute('disabled'); //속성 제거
    newInputEl.focus();

    saveToLocalStorage();
}

function createTodoElement(item) {
    const itemEl = document.createElement('div');
    itemEl.classList.add('item');
    itemEl.setAttribute('data-id', item.id); // ID 추가로 요소 식별

    const checkboxEl = document.createElement('input');
    checkboxEl.type = 'checkbox';
    checkboxEl.checked = item.complete;

    if(item.complete) {
        itemEl.classList.add('complete')
    }

    const inputEl = document.createElement('textarea');
    inputEl.value = item.text;
    inputEl.setAttribute('disabled', "");
    inputEl.setAttribute('rows', '1'); // 초기 행 수

    const actionsEl = document.createElement('div');
    actionsEl.classList.add('actions');

    const editBtnEl = document.createElement('button');
    editBtnEl.classList.add('material-icons');
    editBtnEl.innerText = 'edit';

    const removeBtnEl = document.createElement('button');
    removeBtnEl.classList.add('material-icons', 'remove-btn');
    removeBtnEl.innerText = 'remove_circle';

    actionsEl.append(editBtnEl);
    actionsEl.append(removeBtnEl);

    itemEl.append(checkboxEl);
    itemEl.append(inputEl);
    itemEl.append(actionsEl);

     // 초기 높이 설정
    setTimeout(() => adjustTextareaHeight(inputEl), 0);

    // 이벤트 리스트 추가
    checkboxEl.addEventListener('change',  () =>{
        item.complete = checkboxEl.checked;

        if(item.complete) {
            itemEl.classList.add('complete')
        }else {
            itemEl.classList.remove('complete')
        }
        
        renderSortedTodos(); // 체크박스 상태 변경 시 다시 정렬
        saveToLocalStorage();
    });

    inputEl.addEventListener('input', () => {
        adjustTextareaHeight(inputEl);
        item.text = inputEl.value;
    });

    inputEl.addEventListener('blur', () => {
        inputEl.setAttribute('disabled', "");
        saveToLocalStorage();
    });

    // enter : 저장 및 수정 종료, shift + enter : 줄바꿈
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();  // Shift가 없으면 줄바꿈 막고
            inputEl.blur();      // 저장 및 수정 종료
        }
        // Shift + Enter는 아무 동작 안 하므로 줄바꿈 됨
    });

    editBtnEl.addEventListener('click', () => {
        inputEl.removeAttribute('disabled');
        inputEl.focus();
    });

    removeBtnEl.addEventListener('click', () => {
        todos = todos.filter(t => t.id !== item.id);
        // itemEl.remove();
        renderSortedTodos(); // 삭제 후 다시 렌더링
        saveToLocalStorage();
    });

    return {
        itemEl,
        inputEl,
        editBtnEl,
        removeBtnEl
    }
}

// 정렬된 투두 리스트 렌더링 함수
function renderSortedTodos() {
    // 기존 리스트 초기화
    list.innerHTML = '';
    
    // 투두 정렬: 완료되지 않은 것 먼저, 그 다음 완료된 것
    // 각 그룹 내에서는 최신순 (ID 기준 내림차순)
    const sortedTodos = todos.sort((a, b) => {
        // 완료 상태가 다르면 완료되지 않은 것을 먼저
        if (a.complete !== b.complete) {
            return a.complete - b.complete;
        }
        // 완료 상태가 같으면 최신순 (ID가 클수록 최신)
        return b.id - a.id;
    });
    
    // 정렬된 순서대로 DOM에 추가
    sortedTodos.forEach(item => {
        const {itemEl} = createTodoElement(item);
        list.append(itemEl);
    });
}

// textarea 높이 자동 조정 함수
function adjustTextareaHeight(textarea) {
    textarea.style.height = 'auto';
    const scrollHeight = textarea.scrollHeight;
    const minHeight = 24; // 최소 높이
    textarea.style.height = Math.max(scrollHeight, minHeight) + 'px';
}

function saveToLocalStorage() {
    const data = JSON.stringify(todos);
    window.localStorage.setItem("my-todos", data);
}

function loadFromLocalStorage() {
    const data = localStorage.getItem('my-todos');

    if (data) {
        todos = JSON.parse(data)
    }
}

function displayTodos() {
    loadFromLocalStorage();
    renderSortedTodos(); // 정렬된 상태로 표시
}

displayTodos();