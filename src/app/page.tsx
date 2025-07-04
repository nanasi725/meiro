'use client';
import { useState } from 'react';
import styles from './page.module.css';

// 迷路のサイズ
const MAZE_WIDTH = 15;
const MAZE_HEIGHT = 15;

export default function Home() {
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 'S', 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 'G', 0],
  ]);

  const [player, setPlayer] = useState<{
    pos: { y: number; x: number } | null;
    dir: 'up' | 'right' | 'down' | 'left';
  }>({ pos: null, dir: 'down' });

  const [solverIntervalId, setSolverIntervalId] = useState<NodeJS.Timeout | null>(null);

  // タイマーが動いていたら停止する関数
  const stopSolver = () => {
    if (solverIntervalId) {
      clearInterval(solverIntervalId);
      setSolverIntervalId(null);
    }
  };

  const generateMaze = () => {
    stopSolver();
    setPlayer({ pos: null, dir: 'down' });

    // 1. まず、迷路の土台となる、すべてが壁(1)の盤面を用意します。
    const newBoard: (string | number)[][] = [];
    for (let y = 0; y < MAZE_HEIGHT; y++) {
      const row: (string | number)[] = [];
      for (let x = 0; x < MAZE_WIDTH; x++) {
        row.push(1);
      }
      newBoard.push(row);
    }

    // --- ここから迷路の「内側」だけを生成します ---

    // 2. 内側に道(0)の基準点を格子状に作る
    for (let y = 1; y < MAZE_HEIGHT - 1; y += 2) {
      for (let x = 1; x < MAZE_WIDTH - 1; x += 2) {
        newBoard[y][x] = 0;
      }
    }

    // 3. 道の基準点からランダムに壁を壊し、道を繋げる（棒倒し）
    for (let y = 1; y < MAZE_HEIGHT - 1; y += 2) {
      for (let x = 1; x < MAZE_WIDTH - 1; x += 2) {
        if (y === 1 && x === 1) continue;
        const directions = [];
        if (y > 1) directions.push('up');
        if (x > 1) directions.push('left');
        if (directions.length === 0) continue;
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
        if (randomDirection === 'up') {
          newBoard[y - 1][x] = 0;
        } else {
          newBoard[y][x - 1] = 0;
        }
      }
    }

    // 4. スタートとゴールを設置
    newBoard[1][1] = 'S';
    newBoard[MAZE_HEIGHT - 2][MAZE_WIDTH - 2] = 'G';

    // 5. 完成した新しい迷路で画面を更新
    setBoard(newBoard);
  };

  // 左手法のシミュレーションを開始する関数
  const solveMaze = () => {
    stopSolver();

    let startPos = null;
    for (let y = 0; y < board.length; y++) {
      if (board[y].includes('S')) {
        startPos = { y, x: board[y].indexOf('S') };
        break;
      }
    }
    if (!startPos) return;

    setPlayer({ pos: startPos, dir: 'down' });

    const intervalId = setInterval(() => {
      setPlayer((currentPlayer) => moveStep(currentPlayer));
    }, 100);
    setSolverIntervalId(intervalId);
  };

  // 左手法に基づいて、次の一歩を計算する関数
  const moveStep = (currentPlayer: typeof player) => {
    if (!currentPlayer.pos) return currentPlayer;

    if (board[currentPlayer.pos.y][currentPlayer.pos.x] === 'G') {
      stopSolver();
      return currentPlayer;
    }

    const directions = ['up', 'right', 'down', 'left'] as const;
    const vectors = {
      up: { y: -1, x: 0 },
      right: { y: 0, x: 1 },
      down: { y: 1, x: 0 },
      left: { y: 0, x: -1 },
    };

    const currentDirIndex = directions.indexOf(currentPlayer.dir);

    const leftDir = directions[(currentDirIndex + 3) % 4];
    let nextPos = {
      y: currentPlayer.pos.y + vectors[leftDir].y,
      x: currentPlayer.pos.x + vectors[leftDir].x,
    };
    if (board[nextPos.y]?.[nextPos.x] !== 1) {
      return { pos: nextPos, dir: leftDir };
    }

    nextPos = {
      y: currentPlayer.pos.y + vectors[currentPlayer.dir].y,
      x: currentPlayer.pos.x + vectors[currentPlayer.dir].x,
    };
    if (board[nextPos.y]?.[nextPos.x] !== 1) {
      return { pos: nextPos, dir: currentPlayer.dir };
    }

    const rightDir = directions[(currentDirIndex + 1) % 4];
    nextPos = {
      y: currentPlayer.pos.y + vectors[rightDir].y,
      x: currentPlayer.pos.x + vectors[rightDir].x,
    };
    if (board[nextPos.y]?.[nextPos.x] !== 1) {
      return { pos: nextPos, dir: rightDir };
    }

    const backDir = directions[(currentDirIndex + 2) % 4];
    return { pos: currentPlayer.pos, dir: backDir };
  };

  return (
    <div className={styles.container}>
      <div>
        <button onClick={generateMaze} className={styles.button}>
          新しい迷路を生成
        </button>
        <button onClick={solveMaze} className={styles.button}>
          解く (左手法)
        </button>
      </div>

      <div className={styles.board}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((cell, colIndex) => {
              const isPlayerPosition =
                player.pos && player.pos.y === rowIndex && player.pos.x === colIndex;

              let cellStyle;
              if (isPlayerPosition) {
                cellStyle = styles.player;
              } else if (cell === 'S') {
                cellStyle = styles.start;
              } else if (cell === 'G') {
                cellStyle = styles.goal;
              } else if (cell === 1) {
                cellStyle = styles.wall;
              } else {
                cellStyle = styles.path;
              }
              const cellContent = cell === 'S' || cell === 'G' ? cell : '';
              return (
                <div key={colIndex} className={cellStyle}>
                  {cellContent}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
