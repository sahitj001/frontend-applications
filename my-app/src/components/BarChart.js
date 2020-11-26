import React, { useEffect } from "react";
import * as d3 from "d3";

//playing around with data: https://www.youtube.com/watch?v=BDpBAFvdjYo
//also playing around with mouseover: http://bl.ocks.org/mbostock/2706022
const yeet = [
  { province: "Patrick", capacity: 80 },
  { province: "Patrick2", capacity: 30 },
  { province: "Patrick3", capacity: 40 },
  { province: "Patrick4", capacity: 10 },
  { province: "Patrick5", capacity: 70 },
]

// function getProv(result, item){
//   if(result.includes(""))
//   const test = {
//     province: province,
//     capacity: capacity,
//     id: id
//   }
//   return result
// }

// const reduceIt = yeet.reduce(getProv, [])
// console.log(reduceIt)

const sizes = {
  width: 900,
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
  const bar = d3.select(this)
    .attr("fill", "orange")

  // // Specify where to put label of text
  // const svg = d3.select("#svg")
  // svg.append("text")
  // .attr("id", "bar-" + barValue.province)
  // .attr("x", function() { return xAxis(e.x) - 30; })
  // .attr("y", function() { return yAxis(e.y) - 15; })
  //  .text(function() {
  //    return [e.x, e.y];  // Value of the text
  //  });
}

function handleMouseOut(e, barValue) {
  console.log("mouse out", e, barValue)
  const el = e.target;
  const bar = d3.select(this)
    .attr("fill", "royalblue")
  
  // d3.select("bar-" + barValue.province).remove();  // Remove text location
}

export function BarChart(props) {
  //because i already gave my data array as a prop, i can use it here directly for my d3 bar chart
  const { data, selectedProvince } = props;
  
  console.log('bruh', props.data.length)

  const x = d3.scaleBand()
  .domain(d3.range(props.data.length))
  .range([margin.left, sizes.width - margin.right ])
  .padding(0.1)

const y = d3.scaleLinear()
  .domain([0, d3.max(data, (d) => d.capacity )])
  .range([sizes.height - margin.bottom, margin.top])


const yAxis = (g) => {
  g.attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(y).ticks())
    .attr("font-size", "20px")
}

const xAxis = (g) => {
  g.attr("transform", `translate(0,${sizes.height - margin.bottom})`)
    .call(d3.axisBottom(x).tickFormat((i) => data[i].province))
    .attr("font-size", "20px")
}

  useEffect(() => {
      const svg = d3.select("#svg")
      
      svg.append('g')
       .attr("fill", "royalblue")
       .selectAll("rect")
       .data(data.sort((a,b) => d3.descending(a.capacity, b.capacity)))
       .join("rect")
          .attr("class", "rect")
          .attr("x", (d, i) => x(i))
          .attr("y", (d) => y(d.capacity))
          .attr("title", (d) => d.capacity)
          .attr("height", (d) => y(0) - y(d.capacity))
          .attr("width", x.bandwidth())
          .on('mouseover', handleMouseOver)
          .on('mouseout', handleMouseOut)

      svg.append('g').call(xAxis)
      svg.append('g').call(yAxis)
      svg.node()
  })

  return (
    <div>
      <div className="chart info">
        <p>province: {"selected province"}</p>
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