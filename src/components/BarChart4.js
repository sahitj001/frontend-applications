import React, {
    useEffect, useState
  } from "react";
  import * as d3 from "d3";
  import * as d3collection from "d3-collection";
  import '../style/BarChart.css'
  
  //resources i have been using
  //played around with data: https://www.youtube.com/watch?v=BDpBAFvdjYo
  //also playing around with mouseover: http://bl.ocks.org/mbostock/2706022
  //http://www.d3noob.org/2014/02/grouping-and-summing-data-using-d3nest.html
  //https://vizhub.com/Razpudding/c2a9c9b4fde84816931c404951c79873?edit=files&file=index.js&line
  //d3-collection is a deprecated package, but still working for me.
  
  const dropdown = ["total", "average", "highest"]

  const margin = {
    top: 50,
    left: 50,
  }

  function handleMouseOver(e, barValue) {
    console.log("mouse over", e, barValue)
    d3.select(this)
      
      .transition()
      .duration(200)
      .attr("fill", "orange")
  
  }
  //when you hover away from the bar, show the data on screen. I also wanted to do this for mouseOver but the problem was that in the beginning I have
  //nothing selected so I will get an error when loading the page.
  function handleMouseOut(e, barValue) {
    console.log("mouse out", e, barValue)
    d3.select(this)
    .transition()
      .duration(200)
      .attr("fill", "white")
  
    d3.select("#capacity").html(barValue.value)
    d3.select("#province").html(barValue.key)
  }
  //width and size of dataviz. i could for example say that the yAxis could be 200 high if i want to.
  const sizes = {
    width: 900,
    height: 500,
  }

  const bonusheight = 550;
  


  export function BarChart4() {
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

    //   const dropdownButton = d3.select("#dropdown")
    //   .append('select')
  
    //   dropdownButton // Add a button
    //   .selectAll('myOptions') // Next 4 lines add 6 options = 6 colors
    //      .data(dropdown)
    //   .enter()
    //     .append('option')
    //   .text(function (d) { return d; }) // text showed in the menu


    const svg = d3.select('#svg')
      //give the container a width and height
      .attr('width', 1000)
      .attr('height', 900)
    const x = d3.scaleBand()
    const y = d3.scaleLinear()

    // const container = svg
    //   .append('g')
    //   //making sure labels show up by using this line code
    //   .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  
  
    function drawBars(container, data) {
      const theBars = container
        .selectAll('.bar')
        .data(data)
       
  
      theBars.enter()
        .append('rect')
        .attr("fill", "white")
        .attr('class', 'bar')
        .attr('x', d => x(d.key))
        .attr('y', d => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', d => sizes.height - y(d.value))
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut)
  
    }

    const bruh= totalPerProvince()
    const brah= averagePerProvince()
    const bruv= highestPerProvince()
    console.log('bruh', bruh)
    
    async function makeVis() {
        initScales(bruh)
        checkState()
    }
   

    function initScales(data) {
      // set domain equal to number of provinces and also make sure there is padding inbetween bars
      x.domain(data.map(province => province.key))
      x.padding(0.2)

      // set domain equal to the parking capacity 
      y.domain([0, d3.max(data.map(capacity => capacity.value))])
  
      //range is the absolute value of your data. If my domain is for example at max 10 and my range is 1000 and 
      //say that I have each value of domain evenly spread, that means that every step my range increases with 100. A domain value of 25 would give a range of 250.
      x.rangeRound([0, sizes.width])
      y.rangeRound([sizes.height, 0])
      
    }

    function initAxes() {
      //make the Y and X axis in this function. Wanted to have this function run only once but couldn't find a way how to.
      svg
        .append('g')
        .attr('class', 'xAxis')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      svg
        .append('g')
        .attr('class', 'yAxis')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    }

    function choiceChanged(data) {
        console.log('aaa', data)
        // Update the domain so the new y maximum is taken into account and that the x axes is set good
        x.domain(data.map(province => province.key))
        y.domain([0, d3.max( data.map(capacity => capacity.value))]);
        const bars = svg.selectAll('.bar')
            .data(data)
              .join(
            enter => enter.append("rect")
            .attr('class', 'bar')
            .attr('x' ,d => x(d.key))
            .attr('y', d => y(d.value))
            .attr('width', x.bandwidth())
            .attr('height', d => sizes.height - y(d.value))
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut)
            ,
            update => update
                .attr('class', 'bar')
                .attr('x' ,d => x(d.key))
                .attr('y', d => y(d.value))
                .attr('width', x.bandwidth())
                .attr('height', d => sizes.height - y(d.value)),
            exit => exit.remove())

            svg
            .select('.xAxis')
            .call(d3.axisBottom(x))
            .attr('transform', 'translate('+ 50 +',' + bonusheight +')')
            .exit().remove()
            svg.select('.yAxis')
            .call(d3.axisLeft(y)
            .ticks(10))
            .exit().remove()
    }


  
    function totalPerProvince() {
      //calculate the total capacity per province
      const total = d3collection.nest().key(function (d) { //with .key you create for each unique element a key, so we should get 12 provinces
          return d.province
        })
        .rollup(function (d) { //with .rollup you take all the individual values in each key
          return d3.sum(d, function (y) { //and then sum them up
            return y.capacity
          })
        }).entries(data) //the data we are using
        .sort((a, b) => d3.descending(a.value, b.value)) //then sort data from high to low
      return total
    }
  
    function averagePerProvince() {
      //calculate average parking capacity of each province
      const average = d3collection.nest().key(function (d) {
          return d.province
        })
        .rollup(function (d) {
          // eslint-disable-next-line 
          return d3.mean(d.filter(d => d.province === d.province), d => d.capacity)
        }).entries(data)
        .sort((a, b) => d3.descending(a.value, b.value))
      return average
    }
  
    function highestPerProvince() {
      //get the parking garage with the highest capacity per province
      const highest = d3collection.nest().key(function (d) {
          return d.province
        })
        .rollup(function (d) {
          // eslint-disable-next-line 
          return d3.max(d.filter(d => d.province === d.province), d => d.capacity)
        }).entries(data)
        .sort((a, b) => d3.descending(a.value, b.value))
      console.log(highest)
      return highest
    }
  
    function checkState() {
      //when the state of the dropdown changes, the bar will render something different
      
      if (choice === 'total') {
        //   initScales(totalPerProvince())
        //   drawBars(container, totalPerProvince())
        choiceChanged(bruh)
      }
      if (choice === 'average') {
        //   initScales(averagePerProvince())
        //   drawBars(container, averagePerProvince())
        choiceChanged(brah)
      }
      if (choice === 'max') {
        //   initScales(highestPerProvince())
        //   drawBars(container, highestPerProvince())
        choiceChanged(bruv)
      }
    }

    makeVis()
    //https://stackoverflow.com/questions/5629684/how-can-i-check-if-an-element-exists-in-the-visible-dom
    var element =  document.getElementsByClassName('xAxis');
    if (typeof(element) != 'undefined' && element != null && element.length>0)
    {
        console.log('CHECKING ELEMENT', element)
    } else{
        initAxes()
        console.log('it aint here, so im rendering')
    }
    

    return (
      <div className="chart">
        <div className="chart-info">
        <select id="filterChoice" onChange={(e) => setChoice(e.target.value)}>
          {choices.map((choice) => (
            <option key={choice.value} value={choice.value}>{choice.name}</option>
          ))}
        </select>
          <p className="bar-p">Province: <span id="province"> Hover over a bar! </span></p>
          <p className="bar-p">Capacity: <span id="capacity"> Hover over a bar! </span></p>
        </div>
          <h3 className="infoCap">Capacity</h3>
          <h3 className="infoProv">Province</h3>
        <svg
          id="svg"
        ></svg>
      </div>
    )
  }