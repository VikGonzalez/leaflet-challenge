// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

    ///////////////////////////////////
    // Configure SVG and Chart Sizes
    ///////////////////////////////////
    const color = ["green","red","blue","purple","orange","gray"];

    // Select the area for the SVG
    let svgArea = d3.select("#linePlot").select("svg");
    
    // Clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    };
    
    // Set SVG dimensions
    let svgWidth = window.innerWidth*0.8;
    let svgHeight = window.innerHeight*0.7;
    
    //Configure the chart margins relative to SVG size
    let chartMargin = {
      top: 80,
      bottom: 50,
      right: 20,
      left: 100
    };
    
    // Configure chart height and width
    let height = svgHeight - chartMargin.top - chartMargin.bottom;
    let width = svgWidth - chartMargin.left - chartMargin.right;
    
    // Append SVG element
    let svg = d3
      .select("#linePlot")
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);

    svg.append("circle").attr("cx",svgWidth-220).attr("cy",20).attr("r", 6).style("fill", color[0])
    svg.append("circle").attr("cx",svgWidth-220).attr("cy",40).attr("r", 6).style("fill", color[1])
    svg.append("circle").attr("cx",svgWidth-220).attr("cy",60).attr("r", 6).style("fill", color[2])
    svg.append("circle").attr("cx",svgWidth-100).attr("cy",20).attr("r", 6).style("fill", color[3])
    svg.append("circle").attr("cx",svgWidth-100).attr("cy",40).attr("r", 6).style("fill", color[4])
    svg.append("circle").attr("cx",svgWidth-100).attr("cy",60).attr("r", 6).style("fill", color[5])
    svg.append("text").attr("x", svgWidth-210).attr("y", 20).text("5-14 yrs").style("fill", color[0]).style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", svgWidth-210).attr("y", 40).text("15-24 yrs").style("fill", color[1]).style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", svgWidth-210).attr("y", 60).text("25-34 yrs").style("fill", color[2]).style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", svgWidth-90).attr("y", 20).text("35-54 yrs").style("fill", color[3]).style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", svgWidth-90).attr("y", 40).text("55-34 yrs").style("fill", color[4]).style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", svgWidth-90).attr("y", 60).text("75+ yrs").style("fill", color[5]).style("font-size", "15px").attr("alignment-baseline","middle")
    
    
    // Append group element
    let chartGroup = svg.append("g")
    .classed("chartGroup",true)
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
    
    // ///////////////////////////////////
    // // Initialize plot
    // ///////////////////////////////////
     let selXaxis = "year";
     let selYaxis = "female";
    
    // ///////////////////////////////////
    // // Create all required functions
    // ///////////////////////////////////
    
    // function used for updating yAxis var upon click on axis label
    function renderYaxes(newYScale, yAxis) {
      let leftAxis = d3.axisLeft(newYScale);
    
      yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
      return yAxis;
    };
    
    const unique = (value, index, self) => {
      return self.indexOf(value) === index
    }
    
    // ///////////////////////////////////
    // // Read CSV and create plot
    // ///////////////////////////////////

function init() {
    d3.json("Data/suicide_data.json").then(function(sData, err) {
       if (err) throw err;
        let list_of_countries = [];
        let list_of_codes = [];
          sData.forEach(data => {
            list_of_countries.push(data.country)
            list_of_codes.push(data.code)
            });


          let countryArea = d3.select("#selDataset").selectAll("option")
          if (!countryArea .empty()) {
            countryArea .remove();
          };

          let countrySel = d3.select("#selDataset");
          uniqueCountries = list_of_countries.filter(unique)
          uniqueCodes = list_of_codes.filter(unique)
          // Populate the drop-down list with sample IDs
          for (i=0;i<uniqueCountries.length;i++){
            countrySel.append("option").property("value",uniqueCodes[i]).text(uniqueCountries[i].substring(0,32));
          }

          let countryData = [];
          let country_code = d3.select("#selDataset").property('value');

           sData.forEach(data => {
             if (data.code === country_code) {
              countryData.push(data)
             }
           });

        let cData = [];

        countryData.forEach(data => {
          let yData = {};
          yData["year"] = data.year
          availGrps = Object.keys(data[selYaxis]);
          availGrps.forEach(grp => {
            switch (grp) {
              case "5-14 years":
                yData["s5_14"] = data[selYaxis][grp];
                break;
              case "15-24 years":
                yData["s15_24"] = data[selYaxis][grp];
                break;
              case "25-34 years":
                yData["s25_34"] = data[selYaxis][grp];
                break;
              case "35-54 years":
                yData["s35_54"] = data[selYaxis][grp];
                break;
              case "55-74 years":
                yData["s55_74"] = data[selYaxis][grp];
                break;
              case "75+ years":
                yData["s75plus"] = data[selYaxis][grp];
                break;
              default:
                console.log("Error in age group")
            }
          })
          cData.push(yData);
          return availGrps
        });
        
        maxs5_14 = d3.max(cData,d=> d['s5_14']);
        maxs15_24 = d3.max(cData,d=> d['s15_24']);
        maxs25_34 = d3.max(cData,d=> d['s25_34']);
        maxs35_54 = d3.max(cData,d=> d['s35_54']);
        maxs55_74 = d3.max(cData,d=> d['s55_74']);
        maxs75 = d3.max(cData,d=> d['s75plus']);

        yMAX = Math.max(maxs5_14,maxs15_24,maxs25_34,maxs35_54,maxs55_74,maxs75)

        years = d3.extent(cData,d=> d.year);

        //Create x and y linear scales
        let xLinearScale = d3.scaleLinear()
        .domain(years)
        .range([0, width]);

        let yLinearScale = d3.scaleLinear()
        .domain([0,yMAX])
        .range([height, 0]);
    
        // // create axes
        let bottomAxis = d3.axisBottom(xLinearScale).tickFormat(d3.format("d"));;
        let leftAxis = d3.axisLeft(yLinearScale);
    
        // append axes
        let xAxis= chartGroup.append("g")
          .classed("x-axis",true)
          .attr("transform", `translate(0, ${height})`)
          .call(bottomAxis)
    
        let yAxis= chartGroup.append("g")
          .classed("y-axis",true)
          .call(leftAxis);
    
        let xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
    
        let yearLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "year") // value to grab for event listener
        .classed("active", true)
        .text("Year");
    
        let yLabelsGroup = chartGroup.append("g")
        .attr("transform",`translate(${chartMargin.left},0)`);
    
        let femaleLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0- chartMargin.left - 60)
        .attr("x", 0 - (height*0.5))
        .attr("dy", "1em")
        .attr("value", "female") // value to grab for event listener
        .classed("active", true)
        .text("FEMALE suicide rate (per 100K)");
    
        let maleLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left - 85)
        .attr("x", 0 - ((height*0.5)))
        .attr("dy", "1em")
        .attr("value", "male") // value to grab for event listener
        .classed("inactive", true)
        .text("MALE suicide rate (per 100K)");

        let countryName = countryData[0].country;
        let title = svg.append("text")
        .classed("title",true)
        .attr("x", chartMargin.left + 200)             
        .attr("y", chartMargin.top-30)
        .attr("text-anchor", "middle")  
        .style("color","black")
        .style("font-weight","bold")
        .style("font-size", "20px") 
        .style("text-decoration", "underline")  
        .text(`Historical suicide data for ${countryName} (${country_code})`)

        // Line generator for morning data

        let line1 = d3.line()
          .defined(d => !isNaN(d.s5_14)) //removes NAN values
          .x(d => xLinearScale(d.year))
          .y(d => yLinearScale(d.s5_14));

        let line2 = d3.line()
        .x(d => xLinearScale(d.year))
        .y(d => yLinearScale(d.s15_24));

        let line3 = d3.line()
        .x(d => xLinearScale(d.year))
        .y(d => yLinearScale(d.s25_34));

        let line4 = d3.line()
        .x(d => xLinearScale(d.year))
        .y(d => yLinearScale(d.s35_54));

        let line5 = d3.line()
        .x(d => xLinearScale(d.year))
        .y(d => yLinearScale(d.s55_74));

        let line6 = d3.line()
        .x(d => xLinearScale(d.year))
        .y(d => yLinearScale(d.s75plus));

        // Append a path for line1

        let linesGroup = chartGroup.append("g")

        linesGroup
        .append("path")
        .attr("d", line1(cData))
        .classed("line s5_14", true);

        linesGroup
        .append("path")
        .attr("d", line2(cData))
        .classed("line s15_24", true); 

        linesGroup
        .append("path")
        .attr("d", line3(cData))
        .classed("line s25_34", true); 

        linesGroup
        .append("path")
        .attr("d", line4(cData))
        .classed("line s35_54", true); 

        linesGroup
        .append("path")
        .attr("d", line5(cData))
        .classed("line s55_74", true); 

        linesGroup
        .append("path")
        .attr("d", line6(cData))
        .classed("line s75plus", true); 

        let toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([150, 70])
        .html(function(d) {
          return (`<strong>${country_code}</strong><br>(data from: ${d.year})<hr>Suicide rates (${selYaxis})<hr>Age 5-14: ${d.s5_14}<br>Age 15-24: ${d.s15_24}<br>Age 25-34: ${d.s25_34}<br>Age 35-54: ${d.s35_54}<br>Age 55-74: ${d.s55_74}<br>Age 75+: ${d.s75plus}`);
        });

        let circlesGroup = chartGroup.selectAll("circle")
        .data(cData)
        .enter()
        .append("g")

       circlesGroup
       .append("circle")
        .attr("id","s5_14")
        .attr("cx", d => xLinearScale(d.year))
        .attr("cy", d => yLinearScale(d.s5_14))
        .attr("r", function(d) { return d.s5_14 == undefined ? 0 : 3; })
        .attr("fill", color[0]);

        circlesGroup
        .append("circle")
        .attr("id","s15_24")
        .attr("cx", d => xLinearScale(d.year))
        .attr("cy", d => yLinearScale(d.s15_24))
        .attr("r", "3")
        .attr("fill", color[1]);

        circlesGroup
        .append("circle")
        .attr("id","s25_34")
        .attr("cx", d => xLinearScale(d.year))
        .attr("cy", d => yLinearScale(d.s25_34))
        .attr("r", "3")
        .attr("fill", color[2]);

        circlesGroup
        .append("circle")
        .attr("id","s35_54")
        .attr("cx", d => xLinearScale(d.year))
        .attr("cy", d => yLinearScale(d.s35_54))
        .attr("r", "3")
        .attr("fill", color[3]);

        circlesGroup
        .append("circle")
        .attr("id","s55_74")
        .attr("cx", d => xLinearScale(d.year))
        .attr("cy", d => yLinearScale(d.s55_74))
        .attr("r", "3")
        .attr("fill", color[4]);

        circlesGroup
        .append("circle")
        .attr("id","s75plus")
        .attr("cx", d => xLinearScale(d.year))
        .attr("cy", d => yLinearScale(d.s75plus))
        .attr("r", "3")
        .attr("fill", color[5]);
        
        circlesGroup.call(toolTip);

        // Step 2: Create "mouseover" event listener to display tooltip
        circlesGroup.on("mouseover",d=>{
          toolTip.show(d,this)
        }).on("mouseout", (d,i)=> {
          toolTip.hide(d)
        });

      // y axis labels event listener
      yLabelsGroup.selectAll("text")
      .on("click", function() {
    
        // get value of selection
        let Yvalue = d3.select(this).attr("value");
        if (Yvalue !== selYaxis) {
    
          // Get value of selected y-axis
          selYaxis = Yvalue;

          let mData = [];

          countryData.forEach(data => {
            let yData = {};
            yData["year"] = data.year
            availGrps = Object.keys(data[selYaxis]);
            availGrps.forEach(grp => {
              switch (grp) {
                case "5-14 years":
                  yData["s5_14"] = data[selYaxis][grp];
                  break;
                case "15-24 years":
                  yData["s15_24"] = data[selYaxis][grp];
                  break;
                case "25-34 years":
                  yData["s25_34"] = data[selYaxis][grp];
                  break;
                case "35-54 years":
                  yData["s35_54"] = data[selYaxis][grp];
                  break;
                case "55-74 years":
                  yData["s55_74"] = data[selYaxis][grp];
                  break;
                case "75+ years":
                  yData["s75plus"] = data[selYaxis][grp];
                  break;
                default:
                  console.log("Error in age group")
              }
            })
            mData.push(yData);
            return availGrps
          });
  
          maxs5_14 = d3.max(mData,d=> d['s5_14']);
          maxs15_24 = d3.max(mData,d=> d['s15_24']);
          maxs25_34 = d3.max(mData,d=> d['s25_34']);
          maxs35_54 = d3.max(mData,d=> d['s35_54']);
          maxs55_74 = d3.max(mData,d=> d['s55_74']);
          maxs75 = d3.max(mData,d=> d['s75plus']);
  
          mMAX = Math.max(maxs5_14,maxs15_24,maxs25_34,maxs35_54,maxs55_74,maxs75)

          let yLinearScale = d3.scaleLinear()
          .domain([0,mMAX])
          .range([height, 0]);
      
          // // create axes
          bottomAxis = d3.axisBottom(xLinearScale);
          leftAxis = renderYaxes(yLinearScale, yAxis);

          line1.y(d => yLinearScale(d.s5_14))
          .defined(d => !isNaN(d.s5_14)) //removes NAN values;
          linesGroup
          .transition()
          .duration(1000)
          .select(".s5_14")
          .attr("d", line1(mData));

          line2.y(d => yLinearScale(d.s15_24));
          linesGroup
          .transition()
          .duration(1000)
          .select(".s15_24")
          .attr("d", line2(mData));

          line3.y(d => yLinearScale(d.s25_34));
          linesGroup
          .transition()
          .duration(1000)
          .select(".s25_34")
          .attr("d", line3(mData));

          line4.y(d => yLinearScale(d.s35_54));
          linesGroup
          .transition()
          .duration(1000)
          .select(".s35_54")
          .attr("d", line4(mData));

          line5.y(d => yLinearScale(d.s55_74));
          linesGroup
          .transition()
          .duration(1000)
          .select(".s55_74")
          .attr("d", line5(mData));

          line6.y(d => yLinearScale(d.s75plus));
          linesGroup
          .transition()
          .duration(1000)
          .select(".s75plus")
          .attr("d", line6(mData));

          circlesGroup.select("#s5_14")
          .data(mData)
          .transition()
          .duration(1000)
          .attr("cy", d => yLinearScale(d.s5_14))
          .attr("r", function(d) { return d.s5_14 == undefined ? 0 : 3; })

          circlesGroup.select("#s15_24")
          .data(mData)
          .transition()
          .duration(1000)
          .attr("cy", d => yLinearScale(d.s15_24))

          circlesGroup.select("#s25_34")
          .data(mData)
          .transition()
          .duration(1000)
          .attr("cy", d => yLinearScale(d.s25_34))

          circlesGroup.select("#s35_54")
          .data(mData)
          .transition()
          .duration(1000)
          .attr("cy", d => yLinearScale(d.s35_54))

          circlesGroup.select("#s55_74")
          .data(mData)
          .transition()
          .duration(1000)
          .attr("cy", d => yLinearScale(d.s55_74))

          circlesGroup.select("#s75plus")
          .data(mData)
          .transition()
          .duration(1000)
          .attr("cy", d => yLinearScale(d.s75plus))

          let ylabel;

          switch(selYaxis) {
            case "female":
              ylabel = "FEMALE suicide rate (per 100K)"
              break;
            case "male":
              ylabel = "MALE suicide rate (per 100K)"
              break;
            default:
              ylabel = "Error in Y";
          };

          let toolTip = d3.tip()
          .attr("class", "tooltip")
          .html(function(d) {
            return (`<strong>${country_code}</strong><br>(data from: ${d.year})<hr>Suicide rates (${selYaxis})<hr>Age 5-14: ${d.s5_14}<br>Age 15-24: ${d.s15_24}<br>Age 25-34: ${d.s25_34}<br>Age 35-54: ${d.s35_54}<br>Age 55-74: ${d.s55_74}<br>Age 75+: ${d.s75plus}`);
          });

          circlesGroup.data(mData).call(toolTip);

          // Step 2: Create "mouseover" event listener to display tooltip
          circlesGroup.on("mouseover",d=>{
            toolTip.show(d,this)
            .style('top', (d3.event.pageY + 10)+'px')
            .style('left', (d3.event.pageX + 10)+'px');
          }).on("mouseout", (d,i)=> {
            toolTip.hide(d)
          });

          switch(selYaxis) {
            case "male":
              maleLabel
                .classed("active", true)
                .classed("inactive", false);
              femaleLabel
                .classed("active", false)
                .classed("inactive", true);
              break;
            case "female":
              maleLabel
                .classed("active", false)
                .classed("inactive", true);
              femaleLabel
                .classed("active", true)
                .classed("inactive", false);
              break;
            default:
              maleLabel
                .classed("active", false)
                .classed("inactive", true);
              femaleLabel
                .classed("active", false)
                .classed("inactive", true);
          }; //end of switch
    }
  }); //end of y-axis listener
    
  }); //end of JSON read
}; // end of init

init()

function optionChanged() {
  d3.json("Data/suicide_data.json").then(function(sData, err) {
     if (err) throw err;

        let countryData = [];
        let country_code = d3.select("#selDataset").property('value');

         sData.forEach(data => {
          if (data.code === country_code) {
            countryData.push(data)
           }
          });

      let cData = [];

      countryData.forEach(data => {
        let yData = {};
        yData["year"] = data.year
        availGrps = Object.keys(data[selYaxis]);
        availGrps.forEach(grp => {
          switch (grp) {
            case "5-14 years":
              yData["s5_14"] = data[selYaxis][grp];
              break;
            case "15-24 years":
              yData["s15_24"] = data[selYaxis][grp];
              break;
            case "25-34 years":
              yData["s25_34"] = data[selYaxis][grp];
              break;
            case "35-54 years":
              yData["s35_54"] = data[selYaxis][grp];
              break;
            case "55-74 years":
              yData["s55_74"] = data[selYaxis][grp];
              break;
            case "75+ years":
              yData["s75plus"] = data[selYaxis][grp];
              break;
            default:
              console.log("Error in age group")
          }
        })
        cData.push(yData);
        return availGrps
      });


      maxs5_14 = d3.max(cData,d=> d['s5_14']);
      maxs15_24 = d3.max(cData,d=> d['s15_24']);
      maxs25_34 = d3.max(cData,d=> d['s25_34']);
      maxs35_54 = d3.max(cData,d=> d['s35_54']);
      maxs55_74 = d3.max(cData,d=> d['s55_74']);
      maxs75 = d3.max(cData,d=> d['s75plus']);

      yMAX = Math.max(maxs5_14,maxs15_24,maxs25_34,maxs35_54,maxs55_74,maxs75)

      years = d3.extent(cData,d=> d.year);

      let chartArea = d3.select("#linePlot").select("svg").select(".chartGroup");
    
      // Clear svg is not empty
      if (!chartArea.empty()) {
        chartArea.remove();
      };

            // Append group element
      let chartGroup = svg.append("g")
      .classed("chartGroup",true)
      .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

      //Create x and y linear scales
      let xLinearScale = d3.scaleLinear()
      .domain(years)
      .range([0, width]);

      let yLinearScale = d3.scaleLinear()
      .domain([0,yMAX])
      .range([height, 0]);
  
      // // create axes
      let bottomAxis = d3.axisBottom(xLinearScale).tickFormat(d3.format("d"));
      let leftAxis = d3.axisLeft(yLinearScale);
  
      // append axes
      let xAxis= chartGroup.append("g")
        .classed("x-axis",true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
  
      let yAxis= chartGroup.append("g")
        .classed("y-axis",true)
        .call(leftAxis);


      let titleArea = d3.select("#linePlot").select("svg").select(".title");
  
      // Clear svg is not empty
      if (!titleArea.empty()) {
        titleArea.remove();
      };
      let countryName = countryData[0].country;

      let title = svg.append("text")
      .classed("title",true)
      .attr("x", chartMargin.left + 200)             
      .attr("y", chartMargin.top-30)
      .attr("text-anchor", "middle")  
      .style("color","black")
      .style("font-weight","bold")
      .style("font-size", "20px") 
      .style("text-decoration", "underline")  
      .text(`Historical suicide data for ${countryName} (${country_code})`)
  
      let xLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
      let yearLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "year") // value to grab for event listener
      .classed("active", true)
      .text("Year");
  
      let yLabelsGroup = chartGroup.append("g")
      .attr("transform",`translate(${chartMargin.left},0)`);
  
      let femaleLabel = yLabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0- chartMargin.left - 60)
      .attr("x", 0 - (height*0.5))
      .attr("dy", "1em")
      .attr("value", "female") // value to grab for event listener
      .classed("active", true)
      .text("FEMALE suicide rate (per 100K)");
  
      let maleLabel = yLabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - chartMargin.left - 85)
      .attr("x", 0 - ((height*0.5)))
      .attr("dy", "1em")
      .attr("value", "male") // value to grab for event listener
      .classed("inactive", true)
      .text("MALE suicide rate (per 100K)");

      // Line generator for morning data
      let line1 = d3.line()
        .defined(d => !isNaN(d.s5_14)) //removes NAN values
        .x(d => xLinearScale(d.year))
        .y(d => yLinearScale(d.s5_14));

      let line2 = d3.line()
      .x(d => xLinearScale(d.year))
      .y(d => yLinearScale(d.s15_24));

      let line3 = d3.line()
      .x(d => xLinearScale(d.year))
      .y(d => yLinearScale(d.s25_34));

      let line4 = d3.line()
      .x(d => xLinearScale(d.year))
      .y(d => yLinearScale(d.s35_54));

      let line5 = d3.line()
      .x(d => xLinearScale(d.year))
      .y(d => yLinearScale(d.s55_74));

      let line6 = d3.line()
      .x(d => xLinearScale(d.year))
      .y(d => yLinearScale(d.s75plus));

      // Append a path for line1

      let linesGroup = chartGroup.append("g")

      linesGroup
      .append("path")
      .attr("d", line1(cData))
      .classed("line s5_14", true);

      linesGroup
      .append("path")
      .attr("d", line2(cData))
      .classed("line s15_24", true); 

      linesGroup
      .append("path")
      .attr("d", line3(cData))
      .classed("line s25_34", true); 

      linesGroup
      .append("path")
      .attr("d", line4(cData))
      .classed("line s35_54", true); 

      linesGroup
      .append("path")
      .attr("d", line5(cData))
      .classed("line s55_74", true); 

      linesGroup
      .append("path")
      .attr("d", line6(cData))
      .classed("line s75plus", true); 

      let toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([150, 70])
      .html(function(d) {
        return (`<strong>${country_code}</strong><br>(data from: ${d.year})<hr>Suicide rates (${selYaxis})<hr>Age 5-14: ${d.s5_14}<br>Age 15-24: ${d.s15_24}<br>Age 25-34: ${d.s25_34}<br>Age 35-54: ${d.s35_54}<br>Age 55-74: ${d.s55_74}<br>Age 75+: ${d.s75plus}`);
      });

      let circlesGroup = chartGroup.selectAll("circle")
      .data(cData)
      .enter()
      .append("g")

     circlesGroup
     .append("circle")
      .attr("id","s5_14")
      .attr("cx", d => xLinearScale(d.year))
      .attr("cy", d => yLinearScale(d.s5_14))
      .attr("r", function(d) { return d.s5_14 == undefined ? 0 : 3; })
      .attr("fill", color[0])


      circlesGroup
      .append("circle")
      .attr("id","s15_24")
      .attr("cx", d => xLinearScale(d.year))
      .attr("cy", d => yLinearScale(d.s15_24))
      .attr("r", "3")
      .attr("fill", color[1]);

      circlesGroup
      .append("circle")
      .attr("id","s25_34")
      .attr("cx", d => xLinearScale(d.year))
      .attr("cy", d => yLinearScale(d.s25_34))
      .attr("r", "3")
      .attr("fill", color[2]);

      circlesGroup
      .append("circle")
      .attr("id","s35_54")
      .attr("cx", d => xLinearScale(d.year))
      .attr("cy", d => yLinearScale(d.s35_54))
      .attr("r", "3")
      .attr("fill", color[3]);

      circlesGroup
      .append("circle")
      .attr("id","s55_74")
      .attr("cx", d => xLinearScale(d.year))
      .attr("cy", d => yLinearScale(d.s55_74))
      .attr("r", "3")
      .attr("fill", color[4]);

      circlesGroup
      .append("circle")
      .attr("id","s75plus")
      .attr("cx", d => xLinearScale(d.year))
      .attr("cy", d => yLinearScale(d.s75plus))
      .attr("r", "3")
      .attr("fill", color[5]);
      
      circlesGroup.call(toolTip);

      // Step 2: Create "mouseover" event listener to display tooltip
      circlesGroup.on("mouseover",d=>{
        toolTip.show(d,this)
      }).on("mouseout", (d,i)=> {
        toolTip.hide(d)
      });

    // y axis labels event listener
    yLabelsGroup.selectAll("text")
    .on("click", function() {
  
      // get value of selection
      let Yvalue = d3.select(this).attr("value");
      if (Yvalue !== selYaxis) {
  
        // Get value of selected y-axis
        selYaxis = Yvalue;

        let mData = [];

        countryData.forEach(data => {
          let yData = {};
          yData["year"] = data.year
          availGrps = Object.keys(data[selYaxis]);
          availGrps.forEach(grp => {
            switch (grp) {
              case "5-14 years":
                yData["s5_14"] = data[selYaxis][grp];
                break;
              case "15-24 years":
                yData["s15_24"] = data[selYaxis][grp];
                break;
              case "25-34 years":
                yData["s25_34"] = data[selYaxis][grp];
                break;
              case "35-54 years":
                yData["s35_54"] = data[selYaxis][grp];
                break;
              case "55-74 years":
                yData["s55_74"] = data[selYaxis][grp];
                break;
              case "75+ years":
                yData["s75plus"] = data[selYaxis][grp];
                break;
              default:
                console.log("Error in age group")
            }
          })
          mData.push(yData);
          return availGrps
        });

        maxs5_14 = d3.max(mData,d=> d['s5_14']);
        maxs15_24 = d3.max(mData,d=> d['s15_24']);
        maxs25_34 = d3.max(mData,d=> d['s25_34']);
        maxs35_54 = d3.max(mData,d=> d['s35_54']);
        maxs55_74 = d3.max(mData,d=> d['s55_74']);
        maxs75 = d3.max(mData,d=> d['s75plus']);

        mMAX = Math.max(maxs5_14,maxs15_24,maxs25_34,maxs35_54,maxs55_74,maxs75)

        let yLinearScale = d3.scaleLinear()
        .domain([0,mMAX])
        .range([height, 0]);
    
        // // create axes
        bottomAxis = d3.axisBottom(xLinearScale);
        leftAxis = renderYaxes(yLinearScale, yAxis);

        line1.y(d => yLinearScale(d.s5_14))
        .defined(d => !isNaN(d.s5_14)); //removes NAN values;
        linesGroup
        .transition()
        .duration(1000)
        .select(".s5_14")
        .attr("d", line1(mData));

        line2.y(d => yLinearScale(d.s15_24));
        linesGroup
        .transition()
        .duration(1000)
        .select(".s15_24")
        .attr("d", line2(mData));

        line3.y(d => yLinearScale(d.s25_34));
        linesGroup
        .transition()
        .duration(1000)
        .select(".s25_34")
        .attr("d", line3(mData));

        line4.y(d => yLinearScale(d.s35_54));
        linesGroup
        .transition()
        .duration(1000)
        .select(".s35_54")
        .attr("d", line4(mData));

        line5.y(d => yLinearScale(d.s55_74));
        linesGroup
        .transition()
        .duration(1000)
        .select(".s55_74")
        .attr("d", line5(mData));

        line6.y(d => yLinearScale(d.s75plus));
        linesGroup
        .transition()
        .duration(1000)
        .select(".s75plus")
        .attr("d", line6(mData));

        circlesGroup.select("#s5_14")
        .data(mData)
        .transition()
        .duration(1000)
        .attr("cy", d => yLinearScale(d.s5_14))
        .attr("r", function(d) { return d.s5_14 == undefined ? 0 : 3; })

        circlesGroup.select("#s15_24")
        .data(mData)
        .transition()
        .duration(1000)
        .attr("cy", d => yLinearScale(d.s15_24))

        circlesGroup.select("#s25_34")
        .data(mData)
        .transition()
        .duration(1000)
        .attr("cy", d => yLinearScale(d.s25_34))

        circlesGroup.select("#s35_54")
        .data(mData)
        .transition()
        .duration(1000)
        .attr("cy", d => yLinearScale(d.s35_54))

        circlesGroup.select("#s55_74")
        .data(mData)
        .transition()
        .duration(1000)
        .attr("cy", d => yLinearScale(d.s55_74))

        circlesGroup.select("#s75plus")
        .data(mData)
        .transition()
        .duration(1000)
        .attr("cy", d => yLinearScale(d.s75plus))

        let ylabel;

        switch(selYaxis) {
          case "female":
            ylabel = "FEMALE suicide rate (per 100K)"
            break;
          case "male":
            ylabel = "MALE suicide rate (per 100K)"
            break;
          default:
            ylabel = "Error in Y";
        };

        let toolTip = d3.tip()
        .attr("class", "tooltip")
        .html(function(d) {
          return (`<strong>${country_code}</strong><br>(data from: ${d.year})<hr>Suicide rates (${selYaxis})<hr>Age 5-14: ${d.s5_14}<br>Age 15-24: ${d.s15_24}<br>Age 25-34: ${d.s25_34}<br>Age 35-54: ${d.s35_54}<br>Age 55-74: ${d.s55_74}<br>Age 75+: ${d.s75plus}`);
        });

        circlesGroup.data(mData).call(toolTip);

        // Step 2: Create "mouseover" event listener to display tooltip
        circlesGroup.on("mouseover",d=>{
          toolTip.show(d,this)
          .style('top', (d3.event.pageY + 10)+'px')
          .style('left', (d3.event.pageX + 10)+'px');
        }).on("mouseout", (d,i)=> {
          toolTip.hide(d)
        });

        switch(selYaxis) {
          case "male":
            maleLabel
              .classed("active", true)
              .classed("inactive", false);
            femaleLabel
              .classed("active", false)
              .classed("inactive", true);
            break;
          case "female":
            maleLabel
              .classed("active", false)
              .classed("inactive", true);
            femaleLabel
              .classed("active", true)
              .classed("inactive", false);
            break;
          default:
            maleLabel
              .classed("active", false)
              .classed("inactive", true);
            femaleLabel
              .classed("active", false)
              .classed("inactive", true);
        }; //end of switch
  }
}); //end of y-axis listener
  
}); //end of JSON read
}; // end of init
d3.select("#selDataset").on("change",optionChanged);
    } //end of responsive function
    
    // When the browser loads, makeResponsive() is called.
    makeResponsive();
    
    // When the browser window is resized, makeResponsive() is called.
    d3.select(window).on("resize", makeResponsive);


