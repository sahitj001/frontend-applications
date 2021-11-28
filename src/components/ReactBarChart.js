import React, {
    useEffect, useState
  } from "react";
  import * as d3 from "d3";
  import * as d3collection from "d3-collection";
  import '../style/ReactBarChart.css'
  
  //main resources I have been using
  //this very long video from Curran Kelleher: https://www.youtube.com/watch?v=2LhoCfjm8R4
  //also got some inspiration from this datavisualisation: https://vizhub.com/curran/b9069ad0a02c4ab5b29f0b8dcb447396?edit=files&file=index.js
  //BIG SHOUTOUT TO SUWI FOR HELPING MY OUT WITH MY RENDER ISSUES in my somewhat more D3 version combined with React!


  // margins for axes
  const margin = {
    top: 50,
    left: 50,
    bottom:50,
    right:50
  }
  
  const sizes = {
    width:1000,
    height: 600,
  }


  const innerHeight = sizes.height - margin.top - margin.bottom;
  const innerWidth = sizes.width - margin.left - margin.right;    
  

  export function ReactBarChart(props) { 
    let [hoverCap, setHoverCap] = useState('Hover over a bar!')
    let [hoverProv, setHoverProv] = useState('Hover over a bar!')
    let [selectedData, setSelectedData] = useState([])

    const x = d3.scaleBand()
    .domain(selectedData.map(province => province.key))
    .range([0, innerWidth])
    .padding(0.2)
  
    const y = d3.scaleLinear()
    .domain([0, d3.max(selectedData.map(capacity => capacity.value))])
    .range([innerHeight, 0])
    
    function overBar(e){
        // console.log("going over: ", e, val)
        console.log("checking for value: ", e.target)
        const currentHoverValue = e.target.getAttribute('value')
        const currentHoverKey = e.target.getAttribute('province')
        e.target.setAttribute("fill", 'orange')
        setHoverCap(currentHoverValue)
        setHoverProv(currentHoverKey)
      }

      function leaveBar(e){
          e.target.setAttribute('fill', 'white')
      }
 
    //because I already gave my data array as a prop, I can use it here directly for my d3 bar chart
    const {
      data,
      selectedChoice
    } = props;
    console.log('The array has', props.data.length, 'elements')
    console.log('selected choice is:', selectedChoice);
    console.log('the data', data)
    useEffect(() => {
      if(data.length) {
        checkState()
      }
    }, [data, selectedChoice])
  
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
      setSelectedData(drawFunction)
    }

    
    return ( <div className = "react-chart">
        <div className = "chart-info" >
        <h1 className= 'react-chart-title' >Rendering the data with React! ⚛</h1>
        <p className = "bar-p" > Province: <span id = "province" > {hoverCap}</span></p >
        <p className = "bar-p" > Capacity: <span id = "capacity" > {hoverProv} </span></p >
        </div> 
        
        <h3 className = "infoCap" > Capacity </h3> 
        <h3 className = "infoProv" > Province </h3>
        
        {/* we will work in the svg element, we start by giving it a size */}
        <svg width={1200} height={600}>
        
        {/* the next step is to create a group element with margin so that we can show our axes */}
        <g transform={`translate(${150},${margin.top})`}>

        {/* start with making the x axis */}
        <g transform={`translate(0, ${sizes.height})`}>
        <line x1={900} transform={`translate(0, ${-100})`} stroke="royalblue" />

        {/* I map the labels and then render them in the HTML */}
        {x.domain().map( d =>
            <text
            style={{ textAnchor: 'middle' }}
            fontSize={10}
            fill={'white'}

            // set positioning of each label, might look a bit crooked but hey couldn't find another way ¯\_(ツ)_/¯
            x={x(d) + 30}
            y="-80px"
            >

            {/* show the data in the HTML */}
            {d}
            </text>
        )}
        </g>
        
        {/* render the y axis stroke */}
        <g>
        <line y2={506} stroke="royalblue" />

        {/* create upper tick of y axis  */}
        <line   
            x2={-6}
            stroke='royalblue'
        />

        {/* mapping the labels */}
        {y.ticks(10).map(tickValue => (
            <g>
                {/* create ticks of y axis */}
                <line x2={-6}
                    stroke='royalblue'
                    y={y(tickValue) + 5}
                    transform={`translate(0, ${y(tickValue)})`}
                ></line>
                {/* create text labels */}
                <text
                    key={tickValue}
                    style={{ textAnchor: 'end' }}
                    fill={'white'}
                    fontSize={10}
                    //setting the position of the ticks
                    y={y(tickValue) + 5}
                    x={-8}
                >
            {/* show the data in HTML */}
            {tickValue}
          </text>
          </g>
        ))}
        </g>     

         {/* render the bars */}
          {selectedData.map(d => <rect 
          x={x(d.key)} 
          y={y(d.value)} 
          width={x.bandwidth()} 
          height={500 - y(d.value)} 
          fill={"white"}
          value={d.value}
          province={d.key} 
          onMouseOver={overBar}
          onMouseLeave={leaveBar}
           />)} 
           </g>

        </svg> 

        </div>
    )
  }