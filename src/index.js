import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />;
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
      xIsNext: true,
      stepNumber: 0,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{ squares: squares }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }
  jumpTo(step) {
    if (step === 9){
      this.setState({
        stepNumber: 0,
        xIsNext: true,
      });
    } else {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0
      });
    }
  };
  render() {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const winnerArray = calculateWinner(current.squares);
    const winner = winnerArray ? winnerArray[3] : null;

    const moves = history.map((step, move) => {
      const desc = move ? ((move === 9) ? 'Начать сначала' : 'Перейти к ходу')  : 'К началу игры';
      return (
        <tr key = { move } class = {  ( (move + 1) === history.length) ? 'table-success': '' }>
          <th scope="row">{ move + 1 }</th>
          <td><button onClick={() => this.jumpTo(move)}>{desc}</button></td>
          <td>{ move }</td>          
        </tr>
        //<li key={move}>
        //  <button onClick={() => this.jumpTo(move)}>{desc}</button>
        //</li>
      )
    });
    let status;
    if (winner) {
      status = 'Выиграл ' + winner;
    } else {
      if (this.state.stepNumber === 9){
        status = 'Ничья';
      } else {
        status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');
      }      
    }

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
          <table class='table table-sm table-hover'>
            <thead>
              <th scope="col">#</th>
              <th scope="col">Кнопка</th>
              <th scope="col">№ хода</th>              
            </thead>
            <tbody>
            {moves}
            </tbody>            
          </table>          
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i].concat(squares[a]);
    }
  }
  return null;
}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
