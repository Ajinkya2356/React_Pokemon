import "./App.css";

import React from "react";
import Pokemon from "./components/Pokemon";
function App() {

  return <div>
    <div style={{ padding: "3%" }}>
      <p ><h1 style={{ display: "inline" }}>Pokédex &nbsp;&nbsp;</h1>
        <span id="done">|&nbsp;&nbsp;&nbsp;&nbsp;</span> <hr className="horizontal"/>
        Search for any Pokémon that exists on the planet
      </p>


      <Pokemon />
    </div>
  </div>;
}

export default App;
