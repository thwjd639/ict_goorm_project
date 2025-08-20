// 1. 상수 및 변수 선언
const ROWS = 10;
const COLS = 10;
const alphabets = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
]
const spreadsheet = []

let currentCell = null; 
let isEditing = false;
let editingCell = null;
let preventNextFocus = false; 
let isMouseDown = false;
let startCell = null;
let selectedCells = new Set();
let isRowColumnSelection = false;

// DOM 요소들
const spreadSheetContainer = document.querySelector("#spreadsheet-container");
const exportBtn = document.querySelector("#export-btn");
const importBtn = document.querySelector("#import-btn");
const saveBtn = document.querySelector("#save-btn");
const loadBtn = document.querySelector("#load-btn");
const listBtn = document.querySelector("#list-btn");
const deleteBtn = document.querySelector("#delete-btn");
const homeBtn = document.querySelector("#home-btn");
const fileInput = document.querySelector("#file-input");
const filenameInput = document.querySelector("#filename-input");
const cellStatus = document.querySelector("#cell-status");

// 3. 문자열이 아닌 객체 데이터 생성하기
class Cell {
    constructor(isHeader, disabled, data, row, column, rowName, columnName, active = false) {
        this.isHeader = isHeader;
        this.disabled = disabled;
        this.data = data;
        this.row = row;
        this.column = column;

        // 10. rowName, columnName 생성
        this.rowName = rowName;
        this.columnName = columnName;

        this.active = active;
    }
}

// // 홈 버튼 기능 - 스프레드시트 초기화
homeBtn.onclick = function() {
    // 사용자에게 확인 받기
    if (confirm('모든 데이터를 초기화하시겠습니까?')) {
        // 헤더가 아닌 모든 셀의 데이터를 빈 값으로 초기화
        for (let i = 1; i < spreadsheet.length; i++) {
            for (let j = 1; j < spreadsheet[i].length; j++) {
                spreadsheet[i][j].data = '';
            }
        }
        
        // 화면 새로고침 및 A1 셀로 포커스 이동
        refreshSpreadsheet();
        
        alert('스프레드시트가 초기화되었습니다.');
    }
};

// 키보드 네비게이션 
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (!currentCell || currentCell.isHeader) return;

        // 편집 중일 때 처리
        if (isEditing) {
            if (e.key === 'Enter' || e.key === 'Escape') {
                finishEditing();
                if (e.key === 'Enter') {
                    // Enter 시 아래 셀로 이동
                    let newRow = Math.min(ROWS - 1, currentCell.row + 1);
                    const newCell = spreadsheet[newRow][currentCell.column];
                    if (newCell && !newCell.isHeader) {
                        selectSingleCell(newCell);
                        const cellEl = getElFromRowCol(newRow, currentCell.column);
                        cellEl.focus();
                    }
                }
                e.preventDefault();
            }
            return;
        }

        // Delete 키 처리
        if (e.key === 'Delete') {
            if (selectedCells.size > 0) {
                selectedCells.forEach(cellKey => {
                    const [row, col] = cellKey.split('-').map(Number);
                    if (spreadsheet[row] && spreadsheet[row][col] && !spreadsheet[row][col].isHeader) {
                        spreadsheet[row][col].data = '';
                        const cellEl = getElFromRowCol(row, col);
                        if (cellEl) {
                            cellEl.value = '';
                        }
                    }
                });
            }
            return;
        }

        // 방향키 처리
        let newRow = currentCell.row;
        let newCol = currentCell.column;

        switch(e.key) {
            case 'ArrowUp': newRow = Math.max(1, currentCell.row - 1); break;
            case 'ArrowDown': newRow = Math.min(ROWS - 1, currentCell.row + 1); break;
            case 'ArrowLeft': newCol = Math.max(1, currentCell.column - 1); break;
            case 'ArrowRight':
            case 'Tab': newCol = Math.min(COLS - 1, currentCell.column + 1); break;
            case 'Enter': newRow = Math.min(ROWS - 1, currentCell.row + 1); break;
            case 'Escape': 
                if (document.activeElement) {
                    document.activeElement.blur();
                }
                return;
            default: return;
        }

        e.preventDefault();

        // 새로운 셀로 이동
        if (newRow !== currentCell.row || newCol !== currentCell.column) {
            const newCell = spreadsheet[newRow][newCol];
            if (newCell && !newCell.isHeader) {
                selectSingleCell(newCell);
                const cellEl = getElFromRowCol(newRow, newCol);
                if (cellEl) {
                    cellEl.focus();
                }
            }
        }
    });
}

// 16. 엑셀시트 export 기능 생성하기
exportBtn.onclick = function (e) {
    // 18. 엑셀 데이터 생성하기
    let csv = "";
    for (let i = 0; i < spreadsheet.length; i++) {
        if (i === 0) continue;
        csv +=
            spreadsheet[i]
                .filter(item => !item.isHeader) // header부분을 전부 필터링으로 빼줌
                .map(item => `"${item.data}"`)
                .join(',') + "\r\n";
    }

    // 19. 엑셀 파일 다운로드
    const filename = filenameInput.value || 'spreadsheet';
    const csvObj = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    // console.log('csvObj', csvObj);

    const csvUrl = URL.createObjectURL(csvObj);
    // console.log('csvUrl', csvUrl);

    const a = document.createElement("a");
    a.href = csvUrl;
    a.download = filename + '.csv'; // 'spreadsheet name.csv'
    a.click();
    URL.revokeObjectURL(csvUrl);
}

// Import 기능
importBtn.onclick = function() {
    fileInput.click();
};

fileInput.onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const csv = e.target.result;
        const lines = csv.split('\n');
        
        // 기존 데이터 클리어 (헤더 제외)
        for (let i = 1; i < spreadsheet.length; i++) {
            for (let j = 1; j < spreadsheet[i].length; j++) {
                spreadsheet[i][j].data = '';
            }
        }

        // CSV 데이터 로드
        lines.forEach((line, rowIndex) => {
            if (line.trim() && rowIndex + 1 < spreadsheet.length) {
                const cells = line.split(',');
                cells.forEach((cellData, colIndex) => {
                    if (colIndex + 1 < spreadsheet[rowIndex + 1].length) {
                        // 따옴표 제거
                        const cleanData = cellData.replace(/^"|"$/g, '');
                        spreadsheet[rowIndex + 1][colIndex + 1].data = cleanData;
                    }
                });
            }
        });

        // 화면 새로 고침
        refreshSpreadsheet();
    };
    reader.readAsText(file);
};

// Save 기능 (localStorage 사용)
saveBtn.onclick = function() {
    const filename = filenameInput.value || 'spreadsheet';
    const data = {
        spreadsheet: spreadsheet,
        timestamp: new Date().toISOString()
    };

    // localStorage 사용
    try {
        localStorage.setItem('spreadsheet_' + filename, JSON.stringify(data));
        alert(`데이터가 "${filename}"으로 저장되었습니다.`);
    } catch (error) {
        alert('저장 중 오류가 발생했습니다: ' + error.message);
    }
};

// Load 기능
loadBtn.onclick = function() {
    const filename = filenameInput.value || 'spreadsheet';
    
    // localStorage 사용
    try {
        const savedData = localStorage.getItem('spreadsheet_' + filename);
        
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            
            // 데이터 복원
            for (let i = 0; i < spreadsheet.length; i++) {
                for (let j = 0; j < spreadsheet[i].length; j++) {
                    if (parsedData.spreadsheet[i] && parsedData.spreadsheet[i][j]) {
                        spreadsheet[i][j].data = parsedData.spreadsheet[i][j].data;
                    }
                }
            }
            
            refreshSpreadsheet();
            alert(`"${filename}" 데이터를 불러왔습니다.`);
        } else {
            alert(`"${filename}" 파일을 찾을 수 없습니다.`);
        }
    } catch (error) {
        alert('불러오기 중 오류가 발생했습니다: ' + error.message);
    }
};

// 파일 목록 보기 기능
listBtn.onclick = function() {
    const savedFiles = getSavedFilesList();
    
    if (savedFiles.length === 0) {
        alert('저장된 파일이 없습니다.');
        return;
    }
    
    let fileListMessage = '저장된 파일 목록:\n\n';
    savedFiles.forEach((file, index) => {
        const date = new Date(file.timestamp).toLocaleString('ko-KR');
        fileListMessage += `${index + 1}. ${file.name} (저장일: ${date})\n`;
    });
    
    alert(fileListMessage);
};

// 저장된 파일 목록 보기 기능(localStorage)
function getSavedFilesList() {
    const savedFiles = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('spreadsheet_')) {
            const filename = key.replace('spreadsheet_', '');
            const data = JSON.parse(localStorage.getItem(key));
            savedFiles.push({
                name: filename,
                timestamp: data.timestamp
            });
        }
    }
    return savedFiles;
}

// 파일 삭제 기능
function deleteFile(filename) {
    const key = 'spreadsheet_' + filename;
    const savedData = localStorage.getItem(key);
    
    if (savedData) {
        if (confirm(`"${filename}" 파일을 정말 삭제하시겠습니까?`)) {
            localStorage.removeItem(key);
            return true;
        }
    } else {
        alert(`"${filename}" 파일을 찾을 수 없습니다.`);
        return false;
    }
    return false;
}

// 사용
deleteBtn.onclick = function() {
    const filename = filenameInput.value || 'spreadsheet';
    if (deleteFile(filename)) {
        alert(`"${filename}" 파일이 삭제되었습니다.`);
    }
};

// 2. spreadsheet 배열에 기본 데이터 생성하기
function initSpreadsheet() {
    // 기존 스프레드시트 초기화 코드...
    for (let i = 0; i < ROWS; i++) {
        let spreadsheetRow = [];
        for (let j = 0; j < COLS; j++) {
            let cellData = '';
            let isHeader = false;
            let disabled = false;

            if (j === 0) {
                cellData = i;
                isHeader = true;
                disabled = true;
            }

            if (i === 0) {
                cellData = alphabets[j - 1];
                isHeader = true;
                disabled = true;
            }

            if (!cellData) {
                cellData = "";
            }

            const rowName = i;
            const columnName = alphabets[j - 1];

            const cell = new Cell(isHeader, disabled, cellData, i, j, rowName, columnName, false);
            spreadsheetRow.push(cell);
        }
        spreadsheet.push(spreadsheetRow);
    }
    
    drawSheet();
    setupDragSelection();
    
    // 첫 번째 데이터 셀 선택
    if (spreadsheet[1] && spreadsheet[1][1]) {
        selectSingleCell(spreadsheet[1][1]);
    }
}

// 4. cell 생성하기
function createCellEl(cell) { // 여기서 cell은 객체
    const cellEl = document.createElement('input');
    cellEl.className = 'cell';
    cellEl.id = 'cell_' + cell.row + cell.column;
    cellEl.value = cell.data;
    cellEl.disabled = cell.disabled;

    // 8. header인 cell은 className에 'header'라고 추가해주기
    if (cell.isHeader) {
        cellEl.classList.add("header");
    }

    // 이벤트 리스터 추가
    // 11. cell click 했을 때 상호작용 => click 이벤트 발생
    cellEl.onclick = (e) => {
        // 편집 중인 셀에서 다른 셀로 클릭할 때 편집 완료 처리
        e.stopPropagation();
        handleCellClick(cell, e);
    };

    // 클릭 이벤트 - 단순화
    cellEl.onclick = (e) => {
        e.stopPropagation();
        handleCellClick(cell, e);
    };

    // 더블클릭 이벤트
    cellEl.ondblclick = (e) => {
        e.stopPropagation();
        handleCellDoubleClick(cell, e);
    };

    // 입력 이벤트
    cellEl.oninput = (e) => {
        if (!cell.isHeader) {
            isEditing = true;
            editingCell = cell;
            cell.data = e.target.value;
        }
    };

    // 변경 이벤트
    cellEl.onchange = (e) => {
        if (!cell.isHeader) {
            cell.data = e.target.value;
        }
    };

    // 포커스 이벤트
    cellEl.onfocus = (e) => {
        if (!cell.isHeader && !isEditing) {
            currentCell = cell;
            updateCellSelection(cell);
        }
    };

    // 블러 이벤트
    cellEl.onblur = (e) => {
        if (isEditing && editingCell === cell) {
            setTimeout(() => {
                finishEditing();
            }, 50);
        }
    };

    return cellEl;
}

// 편집 완료 함수 
function finishEditing() {
    if (isEditing && editingCell) {
        const editingCellEl = getElFromRowCol(editingCell.row, editingCell.column);
        if (editingCellEl) {
            editingCell.data = editingCellEl.value;
        }
        isEditing = false;
        editingCell = null;
    }
}

// 모든 하이라이트 제거 함수
function clearAllHighlights() {
    clearHeaderActiveStates();
    clearSelectedCells();
    selectedCells.clear();
    currentCell = null;
    isRowColumnSelection = false;
    document.querySelector("#cell-status").innerHTML = "";
}

// 더블클릭 이벤트 처리
function handleCellDoubleClick(cell, event) {
    event.preventDefault();
    
    if (cell.isHeader) {
        if (cell.row === 0 && cell.column !== 0) {
            selectColumn(cell.column);
        } else if (cell.column === 0 && cell.row !== 0) {
            selectRow(cell.row);
        }
    } else if (!cell.disabled) {
        // 일반 셀 더블클릭 시 편집 모드
        isEditing = true;
        editingCell = cell;
        const cellEl = getElFromRowCol(cell.row, cell.column);
        cellEl.focus();
        cellEl.select();
    }
}

// selectCell 함수 추가
function selectCell(cell) {
    // 편집 중이면 셀 선택하지 않음
    if (isEditing) return;

    currentCell = cell;
    handleCellClick(cell);
}

// 17. 타이핑 시 텍스트를 cell 객체의 data 속성 값으로 넣어주기 
function handleOnChange(data, cell) {
    cell.data = data; // 타이핑 값 넣어주기
}

// 11. cell click 했을 때 상호작용
function handleCellClick(cell, event) {
    // 편집 중이면 편집 완료
    if (isEditing && editingCell && editingCell !== cell) {
        finishEditing();
    }

    // 헤더 클릭 처리
    if (cell.isHeader) {
        if (cell.row === 0 && cell.column !== 0) {
            // 열 헤더 클릭
            selectColumn(cell.column);
        } else if (cell.column === 0 && cell.row !== 0) {
            // 행 헤더 클릭
            selectRow(cell.row);
        }
        return;
    }

    // 일반 셀 클릭 처리
    if (event && event.shiftKey && currentCell && !currentCell.isHeader) {
        // Shift + 클릭으로 범위 선택
        selectRange(currentCell, cell);
    } else {
        // 단일 셀 선택
        selectSingleCell(cell);
    }
}

// 새로운 셀 선택 함수 추가
function selectNewCell(cell, event) {
    // Shift + 클릭으로 범위 선택
    if (event && event.shiftKey && currentCell && !cell.isHeader && !currentCell.isHeader) {
        selectRange(currentCell, cell);
        return;
    }

    // 행 헤더 클릭 시 전체 행 선택
    if (cell.isHeader && cell.column === 0 && cell.row !== 0) {
        selectRow(cell.row);
        return;
    }

    // 열 헤더 클릭 시 전체 열 선택
    if (cell.isHeader && cell.row === 0 && cell.column !== 0) {
        selectColumn(cell.column);
        return;
    }
    
    // 일반 셀 클릭
    if (!cell.isHeader) {
        clearHeaderActiveStates();
        clearSelectedCells();
        selectSingleCell(cell);
    }
}

// 단일 셀 선택
function selectSingleCell(cell) {
    currentCell = cell;
    selectedCells.clear();
    selectedCells.add(`${cell.row}-${cell.column}`);
    isRowColumnSelection = false;
    
    updateCellSelection(cell);
}

// 셀 선택 UI 업데이트
function updateCellSelection(cell) {
    // 이전 선택 해제
    clearHeaderActiveStates();
    clearSelectedCells();
    
    // 현재 셀 선택 표시
    const cellEl = getElFromRowCol(cell.row, cell.column);
    if (cellEl) {
        cellEl.classList.add('selected');
    }
    
    // 헤더 하이라이트
    if (!cell.isHeader) {
        const columnHeader = spreadsheet[0][cell.column];
        const rowHeader = spreadsheet[cell.row][0];
        
        const columnHeaderEl = getElFromRowCol(0, cell.column);
        const rowHeaderEl = getElFromRowCol(cell.row, 0);
        
        if (columnHeaderEl) columnHeaderEl.classList.add('active');
        if (rowHeaderEl) rowHeaderEl.classList.add('active');
        
        // 상태 표시
        document.querySelector("#cell-status").innerHTML = cell.columnName + cell.rowName;
    }
}

// 전체 행 선택
function selectRow(rowIndex) {
    clearHeaderActiveStates();
    clearSelectedCells();
    selectedCells.clear();
    isRowColumnSelection = true;

    // 해당 행의 모든 데이터 셀 선택 (헤더 제외)
    for (let j = 1; j < COLS; j++) {
        selectedCells.add(`${rowIndex}-${j}`);
        const cellEl = getElFromRowCol(rowIndex, j);
        cellEl.classList.add('selected');
    }

    // 행 헤더 하이라이트
    const rowHeaderEl = getElFromRowCol(rowIndex, 0);
    rowHeaderEl.classList.add('active');

    // 상태 표시
    document.querySelector("#cell-status").innerHTML = `행 ${rowIndex} 전체 선택`;
    currentCell = spreadsheet[rowIndex][1]; // 첫 번째 데이터 셀로 설정
}

// 전체 행 선택
function selectRow(rowIndex) {
    clearHeaderActiveStates();
    clearSelectedCells();
    selectedCells.clear();
    isRowColumnSelection = true;
    currentCell = spreadsheet[rowIndex][1]; // 첫 번째 데이터 셀

    // 해당 행의 모든 데이터 셀 선택
    for (let j = 1; j < COLS; j++) {
        selectedCells.add(`${rowIndex}-${j}`);
        const cellEl = getElFromRowCol(rowIndex, j);
        if (cellEl) {
            cellEl.classList.add('selected');
        }
    }

    // 행 헤더 하이라이트
    const rowHeaderEl = getElFromRowCol(rowIndex, 0);
    if (rowHeaderEl) {
        rowHeaderEl.classList.add('active');
    }

    // 상태 표시
    document.querySelector("#cell-status").innerHTML = `행 ${rowIndex} 전체 선택`;
}

// 전체 열 선택
function selectColumn(colIndex) {
    clearHeaderActiveStates();
    clearSelectedCells();
    selectedCells.clear();
    isRowColumnSelection = true;
    currentCell = spreadsheet[1][colIndex]; // 첫 번째 데이터 셀

    // 해당 열의 모든 데이터 셀 선택
    for (let i = 1; i < ROWS; i++) {
        selectedCells.add(`${i}-${colIndex}`);
        const cellEl = getElFromRowCol(i, colIndex);
        if (cellEl) {
            cellEl.classList.add('selected');
        }
    }

    // 열 헤더 하이라이트
    const colHeaderEl = getElFromRowCol(0, colIndex);
    if (colHeaderEl) {
        colHeaderEl.classList.add('active');
    }

    // 상태 표시
    const columnName = alphabets[colIndex - 1];
    document.querySelector("#cell-status").innerHTML = `열 ${columnName} 전체 선택`;
}

// 범위 선택
function selectRange(startCell, endCell) {
    clearHeaderActiveStates();
    clearSelectedCells();
    selectedCells.clear();
    isRowColumnSelection = false;

    const startRow = Math.min(startCell.row, endCell.row);
    const endRow = Math.max(startCell.row, endCell.row);
    const startCol = Math.min(startCell.column, endCell.column);
    const endCol = Math.max(startCell.column, endCell.column);

    // 범위 내 모든 셀 선택
    for (let i = startRow; i <= endRow; i++) {
        for (let j = startCol; j <= endCol; j++) {
            if (i > 0 && j > 0) {
                selectedCells.add(`${i}-${j}`);
                const cellEl = getElFromRowCol(i, j);
                if (cellEl) {
                    cellEl.classList.add('selected');
                }
            }
        }
    }

    // 관련 헤더들 하이라이트
    for (let j = startCol; j <= endCol; j++) {
        if (j > 0) {
            const colHeaderEl = getElFromRowCol(0, j);
            if (colHeaderEl) {
                colHeaderEl.classList.add('active');
            }
        }
    }
    for (let i = startRow; i <= endRow; i++) {
        if (i > 0) {
            const rowHeaderEl = getElFromRowCol(i, 0);
            if (rowHeaderEl) {
                rowHeaderEl.classList.add('active');
            }
        }
    }

    // 상태 표시
    const startColName = alphabets[startCol - 1];
    const endColName = alphabets[endCol - 1];
    document.querySelector("#cell-status").innerHTML = 
        `${startColName}${startRow}:${endColName}${endRow} 선택`;
}

// 드래그 선택을 위한 마우스 이벤트 처리
function setupDragSelection() {
    let dragStartCell = null;
    let isDragging = false;

    document.addEventListener('mousedown', function(e) {
        if (isEditing) return;

        const cellEl = e.target.closest('.cell');
        if (!cellEl) return;

        const [row, col] = getCellPosition(cellEl);
        const cell = spreadsheet[row][col];
        
        if (!cell.isHeader) {
            isDragging = true;
            dragStartCell = cell;
            e.preventDefault();
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging || !dragStartCell || isEditing) return;

        const cellEl = e.target.closest('.cell');
        if (!cellEl) return;

        const [row, col] = getCellPosition(cellEl);
        const cell = spreadsheet[row][col];
        
        if (!cell.isHeader) {
            selectRange(dragStartCell, cell);
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        dragStartCell = null;
    });
}

// 셀 위치 가져오기 (ID에서 추출)
function getCellPosition(cellEl) {
    const id = cellEl.id; // cell_12 형식
    const coords = id.replace('cell_', '');
    
    // 더 안전한 파싱 방법
    if (coords.length === 2) {
        const row = parseInt(coords.charAt(0));
        const col = parseInt(coords.charAt(1));
        return [row, col];
    } else {
        // 더 긴 ID의 경우 (cell_10 등)
        const row = parseInt(coords.charAt(0));
        const col = parseInt(coords.substring(1));
        return [row, col];
    }
}

// 선택된 셀 초기화
function clearSelectedCells() {
    const selectedCellEls = document.querySelectorAll('.cell.selected');
    selectedCellEls.forEach((cell) => {
        cell.classList.remove('selected');
    });
}

// 15. 이전 하이라이트된 부분 지워주기
function clearHeaderActiveStates() {
    const headers = document.querySelectorAll('.header'); // header라는 것을 갖는 모든 요소를 리턴

    headers.forEach((header) => {
        header.classList.remove('active');
    });
}

// 13. column header, row header 요소 가져오기
function getElFromRowCol(row, col) {
    return document.querySelector("#cell_" + row + col);
}

// 5. cell 렌더링하기 : 데이터의 수만큼 input 요소를 생성
function drawSheet() {
    spreadSheetContainer.innerHTML = ''; // 기존 내용 클리어

    for (let i = 0; i < spreadsheet.length; i++) {
        // 6. 10개의 셀을 하나의 row div로 감싸기
        const rowContainerEl = document.createElement("div"); // <div>를 생성
        rowContainerEl.className = "cell-row"; // class = 'cell-row'로 지정

        for (let j = 0; j < spreadsheet[i].length; j++) {
            const cell = spreadsheet[i][j];
            rowContainerEl.append(createCellEl(cell)); // 10개의 element가 rowContainerEl에 append
        }
        spreadSheetContainer.append(rowContainerEl); // 10개의 div가 spreadSheetContainer에 append 됨
    }
}

// 스프레드시트 새로고침
function refreshSpreadsheet() {
    drawSheet();
    // 첫 번째 데이터 셀로 포커스 이동
    if (spreadsheet[1] && spreadsheet[1][1]) {
        handleCellClick(spreadsheet[1][1]);
        const firstDataCell = getElFromRowCol(1, 1);
        firstDataCell.focus();
    }
}

// CSS 스타일 추가
const style = document.createElement('style');
style.textContent = `
    .cell.selected {
        background-color: #e3f2fd !important;
        border: 2px solid #2196f3 !important;
    }
    
    .header.active {
        background-color: #bbdefb !important;
        font-weight: bold;
    }
    
    .cell {
        user-select: none; /* 드래그 시 텍스트 선택 방지 */
    }
`;
document.head.appendChild(style);

// 초기화 및 키보드 네비게이션 설정
initSpreadsheet();
setupKeyboardNavigation();

// 첫 번째 데이터 셀 선택
if (spreadsheet[1] && spreadsheet[1][1]) {
    handleCellClick(spreadsheet[1][1]);
}