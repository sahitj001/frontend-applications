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
  
  export function BarChart5(props) {
    const choices = [ {value:'total', name: 'Total capacity'}, {value:'average', name: 'Average capacity'}, {value:'max', name:'Highest capacity parking garage'}]
    const [choice, setChoice] = useState("total")
    const url = 'https://gist.githubusercontent.com/sahitj001/26850a99179af9f089a879f00cc7daad/raw/d276697fc13e60c07f2bec4078da9148f74dcf79/parkingData.json'

    const [data, setData] = useState([])
    
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

        const svg = d3.select('svg')

        const group = svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

        const x = d3.scaleBand()
                    .padding(0.2)
        const y = d3.scaleLinear()


        const totalCap = prepTotal()
        const averageCap = prepAverage()
        const highCap = prepHighest()
        setupScales()
        setupAxes()  
        console.log(totalCap)

        async function prepTotal(){
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

        async function prepAverage(){
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

        async function prepHighest(){
  //get the parking garage with the highest capacity per province
  const highest = d3collection.nest().key(function (d) {
      return d.province
    })
    .rollup(function (d) {
      // eslint-disable-next-line 
      return d3.max(d.filter(d => d.province === d.province), d => d.capacity)
    }).entries(data)
    .sort((a, b) => d3.descending(a.value, b.value))

    return highest
        }

        function checkChoice(){
            if( choice === 'total'){
                selectionChangedX(totalCap)
            }
            if (choice === 'average') {

            }
            if (choice === 'highest') {

            }
        }

        checkChoice()
    

        function setupScales(){
            //We'll set the x domain to the different preferences
            x.domain(data.map(province => province.key))
            //The y-domain is set to the min and max of the current y variable
            y.domain([0, d3.max( data.map(capacity => capacity.value) )] )
            x.rangeRound([0, sizes.width]);
            y.rangeRound([sizes.height, 0]);
          }

          function setupAxes(){
            group
              .append('g')
              .attr('class', 'xAxis')
                .call(d3.axisBottom(x)).attr('transform', 'translate(0,' + sizes.height + ')')
            group
              .append('g')
              .attr('class', 'yAxis')
                .call(d3.axisLeft(y).ticks(10))
          }

          function selectionChangedX(data){
            x.domain(data.map(item => item.key))
            // Update the domain so the new y maximum is taken into account
            y.domain([0, d3.max( data.map(capacity => capacity.value) )] );
            const bars = group.selectAll('.bar')
                .data(data)
              console.log(bars)
            //The update selection
            bars
                .attr('x', d => x(d.key))
              .attr('y', d => y(d.value))
              .attr('width', x.bandwidth())
              .attr('height', d => sizes.height - y(d.value))
            //The enter selection
            bars
                .enter()
                .append('rect')
                .attr('class', 'bar')
                    .attr('x' ,d => x(d.key))
                .attr('y', d => y(d.value))
                .attr('width', x.bandwidth())
                .attr('height', d => sizes.height - y(d.value))
            //The exit selection
            bars
              .exit()
              .remove()
            //Update the ticks on the axes
            svg.select('.axis-x')
                .call(d3.axisBottom(x)).attr('transform', 'translate(0,' + sizes.height + ')')
            svg.select('.axis-y')
                .call(d3.axisLeft(y).ticks(10))
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