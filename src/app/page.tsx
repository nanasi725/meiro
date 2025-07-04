'use client';
import styles from './page.module.css';

export default function Home() {
  const board = [
    ['S', 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 'G'],
  ];

  // 0が道、1が壁 Sがスタート Gがゴール

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((cell, colIndex) => {
              let cellStyle;
              if (cell === 'S') {
                cellStyle = styles.start; // "S"ならスタートのスタイル
              } else if (cell === 'G') {
                cellStyle = styles.goal; // "G"ならゴールのスタイル
              } else if (cell === 1) {
                cellStyle = styles.wall; // 1なら壁のスタイル
              } else {
                cellStyle = styles.path; // それ以外（0）は道のスタイル
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
