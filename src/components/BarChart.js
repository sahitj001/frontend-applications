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

    //making sure labels show up by using this line code
    // .append('g')
    // .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    
//     let counter = 0
//     if(counter = 0){
//       runOnce()
//     }
// console.log(counter)
//     function runOnce(){
//       svg.append('g')
//       .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
//       counter++
//       console.log('running')
//     }

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

    //range is the absolute value of your data. If my domain is for example at max 10 and my range is 1000 and 
    //say that I have each value of domain evenly spread, that means that every step my range increases with 100. A domain value of 25 would give a range of 250.
    x.rangeRound([0, sizes.width])
    y.rangeRound([sizes.height, 0])
  }

      //https://stackoverflow.com/questions/5629684/how-can-i-check-if-an-element-exists-in-the-visible-dom
      var element =  document.getElementsByClassName('xAxis');
      if (typeof(element) != 'undefined' && element != null && element.length>0)
      {
          console.log('CHECKING ELEMENT', element)
      } else{

          initAxes(container)
          svg

          //making sure labels show up by using this line code
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
          
          console.log('it aint here, so im rendering')
      }
      
      //https://stackoverflow.com/questions/5629684/how-can-i-check-if-an-element-exists-in-the-visible-dom
      // var element =  document.getElementsByClassName('draw');
      // if (typeof(element) != 'undefined' && element != null && element.length>0)
      // {
      //     console.log('CHECKING ELEMENT', element)
      // } else{
      //   svg.attr('class', 'draw')
      //   //making sure labels show up by using this line code
      //   .append('g')
      //   .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      //   console.log('doing it')
      // }

  function initAxes(container) {
    //make the Y and X axis in this function. Wanted to have this function run only once but couldn't find a way how to.
    container
      .append('g')
      .attr('class', 'xAxis')
    container
      .append('g')
      .attr('class', 'yAxis')
      // .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
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
      .attr('x', d => x(d.key))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => sizes.height - y(d.value))

    //by updating the domain, you set up the scaling of your axes  
    x.domain(total.map(province => province.key))
    y.domain([0, d3.max(total.map(capacity => capacity.value))])

    //update the axes
    svg.select('.xAxis')
      .call(d3.axisBottom(x))
      .attr('transform', 'translate(0,' + sizes.height + ')')
    svg.select('.yAxis')
      .call(d3.axisLeft(y)
      .ticks(10))
    

    theBars.exit()
      .remove()

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
      .attr('x', d => x(d.key))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => sizes.height - y(d.value))

    //update domain, setting up the scaling of my axes
    x.domain(average.map(province => province.key))
    y.domain([0, d3.max(average.map(capacity => capacity.value))])

    //update axes
    svg.select('.xAxis')
      .call(d3.axisBottom(x))
      .attr('transform', 'translate(0,' + sizes.height + ')')
    svg.select('.yAxis')
      .call(d3.axisLeft(y)
      .ticks(10))

    theBars.exit()
      .remove()

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
      .attr('x', d => x(d.key))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => sizes.height - y(d.value))

    //update domain, setting up scaling for each axis
    x.domain(highest.map(province => province.key))
    y.domain([0, d3.max(highest.map(capacity => capacity.value))])

    //update axes
    svg.select('.xAxis')
      .call(d3.axisBottom(x))
      .attr('transform', 'translate(0,' + sizes.height + ')')
    svg.select('.yAxis')
      .call(d3.axisLeft(y).ticks(10))

    theBars.exit()
      .remove()

    return highest
  }

  function checkState() {
    //when the state of the dropdown changes, the bar will render something different
    // initAxes(container)
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