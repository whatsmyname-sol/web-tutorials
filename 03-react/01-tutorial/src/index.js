/* eslint-disable react/prop-types */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      playerToken: ['X', 'O'],
    };
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.playerToken[this.props.squares[i]]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      player: 0,
      viewingStep: 0,
    };
  }

  handleClick(i) {
    const step = this.state.viewingStep;
    const history = (step == (this.state.history.length - 1)) ?
          this.state.history :
          this.state.history.slice(0, step + 1);
    const current = history[step];

    const winner = calculateWinner(current.squares);
    if (winner !== null || current.squares[i]) {
      return;
    }

    const squares = current.squares.slice();
    const player = this.state.player;

    squares[i] = player;
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      player: 1 - player,
      viewingStep: step + 1,
    });
  }

  jumpTo(step) {
    this.setState({
      viewingStep: step,
      player: (step % 2),
    });
  }

  render() {
    const history = this.state.history;

    const step = this.state.viewingStep;
    const current = history[step];

    const winner = calculateWinner(current.squares);
    let status;
    if (winner !== null) {
      status = `Winner: player ${winner}`;
    } else {
      status = `Next: player ${this.state.player}`;
    }

    const moves = history.map((_step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] !== null && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
