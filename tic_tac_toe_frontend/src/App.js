import React, { useState } from 'react';
import './App.css';

/* 
  COLORS:
  Accent:   #e91e63
  Primary:  #3f51b5
  Secondary:#f5f5f5
*/

// PUBLIC_INTERFACE
function App() {
  // State: board (array of 9), current player, status, and win info
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameStatus, setGameStatus] = useState('ongoing'); // 'ongoing', 'draw', 'win'
  const [winner, setWinner] = useState(null); // 'X' or 'O'
  const [winLine, setWinLine] = useState([]);

  // PUBLIC_INTERFACE
  /** Returns 'X', 'O', or null if no winner; also returns winning indices */
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diags
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return { winner: squares[a], line };
      }
    }
    return null;
  }

  /** Handle user click on a square */
  const handleClick = (index) => {
    if (board[index] || gameStatus !== 'ongoing') return; // ignore filled or finished
    const newBoard = board.slice();
    newBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    // Check for winner
    const result = calculateWinner(newBoard);

    if (result) {
      setGameStatus('win');
      setWinner(result.winner);
      setWinLine(result.line);
    } else if (newBoard.every(cell => cell)) {
      setGameStatus('draw');
      setWinner(null);
    } else {
      setXIsNext(!xIsNext);
    }
  };

  /** Reset game to initial state */
  // PUBLIC_INTERFACE
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setGameStatus('ongoing');
    setWinner(null);
    setWinLine([]);
  };

  // UI computed values
  const player = xIsNext ? 'X' : 'O';
  let statusMessage = '';
  if (gameStatus === 'win') {
    statusMessage = `Winner: ${winner}`;
  } else if (gameStatus === 'draw') {
    statusMessage = `It's a Draw!`;
  } else {
    statusMessage = `Turn: ${player}`;
  }

  return (
    <div className="ttt-app-bg">
      <div className="ttt-container">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-status">{statusMessage}</div>
        <Board 
          squares={board} 
          onClick={handleClick} 
          winLine={winLine}
          isGameOver={gameStatus !== 'ongoing'}
        />
        <button className="ttt-reset-btn" onClick={resetGame}>
          Reset
        </button>
        <div className="ttt-footer">
          <span>Minimal UI &mdash; React &middot; <span style={{color: "#e91e63", fontWeight:"bold"}}>♥</span></span>
        </div>
      </div>
    </div>
  );
}

/** The Tic Tac Toe board grid */
// PUBLIC_INTERFACE
function Board({ squares, onClick, winLine, isGameOver }) {
  // Helper to render a square
  function renderSquare(i) {
    const isWinning = winLine && winLine.includes(i);
    return (
      <button
        className={`ttt-square${isWinning ? ' ttt-square-win': ''}${squares[i] ? ' ttt-square-filled' : ''}`}
        onClick={() => onClick(i)}
        disabled={Boolean(squares[i]) || isGameOver}
        aria-label={`Cell ${i + 1}${squares[i] ? ', filled by ' + squares[i] : ', empty'}`}
        key={i}
      >
        {squares[i]}
      </button>
    );
  }

  // Render 3x3 grid
  const rows = [0,1,2].map(r => (
    <div className="ttt-board-row" key={r}>
      { [0,1,2].map(c => renderSquare(3*r + c)) }
    </div>
  ));
  return <div className="ttt-board">{rows}</div>;
}


export default App;
