  function Square (props) {
    return (
      <button className="square" onClick={props.onRefresh}>
        {props.value}
      </button>
    );
  }
  

  class Board extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        squares: Array(9).fill(null),
        xIsNext: true
      };
    }

    handleClick(i){
      const squaresCopy = this.state.squares.slice();
      console.log(squaresCopy[i]);
      if (calculateWinner(squaresCopy) || squaresCopy[i]){
        console.log("Már van győztes vagy ugyanoda kattintasz");
        return;
      }

        squaresCopy[i] = this.state.xIsNext ? "X" : "O";
        console.log(squaresCopy);
        console.log(this.state.squares);
        this.setState( {
          squares:squaresCopy,
          xIsNext: !this.state.xIsNext} );

      

      //console.log(this.state.squares)

    }


    renderSquare(i) {
      //return <Square value = {i} />;
      return ( <Square 
      value={this.state.squares[i]}
      onRefresh={ () => this.handleClick(i)} 
      />
      );
    }

  
    render() {
      let winner = calculateWinner(this.state.squares);
      let status;
      if(winner){
        status = "Győztes: " + winner;
      }else {
        status = "A következő játékos: " + (this.state.xIsNext ? "X" : "O")
      }
  
      return (
        <div>
          <div className="status">{status}</div>
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
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
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
  

  function calculateWinner(square){
    const table = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6]
    ];
    for (let i =0; i< table.length; i++){
      const [a,b,c] = table[i];
      if(square[a] && square[a] === square [b] && square[a] === square [c]){
        return square[a]
      }
    }
    return null
  }