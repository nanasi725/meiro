'use client';

import { useState } from 'react';
import styles from './page.module.css';

const directions = [
  [-1, 0],
  [0, -1],
  [0, 1],
  [1, 0],
] as const;

type CellType = 'wall' | 'path' | 'start' | 'goal';
interface Cell {
  row: number;
  col: number;
  type: CellType;
}

const MAZE_HEIGHT = 21; //迷路の高さ
const MAZE_WIDTH = 21; //迷路の幅

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

  return (
    <div className={styles.container}>
      <div
        className={styles.bord}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${MAZE_WIDTH}, 1fr)`,
          gap: '1px',
        }}
      >
        {grid.map((row) =>
          row.map((cell) => (
            <div
              key={`${cell.row}-${cell.col}`}
              style={{
                backgroundColor: cell.type === 'wall' ? 'black' : 'white',
                width: '20px',
                height: '20px',
              }}
            />
          )),
        )}
      </div>
    </div>
  );
}
