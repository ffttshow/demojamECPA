var yaw=0.5,pitch=0.5, width=700, height=400, drag=false;

sap.ui.controller("ecpa.SVG_HTML", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf ecpa.SVG_HTML
*/
	onInit: function() {
		
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf ecpa.SVG_HTML
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf ecpa.SVG_HTML
*/
	onAfterRendering: function() {
		function dataFromFormular(func){
		    var output=[];
		    for(var x=-10;x<10;x++){
		      var f0=[];            
		      output.push(f0);
		      for(var y=-10;y<10;y++){
		          f0.push(func(x,y));
		      }
		    }
		    return output;
		  }

		  var surfaces=[
		    {
		      name: 'Dataset 1',
		      data: dataFromFormular(function(x,y){
		          return Math.sin(Math.sqrt(x*x+y*y)/5*Math.PI)*50;
		        })
		    },
		    {
		      name: 'Dataset 2',
		      data: dataFromFormular(function(x,y){
		          return Math.cos(x/15*Math.PI)*Math.cos(y/15*Math.PI)*60+Math.cos(x/8*Math.PI)*Math.cos(y/10*Math.PI)*40;
		        })
		    },
		    {
		      name: 'Dataset 3',
		      data: dataFromFormular(function(x,y){
		          return -(Math.cos(Math.sqrt(x*x+y*y)/6*Math.PI)+1)*300/(Math.pow(x*x+y*y+1,0.3)+1)+50;
		        })
		    }
		  ];
		  var selected=surfaces[0];

		  var svg=d3.select('#svg_div')
		          .append('svg')
		            .attr('height',height)
		            .attr('width',width);

		  var group = svg.append("g");

		  var md=group.data([surfaces[0].data])
		    .surface3D(width,height)
		      .surfaceHeight(function(d){ 
		        return d;
		      }).surfaceColor(function(d){
		        var c=d3.hsl((d+100), 0.6, 0.5).rgb();
		        return "rgb("+parseInt(c.r)+","+parseInt(c.g)+","+parseInt(c.b)+")";
		      });

/*		  ul.selectAll('li')
		    .data(surfaces)
		      .enter().append('li')
		        .html(function(d){
		          return d.name
		        }).on('mousedown',function(){
		          md.data([d3.select(this).datum().data]).surface3D()
		            .transition().duration(500)
		            .surfaceHeight(function(d){
		              return d;
		            }).surfaceColor(function(d){
		              var c=d3.hsl((d+100), 0.6, 0.5).rgb();
		              return "rgb("+parseInt(c.r)+","+parseInt(c.g)+","+parseInt(c.b)+")";
		            });
		        });*/

		  svg.on("mousedown",function(){
		    drag=[d3.mouse(this),yaw,pitch];
		  }).on("mouseup",function(){
		    drag=false;
		  }).on("mousemove",function(){
		    if(drag){            
		      var mouse=d3.mouse(this);
		      yaw=drag[1]-(mouse[0]-drag[0][0])/50;
		      pitch=drag[2]+(mouse[1]-drag[0][1])/50;
		      pitch=Math.max(-Math.PI/2,Math.min(Math.PI/2,pitch));
		      md.turntable(yaw,pitch);
		    }
		  });
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf ecpa.SVG_HTML
*/
//	onExit: function() {
//
//	}

});