function Square(props) {
  return (
    <button className="square" onClick={props.onRefresh} key={props.value}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  //Hozzárendeli a négyzetekhez az értéket
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onRefresh={() => this.props.onClick(i)}
        key={i}
      />
    );
  }


  createRow(index){
    let indexedSquares = [];
    let reduce = 0;
    while(reduce < 3){
      index = index-reduce;
      indexedSquares.push(this.renderSquare(index));
      reduce++;
    }
  return indexedSquares;
  }



createTable(i){
  let index = i;
  let table= [];
  while(index > 0 ){
    if(index % 3 == 0){
      table.push(this.renderDiv(index))
    }
    index--;
  }
  return (table)
}


renderDiv(index){
  return(
    <div>
      {this.createRow(index)}
    </div>
  )
}

/*
  renderDiv(i) {
    let rows =[];
    for(let index = 0; index< i;index++){
      rows.push(this.renderSquare(index))
    }    
    return (
      <div className="board-row">
        {rows}
      </div>
    )
  }

*/

  //Létrehozza a négyzeteket
  render() {
    return (
      this.createTable(9)

      /*<div>
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
      </div>*/
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
      boldButton: null
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1); // a lépéstörténetből levlasztjuk azt a részt ameddig a stepNumber enged
    const current = history[history.length - 1]; // Aktuális tábla állapot Objektum
    const squaresCopy = current.squares.slice(); // Aktuális tábla állapot másolata Array
    const posi = this.state.position.slice(); //Aktuális cella koordinátája
    if (calculateWinner(squaresCopy) || squaresCopy[i]) { // Ha van győztes  vagy ugyanoda kattintunk akkor ne engedélyezze  kattintást
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
      ])
    });
  }


  jumpTo(step) {
    const gameStatus = this.state.history[step];
    const historyCopy = this.state.history.slice(0, step + 1);
    this.setState({
      history: historyCopy,
      stepNumber: step, // Módosítjuk a lépést arra a pontra ahova vissza szeretnénk ugrani
      xIsNext: (step % 2) === 0, // Megnézzük, hogy ennél a pontnál X-et vagy O-t kell tenni
      squares: gameStatus.squares,
      boldButton: step
    })
    //console.log(this)



  }


  render() {
    const history = this.state.history;
    console.log("Step number:");
    console.log(this.state.stepNumber)
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
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
    if (winner) {
      status = "Győztes" + winner;
    } else {
      status = "A következő játékos: " + (this.state.xIsNext ? "X" : "O");
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
          <ol>{moves}</ol>
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


function calculateWinner(square) {
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
      return square[a]
    }
  }
  return null
};

function calculateposition(i) {
  const position = [
    [1, 1], [1, 2], [1, 3],
    [2, 1], [2, 2], [2, 3],
    [3, 1], [3, 2], [3, 3]
  ]
  return position[i]

}