 /*
 * household.js
 * expenses charts for economie
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, d3, household, dc, crossfilter */
 
household = (function(){
       'use strict';
       //---------------- BEGIN MODULE SCOPE VARIABLES --------------
       var configMap = {
           
           main_html : String()
             + '<div class="content">'
               + '<div class="container">'
           
                       + '<div class="row">'
                           + '<div class="span6" id="dc-day-chart">'
                             + '<h4>Daily Expenses</h4>'
                           + '</div>'
                       + '</div>'
                       
                       + '<div class="row">'
                           + '<div class="span4" id="dc-month-chart">'
                               + '<h4>Monthly Expenses</h4>'                        
                           + '</div>'
                           + '<div class="span4" id="dc-detail-chart">'
                               + '<h4>Expense by Location</h4>'
                           + '</div>'                           
                           + '<div class="span4" id="dc-name-chart">'
                               + '<h4>Expense by user</h4>'
                           + '</div>'
                       + '</div>'
                       
                       + '<div class="row">'
                           + '<div class="span12" id="table-chart">'
                               + '<h4>Expense Details</h4>'
                               + '<table class="table table-hover" id="dc-table-graph">'
                                   + '<thead>'
                                       + '<tr class="header">'
                                         + '<th>Date</th>'
                                         + '<th>Amount</th>'
                                         + '<th>Detail</th>'
                                         + '<th>Who</th>'
                                         + '<th>Update</th>'
                                         + '<th>Delete</th>'
                                       + '</tr>'                            
                                   + '</thead>'                        
                               + '</table>'
                       
                           + '</div>'    
                       + '</div>'            
           
               + '</div>'
             + '</div>'
                 
       },       
       stateMap  = {
           $append_target   : null          
       },
              
       dayChart, monthChart, nameChart, dataTable, detailChart,               
       
       dtgFormat2, monthNames, parseDate,                
       setJqueryMap, generate,
       initModule;
       
        
       //Utilities
       parseDate = d3.time.format("%Y-%b-%d");              
       dtgFormat2 = d3.time.format("%a %e %b");    
       monthNames = [ "jan", "feb", "mar", "apr", "may", "jun",
                           "jul", "aug", "sep", "oct", "nov", "dec" ];
       
       
       /* plots dc.js charts */
       generate = function(data) {
       
              var
              facts,
              dayDimension, dayDimensionGroup,
              monthDimension, monthDimensionGroup,
              nameDimension, nameDimensionGroup,
              detailDimension, detailDimensionGroup,
              all,allDetail, 
              
              
              margins_template,                
              span_height, span4_width, span6_width, span12_width,
              
                             
              
              start_dayChart, end_dayChart,
              start_monthChart, end_monthChart
              ;
                     
              
              //formatting and utilities
              margins_template = {top: 10, right: 10, bottom: 80, left: 60};
              span_height = 350;
              span4_width = 300;
              span6_width = 450;
              span12_width = 900;
              
              
              data.forEach(function(d) {
                
                     d.date = parseDate.parse(d.date);
                     d.month = d3.time.month(d.date);
                     d.year = d.date.getFullYear().toString();
                     d._month = monthNames[d.date.getMonth()];
                     d.day = d.date.getDate().toString();
                     d.amount = d.amount.toFixed(2);
                     d.update_url = ['<a href="',['receipt/update',d.pk,'">Update</a>'].join('/')].join('');
                     d.delete_url = ['<a href="',['receipt',d.pk,'delete','">Delete</a>'].join('/')].join('');
              
              });
          
                       
              // Run the data through crossfilter and load our 'facts'
              facts = crossfilter(data);                
              
              // Create dataTable dimension
              dayDimension = facts.dimension(function(d) { return d3.time.day(d.date); });
              dayDimensionGroup = dayDimension.group().reduceSum(function(d) { return d.amount; });                
             
              monthDimension = facts.dimension(function(d) { return d.month; });
              monthDimensionGroup = monthDimension.group().reduceSum(function(d) { return d.amount; }); 
              
              nameDimension = facts.dimension(function(d) { return d.name; });
              nameDimensionGroup = nameDimension.group().reduceSum(function(d) { return d.amount; });                
                         
              detailDimension = facts.dimension(function(d) { return d.detail; });
              detailDimensionGroup = detailDimension.group().reduceSum(function(d) { return d.amount; });
              
              all = facts.groupAll();
              
              allDetail = all.reduceSum( function(d) { return d.amount; } );
                                       
              //// Receipts by day
              start_dayChart = d3.time.day.offset(d3.extent(data, function(d){ return d.date; })[0], -1);
              end_dayChart  = d3.time.day.offset(d3.extent(data, function(d){ return d.date; })[1], +1);
              dayChart.width(span12_width)
                      .height(span_height)
                      .margins(margins_template)
                      .dimension(dayDimension)
                      .group(dayDimensionGroup)
                      .transitionDuration(500)
                      .centerBar(true)
                      .gap(5)
                      .xUnits(d3.time.days)
                      .x(d3.time.scale().domain([start_dayChart, end_dayChart]) )
                      .elasticY(true)
                      .xAxis();
                      
                                 
              //// Receipts by month
              start_monthChart = d3.time.month.offset(d3.extent(data, function(d){ return d.month; })[0], -1);
              end_monthChart  = d3.time.month.offset(d3.extent(data, function(d){ return d.month; })[1], +10);
              monthChart.width(span4_width)
                       .height(span_height)
                       .margins(margins_template)
                       .dimension(monthDimension)
                       .group(monthDimensionGroup)
                       .transitionDuration(500)
                       .centerBar(false)
                       .xUnits(d3.time.months)
                       .gap(4)
                       .x(d3.time.scale().domain([start_monthChart, end_monthChart ]))
                       .elasticY(true)
                       .xAxis();
       
                             
              //// Receipts by name
              nameChart.width(span4_width)
                          .height(span_height)
                          .margins(margins_template)
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
                          .x(d3.scale.ordinal().domain( data.map(function (d) { return d.name; }) ) )
                          .xAxis();                  
            
            
               //// Receipts by location detail
               detailChart
                     .width(span4_width) 
                     .height(span_height)
                     .radius((span4_width/2.5)) 
                     .label(function (d) {
                            return d.data.key;
                     })
                     .renderLabel(true)
                      .colors(d3.scale.category10())
                     .transitionDuration(500)
                     .dimension(detailDimension) 
                     .group(detailDimensionGroup);
                     
                     
              // Table of receipt data
              dataTable.width( span12_width )
                  .dimension( dayDimension )
                  .group(function() {
                      return "expenditures";
                  })
                  .size(100)
                  .columns([
                    function(d) { return d.date.toDateString(); },
                    function(d) { return d.amount; },
                    function(d) { return d.detail; },
                    function(d) { return d.name; },
                    function(d) { return d.update_url;},
                    function(d) { return d.delete_url;}
                ]);
              
              
              // Render the Charts
              dc.renderAll();       
              
              // Post rendering formatting of x tickl labels
              d3.select("#dc-month-chart .axis.x")
                     .selectAll("text")
                     .style("text-anchor", "end")
                     .attr("dx", "-.8em")
                     .attr("dy", ".15em")
                     .attr("transform", function() {
                       return "rotate(-45)";
                     });
              
              d3.select("#dc-day-chart .axis.x")
                     .selectAll("text")
                     .style("text-anchor", "end")
                     .attr("dx", "-.8em")
                     .attr("dy", ".15em")
                     .attr("transform", function() {
                       return "rotate(-45)";
                     });

              d3.select("#dc-name-chart .axis.x")
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", "1em")
                    .attr("transform", function() {
                     return "rotate(-45)";
                    });
       }
       
       //------------------- BEGIN PUBLIC METHODS ---------------------
       
       // Begin public method /initModule/
       // Example    : economie.household.initModule( $('#div_id') );
       // Purpose    :
       //   Directs household to append charts to the offered container
       // Arguments  :
       //   * $append_target (example: $('#div_id')).
       //     A jQuery collection that should represent
       //     a single DOM container
       // Action     :
       //   Appends the charts to the provided container and fills
       //   it with HTML content.  It then initializes elements,
       //   events, and handlers to provide the graphical 
       //   interface
       // Returns    : true on success, false on failure
       // Throws     : none
       
       initModule = function ( $append_target ) {
           
              //console.log("inside initModule");
              
              // load chat slider html and jquery cache
              stateMap.$append_target = $append_target;
              $append_target.append( configMap.main_html );
                      
              // initialize chat slider to default title and state
              
              // Create the dc.js chart objects & link to div
              detailChart = dc.pieChart("#dc-detail-chart");
              dayChart = dc.barChart("#dc-day-chart");
              monthChart = dc.barChart("#dc-month-chart");
              nameChart = dc.barChart("#dc-name-chart");
              dataTable = dc.dataTable("#dc-table-graph");
              
              $.ajax({
                 type: "GET",
                 url: "/household/receipt/json/",
                 dataType: "json",
                 success: function(data){ generate(data); }               
              });
       
                           
       };
       // End public method /initModule/
       
       // return public methods
       return { initModule : initModule };
       
       //------------------- END PUBLIC METHODS ---------------------

})();
 