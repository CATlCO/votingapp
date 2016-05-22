
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
		rust: { color1: {red: 142, green: 40, blue: 0}, color2: {red: 255, green: 240, blue: 165}},
		algae: { color1: {red: 0, green: 163, blue: 136}, color2: {red: 255, green: 255, blue: 157}},
		night: { color1: {red: 0, green: 67, blue: 88}, color2: {red: 255, green: 255, blue: 26}},
		cherry: { color1: {red: 185, green: 18, blue: 27}, color2: {red: 246, green: 228, blue: 151}}
	}

	Chart.defaults.global.legend = { display: false, defaultFontColor: '#ffffff', defaultFontFamily: 'Raleway' };
	var options = { 
		scales: { 
			yAxes: [{ 
				display: false,
				ticks: { 
					beginAtZero: true, 
					fontColor: 'rgba(255, 255, 255, .4)',
					min: 0
				}, 
				gridLines: { 
					display: false,
					zeroLineColor: 'rgba(255, 255, 255, 1)'
				} 
			}], 
			xAxes: [{ 
				display: false,
				ticks: {
					beginAtZero: true, 
					fontColor: 'rgba(255, 255, 255, .4)',
					min: 0
				}, 
				gridLines: { 
					display: false,
					zeroLineColor: 'rgba(255, 255, 255, 1)'
				} 
			}] 
		}};
	var optionsdetail = { 
		scales: { 
			yAxes: [{ 
				ticks: { 
					beginAtZero: true, 
					fontColor: 'rgba(255, 255, 255, .4)',
					min: 0
				}, 
				gridLines: { 
					display: false,
					zeroLineColor: 'rgba(255, 255, 255, 1)'
				} 
			}], 
			xAxes: [{ 
				ticks: {
					beginAtZero: true, 
					fontColor: 'rgba(255, 255, 255, .4)',
					min: 0
				}, 
				gridLines: { 
					display: false,
					zeroLineColor: 'rgba(255, 255, 255, 1)'
				} 
			}] 
		}};

	function drawGraph(data){
		var ctx; 

		for (var i in data){
			var social = '<div class="social"><a href="http://www.facebook.com/sharer.php?u='+appUrl +'/polls/'+data[i]._id+'" target="_blank"><i class="fa fa-facebook-square fa-2x"></i></a><a href="https://twitter.com/share?url='+appUrl +'/polls/'+data[i]._id+'" target="_blank"><i class="fa fa-twitter-square fa-2x"></i></a><a href="http://www.linkedin.com/shareArticle?mini=true&amp;url='+appUrl +'/polls/'+data[i]._id+'" target="_blank"><i class="fa fa-linkedin-square fa-2x"></i></a></div>';
			
			if (mypolls){
				document.getElementById('graph').innerHTML += '<div class="chartWrapper"><a href="/polls/'+data[i]._id+'"><div class="chart"><h1>'+data[i].question+'</h1><canvas class="canvas" id="chart'+i+'"></canvas></div></a>'+social+'<a class="author" href="/polls/'+data[i]._id+'">delete</a></div>';
			} else if (detail || newpoll){
				 document.getElementById('graph').innerHTML = '<div class="chartWrapper"><div class="chart"><h1>'+data[i].question+'</h1><canvas class="canvas" id="chart'+i+'"></canvas></div></a><a class="author" href="https://github.com/'+data[i].author.github.username+'" target="_blank">@'+ data[i].author.github.username + '</div>';
			} else {
				 document.getElementById('graph').innerHTML += '<div class="chartWrapper"><a href="/polls/'+data[i]._id+'"><div class="chart"><h1>'+data[i].question+'</h1><canvas class="canvas" id="chart'+i+'"></canvas></div></a><a class="author" href="https://github.com/'+data[i].author.github.username+'" target="_blank">@'+ data[i].author.github.username + '</a></div>';
			}

			var bg = [];
			var hover = [];
			var per, green, red, blue;
			var steps = data[i].chartData[0].length;
			
			function addColor(col){
				for (var k=0; k<steps; k++) {
					per = (100/(steps-1) * k)/100;
					red  = parseInt(col.color1.red + per * (col.color2.red - col.color1.red), 10);
					green = parseInt(col.color1.green + per * (col.color2.green - col.color1.green), 10);
					blue = parseInt(col.color1.blue + per * (col.color2.blue - col.color1.blue), 10);
					bg.push('rgba('+red+', '+green+', '+blue+', .6)');
					hover.push('rgba('+red+', '+green+', '+blue+', 1)');
				}	
			}
			
			addColor(colors[data[i].color]);

			if (data[i].chart === "line") {
				data[i].chartData = { labels: data[i].chartData[0], datasets: [{data: data[i].chartData[1], borderColor: hover[Math.round(hover.length / 2)], borderWidth: 2}]};
			} else {
				data[i].chartData = { labels: data[i].chartData[0], datasets: [{data: data[i].chartData[1], backgroundColor: bg, hoverBackgroundColor: hover, borderColor: hover, borderWidth: 1}]};
			}
		}

		for (var j in data){
			ctx = document.getElementById("chart"+j).getContext("2d");
			if ((newpoll || detail) && (data[i].chart === "line" || data[i].chart === "bar")) { 
				graph = new Chart(ctx, { type: data[j].chart, data: data[j].chartData, options: optionsdetail}); 
			} else { graph = new Chart(ctx, { type: data[j].chart, data: data[j].chartData, options: options}); }
		}

		if ((newpoll || detail) && (data[i].chart === "pie" || data[i].chart === "doughnut")) document.getElementById('legend').innerHTML = graph.generateLegend();
	}

	function createChart (result) {
		var res = JSON.parse(result);
		var data;
		var ip = res.ip;

		if (Array.isArray(res.result)){
			data = res.result;
		} else {
			data = [];
			data.push(res.result);
		}

		if (path == "/mypolls" && data.length < 1) {
			document.getElementById('graph').innerHTML = '<div>You haven\'t created any polls yet.</div>';
		}

		drawGraph(data);

		if (detail) {
			if (!data[0].voters.includes(ip)){
			var inputlist = document.getElementById('input_list');
				for (var k in data[0].chartData.labels) {
					var label =  data[0].chartData.labels[k];
					if (k == 0){
						inputlist.innerHTML = '<div class="radio"><input class="radio_input" type="radio" id="'+ label + '" name="options" value="'+ label +'" /><label class="radio_label" for="'+ label + '"><span class="radio_span"></span>'+ label + '</label></div>';
					} else {
						inputlist.innerHTML += '<div class="radio"><input class="radio_input" type="radio" id="'+ label + '" name="options" value="'+ label +'" /><label class="radio_label" for="'+ label + '"><span class="radio_span"></span>'+ label + '</label></div>';
					}
				}
			} else{
			 document.getElementById('msg').innerHTML = "You voted in this poll.";
			}
		}

		if (mypolls) deletePoll();
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
				document.getElementById('msg').innerHTML = "You voted in this poll.";
				document.getElementById('container').removeChild(document.getElementById('vote'));
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

	function deletePoll() {		
		[].slice.call(document.getElementsByClassName("author")).forEach(function(del) {
			del.onclick = function(e) {
				e.preventDefault();
				ajaxFunctions.ajaxRequest('DELETE', appUrl + '/api' + del.getAttribute("href"));
				document.getElementById('graph').removeChild(del.parentNode);
			}
		});
	}

	function validate(inputs) {
		var own = document.getElementById("owninput");
		own = (own ? own.value : "" );
		for (var i=0; i<inputs.length; i++){
			if (inputs[i].checked){
				if(inputs[i].id === "own" && own === "") {
					return "empty";
				} else {
					return "option=" + inputs[i].id + "&own=" + own;
				}
			}
		}
		if (inputs.length === 2 && inputs[0] === inputs[1]) return "same";
		return "none";
	}

	ajaxFunctions.ready(function(){

		ajaxFunctions.ajaxRequest('GET', apiUrl, createChart);
		if (detail) vote();
		if (newpoll) newPoll();

	});

})();