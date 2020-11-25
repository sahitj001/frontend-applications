import React, { useState } from 'react';
import './App.css';

function App() {

const provinces = [{value:'groningen', name: 'Groningen'}, {value:'noord-holland', name: 'Noord-Holland'}]

for (let i = 0; i < provinces.length; i++) {
  const createEl = document.createElement("option")
  document.getElementById("province").innerHTML += ' <option value=" '+ pronvince[i].value + '">' + provinces[i].name + '</option'
  
}

  return (
    <div className="App">
      <select id="province">
        
      </select>
    </div>
  );
}

export default App;
