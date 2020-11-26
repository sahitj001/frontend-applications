import React, { useEffect, useState } from 'react'
import * as d3 from "d3"
import { BarChart } from './components/BarChart'
import './App.css'


function App() {

const choices = [{value:'gemiddelde', name: 'Het gemiddelde'}, {value:'totaal', name: 'Totaal aantal'}, {value:'max', name:'Hoogste capaciteit parkeergarage'}]

const url = 'https://gist.githubusercontent.com/sahitj001/ff71b2e2e97c9fc07a6044680ba00a56/raw/742228f0dccb368d6b0bc8102ef94adc08c318c5/parkingData.json'

const [data, setData] = useState([])
const [choice, setChoice] = useState("gemiddelde")

useEffect(() => {
  function filterIt(x){
    if(x.hasOwnProperty('capacity') && x.hasOwnProperty('province')){
      return x
    }
  }
  
  // fetching the data from github
  const getData = async () => {
    try {
      const data = await d3.json(url)

      //filtering the objects that don't have a capacity
      const filteredData = data.filter(filterIt)
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
