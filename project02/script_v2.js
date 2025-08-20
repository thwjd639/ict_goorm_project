// DOM 요소 선택
const todoListElement = document.getElementById('list');
const createTodoButton = document.getElementById('create-btn');

// 할일 목록 저장 배열
let todoItems = [];

// 이벤트 리스너 등록
createTodoButton.addEventListener('click', handleCreateNewTodo);

// 새로운 할일 생성 처리
function handleCreateNewTodo() {
    const newTodoItem = createTodoItem();
    addTodoToList(newTodoItem);
    renderAllTodos();
    focusNewTodoInput(newTodoItem.id);
    saveTodosToStorage();
}

// 할일 아이템 객체 생성
function createTodoItem() {
    return {
        id: new Date().getTime(),
        text: '',
        complete: false
    };
}

// 할일을 배열에 추가
function addTodoToList(todoItem) {
    todoItems.unshift(todoItem);
}

// 새로 생성된 할일 입력창에 포커스
function focusNewTodoInput(todoId) {
    const newTodoElement = findTodoElementById(todoId);
    const textareaElement = newTodoElement.querySelector('textarea');
    enableTextareaEditing(textareaElement);
    textareaElement.focus();
}

// ID로 할일 요소 찾기
function findTodoElementById(todoId) {
    return todoListElement.querySelector(`[data-id="${todoId}"]`);
}

// 할일 DOM 요소 생성 (메인 함수)
function createTodoElement(todoItem) {
    const todoContainer = createTodoContainer(todoItem.id);
    const checkboxElement = createTodoCheckbox(todoItem);
    const textareaElement = createTodoTextarea(todoItem);
    const actionsElement = createTodoActions(todoItem);

    // 완료된 할일에 스타일 추가
    if (todoItem.complete) {
        todoContainer.classList.add('complete');
    }

    // 요소들을 컨테이너에 추가
    todoContainer.append(checkboxElement, textareaElement, actionsElement);

    // textarea 높이 초기 설정
    setTimeout(() => adjustTextareaHeight(textareaElement), 0);

    return todoContainer;
}

// 할일 컨테이너 요소 생성
function createTodoContainer(todoId) {
    const containerElement = document.createElement('div');
    containerElement.classList.add('item');
    containerElement.setAttribute('data-id', todoId);
    return containerElement;
}

// 체크박스 요소 생성 및 이벤트 연결
function createTodoCheckbox(todoItem) {
    const checkboxElement = document.createElement('input');
    checkboxElement.type = 'checkbox';
    checkboxElement.checked = todoItem.complete;

    checkboxElement.addEventListener('change', (event) => {
        handleTodoCompletionToggle(todoItem, checkboxElement, event);
    });

    return checkboxElement;
}

// 할일 완료 상태 토글 처리
function handleTodoCompletionToggle(todoItem, checkboxElement, event) {
    const wasCompleted = todoItem.complete;
    todoItem.complete = checkboxElement.checked;

    // 체크박스가 체크되었을 때만 축하 효과 실행
    if (!wasCompleted && todoItem.complete) {
        createCelebrationEffect(event.target);
    }
    
    renderAllTodos();
    saveTodosToStorage();
}

// 박수 축하 효과 생성
function createCelebrationEffect(checkboxElement) {
    const rect = checkboxElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // 박수 이모지 흩뿌리기
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            createClapEmoji(centerX, centerY);
        }, i * 100);
    }

    // 중앙에 추가 축하 효과
    createCelebrationBurst(centerX, centerY);
    
    // 랜덤한 위치에 추가 박수들
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const randomX = centerX + (Math.random() - 0.5) * 200;
            const randomY = centerY + (Math.random() - 0.5) * 100;
            createClapEmoji(randomX, randomY);
        }, i * 200);
    }
}

// 박수 이모지 생성
function createClapEmoji(x, y) {
    const clap = document.createElement('div');
    clap.className = 'clap-emoji';
    clap.textContent = '👏';
    
    // 랜덤한 시작 위치 조정
    const offsetX = (Math.random() - 0.5) * 50;
    const offsetY = (Math.random() - 0.5) * 30;
    
    clap.style.left = (x + offsetX) + 'px';
    clap.style.top = (y + offsetY) + 'px';
    
    document.body.appendChild(clap);
    
    // 애니메이션 후 제거
    setTimeout(() => {
        if (clap.parentNode) {
            clap.parentNode.removeChild(clap);
        }
    }, 2000);
}

// 중앙 축하 버스트 효과
function createCelebrationBurst(x, y) {
    const emojis = ['🎉', '✨', '🌟', '💫', '🎊'];
    
    emojis.forEach((emoji, index) => {
        setTimeout(() => {
            const burst = document.createElement('div');
            burst.className = 'celebration-burst';
            burst.textContent = emoji;
            
            const angle = (index * 72) * Math.PI / 180; // 5개 이모지를 72도씩 배치
            const distance = 30;
            const burstX = x + Math.cos(angle) * distance;
            const burstY = y + Math.sin(angle) * distance;
            
            burst.style.left = burstX + 'px';
            burst.style.top = burstY + 'px';
            
            document.body.appendChild(burst);
            
            setTimeout(() => {
                if (burst.parentNode) {
                    burst.parentNode.removeChild(burst);
                }
            }, 1500);
        }, index * 50);
    });
}

// 텍스트 영역 요소 생성 및 이벤트 연결
function createTodoTextarea(todoItem) {
    const textareaElement = document.createElement('textarea');
    textareaElement.value = todoItem.text;
    textareaElement.setAttribute('disabled', '');
    textareaElement.setAttribute('rows', '1');

    attachTextareaEventHandlers(textareaElement, todoItem);
    return textareaElement;
}

// 텍스트 영역에 이벤트 핸들러 연결
function attachTextareaEventHandlers(textareaElement, todoItem) {
    // 텍스트 입력 시 높이 조정 및 내용 저장
    textareaElement.addEventListener('input', () => {
        adjustTextareaHeight(textareaElement);
        todoItem.text = textareaElement.value;
    });

    // 포커스 해제 시 편집 모드 종료 및 저장
    textareaElement.addEventListener('blur', () => {
        disableTextareaEditing(textareaElement);
        saveTodosToStorage();
    });

    // 키보드 입력 처리 (Enter로 저장, Shift+Enter로 줄바꿈)
    textareaElement.addEventListener('keydown', (event) => {
        handleTextareaKeyPress(event, textareaElement);
    });
}

// 텍스트 영역 키보드 입력 처리
function handleTextareaKeyPress(event, textareaElement) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        textareaElement.blur();
    }
}

// 액션 버튼들 생성
function createTodoActions(todoItem) {
    const actionsContainer = document.createElement('div');
    actionsContainer.classList.add('actions');

    const editButton = createEditButton(todoItem);
    const removeButton = createRemoveButton(todoItem);

    actionsContainer.append(editButton, removeButton);
    return actionsContainer;
}

// 편집 버튼 생성 및 이벤트 연결
function createEditButton(todoItem) {
    const editButtonElement = document.createElement('button');
    editButtonElement.classList.add('material-icons');
    editButtonElement.innerText = 'edit';

    editButtonElement.addEventListener('click', () => {
        handleEditTodo(todoItem.id);
    });

    return editButtonElement;
}

// 할일 편집 모드 활성화
function handleEditTodo(todoId) {
    const todoElement = findTodoElementById(todoId);
    const textareaElement = todoElement.querySelector('textarea');
    enableTextareaEditing(textareaElement);
    textareaElement.focus();
}

// 삭제 버튼 생성 및 이벤트 연결
function createRemoveButton(todoItem) {
    const removeButtonElement = document.createElement('button');
    removeButtonElement.classList.add('material-icons', 'remove-btn');
    removeButtonElement.innerText = 'remove_circle';

    removeButtonElement.addEventListener('click', () => {
        handleRemoveTodo(todoItem.id);
    });

    return removeButtonElement;
}

// 할일 삭제 처리
function handleRemoveTodo(todoId) {
    todoItems = todoItems.filter(todo => todo.id !== todoId);
    renderAllTodos();
    saveTodosToStorage();
}

// 텍스트 영역 편집 모드 활성화
function enableTextareaEditing(textareaElement) {
    textareaElement.removeAttribute('disabled');
}

// 텍스트 영역 편집 모드 비활성화
function disableTextareaEditing(textareaElement) {
    textareaElement.setAttribute('disabled', '');
}

// 정렬된 할일 목록 렌더링
function renderAllTodos() {
    clearTodoList();
    const sortedTodos = getSortedTodos();
    
    sortedTodos.forEach(todoItem => {
        const todoElement = createTodoElement(todoItem);
        todoListElement.append(todoElement);
    });
}

// 할일 목록 초기화
function clearTodoList() {
    todoListElement.innerHTML = '';
}

// 할일을 정렬된 순서로 반환
function getSortedTodos() {
    return todoItems.sort((firstTodo, secondTodo) => {
        // 완료되지 않은 할일을 먼저 표시
        if (firstTodo.complete !== secondTodo.complete) {
            return firstTodo.complete - secondTodo.complete;
        }
        // 같은 완료 상태 내에서는 최신순으로 정렬
        return secondTodo.id - firstTodo.id;
    });
}

// 텍스트 영역 높이 자동 조정
function adjustTextareaHeight(textareaElement) {
    textareaElement.style.height = 'auto';
    const contentHeight = textareaElement.scrollHeight;
    const minimumHeight = 24;
    textareaElement.style.height = Math.max(contentHeight, minimumHeight) + 'px';
}

// 로컬 스토리지에 할일 저장
function saveTodosToStorage() {
    const todoData = JSON.stringify(todoItems);
    window.localStorage.setItem('my-todos', todoData);
}

// 로컬 스토리지에서 할일 불러오기
function loadTodosFromStorage() {
    const savedTodoData = localStorage.getItem('my-todos');
    if (savedTodoData) {
        todoItems = JSON.parse(savedTodoData);
    }
}

// 애플리케이션 초기화 및 할일 목록 표시
function initializeTodoApp() {
    loadTodosFromStorage();
    renderAllTodos();
}

// 페이지 로드 시 애플리케이션 시작
initializeTodoApp();