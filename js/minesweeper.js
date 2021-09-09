// number of rows
const ROW = 10;
// number of columns
const COL = 10;
// set the hardness of the game in (0, 1)
const HARDNESS = 0.2;
let isGameEnded = false;
// game board
const board = document.getElementById('board');
const result = document.getElementById('result');
const bombNumber = document.getElementById('bomb-count');
const resetBtn = document.getElementById('reset-btn');

// set bombs into the game board
function setBombs() {
  // number of bombs
  const bombCount = Math.floor(ROW * COL * HARDNESS);
  // index of cells with class "bomb"
  const bombIndexes = mkRandom(bombCount, 0, ROW * COL - 1);
  // array of game cells
  const cells = document.getElementsByClassName('cell');
  bombIndexes.forEach((bomb) => {
    cells[bomb].classList.add('bomb');
  });
}
// make different random numbers in [min, max] for count times and set them into an array
function mkRandom(count, min, max) {
  if (count === 0) {
    return [];
  }
  const res = [];
  while (1) {
    const rndNum = Math.floor(Math.random() * (max - min + 1) + min);
    if (!res.includes(rndNum)) {
      res.push(rndNum);
    }
    if (res.length === count) {
      return res;
    }
  }
}
// create a ROW * COL game board
function createBoard() {
  board.innerHTML = '';
  for (let i = 1; i <= ROW; i++) {
    const row = document.createElement('div');
    row.className = 'row';
    for (let j = 1; j <= COL; j++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = i;
      cell.dataset.col = j;

      row.appendChild(cell);
    }
    board.appendChild(row);
  }
}
// return number of bombs around cell
function getBombCount(cell) {
  let bombCount = 0;
  getAroundCells(cell).forEach((item) => {
    if (item.classList.contains('bomb')) {
      bombCount++;
    }
  });
  return bombCount;
}
function controlGame(e) {
  const cell = e.target;
  if (!cell.classList.contains('cell')) {
    return;
  }
  if (isGameEnded) {
    return;
  }
  if (cell.classList.contains('flag')) {
    return;
  }
  // game end and you are a loser
  if (cell.classList.contains('bomb')) {
    isGameEnded = true;
    isLoser(cell);

    return;
  }
  showCell(cell);
  // game end and you are a winner
  if (isWinner()) {
    isGameEnded = true;
    result.textContent = 'you won this game';
    result.classList.add('winner');
    result.classList.remove('loser');
    setTimeout(() => {
      // result.textContent = '';
      result.classList.remove('winner');
    }, 4000);
  }
}
function isWinner() {
  let cells = document.getElementsByClassName('cell');
  cells = Array.prototype.slice.call(cells);
  const bombCount = ROW * COL * HARDNESS;
  const checkedCellsCount = cells.filter((cell) =>
    cell.classList.contains('active')
  ).length;
  return checkedCellsCount === ROW * COL - bombCount;
}
function isLoser(cell) {
  showAllBombs(cell);
  showWrongFlags();
  result.textContent = 'you lost this game';
  result.classList.add('loser');
  result.classList.remove('winner');
  setTimeout(() => {
    // result.textContent = '';
    result.classList.remove('loser');
  }, 5000);
}
function showAllBombs(clickedBomb) {
  clickedBomb.style = '--i: 0';
  let cells = document.getElementsByClassName('cell');
  cells = Array.prototype.slice.call(cells);
  const bombs = cells
    .filter(
      (cell) =>
        cell.classList.contains('bomb') && !cell.classList.contains('flag')
    )
    .forEach((bomb, index) => {
      bomb.classList.add('active');
      // bomb.style.transitionDelay = `${index * 0.1}s`;
      if (bomb !== clickedBomb) {
        bomb.style = `--i: ${index * 0.1}`;
      }
    });
}
function showWrongFlags() {
  let cells = document.getElementsByClassName('cell');
  cells = Array.prototype.slice.call(cells);
  const wrongFlags = cells
    .filter(
      (cell) =>
        cell.classList.contains('flag') && !cell.classList.contains('bomb')
    )
    .forEach((flag) => blinkCell(flag));
}
function blinkCell(flag) {
  const line1 = document.createElement('div');
  line1.className = 'line line--1';
  const line2 = document.createElement('div');
  line2.className = 'line line--2';
  flag.appendChild(line1);
  flag.appendChild(line2);
}
function showCell(cell) {
  if (cell.classList.contains('flag')) {
    return;
  }
  cell.classList.add('active');
  setTextColor(cell);
  if (getBombCount(cell) === 0) {
    const aroundCells = getAroundCells(cell);
    aroundCells.forEach((cell) => {
      if (!cell.classList.contains('active')) {
        showCell(cell);
      }
    });
  } else {
    cell.textContent = getBombCount(cell);
  }
}
function putFlag(e) {
  e.preventDefault();
  const cell = e.target;
  if (!cell.classList.contains('cell')) {
    return;
  }
  if (isGameEnded) {
    return;
  }

  if (!cell.classList.contains('active')) {
    cell.classList.toggle('flag');
    if (cell.classList.contains('flag')) {
      bombNumber.textContent = `${+bombNumber.textContent - 1}`;
    } else {
      bombNumber.textContent = `${+bombNumber.textContent + 1}`;
    }
  }
}
function setTextColor(cell) {
  if (getBombCount(cell) === 1) {
    cell.style.color = '#3e50bf';
  }
  if (getBombCount(cell) === 2) {
    cell.style.color = '#27ae60';
  }
  if (getBombCount(cell) === 3) {
    cell.style.color = '#c0392b';
  }
  if (getBombCount(cell) === 4) {
    cell.style.color = '#8e44ad';
  }
  if (getBombCount(cell) === 5) {
    cell.style.color = '#d35400';
  }
  if (getBombCount(cell) === 6) {
    cell.style.color = '#2c3e50';
  }
}
function getAroundCells(cell) {
  const { row: rowNumber, col: colNumber } = cell.dataset;

  let cells = document.getElementsByClassName('cell');
  cells = Array.prototype.slice.call(cells);
  return cells
    .filter((gameCell) => {
      const { row, col } = gameCell.dataset;
      if (
        row >= +rowNumber - 1 &&
        row <= +rowNumber + 1 &&
        col >= +colNumber - 1 &&
        col <= +colNumber + 1
      ) {
        return true;
      }
    })
    .filter((neighbor) => neighbor !== cell);
}
function clearAroundCells(e) {
  const cell = e.target;
  if (!cell.classList.contains('cell')) {
    return;
  }
  if (isGameEnded) {
    return;
  }
  if (!cell.classList.contains('active')) {
    return;
  }

  const bombCount = getBombCount(cell);
  const aroundCells = getAroundCells(cell);
  let flagCount = 0;
  aroundCells.forEach((cell) => {
    if (cell.classList.contains('flag')) {
      flagCount++;
    }
  });
  if (flagCount === bombCount) {
    const emptyAroundCells = aroundCells.filter(
      (cell) =>
        !cell.classList.contains('flag') && !cell.classList.contains('active')
    );
    for (const cell of emptyAroundCells) {
      if (cell.classList.contains('bomb')) {
        isGameEnded = true;
        isLoser(cell);

        return;
      }
    }
    for (const cell of emptyAroundCells) {
      showCell(cell);
      if (isWinner()) {
        isGameEnded = true;

        result.textContent = 'you won this game';
        result.classList.add('winner');
        result.classList.remove('loser');
        setTimeout(() => {
          // result.textContent = '';
          result.classList.remove('winner');
        }, 4000);
      }
    }
  } else {
    blinkCell(cell);
    const blinkedCell = Array.prototype.slice.call(cell.children);
    setTimeout(() => {
      for (const line of blinkedCell) {
        // line.style.display = 'none';
        line.parentElement.removeChild(line);
      }
    }, 800);
  }
}
function reset() {
  createBoard();
  setBombs();
  isGameEnded = false;
  // result.textContent = '';
  result.classList.remove('winner');
  result.classList.remove('loser');
  bombNumber.textContent = `${Math.floor(ROW * COL * HARDNESS)}`;
}
reset();
board.addEventListener('click', controlGame);
board.addEventListener('contextmenu', putFlag);
board.addEventListener('dblclick', clearAroundCells);
resetBtn.addEventListener('click', reset);
