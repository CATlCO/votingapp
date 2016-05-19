'use strict';


(function(){
	if (path === "/") path = "/polls";
	var apiUrl = appUrl + '/api' + path;
	var graph;
	var index, newpoll, detail, mypolls;

	if (path === "/polls") { index = true; }
	else if (path === "/newpoll") { newpoll = true; }
	else if (path.match(/^\/polls\/\d/)) { detail = true; }
	else if (path === "/mypolls") { mypolls = true; }

	var colors = {
		sandy: { color1: {red: 0, green: 47, blue: 47}, color2: {red: 230, green: 226, blue: 175}},
		river: { color1: {red: 25, green: 52, blue: 65}, color2: {red: 252, green: 255, blue: 245}},
		sunset: { color1: {red: 189, green: 73, blue: 50}, color2: {red: 255, green: 211, blue: 78}},
		blood: { color1: {red: 142, green: 40, blue: 0}, color2: {red: 255, green: 240, blue: 165}},
		algae: { color1: {red: 0, green: 163, blue: 136}, color2: {red: 255, green: 255, blue: 157}},
		night: { color1: {red: 0, green: 67, blue: 88}, color2: {red: 255, green: 255, blue: 26}},
		cherry: { color1: {red: 185, green: 18, blue: 27}, color2: {red: 246, green: 228, blue: 151}}
	}

	Chart.defaults.global.legend = { fdisplay: false }

	function drawGraph(data){
		var ctx; 

		for (var i in data){
			if (mypolls){
				document.getElementById('graph').innerHTML += '<div class="chartWrapper"><a href="/polls/'+data[i]._id+'"><div class="chart"><h1>'+data[i].question+'</h1><canvas class="canvas" id="chart'+i+'"></canvas></div></a><a class="author" href="#" target="_blank">delete</a></div>';
			} else if (detail || newpoll){
				 document.getElementById('graph').innerHTML = '<div class="chartWrapper"><div class="chart"><h1>'+data[i].question+'</h1><canvas class="canvas" id="chart'+i+'"></canvas></div></a><a class="author" href="https://github.com/'+data[i].author.github.username+'" target="_blank">@'+ data[i].author.github.username + '</div>';
			} else {
				 document.getElementById('graph').innerHTML += '<div class="chartWrapper"><a href="/polls/'+data[i]._id+'"><div class="chart"><h1>'+data[i].question+'</h1><canvas class="canvas" id="chart'+i+'"></canvas></div></a><a class="author" href="https://github.com/'+data[i].author.github.username+'" target="_blank">@'+ data[i].author.github.username + '</a></div>';
			}

			var bg = [];
			var hover = [];
			var per, green, red, blue;
			var steps = data[i].chartData[0].length;
			
			addColor(colors[data[i].color]);

			function addColor(col){
				for (var k=0; k<steps; k++) {
					per = (100/(steps-1) * k)/100;
					red  = parseInt(col.color1.red + per * (col.color2.red - col.color1.red), 10);
					green = parseInt(col.color1.green + per * (col.color2.green - col.color1.green), 10);
					blue = parseInt(col.color1.blue + per * (col.color2.blue - col.color1.blue), 10);
					bg.push('rgba('+red+', '+green+', '+blue+', .7)');
					hover.push('rgba('+red+', '+green+', '+blue+', 1)');
				}	
			}

			data[i].chartData = { labels: data[i].chartData[0], datasets: [{data: data[i].chartData[1], backgroundColor: bg, hoverBackgroundColor: hover, borderColor: hover, borderWidth: 1}]};
		}

		for (var j in data){
			ctx = document.getElementById("chart"+j).getContext("2d");
			graph = new Chart(ctx, { type: data[j].chart.toLowerCase(), data: data[j].chartData});
		}

		document.getElementById('legend').innerHTML = graph.generateLegend();
	}

	function createChart (result) {
		var res = JSON.parse(result);
		var data;

		if (Array.isArray(res)){
			data = res;
		} else {
			data = [];
			data.push(res);
		}

		if (path == "/mypolls" && data.length < 1) {
			document.getElementById('graph').innerHTML = '<div>You haven\'t created any polls yet.</div>';
		}

		drawGraph(data);

		var inputlist = document.getElementById('input_list');
		for (var k in data[0].chartData.labels) {
			var label =  data[0].chartData.labels[k];
			if (k == 0){
				inputlist.innerHTML = '<div class="radio"><input class="radio_input" type="radio" id="'+ label + '" name="options" value="'+ label +'" /><label class="radio_label" for="'+ label + '"><span class="radio_span"></span>'+ label + '</label></div>';
			} else {
				inputlist.innerHTML += '<div class="radio"><input class="radio_input" type="radio" id="'+ label + '" name="options" value="'+ label +'" /><label class="radio_label" for="'+ label + '"><span class="radio_span"></span>'+ label + '</label></div>';
			}
			
		}
	}

	function vote(){
		document.getElementById("vote").onsubmit = function(e){
			e.preventDefault();	
			var data = validate(e.target.elements);
			if (data == "none") {
				classie.add(document.getElementById("none"), "show");
				setTimeout(function(){
					classie.remove(document.getElementById("none"), "show");
				}, 2000);
			} else if (data == "empty") {
				classie.add(document.getElementById("empty"), "show");
				setTimeout(function(){
					classie.remove(document.getElementById("empty"), "show");
				}, 2000);
			} else {
				ajaxFunctions.ajaxRequest('POST', apiUrl, createChart, data);
			}
		};
	}

	function newPoll(){
		var col = document.getElementsByName("hue");
		var type = document.getElementsByName("chart");
		var que = document.getElementsByName("question");
		[].slice.call(document.querySelectorAll(".input_field, .select_field")).forEach(function(select) {
			select.onchange = function() {
				var opt = options();
				var val = [];
				for (var i in opt) { val.push(rand()); }
				var data = 
					[{ question: que[0].value || "Chart preview", author: {github: {username: ""}}, color: col[0].value, chart: type[0].value, chartData: [opt, val] }];
				drawGraph(data);
			}
		}); 

		function options(){
			var arr = [];
			var i = 1;
			[].slice.call(document.getElementsByName("options")).forEach(function(input) {
				arr.push(input.value || "Option "+i);
				i++;
			});
			return arr;
		}

		function rand() {
			return Math.floor((Math.random() * 10) + 1); 
		}
	}

	function deleteChart (result) {
		
		
	}

	function validate(inputs) {
		var own = document.getElementById("owninput").value;
		for (var i=0; i<inputs.length; i++){
			if (inputs[i].checked){
				if(inputs[i].id === "own" && own === "") {
					return "empty";
				} else {
					return "option=" + inputs[i].id + "&own=" + own;
				}
			}
		}
		return "none";
	}

	ajaxFunctions.ready(function(){

		ajaxFunctions.ajaxRequest('GET', apiUrl, createChart);
		if (detail) vote();
		if (newpoll) newPoll();

		var del = document.getElementsByClassName('delete');
		for (var i=0; i<del.length; i++){
			console.log(del[i]);
			del[i].onclick = function() {
				console.log("delete");
				ajaxFunctions.ajaxRequest('DELETE', appUrl + del[i].dataset.url);
			}
		}

	});

})();