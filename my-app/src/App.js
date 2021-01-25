import React, { useEffect, useState } from 'react'
import * as d3 from "d3"
import { BarChart } from './components/BarChart'
import './App.css'


function App() {

const choices = [ {value:'totaal', name: 'Totaal aantal'}, {value:'gemiddelde', name: 'Het gemiddelde'}, {value:'max', name:'Hoogste capaciteit parkeergarage'}]

const url = 'https://gist.githubusercontent.com/sahitj001/26850a99179af9f089a879f00cc7daad/raw/d276697fc13e60c07f2bec4078da9148f74dcf79/parkingData.json'

const [data, setData] = useState([])
const [choice, setChoice] = useState("totaal")
console.log(choice)
useEffect(() => {
  // fetching the data from github
  const getData = async () => {
    try {
      const data = await d3.json(url)
      const filteredData = data
      setData(filteredData)
    } catch (error) {
      console.log(error)
    }
  }

  // the if statement is here so that useEffect won't keep re-fetching the data from github
  if (data.length === 0) {
    getData()
  }
})

  

  return (
    <div className="App">
      <select id="filterChoice" onChange={(e) => setChoice(e.target.value)}>
          {choices.map((choice) => (
            <option key={choice.value} value={choice.value}>{choice.name}</option>
          ))}
        </select>

        <BarChart data={data} selectedChoice={choice} />
    </div>
  )
}

export default App
