import { component$, useSignal, useTask$, $ } from '@builder.io/qwik'
import './app.css'

type Grid = number[][]

const GRID_SIZE = 4

const createEmptyGrid = (): Grid => {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0))
}

const addRandomNumber = (grid: Grid): Grid => {
  const emptyCells: [number, number][] = []
  
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === 0) {
        emptyCells.push([row, col])
      }
    }
  }
  
  if (emptyCells.length === 0) return grid
  
  const randomIndex = Math.floor(Math.random() * emptyCells.length)
  const [row, col] = emptyCells[randomIndex]
  const newGrid = grid.map(row => [...row])
  newGrid[row][col] = Math.random() < 0.9 ? 2 : 4
  
  return newGrid
}

const initializeGame = (): Grid => {
  let grid = createEmptyGrid()
  grid = addRandomNumber(grid)
  grid = addRandomNumber(grid)
  return grid
}

const moveLeft = (grid: Grid): { grid: Grid, moved: boolean, score: number } => {
  const newGrid = grid.map(row => [...row])
  let moved = false
  let score = 0
  
  for (let row = 0; row < GRID_SIZE; row++) {
    const filteredRow = newGrid[row].filter(val => val !== 0)
    
    for (let col = 0; col < filteredRow.length - 1; col++) {
      if (filteredRow[col] === filteredRow[col + 1]) {
        filteredRow[col] *= 2
        score += filteredRow[col]
        filteredRow[col + 1] = 0
      }
    }
    
    const compactedRow = filteredRow.filter(val => val !== 0)
    while (compactedRow.length < GRID_SIZE) {
      compactedRow.push(0)
    }
    
    for (let col = 0; col < GRID_SIZE; col++) {
      if (newGrid[row][col] !== compactedRow[col]) {
        moved = true
      }
      newGrid[row][col] = compactedRow[col]
    }
  }
  
  return { grid: newGrid, moved, score }
}

const moveRight = (grid: Grid): { grid: Grid, moved: boolean, score: number } => {
  const rotatedGrid = grid.map(row => [...row].reverse())
  const { grid: movedGrid, moved, score } = moveLeft(rotatedGrid)
  const finalGrid = movedGrid.map(row => [...row].reverse())
  return { grid: finalGrid, moved, score }
}

const moveUp = (grid: Grid): { grid: Grid, moved: boolean, score: number } => {
  const transposed = grid[0].map((_, colIndex) => grid.map(row => row[colIndex]))
  const { grid: movedGrid, moved, score } = moveLeft(transposed)
  const finalGrid = movedGrid[0].map((_, colIndex) => movedGrid.map(row => row[colIndex]))
  return { grid: finalGrid, moved, score }
}

const moveDown = (grid: Grid): { grid: Grid, moved: boolean, score: number } => {
  const transposed = grid[0].map((_, colIndex) => grid.map(row => row[colIndex]))
  const { grid: movedGrid, moved, score } = moveRight(transposed)
  const finalGrid = movedGrid[0].map((_, colIndex) => movedGrid.map(row => row[colIndex]))
  return { grid: finalGrid, moved, score }
}

const isGameOver = (grid: Grid): boolean => {
  const { moved: canMoveLeft } = moveLeft(grid)
  const { moved: canMoveRight } = moveRight(grid)
  const { moved: canMoveUp } = moveUp(grid)
  const { moved: canMoveDown } = moveDown(grid)
  
  return !canMoveLeft && !canMoveRight && !canMoveUp && !canMoveDown
}

const hasWon = (grid: Grid): boolean => {
  return grid.some(row => row.some(cell => cell === 2048))
}

export const App = component$(() => {
  const grid = useSignal<Grid>(initializeGame())
  const score = useSignal(0)
  const gameOver = useSignal(false)
  const won = useSignal(false)

  const handleMove = $((direction: 'left' | 'right' | 'up' | 'down') => {
    if (gameOver.value) return
    
    let result
    switch (direction) {
      case 'left':
        result = moveLeft(grid.value)
        break
      case 'right':
        result = moveRight(grid.value)
        break
      case 'up':
        result = moveUp(grid.value)
        break
      case 'down':
        result = moveDown(grid.value)
        break
    }
    
    if (result.moved) {
      const newGrid = addRandomNumber(result.grid)
      grid.value = newGrid
      score.value += result.score
      
      if (hasWon(newGrid) && !won.value) {
        won.value = true
      }
      
      if (isGameOver(newGrid)) {
        gameOver.value = true
      }
    }
  })

  const restartGame = $(() => {
    grid.value = initializeGame()
    score.value = 0
    gameOver.value = false
    won.value = false
  })

  useTask$(({ track }) => {
    track(() => grid.value)
    
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          handleMove('left')
          break
        case 'ArrowRight':
          event.preventDefault()
          handleMove('right')
          break
        case 'ArrowUp':
          event.preventDefault()
          handleMove('up')
          break
        case 'ArrowDown':
          event.preventDefault()
          handleMove('down')
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  })

  return (
    <div class="game-container">
      <div class="header">
        <h1>2048</h1>
        <div class="score-container">
          <div class="score-box">分数: {score.value}</div>
          <button class="restart-button" onClick$={restartGame}>
            重新开始
          </button>
        </div>
      </div>
      
      {won.value && (
        <div class="game-message win">
          <h2>恭喜！你赢了！</h2>
          <button onClick$={restartGame}>重新开始</button>
        </div>
      )}
      
      {gameOver.value && (
        <div class="game-message game-over">
          <h2>游戏结束！</h2>
          <button onClick$={restartGame}>重新开始</button>
        </div>
      )}
      
      <div class="grid-container">
        {grid.value.map((row, rowIndex) => (
          <div key={rowIndex} class="grid-row">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                class={`grid-cell ${cell ? `cell-${cell}` : 'cell-empty'}`}
              >
                {cell || ''}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div class="game-explanation">
        <p>使用方向键移动数字块。当两个相同的数字块碰撞时，它们会合并成一个！</p>
        <p>目标：创造出数字 2048！</p>
      </div>
    </div>
  )
})
