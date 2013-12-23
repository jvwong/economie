 $(document).ready(function(){
        
        // Create the dc.js chart objects & link to div
        var dayChart = dc.barChart("#dc-day-chart");
        var nameChart = dc.barChart("#dc-name-chart");
        var monthChart = dc.barChart("#dc-month-chart");
        var dataTable = dc.dataTable("#dc-table-graph");
        
        var div = d3.select("body").append("div")   
                                    .attr("class", "tooltip")               
                                    .style("opacity", 0);
        var dtgFormat2 = d3.time.format("%a %e %b");

        var monthNames = [ "jan", "feb", "mar", "apr", "may", "jun",
                            "jul", "aug", "sep", "oct", "nov", "dec" ];
        
       $.ajax({
              type: "GET",
              url: "/household/receipt/json/",
              dataType: "json",
              success: function(response){                     
                     generate(response);
              }           
       });
        
        
        function generate(data) {


          var parseDate = d3.time.format("%Y-%b-%d");
          data.forEach(function(d) {
              
              d.date = parseDate.parse(d.date);
              d.month = d3.time.month(d.date);
              d.year = d.date.getFullYear().toString();
              d._month = monthNames[d.date.getMonth()];
              d.day = d.date.getDate().toString();
              d.amount = d.amount;
              d.detail = d.detail;
              d.name = d.name;
              d.pk = d.pk;
              d.detail_url = ['<a href="',['receipt',d.year,d._month , d.day,d.pk,'">Detail</a>'].join('/')].join('');
              d.update_url = ['<a href="',['receipt/update',d.pk,'">Update</a>'].join('/')].join('');
              d.delete_url = ['<a href="',['receipt',d.pk,'delete','">Delete</a>'].join('/')].join('');
            
            });
          
            //console.log(data);
                     
            // Run the data through crossfilter and load our 'facts'
            var facts = crossfilter(data);
            
            
            // Create dataTable dimension
            var dayDimension = facts.dimension(function(d) { return d3.time.day(d.date); })
            var dayDimensionGroup = dayDimension.group()
                    .reduceSum(function(d) { return d.amount; });                
           
            var nameDimension = facts.dimension(function(d) { return d.name; })
            var nameDimensionGroup = nameDimension.group()
                    .reduceSum(function(d) { return d.amount; });                
            
            var monthDimension = facts.dimension(function(d) {
                                                    return d.month; })
            var monthDimensionGroup = monthDimension.group()
                                                    .reduceSum(function(d) { return d.amount; }); 
            
                                                  
            var margins_template = {top: 10, right: 10, bottom: 80, left: 100};
            
            var span_height = 350;
            var span6_width = 450;
            var span12_width = 800;
                       
            // Setup the charts
            // Table of earthquake data
            dataTable.width( span12_width )
                .dimension( dayDimension )
                .group(function(d) {
                    return "expenditures";
                })
                .size(100)
                .columns([
                  function(d) { return d.date.toDateString(); },
                  function(d) { return d.amount; },
                  function(d) { return d.detail; },
                  function(d) { return d.name; },
                  function(d) { return d.detail_url;},
                  function(d) { return d.update_url;},
                  function(d) { return d.delete_url;}
              ]);
           
            
            var start_dayChart = d3.time.day.offset(d3.extent(data, function(d){ return d.date; })[0], -1);
            var end_dayChart  = d3.time.day.offset(d3.extent(data, function(d){ return d.date; })[1], +1);
           
            //// time graph
            dayChart.width(span12_width)
                    .height(span_height)
                    .margins(margins_template)
                    .dimension(dayDimension)
                    .group(dayDimensionGroup)
                    .transitionDuration(500)
                    .centerBar(true)
                    .gap(2)
                    .xUnits(d3.time.days)
                    .x(d3.time.scale().domain([start_dayChart, end_dayChart]) )
                    .elasticY(true)
                    .xAxis();
           
            // time graph
            nameChart.width(span6_width)
                        .height(span_height)
                        .margins({top: 20, right: 10, bottom: 80, left: 80})
                        .dimension(nameDimension)
                        .group(nameDimensionGroup)
                        .transitionDuration(500)
                        .brushOn(false)
                        .title(function(d){
                            return "Total: $" + d.value;
                        })
                        .centerBar(false)
                        .gap(25)                        
                        .elasticY(true)
                        .xUnits(dc.units.ordinal)
                        .x(d3.scale.ordinal().domain( data.map(function (d) {return d.name; }) ) )
                        .xAxis();                  
            
              console.log( (data.map(function (d) {return d.name; })) );
              
           var start_monthChart = d3.time.month.offset(d3.extent(data, function(d){ return d.month; })[0], -1);
           var end_monthChart  = d3.time.month.offset(d3.extent(data, function(d){ return d.month; })[1], +10);
                 
           //// time graph
           monthChart.width(span6_width)
                    .height(span_height)
                    .margins(margins_template)
                    .dimension(monthDimension)
                    .group(monthDimensionGroup)
                    .transitionDuration(500)
                    .centerBar(true)
                    .xUnits(d3.time.months)
                    .gap(10)
                    .x(d3.time.scale().domain([start_monthChart, end_monthChart ]))
                    .elasticY(true)
                    .xAxis();
             
           // Render the Charts
           dc.renderAll();
           
           d3.select("#dc-day-chart .axis.x")
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", function(d) {
                    return "rotate(-45)"
                });
           
            d3.select("#dc-month-chart .axis.x")
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", function(d) {
                    return "rotate(-90)"
                });
        
       }     
        
        
        
       
    });