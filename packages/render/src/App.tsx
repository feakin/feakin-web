import React from 'react';
import Render from "./Render";

const App = () => {
  const text = `graph TD;
    A-->B
    A-->C
    B-->C;`;

  return (
    <div>
      <Render text={ text }/>
    </div>
  );
};

export default App;
