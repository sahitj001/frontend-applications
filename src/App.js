import React, { useEffect, useState } from 'react'
import * as d3 from "d3"
import { BarChart } from './components/BarChart'
import { BarChart3 } from './components/BarChart3'
import { BarChart4 } from './components/BarChart4'
import { Header } from './components/Header'
import { Intro } from './components/Intro'
import { Findings } from './components/Findings'
import { FilterTitle } from './components/FilterTitle'
import './style/App.css'

function App() {

const choices = [ {value:'total', name: 'Total capacity'}, {value:'average', name: 'Average capacity'}, {value:'max', name:'Highest capacity parking garage'}]

const url = 'https://gist.githubusercontent.com/sahitj001/26850a99179af9f089a879f00cc7daad/raw/d276697fc13e60c07f2bec4078da9148f74dcf79/parkingData.json'

const [data, setData] = useState([])
const [choice, setChoice] = useState("total")
console.log(choice)
useEffect(() => {
  // fetching the data from github
  const getData = async () => {
    try {
      const data = await d3.json(url)
      setData(data)
    } catch (error) {
      console.log(error)
    }
  }
  // when component has been mounted, useEffect will run once. Although, every time there is a change on the page, useEffect will run once more and then also keep fetching data.
  // the if statement is here so that useEffect won't keep re-fetching the data from github
  if (data.length === 0) {
    getData()
  }
})

  return (
    <div className="App">
      <Header />
      <Intro />
      <Findings />
      <FilterTitle />
      <div className="filter">
      <select id="filterChoice" onChange={(e) => setChoice(e.target.value)}>
          {choices.map((choice) => (
            <option key={choice.value} value={choice.value}>{choice.name}</option>
          ))}
        </select>
        </div>
        {/* <BarChart data={data} selectedChoice={choice} /> */}
        {/* <BarChart3 data={data}  selectedChoice={choice}/> */}
        <BarChart4/>
      
    </div>
  )
}

export default App
