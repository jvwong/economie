$(document).ready(function(){
     
     /*Global variables */
     var purchase_price; 
     var downpayment_percent;
     var downpayment;
     var appreciation_rate; 
     var interest_rate;
     var amortization;
     var property_tax_rate;
     var maintainance; 
     var dues; 
     var insurance;
     var appreciation_rate;
     var income_tax_rate; 
     var inflation_rate;     
     var mortgage_payment; 
     var mortage; 
     var insurance_payment_monthly; 
     var housing_monthly;
     var maintenance_monthly; 
     var rent; 
     var rent_inflation_rate;
     var return_cash_rate;
     var t_s;
     var horizon = 10;
     var numMonths = horizon*12;

     /*Chart specific */
     var color = d3.scale.category10();
                         
     var  margin = {top: 15, right: 5, bottom: 60, left: 80},
     width = 500 - margin.left - margin.right,
     height = 350 - margin.top - margin.bottom;
     
     var parseDate = d3.time.format("%d-%b-%y").parse;
         
     
     var xScale = d3.time.scale()
                   .range([0, width]);
     
     var yScale = d3.scale.linear()
                   .range([height, 0]);
     
     
     /*set up the chart*/ 
     var xAxis = d3.svg.axis()
                   .scale(xScale)
                   .orient("bottom");
                   
     var yAxis = d3.svg.axis()
                   .scale(yScale)
                   .orient("left");
              
     var line = d3.svg.line()
                  .x(function(d) { return xScale(d.date); })
                  .y(function(d) { return yScale(d.amount); })
                  .interpolate("linear");
     
     var svg_1 = d3.select("#graph1")
                         .append("svg")
                         .attr("width", width + margin.left + margin.right)
                         .attr("height", height + margin.top + margin.bottom)
                         .append("g")
                         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
     
     var svg_2 = d3.select("#graph2")
                         .append("svg")
                         .attr("width", width + margin.left + margin.right)
                         .attr("height", height + margin.top + margin.bottom)
                         .append("g")
                         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                         
     function makeChart(container, data) {          
          
          color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));
         
          var quantities = color.domain().map(function(name) {
               return {
                         name: name,
                         values: data.map(function(d) {
                              return {date: d.date, amount: +d[name]};
                         })
               };
          });
          
          xScale.domain(d3.extent(data, function(d) { return d.date; }));
          yScale.domain([
                         d3.min(quantities, function(c) { return d3.min(c.values, function(v) { return v.amount; }); }),
                         d3.max(quantities, function(c) { return d3.max(c.values, function(v) { return v.amount; }); })
                   ]);          
          
          //Add the X axis
          container.append("g")
               .attr("class", "x axis")
               .attr("transform", "translate(0," + height + ")")
               .call(xAxis)
               .append("text")
               .attr("transform", "translate(" + (width/2) + "," + (margin.bottom - 10) + ")")
               .text("Date")
               .attr("font-size", "1.2em");          
          
          //Add the Y axis
          container.append("g")
               .attr("class", "y axis")
               .call(yAxis)
               .append("text")
               .attr("transform", "rotate(-90)")
               .attr("x", -height/2 + 20)
               .attr("y", -margin.left)
               .attr("dy", "1em")
               .style("text-anchor", "end")
               .text("Amount ($)")
               .attr("font-size", "1.2em");
               
          var quantity = container.selectAll(".quantity")
                         .data(quantities)
                         .enter().append("g")
                         .attr("class", "quantity");
                         
          //console.log(quantity);
          quantity.append("path")
               .attr("class", "line")
               .attr("d", function(d) { return line(d.values); })
               .attr("data-legend",function(d) { return d.name})
               .style("stroke", function(d) { return color(d.name); });
          
          
          legend = container.append("g")
                         .attr("class","legend")
                         .attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")")
                         .style("font-size","1em")
                         .call(d3.legend);
       
     };//end makeChart
     
     function updateChart(chart_id, data, idx) {
          //console.log(data.length);
          color.domain(d3.keys(data[idx][0]).filter(function(key) { return key !== "date"; }));
          
          var quantities_u = color.domain().map(function(name) {
               return {
                         name: name,
                         values: data[idx].map(function(d) {
                              return {date: d.date, amount: +d[name]};
                         })
               };
          });
          
          xScale.domain(d3.extent(data[idx], function(d) { return d.date; }));
          yScale.domain([
                              d3.min(quantities_u, function(c) { return d3.min(c.values, function(v) { return v.amount; }); }),
                              d3.max(quantities_u, function(c) { return d3.max(c.values, function(v) { return v.amount; }); })
                         ]);          
          
          
          var svg_u = d3.select(chart_id);     
          var t_duration = 500;
          
          var path_u = svg_u.selectAll("path.line")
                              .data(quantities_u);
          path_u.enter()
                .append("path")
                .attr("class", "line");          
          path_u.transition()
                .duration(t_duration)
                .attr("d", function(d) { return line(d.values); })
                .style("stroke", function(d) { return color(d.name); });
          path_u.exit().remove();
                                     
          /*Update the X axis*/
          svg_u.select(".x.axis") // change the x axis
               .transition()
               .duration(t_duration)
               .call(xAxis);

          /*Update the Y axis*/
          svg_u.select(".y.axis") // change the y axis
               .transition()
               .duration(t_duration)
               .call(yAxis);
               
          ////console.log(data);     
          updateTotals(data[2], data[3]);
     }
     
     function updateTotals(equity, savings) {
          var last = savings[0].length - 1 ;
          var homeValue = savings[3][last];
          var debt = savings[4][last];
          var transaction = homeValue*0.06;
          var equity = equity[last];
          var net = equity - transaction;
          var savings = savings[0][last];
          var years = numMonths/12;
          var benefit = (net - savings)/(Math.pow((1 + inflation_rate*0.01), years));
          
          
          $('#total-value').html(homeValue.toFixed(0));
          $('#total-debt').html(debt.toFixed(0));
          $('#total-equity').html(equity.toFixed(0));
          $('#total-transaction').html(transaction.toFixed(0));
          
          $('#total-net').html(net.toFixed(0));
          $('#total-savings').html(savings.toFixed(0));
          $('#total-benefit').html(benefit.toFixed(0));          
     }
     
     function initSliders(numMonths) {
          $("#horizon_slider").slider({ value: horizon,
                                        max: 30,
                                        min: 1,
                                        step: 1,
                                        change: function( event, ui ) {
                                                  horizon = ui.value;
                                                  numMonths = horizon*12;
                                                  updateParams();
                                                  t_s = get_time_series(numMonths); updateChart("#graph1", t_s, 0); updateChart("#graph2", t_s, 1);                                                  
                                                },
                                                
                                         slide: function( event, ui ) {
                                             $("#horizon").val( ui.value + " years");
                                         }
                                    });
         
         
         $("#purchase_price_slider").slider({ value: 750000,
                                        max: 1000000,
                                        min: 100000,
                                        step: 10000,
                                        change: function( event, ui ) {
                                                  purchase_price = ui.value;
                                                  updateParams();
                                                  t_s = get_time_series(numMonths); updateChart("#graph1", t_s, 0); updateChart("#graph2", t_s, 1);
                                                  mortgage_payment = fmortgage_payment(purchase_price, downpayment, interest_rate, amortization);
                                                },
                                                
                                         slide: function( event, ui ) {
                                             $("#purchase_price").val( "$" + ui.value );
                                         }
                                    });
         
         //$('#purchase_price').on("change", function(event){
         //      purchase_price = parseFloat(event.currentTarget.value)
         //      updateParams();
         //      t_s = get_time_series(numMonths); updateChart("#graph1", t_s, 0); updateChart("#graph2", t_s, 1);                                                  
         //      //console.log(parseFloat(event.currentTarget.value));
         // });
         
         $("#downpayment_slider").slider({  value: 20,
                                     max: 100,
                                     min: 0,
                                     step: 5,
                                     change: function( event, ui ) {
                                                  downpayment_percent = ui.value;
                                                  updateParams();
                                                  t_s = get_time_series(numMonths); updateChart("#graph1", t_s, 0); updateChart("#graph2", t_s, 1);
                                             },
                                     slide: function( event, ui ) {
                                             $("#downpayment").val( ui.value + "% ($" + (ui.value*0.01*purchase_price) +  ")" );                                             
                                         }
                                    });
         
          $("#interest_rate_slider").slider({
                                             value: 6,
                                             max: 8,
                                             min: 0,
                                             step: 0.10,
                                             change: function( event, ui ) {
                                                          interest_rate = ui.value;
                                                          updateParams();
                                                          t_s = get_time_series(numMonths); updateChart("#graph1", t_s, 0); updateChart("#graph2", t_s, 1);
                                                     },
                                             slide: function( event, ui ) {
                                                     $("#interest_rate").val( ui.value + "%" );
                                                 }
                                             });
          
          $("#amortization_slider").slider({
                                             value: 30,
                                             max: 50,
                                             min: 0,
                                             step: 5,
                                             change: function( event, ui ) {
                                                          amortization = ui.value;
                                                          updateParams();
                                                          t_s = get_time_series(numMonths); updateChart("#graph1", t_s, 0); updateChart("#graph2", t_s, 1);
                                                     },
                                             slide: function( event, ui ) {
                                                     $("#amortization").val( ui.value + " years" );
                                                 }
                                             });
          
          $("#property_tax_rate_slider").slider({
                                             value: 1.00,
                                             max: 3,
                                             min: 0,
                                             step: 0.05,
                                             change: function( event, ui ) {
                                                          property_tax_rate = ui.value;
                                                          updateParams();
                                                          t_s = get_time_series(numMonths); updateChart("#graph1", t_s, 0); updateChart("#graph2", t_s, 1);
                                                     },
                                             slide: function( event, ui ) {
                                                     $("#property_tax_rate").val( ui.value + "%" );
                                                 }
                                             });
          
          $("#maintainance_slider").slider({
                                             value: 1000,
                                             max: 10000,
                                             min: 0,
                                             step: 250,
                                             change: function( event, ui ) {
                                                          maintainance = ui.value;
                                                          maintenance_monthly = maintainance/12;
                                                          updateParams();
                                                          t_s = get_time_series(numMonths); updateChart("#graph1", t_s, 0); updateChart("#graph2", t_s, 1);
                                                     },
                                             slide: function( event, ui ) {
                                                     $("#maintainance").val( "$" + ui.value  );
                                                 }
                                             });
          
          $("#dues_slider").slider({
                                             value: 2000,
                                             max: 10000,
                                             min: 0,
                                             step: 250,
                                             change: function( event, ui ) {
                                                          dues = ui.value;
                                                          housing_monthly = dues / 12;
                                                          updateParams();
                                                          t_s = get_time_series(numMonths); updateChart("#graph1", t_s, 0); updateChart("#graph2", t_s, 1);
                                                     },
                                             slide: function( event, ui ) {
                                                     $("#dues").val( "$" + ui.value  );
                                                 }
                                             });
          
          
          $("#insurance_slider").slider({
                                             value: 1500,
                                             max: 10000,
                                             min: 0,
                                             step: 250,
                                             change: function( event, ui ) {
                                                          insurance = ui.value;
                                                          insurance_payment_monthly = insurance / 12;
                                                          updateParams();
                                                          t_s = get_time_series(numMonths); updateChart("#graph1", t_s, 0); updateChart("#graph2", t_s, 1);
                                                     },
                                             slide: function( event, ui ) {
                                                     $("#insurance").val( "$" + ui.value  );
                                                 }
                                             });
          
          
          $("#appreciation_rate_slider").slider({
                                             value: 3,
                                             max: 10,
                                             min: -10,
                                             step: 0.10,
                                             change: function( event, ui ) {
                                                          appreciation_rate = ui.value;
                                                          updateParams();
                                                          t_s = get_time_series(numMonths); updateChart("#graph1", t_s, 0); updateChart("#graph2", t_s, 1);
                                                     },
                                             slide: function( event, ui ) {
                                                     $("#appreciation_rate").val( ui.value + "%" );
                                                 }
                                             });
          
          $("#income_tax_rate_slider").slider({
                                             value: 30,
                                             max: 100,
                                             min: 0,
                                             step: 1,
                                             change: function( event, ui ) {
                                                          income_tax_rate = ui.value;
                                                          updateParams();
                                                          t_s = get_time_series(numMonths); updateChart("#graph1", t_s, 0); updateChart("#graph2", t_s, 1);
                                                     },
                                             slide: function( event, ui ) {
                                                     $("#income_tax_rate").val( ui.value + "%" );
                                                 }
                                             });
          
          $("#inflation_rate_slider").slider({
                                             value: 2,
                                             max: 8,
                                             min: 0,
                                             step: 0.10,
                                             change: function( event, ui ) {
                                                          inflation_rate = ui.value;
                                                          updateParams();
                                                          t_s = get_time_series(numMonths); updateChart("#graph1", t_s, 0); updateChart("#graph2", t_s, 1);
                                                     },
                                             slide: function( event, ui ) {
                                                     $("#inflation_rate").val( ui.value + "%" );
                                                 }
                                             });
          
          
          
          $("#rent_slider").slider({
                                             value: 2500,
                                             max: 10000,
                                             min: 0,
                                             step: 100,
                                             change: function( event, ui ) {
                                                          rent = ui.value;
                                                          updateParams();
                                                          t_s = get_time_series(numMonths); updateChart("#graph1", t_s, 0); updateChart("#graph2", t_s, 1);
                                                     },
                                             slide: function( event, ui ) {
                                                     $("#rent").val( "$" + ui.value );
                                                 }
                                             });
          
          
          $("#rent_inflation_rate_slider").slider({
                                             value: 3,
                                             max: 8,
                                             min: 0,
                                             step: 0.10,
                                             change: function( event, ui ) {
                                                          rent_inflation_rate = ui.value;
                                                          updateParams();
                                                          t_s = get_time_series(numMonths); updateChart("#graph1", t_s, 0); updateChart("#graph2", t_s, 1);
                                                     },
                                             slide: function( event, ui ) {
                                                     $("#rent_inflation_rate").val( ui.value + "%" );
                                                 }
                                             });
          
          $("#return_cash_rate_slider").slider({
                                             value: 6,
                                             max: 20,
                                             min: 0,
                                             step: 0.10,
                                             change: function( event, ui ) {
                                                          return_cash_rate = ui.value;
                                                          updateParams();
                                                          t_s = get_time_series(numMonths); updateChart("#graph1", t_s, 0); updateChart("#graph2", t_s, 1);
                                                     },
                                             slide: function( event, ui ) {
                                                     $("#return_cash_rate").val( ui.value + "%" );
                                                 }
                                             });
          
        
     }
     
     function updateParams() {
          downpayment = downpayment_percent*0.01*purchase_price;
          mortgage_payment = (purchase_price-downpayment)*(1-1/(1+interest_rate*0.01/12))/(1-1/Math.pow((1+interest_rate*0.01/12),(amortization*12+1)));          
          $('#mortage').val('$' + mortgage_payment.toFixed(2));     
          $('#downpayment').val(downpayment_percent + "% ($" + downpayment + ")" );     
     }
     
     /* Debt calculations */
     function initParams() {
         
          horizon = ($('#horizon_slider').slider("value"));
          $('#horizon').val(horizon + " years");
                    
          purchase_price = $('#purchase_price_slider').slider("value");
          $('#purchase_price').val("$" + purchase_price );
          //purchase_price = parseFloat($('#purchase_price').val());
          
          downpayment_percent = $('#downpayment_slider').slider("value");
          downpayment = downpayment_percent*0.01*purchase_price;
          $('#downpayment').val(downpayment_percent + "% ($" + downpayment + ")" );
          
          interest_rate = $('#interest_rate_slider').slider("value");
          $('#interest_rate').val(interest_rate + "%" );
                    
          amortization =  $('#amortization_slider').slider("value");
          $('#amortization').val( amortization + " years" );
                    
          appreciation_rate = $('#appreciation_rate_slider').slider("value");
          $('#appreciation_rate').val( appreciation_rate + "%" );
          
          property_tax_rate =  $('#property_tax_rate_slider').slider("value");
          $('#property_tax_rate').val( property_tax_rate + "%" );
          
          maintainance =  $('#maintainance_slider').slider("value");
          $('#maintainance').val( "$" + maintainance );
          maintenance_monthly = maintainance / 12;
          
          dues = $('#dues_slider').slider("value");
          $('#dues').val( "$" + dues );
          housing_monthly = dues / 12;
          
          insurance = $('#insurance_slider').slider("value");
          $('#insurance').val( "$" + insurance);
          insurance_payment_monthly = insurance / 12;
          
          appreciation_rate = $('#appreciation_rate_slider').slider("value");
          $('#appreciation_rate').val( appreciation_rate + "%" );
          
          income_tax_rate = $('#income_tax_rate_slider').slider("value");
          $('#income_tax_rate').val( income_tax_rate + "%" );
          
          inflation_rate = $('#inflation_rate_slider').slider("value");
          $('#inflation_rate').val( inflation_rate + "%" );
          
          mortgage_payment = fmortgage_payment(purchase_price, downpayment, interest_rate, amortization);
          $('#mortage').val('$' + mortgage_payment.toFixed(2));
                        
          rent =  $('#rent_slider').slider("value");
          $('#rent').val( "$" + rent );
          
          rent_inflation_rate = $('#rent_inflation_rate_slider').slider("value");
          $('#rent_inflation_rate').val( rent_inflation_rate + "%" );
          
          return_cash_rate = $('#return_cash_rate_slider').slider("value");
          $('#return_cash_rate').val( return_cash_rate + "%" );
          
     }
     
     function fmortgage_payment(purchase_price, downpayment, interest_rate, amortization) {
          var r = 1/(1+interest_rate*0.01/12);
          var s = ((purchase_price-downpayment)*(1-r))/(r-Math.pow(r,(amortization*12+1)));        
          //var s = ((purchase_price-downpayment)*(1-r))/(1-Math.pow(r,(amortization*12+1))); //spreadsheet value       
          return s; 
     }
     
     function homeValue(homeValuei){
          return homeValuei*(1 + (appreciation_rate*0.01)/12);          
     }
     
     function paid_principal(debti){
          return mortgage_payment - interest_on_debt(debti);          
     }
     
     function interest_on_debt(debti){
          return debti * interest_rate*0.01/12;          
     }
     
     function debt(debti, paid_principal){
          return debti - paid_principal;          
     }
          
     function incomeTaxSavings(interest_on_debt, propertyTax){
          return (interest_on_debt + propertyTax)*0.01*income_tax_rate;          
     }
     
     function finsurance_payment_monthly(insurance_paymenti){
          return insurance_paymenti*(1 + inflation_rate * 0.01 / 12);          
     }
     
     function fhousing_monthly(housing_monthlyi){
          return housing_monthlyi*(1 + inflation_rate * 0.01 / 12);          
     }
     
     function fmaintenance_monthly(maintenance_monthlyi){
          return maintenance_monthlyi*(1 + inflation_rate * 0.01 / 12);          
     }
     
     function propertyTax(homeValuei){
          return property_tax_rate * homeValuei * 0.01 / 12;          
     }
               
     function totalOutflow_buying(insurance_payment_monthly, housing_monthly, maintenance_monthly, propertyTax, incomeTaxSavings){
          return mortgage_payment + insurance_payment_monthly + housing_monthly + maintenance_monthly + propertyTax - incomeTaxSavings;          
     }
     
     function Rent(renti){
          return renti * (1 + rent_inflation_rate*0.01/12); 
     }
        
     function savings(savingsi, totalOutflow_buying, rent){
          return savingsi * (1 + return_cash_rate*0.01/12) + (totalOutflow_buying - rent); 
     }
     

     function date_dt(numMonths){
          var date_array = [];
          var now = new Date();
          date_array.push(now);
          
          for (var i = 1; i < numMonths; i++) {
               date_array.push(d3.time.month.offset(now, i));     
          }
          
          return date_array;
     }
     
     
     function equity_dt(numMonths){
          
          var equity_array = [];
          equity_array.push(downpayment);
          
          var homeValue_array = [];
          homeValue_array.push(purchase_price);
          
          var debt_array = [];
          debt_array.push(purchase_price - downpayment);
          
          for (var i = 1; i < numMonths; i++){
               homeValue_array.push(homeValue(homeValue_array[i-1]));
               debt_array.push(debt(debt_array[i-1], paid_principal(debt_array[i-1])));
               equity_array[i] = homeValue_array[i] - debt_array[i];  
          }
          
          return equity_array;
     
     }
     
     function savings_dt(numMonths){
          
          var debt0 = purchase_price - downpayment;
          
          var homeValue_array = [];
          homeValue_array.push(purchase_price);
          
          var propertyTax_array = [];
          propertyTax_array.push(0);
          
          var interest_on_debt_array = [];
          interest_on_debt_array.push(0); 
              
          var incomeTaxSavings_array = [];
          incomeTaxSavings_array.push(0);         
           
          var paid_principal_array = []; 
          paid_principal_array.push(0);
          
          var debt_array = [];
          debt_array.push(debt(debt0, paid_principal_array[0]));
           
          var savings_array = [];
          savings_array.push(downpayment);
          
          var insurance_payment_monthly_array = [];
          insurance_payment_monthly_array.push(0);
          insurance_payment_monthly_array.push(insurance_payment_monthly);
          
          var housing_monthly_array = [];
          housing_monthly_array.push(0);
          housing_monthly_array.push(housing_monthly);
          
          var maintenance_monthly_array = [];
          maintenance_monthly_array.push(0);
          maintenance_monthly_array.push(maintenance_monthly);
          
          var totalOutflow_buying_array = [];
          //totalOutflow_buying_array.push(0);
          
          var rent_array = [];
          rent_array.push(rent);
          
          for (var i = 1; i < numMonths; i++){
              rent_array.push(Rent(rent_array[i-1]));
              
              homeValue_array.push(homeValue(homeValue_array[i-1]));
              paid_principal_array.push(paid_principal(debt_array[i-1]));
              debt_array.push(debt(debt_array[i-1], paid_principal_array[i]));
              interest_on_debt_array.push(interest_on_debt(debt_array[i-1]));
              propertyTax_array.push(propertyTax(homeValue_array[i-1]));
              incomeTaxSavings_array.push(incomeTaxSavings(interest_on_debt_array[i], propertyTax_array[i]));          
              
              if (i > 1) {
                    insurance_payment_monthly_array.push(finsurance_payment_monthly(insurance_payment_monthly_array[i-1]));
                    housing_monthly_array.push(fhousing_monthly(housing_monthly_array[i-1]));
                    maintenance_monthly_array.push(fmaintenance_monthly(maintenance_monthly_array[i-1]));
                    
              }
              if (i == 1) {
                    totalOutflow_buying_array.push(totalOutflow_buying(insurance_payment_monthly_array[i], housing_monthly_array[i], maintenance_monthly_array[i], propertyTax_array[i], incomeTaxSavings_array[i]));
              }
              totalOutflow_buying_array.push(totalOutflow_buying(insurance_payment_monthly_array[i], housing_monthly_array[i], maintenance_monthly_array[i], propertyTax_array[i], incomeTaxSavings_array[i]));
              
              savings_array.push(savings(savings_array[i-1], totalOutflow_buying_array[i], rent_array[i]));
          }
          return [savings_array,
                  totalOutflow_buying_array,
                  rent_array,
                  homeValue_array,
                  debt_array];
     
     }
          
     function get_time_series(numMonths){
          
          var tSeries1 = [];
          var tSeries2 = [];
          
          var formatDate = d3.time.format("%d-%b-%y");
          
          var equity = equity_dt(numMonths);
          var savings_array = savings_dt(numMonths);
          var savings = savings_array[0];
          var buy_out = savings_array[1];
          var rent_out = savings_array[2];
          var dates = date_dt(numMonths);
          
          for (var i = 0; i < numMonths; i++) {
               tSeries1.push({"equity": equity[i], "savings": savings[i], "date":dates[i]});
               tSeries2.push({"purchase": buy_out[i], "rent": rent_out[i], "date":dates[i]});
          }
          
          return [tSeries1, tSeries2, equity, savings_array];
     }
    
     initSliders(numMonths);
     initParams();
     var t_series_init = get_time_series(numMonths);
     makeChart(svg_1, t_series_init[0]);
     makeChart(svg_2, t_series_init[1]);
     updateTotals(t_series_init[2], t_series_init[3]);
     
});//end $(document).ready()
