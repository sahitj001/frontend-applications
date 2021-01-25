import React, {
  useEffect
} from "react";
import * as d3 from "d3";
import * as d3collection from "d3-collection";
import '../style/BarChart.css'

//playing around with data: https://www.youtube.com/watch?v=BDpBAFvdjYo
//also playing around with mouseover: http://bl.ocks.org/mbostock/2706022

const sizes = {
  width: 1800,
  height: 450,
}

const margin = {
  top: 50,
  bottom: 50,
  left: 50,
  right: 50,
}

function handleMouseOver(e, barValue) {
  console.log("mouse over", e, barValue)
  const value = barValue
  const bar = d3.select(this)
    .attr("fill", "orange")

  return value
}

function handleMouseOut(e, barValue) {
  console.log("mouse out", e, barValue)
  const el = e.target;
  const bar = d3.select(this)
    .attr("fill", "royalblue")
}

export function BarChart(props) {

  const svg = d3.select("#svg")
  const x = d3.scaleBand()
  const y = d3.scaleLinear()

  //because i already gave my data array as a prop, i can use it here directly for my d3 bar chart
  const {
    data,
    selectedChoice
  } = props;
  console.log('The array has', props.data.length, 'elements')
  console.log('selected choice is:', selectedChoice)

  function totalPerProvince() {
    //http://www.d3noob.org/2014/02/grouping-and-summing-data-using-d3nest.html
    //d3 collection is a deprecated package, but still working for me.
    const total = d3collection.nest().key(function (d) {
        return d.province
      })
      .rollup(function (d) {
        return d3.sum(d, function (y) {
          return y.capacity
        })
      }).entries(data)
    console.log(total)

    const x = d3.scaleBand()
      .domain(d3.range(total.length))
      .range([margin.left, sizes.width - margin.right])
      .padding(0.1)


    const y = d3.scaleLinear()
      .domain([0, d3.max(total, (d) => d.value)])
      .range([sizes.height - margin.bottom, margin.top])


    const yAxis = (g) => {
      g.attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y).ticks())
        .attr("font-size", "20px")
    }

    const xAxis = (g) => {
      g.attr("transform", `translate(0,${sizes.height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat((i) => total[i].key))
        .attr("font-size", "20px")
    }

    svg.append('g')
      .attr("fill", "royalblue")
      .selectAll("rect")
      .data(total.sort((a, b) => d3.descending(a.value, b.value)))
      .join("rect")
      .attr("class", "rect")
      .attr("x", (d, i) => x(i))
      .attr("y", (d) => y(d.value))
      .attr("title", (d) => d.value)
      .attr("height", (d) => y(0) - y(d.value))
      .attr("width", x.bandwidth())
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)

    svg.append('g').call(xAxis)
    svg.append('g').call(yAxis)
    svg.node()
  }





  function averagePerProvince() {
    console.log('gemiddelde is aangetikt')
    const average = d3collection.nest().key(function (d) {
        return d.province
      })
      .rollup(function (d) {
        return d3.mean(d.filter(d => d.province === d.province), d => d.capacity)
      }).entries(data)
    // console.log('average', average)

    // const y = d3.scaleLinear()
    // .domain([0, d3.max(average, (d) => d.value )])
    // .range([sizes.height - margin.bottom, margin.top])
    // }

    const x = d3.scaleBand()
      .domain(d3.range(average.length))
      .range([margin.left, sizes.width - margin.right])
      .padding(0.1)



    const y = d3.scaleLinear()
      .domain([0, d3.max(average, (d) => average.value)])
      .range([sizes.height - margin.bottom, margin.top])


    const yAxis = (g) => {
      g.attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y).ticks())
        .attr("font-size", "20px")
    }

    const xAxis = (g) => {
      g.attr("transform", `translate(0,${sizes.height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat((i) => average[i].key))
        .attr("font-size", "20px")
    }

    const getBars =
      d3.select("#svg")
      .selectAll('g')
      .data(average)
      .enter()
      .append('g')

      // .call(yAxis)
      // .call(xAxis)
    // .exit()
    // .remove()
    console.log('bars should be average now', getBars)

    // console.log(test)

    //TODO GOT TO MAKE SVG VARIABLE IN USE EFFECT GLOBAL
  }


  function highestPerProvince() {
    const total = d3collection.nest().key(function (d) {
        return d.province
      })
      .rollup(function (d) {
        return d3.max(d.filter(d => d.province === d.province), d => d.capacity)
      }).entries(data)
    console.log(total)
  }

//   const total = d3collection.nest().key(function(d){
//     return d.province})
//   .rollup(function(d){
//     return d3.sum(d, function(y){
//         return y.capacity
//     })
// }).entries(data)
// console.log('total per province:', total)

// const letsgo = d3.mean(data.filter(d => d.cap))
// console.log('okay:', letsgo)



useEffect(() => {
  if(selectedChoice === 'totaal') {
    totalPerProvince() 
  }
  if(selectedChoice === 'gemiddelde'){
    averagePerProvince()
  }
  if(selectedChoice === 'max'){
    highestPerProvince()
  }
  })

 

  return (
    <div>
      <div className="chart info">
        <p>province: { props.data.province }</p>
        <p>capacity: {"selected capacity"}</p>
      </div>
      <svg
        id="svg"
        height={sizes.height - margin.top - margin.bottom}
        width={sizes.width - margin.left - margin.right} 
        viewBox={[0,0, sizes.width, sizes.height]}
      ></svg>
    </div>
  )
}