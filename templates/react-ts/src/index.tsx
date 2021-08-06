import React, { useState } from "react";
import ReactDOM from "react-dom";

// import default style
import "./main.scss";

const Main = () => {
  const [count, setCount] = useState(0);
  return (
    <div className="App">
      <h1>Hello World</h1>
      <button onClick={() => setCount((count) => ++count)}>
        Click me {count}
      </button>
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<Main />, rootElement);
