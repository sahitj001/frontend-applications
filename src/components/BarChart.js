import React, {
  useEffect
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
  const value = barValue
  const bar = d3.select(this)
    .attr("fill", "orange")
}

function handleMouseOut(e, barValue) {
  console.log("mouse out", e, barValue)
  const el = e.target;
  const bar = d3.select(this)
    .attr("fill", "white")

    d3.select("#capacity").html(barValue.value)
    d3.select("#province").html(barValue.key)
}

const sizes = {
  width: 900,
  height: 500,
}

export function BarChart(props) {
  //select svg tag in HTML
  const svg = d3.select('#svg')
    //give the container a width and height
    .attr('width', 1000)
    .attr('height', 900)
  const x = d3.scaleBand()
  const y = d3.scaleLinear()

  //because i already gave my data array as a prop, i can use it here directly for my d3 bar chart
  const {
    data,
    selectedChoice
  } = props;
  console.log('The array has', props.data.length, 'elements')
  console.log('selected choice is:', selectedChoice)

  const container = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

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

  function initScales(data) {
    // set domain equal to number of provinces and also make sure there is padding inbetween bars
    x.domain(data.map(province => province.key))
    x.padding(0.2)
    // set domain equal to the parking capacity 
    y.domain([0, d3.max(data.map(capacity => capacity.value))])
    x.rangeRound([0, sizes.width])
    y.rangeRound([sizes.height, 0])
  }

  function initAxes(container) {
    container
      .append('g')
      .attr('class', 'xAxis')
    container
      .append('g')
      .attr('class', 'yAxis')
  }

  function totalPerProvince() {
    
    const total = d3collection.nest().key(function (d) {
        return d.province
      })
      .rollup(function (d) {
        return d3.sum(d, function (y) {
          return y.capacity
        })
      }).entries(data)
      .sort((a, b) => d3.descending(a.value, b.value))
    x.domain(total.map(province => province.key))
    y.domain([0, d3.max(total.map(capacity => capacity.value))])

    const theBars = svg.selectAll('.bar')
      .data(total)
    //update
    theBars
      .attr('x', d => x(d.key))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => sizes.height - y(d.value))

    theBars.exit()
      .remove()

    //update the axes
    svg.select('.xAxis')
      .call(d3.axisBottom(x))
      .attr('transform', 'translate(0,' + sizes.height + ')')
    svg.select('.yAxis')
      .call(d3.axisLeft(y).ticks(10))
    return total
  }

  function averagePerProvince() {
    console.log('gemiddelde is aangetikt')
    const average = d3collection.nest().key(function (d) {
        return d.province
      })
      .rollup(function (d) {
        return d3.mean(d.filter(d => d.province === d.province), d => d.capacity)
      }).entries(data)
      .sort((a, b) => d3.descending(a.value, b.value))

    x.domain(average.map(province => province.key))
    y.domain([0, d3.max(average.map(capacity => capacity.value))])

    const theBars = svg.selectAll('.bar')
      .data(average)

    theBars
      .attr('x', d => x(d.key))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => sizes.height - y(d.value))

    theBars.enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.key))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => sizes.height - y(d.value))

    theBars.exit()
      .remove()

    //update axes
    svg.select('.xAxis')
      .call(d3.axisBottom(x))
      .attr('transform', 'translate(0,' + sizes.height + ')')
    svg.select('.yAxis')
      .call(d3.axisLeft(y).ticks(10))

    return average
  }


  function highestPerProvince() {
    const highest = d3collection.nest().key(function (d) {
        return d.province
      })
      .rollup(function (d) {
        return d3.max(d.filter(d => d.province === d.province), d => d.capacity)
      }).entries(data)
      .sort((a, b) => d3.descending(a.value, b.value))
    console.log(highest)

    x.domain(highest.map(province => province.key))
    y.domain([0, d3.max(highest.map(capacity => capacity.value))])

    const theBars = svg.selectAll('.bar')
      .data(highest)
    //update bars
    theBars
      .attr('x', d => x(d.key))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => sizes.height - y(d.value))

    theBars.enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.key))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => sizes.height - y(d.value))


    theBars.exit()
      .remove()

    //update axes
    svg.select('.xAxis')
      .call(d3.axisBottom(x))
      .attr('transform', 'translate(0,' + sizes.height + ')')
    svg.select('.yAxis')
      .call(d3.axisLeft(y).ticks(10))

    return highest
  }

  function checkState() {
    initAxes(container)
    if (selectedChoice === 'total') {
      initScales(totalPerProvince())
      drawBars(container, totalPerProvince())
    }
    if (selectedChoice === 'average') {
      initScales(averagePerProvince())
      drawBars(container, averagePerProvince())
    }
    if (selectedChoice === 'max') {
      initScales(highestPerProvince())
      drawBars(container, highestPerProvince())
    }
  }

  useEffect(() => {
   checkState() 
  })
  
  return (
    <div className="chart">
      <div className="chart-info">
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