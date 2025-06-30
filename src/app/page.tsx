'use client';

import { useState } from 'react';
import styles from './page.module.css';

type CellType = 'wall' | 'path' | 'start' | 'goal';
interface Cell {
  row: number;
  col: number;
  type: CellType;
}

const MAZE_HEIGHT = 7; //迷路の高さ
const MAZE_WIDTH = 7; //迷路の幅

const createInitialGrid = (): Cell[][] => {
  const grid: Cell[][] = [];
  for (let row = 0; row < MAZE_HEIGHT; row++) {
    const currentRow: Cell[] = [];
    for (let col = 0; col < MAZE_WIDTH; col++) {
      const newCell: Cell = {
        row,
        col,
        type: 'wall',
      };
      currentRow.push(newCell);
    }
    grid.push(currentRow);
  }
  return grid;
};

export default function Home() {
  const [grid, setGrid] = useState(() => createInitialGrid());
  const [pillarList, setPillarList] = useState<Cell[]>([]);
  const handleGenerateMaze = () => {
  // 1. 初期化処理
  const newGrid = JSON.parse(JSON.stringify(grid));
  const startRow = 1;
  const startCol = 1;
  newGrid[startRow][startCol].type = 'path';
  const initialPillars: Cell[] = [];
  directions.forEach(([dr, dc]) => {
    const r = startRow + dr;
    const c = startCol + dc;
    if (r > 0 && r < MAZE_HEIGHT - 1 && c > 0 && c < MAZE_WIDTH - 1) {
      initialPillars.push(newGrid[r][c]);
    }
  });
  
  // 最初のスタート地点だけを先に描画する
  setGrid(newGrid);
  
  // --- ここからがループ処理の1ステップ目 ---
  if (initialPillars.length > 0) {
    // 候補リストからランダムに1つ選ぶ
    const randomIndex = Math.floor(Math.random() * initialPillars.length);
    const randomPillar = initialPillars[randomIndex];

    // 選んだ柱を「道」に変える
    // (まだ両隣のチェックはしていない仮の処理)
    newGrid[randomPillar.row][randomPillar.col].type = 'path';

    // 候補リストから、今使った柱を取り除く
    const nextPillars = initialPillars.filter(
      (p) => !(p.row === randomPillar.row && p.col === randomPillar.col)
    );

    // ★変更を画面に反映させる
    setGrid(newGrid);
    setPillarList(nextPillars); // pillarListも更新
  }
};

  const directions = [
    [-1, 0],
    [0, -1],
    [0, 1],
    [1, 0],
  ] as const;

  return (
    <div className={styles.container}>
      <button onClick={handleGenerateMaze}>迷路を生成</button>
      <div
        className={styles.bord}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${MAZE_WIDTH}, 1fr)`,
          gridTemplateRows: `repeat(${MAZE_HEIGHT}, 1fr)`,
          gap: '25px',
        }}
      >
        {grid.map((row) =>
          row.map((cell) => (
            <div
              key={`${cell.row}-${cell.col}`}
              style={{
                backgroundColor: cell.type === 'wall' ? 'black' : 'white',
                width: '30px',
                height: '30px',
              }}
            />
          )),
        )}
      </div>
    </div>
  );
}
