import React, {
  useEffect
} from "react";
import * as d3 from "d3";
import * as d3collection from "d3-collection";
import {easeCubicInOut} from "d3-ease";
import '../style/BarChart.css'

//resources i have been using
//played around with data: https://www.youtube.com/watch?v=BDpBAFvdjYo
//also playing around with mouseover: http://bl.ocks.org/mbostock/2706022
//http://www.d3noob.org/2014/02/grouping-and-summing-data-using-d3nest.html
//https://vizhub.com/Razpudding/c2a9c9b4fde84816931c404951c79873?edit=files&file=index.js&line
//d3-collection is a deprecated package, but still working for me.
//BIG SHOUTOUT TO SUWI FOR HELPING MY OUT WITH MY RENDER ISSUES
//d3 animation transitions documentation: https://observablehq.com/@d3/easing-animations

// margins for axes
const margin = {
  top: 50,
  left: 50,
}

const sizes = {
  width: 900,
  height: 500,
}

let svg 

const x = d3.scaleBand()
const y = d3.scaleLinear()

// hover over element to see data about the bar
function handleMouseOver(e, barValue) {
  console.log("mouse over", e, barValue)
  d3.select(this)

    .transition()
    .duration(200)
    .attr("fill", "orange")

    d3.select("#capacity").html(barValue.value)
    d3.select("#province").html(barValue.key)
}

//when you hover away from the bar, show the data on screen.
function handleMouseOut(e, barValue) {
  console.log("mouse out", e, barValue)
  d3.select(this)
    .transition()
    .duration(200)
    .attr("fill", "white")

  d3.select("#capacity").html(barValue.value)
  d3.select("#province").html(barValue.key)
}

function drawBars(container, data) {
  const theBars = container
    .selectAll('.bar')
    .data(data)
    console.log('ENTERING', theBars)
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
    console.log('ENTER DONE')
}

//run code only after the DOM has completely loaded. Because of render issues I had to use this code.
document.addEventListener('DOMContentLoaded', (event) => {
  svg = d3.select('#svg')
//give the container a width and height and create a group element where we will render our chart in.
.attr('width', 1000)
.attr('height', 900)
.append('g')
//making sure labels show up by making use of margin
.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
// create X and Y axis group after the DOM has completely rendered. This code will be just like the code above, only run once.
initAxes(svg);

})

function initAxes(container) {
  //make the Y and X axis in this function. Wanted to have this function run only once but couldn't find a way how to.
  container
    .append('g')
    .attr('class', 'xAxis')
  container
    .append('g')
    .attr('class', 'yAxis')
}

export function BarChart(props) {
  //because I already gave my data array as a prop, I can use it here directly for my d3 bar chart
  const {
    data,
    selectedChoice
  } = props;
  console.log('The array has', props.data.length, 'elements')
  console.log('selected choice is:', selectedChoice);

  useEffect(() => {
    if(data.length) {
      // put the data I got from checkState() in draw. Then use it as argument in drawBars
      const draw = checkState();
      drawBars(svg, draw)
    }
  }, [data, selectedChoice])

  function initScales(data) {
    // set domain equal to number of provinces and also make sure there is padding inbetween bars
    x.domain(data.map(province => province.key))
    x.padding(0.2)
    // set domain equal to the parking capacity 
    y.domain([0, d3.max(data.map(capacity => capacity.value))])
    // set range size
    x.range([0, sizes.width])
    y.range([sizes.height, 0])
  }

  if (!data) {
    return <h1>HERE{JSON.stringify(data)}</h1>;
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

    const theBars = svg.selectAll('.bar')
      .data(total)

    //updating the bars
    theBars
      .transition()
      .duration(900)
      .ease(easeCubicInOut)
      .attr('x', d => x(d.key))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => sizes.height - y(d.value))

    //update domain
    x.domain(total.map(province => province.key))
    y.domain([0, d3.max(total.map(capacity => capacity.value))])

    //make axes show up
    svg.select('.xAxis')
      .call(d3.axisBottom(x))
      .attr('transform', 'translate(0,' + sizes.height + ')')
    svg.select('.yAxis')
      .call(d3.axisLeft(y)
        .ticks(10))

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

    const theBars = svg.selectAll('.bar')
      .data(average)

    //update bars
    theBars
      .transition()
      .duration(900)
      .ease(easeCubicInOut)
      .attr('x', d => x(d.key))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => sizes.height - y(d.value))

    //update domain
    x.domain(average.map(province => province.key))
    y.domain([0, d3.max(average.map(capacity => capacity.value))])

    //make axes show up
    svg.select('.xAxis')
      .call(d3.axisBottom(x))
      .attr('transform', 'translate(0,' + sizes.height + ')')
    svg.select('.yAxis')
      .call(d3.axisLeft(y)
        .ticks(10))

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

    const theBars = svg.selectAll('.bar')
      .data(highest)

    //update bars
    theBars
      .transition()
      .duration(900)
      .ease(easeCubicInOut)
      .attr('x', d => x(d.key))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => sizes.height - y(d.value))

    //update domain
    x.domain(highest.map(province => province.key))
    y.domain([0, d3.max(highest.map(capacity => capacity.value))])

    //make axes show up
    svg.select('.xAxis')
      .call(d3.axisBottom(x))
      .attr('transform', 'translate(0,' + sizes.height + ')')
    svg.select('.yAxis')
      .call(d3.axisLeft(y).ticks(10))

    return highest
  }

  function checkState() {
    //when the state of the dropdown changes, the bar will render something different
    //drawFunction is a dynamic variable which means it contains a different function depending on the state of the dropdown 
    //totalPerProvince, averagePerProvince and highestPerProvince transform the fetched data and immediately update the bars.
    let drawFunction;
    if (selectedChoice === 'total') {
      drawFunction = totalPerProvince
    }
    if (selectedChoice === 'average') {
      drawFunction = averagePerProvince
    }
    if (selectedChoice === 'max') {
      drawFunction = highestPerProvince
    }
    //before we return the data I want to put the transformed data into the axes
    initScales(drawFunction())
    return drawFunction
  }

  return ( <div className = "chart">
      <div className = "chart-info" >
      <h1 className='d3-chart-title'> Rendering the bar with D3! 📊</h1>
      <p className = "bar-p" > Province: <span id = "province" > Hover over a bar! </span></p >
      <p className = "bar-p" > Capacity: <span id = "capacity" > Hover over a bar! </span></p >
      </div> <h3 className = "infoCap" > Capacity </h3> 
      <h3 className = "infoProv" > Province </h3> <svg id = "svg" >
      </svg> </div>
  )
}