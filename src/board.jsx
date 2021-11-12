function Square(props) {
  let name = "square"

  if(props.winner.length > 0){
    props.winner.map((numb) => {
      if(numb == props.item){
        name = "square back"
      }
    })
  }

  return (
    <button className={`${name}`} onClick={props.onRefresh} key={props.item}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  //Hozzárendeli a négyzetekhez az értéket
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        winner={this.props.winner}
        item={i}
        onRefresh={() => this.props.onClick(i)}

      />
    );
  }

  createCell(index) {
    return Array.from(Array(3)).map((item, idx) => this.renderSquare(index + idx))
  }

  createTable(i) {
    return Array.from(Array(i)).map((curV, index) => index).filter((curV) => curV % 3 == 0).map((curV) => this.renderDiv(curV))
  }

  renderDiv(index) {
    return (
      <div key={index}>
        {this.createCell(index)}
      </div>
    )
  }


  //Létrehozza a négyzeteket
  render() {
    return (
      this.createTable(9)
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      position: [],
      boldButton: null,
      winnerSquares: []
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1); // a lépéstörténetből levlasztjuk azt a részt ameddig a stepNumber enged
    const current = history[history.length - 1]; // Aktuális tábla állapot Objektum
    const squaresCopy = current.squares.slice(); // Aktuális tábla állapot másolata Array
    const posi = this.state.position.slice(); //Aktuális cella koordinátája
    if (calculateWinner(squaresCopy, this.state.stepNumber)[1] || squaresCopy[i]) { // Ha van győztes  vagy ugyanoda kattintunk akkor ne engedélyezze  kattintást
      console.log("Már van győztes vagy ugyanoda kattintasz");
      return;
    }
    squaresCopy[i] = this.state.xIsNext ? "X" : "O"; // Az aktuális tábla másolatában az aktuális cella C vagy O legyen
    this.setState({ // Módosítjuk a paramétereket
      history: history.concat([
        {
          squares: squaresCopy //a tábla Objektumok közé illesze be az új táblát 
        }
      ]),
      stepNumber: history.length, // A lépésszám legyen egyenlő a tábla hosszával 
      xIsNext: !this.state.xIsNext, // Váltsunk jelet
      position: posi.concat([ // Pozíció Array-be illesze be az új pozíciót
        calculateposition(i)
      ]),
      boldButton: this.state.stepNumber + 1
    });
  }


  jumpTo(step) {
    if (step < this.state.history.length && step >= 0) {
      const gameStatus = this.state.history[step];
      const historyCopy = this.state.history.slice(0, step + 1);
      // history: historyCopy,
      this.setState({
        stepNumber: step, // Módosítjuk a lépést arra a pontra ahova vissza szeretnénk ugrani
        xIsNext: (step % 2) === 0, // Megnézzük, hogy ennél a pontnál X-et vagy O-t kell tenni
        // squares: gameStatus.squares,
        boldButton: step
      })

    }

  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares, this.state.stepNumber);
    //History leképezése:
    const moves = history.map((step, move) => {
      const desc = move ?
        "Menj ide, lépés: #" + move + (" Pozíció: " + this.state.position[move - 1]) :
        "menj a játék kezdetéhez";
      if (move == this.state.boldButton) {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}> <b> {desc} </b> </button>
          </li>
        )
      } else {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}> {desc} </button>
          </li>
        )
      }
    })
    let status;
    if (winner[1]) {
      status = "Győztes :" + current.squares[winner[1]];
    } else if (winner[0]) {
      status = "Nincs győztes";
    } else {
      status = "A következő játékos: " + (this.state.xIsNext ? "X" : "O");
    }


    const switchButtons = [
      [
        <div className="switch-buttons">
          <button onClick={() => this.jumpTo(this.state.stepNumber - 1)}>Jump back</button>
        </div>
      ],
      [
        <div className="switch-buttons">
          <button onClick={() => this.jumpTo(this.state.stepNumber + 1)}>Jump Forth</button>
        </div>
      ],
    ]

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winner={winner}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        <div>
          {switchButtons}
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


function calculateWinner(square, step) {
  const table = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < table.length; i++) {
    const [a, b, c] = table[i];
    if (square[a] && square[a] === square[b] && square[a] === square[c]) {
      return table[i];
    } else if (i + 1 == table.length && step > 8) { return ["nowinner"] }
  };
  return [null]
}


function calculateposition(i) {
  const position = [
    [1, 1], [1, 2], [1, 3],
    [2, 1], [2, 2], [2, 3],
    [3, 1], [3, 2], [3, 3]
  ]
  return position[i]

}