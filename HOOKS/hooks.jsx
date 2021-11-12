import React, { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);


  return (
    <div>
      <p>You clicked {times} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

function ExampleWithManyStates(){
    const [age,setAge] = useState(30);
    const [fruit,setFruit] = useState("apple");
    const [todos,setTodos] = useState([{text: "learn hooks"}])
}



ReactDOM.render(
    <Example />,
    document.getElementById('hooks')

)