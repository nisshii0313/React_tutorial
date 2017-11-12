import React from 'react';
import ReactDOM from 'react-dom';
import swal from 'sweetalert'
import './index.css';

function Square(props) {
  if (props.highlight) {
    return (
      <button className="square" onClick={() => props.onClick()} style={{color: "yellow"}}>
        {props.value}
      </button>
    );
  } else{
      if(props.value === 'X') {
        return (
          <button className="square" onClick={() => props.onClick()} style={{color: "red"}}>
            {props.value}
          </button>
        );
      }else {
        return(
          <button className="square" onClick={() => props.onClick()} style={{color: "blue"}}>
            {props.value}
          </button>
        );
      }
    }
}

function getWindowSize() {


  console.log(`ウィンドウサイズの横幅`);
  console.log(window.innerWidth);

  console.log(`ウィンドウサイズの高さ`);
  console.log(window.innerHeight);
}


class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={this.props.winnerLine.includes(i)}
      />
    );
  }

  render() {
    var squ = [], num = 100;
    for (var i = 0; i < num; i++){
      squ.push(
      <div className="board-row">
        {this.renderSquare(i)}
      </div>
      )
    }
    return(
      squ
    );
  }
}
class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [
        {
          squares: Array(100).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ?  "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerData = calculateWinner(current.squares);
    const winner = winnerData ? winnerData.winner : null;
    const winnerLine = winnerData ? winnerData.line : [];

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'restart';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
        status = "Winner: " + winner;
        if (window.innerWidth < 480) {
          if (winner === "X") {
            swal({
              title: "Winner is X",
              text: "Do you want to restart?",
              buttons: {
                no: "No",
                restart: "Yes, I want to restart",
              },
            })
            .then((value) => {
              switch (value) {
                case "no":
                  window.close();
                  break;
                case "restart":
                  window.location.reload();
                  break;
              }
            })
          } else {
            swal({
              title: "Winner is O",
              text: "Do you want to restart?",
              buttons: {
                no: "No",
                restart: "Yes, I want to restart",
              },
            })
            .then((value) => {
              switch (value) {
                case "no":
                  window.close();
                  break;
                case "restart":
                  window.location.reload();
                  break;
              }
            })
          }
        }
    } else {
      status = "Next : " + (this.state.xIsNext ? "X" : "O");
      if (window.innerWidth < 480) {
      if (this.state.xIsNext) {
        swal('Next : X');
      } else {
        swal('Next : O');
      }
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winnerLine={winnerLine}
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

// ========================================

ReactDOM.render(<Game myProps='xIsNext' />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [];
  for (var s = 0; s < 6; s++) {
    lines.push(
    [s, s+1, s+2, s+3, s+4],
    [s+10, s+11, s+12, s+13, s+14],
    [s+20, s+21, s+22, s+23, s+24],
    [s+30, s+31, s+32, s+33, s+34],
    [s+40, s+41, s+42, s+43, s+44],
    [s+50, s+51, s+52, s+53, s+54],
    [s+60, s+61, s+62, s+63, s+64],
    [s+70, s+71, s+72, s+73, s+74],
    [s+80, s+81, s+82, s+83, s+84],
    [s+90, s+91, s+92, s+93, s+94],
    [s, s+11, s+22, s+33, s+44],
    [s+10, s+21, s+32, s+43, s+54],
    [s+20, s+31, s+42, s+53, s+64],
    [s+30, s+41, s+52, s+63, s+74],
    [s+40, s+51, s+62, s+73, s+84],
    [s+50, s+61, s+72, s+83, s+94],
    [9-s, 18-s, 27-s, 36-s, 45-s],
    [19-s, 28-s, 37-s, 46-s, 55-s],
    [29-s, 38-s, 47-s, 56-s, 65-s],
    [39-s, 45-s, 54-s, 63-s, 72-s],
    [49-s, 58-s, 67-s, 76-s, 85-s],
    [59-s, 65-s, 74-s, 83-s, 92-s],
    [10*s, 10*s+10, 10*s+20, 10*s+30, 10*s+40],
    [10*s+1, 10*s+11, 10*s+21, 10*s+31, 10*s+41],
    [10*s+2, 10*s+12, 10*s+22, 10*s+32, 10*s+42],
    [10*s+3, 10*s+13, 10*s+23, 10*s+33, 10*s+43],
    [10*s+4, 10*s+14, 10*s+24, 10*s+34, 10*s+44],
    [10*s+5, 10*s+15, 10*s+25, 10*s+35, 10*s+45],
    [10*s+6, 10*s+16, 10*s+26, 10*s+36, 10*s+46],
    [10*s+7, 10*s+17, 10*s+27, 10*s+37, 10*s+47],
    [10*s+8, 10*s+18, 10*s+28, 10*s+38, 10*s+48],
    [10*s+9, 10*s+19, 10*s+29, 10*s+39, 10*s+49]
    )
  }
  console.log(lines);

  for (let i = 0; i < lines.length; i++) {
    console.log(lines.length);
    const [a, b, c, d, e] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[b] === squares[d] && squares[c] === squares[e]) {
      return { winner: squares[a], line: [a ,b, c, d, e] };
    }
  }
  return null;
}
