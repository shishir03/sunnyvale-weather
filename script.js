function updateTime() {
		var date = new Date();
		var dateString = date.toLocaleString();
	 	document.getElementById("time").innerHTML = dateString.substring(dateString.indexOf(",") + 2);
}

setInterval(updateTime, 1000);

google.charts.load('current', {'packages':['line', "scatter"]});
google.charts.setOnLoadCallback(update);

var metric = false;

function switchMetric() {
		metric = !metric;
}

function update() {
		document.getElementById("temp-graph").innerHTML = "";
		document.getElementById("pressure-graph").innerHTML = "";

  	fetch('https://api.ambientweather.net/v1/devices/84:F3:EB:67:9C:8F?apiKey=ae6adf691961484cad033bf3b9c6d6fcc7fcd509e19145e1a4f2c18d057e4de9&applicationKey=0bdd59132b424e0c832a53c1f6c0960e46eb59f9a7704afd8821f4692b2c9a54').then(data => {
				// console.log("Request sent");
				return data.json();
		}).then(json => {
				var first = json[0];

				document.getElementById("temperature").innerHTML = "Temperature: " + (metric ? fToC(first.tempf) : first.tempf) + (metric ? " C" : " F");
				document.getElementById("humidity").innerHTML = "Humidity: " + first.humidity + "%";
				document.getElementById("dp").innerHTML = "Dew Point: " + roundToOnePlace(metric ? fToC(first.dewPoint) : first.dewPoint) + (metric ? " C" : " F");
				document.getElementById("pressure").innerHTML = "Pressure: " + roundToOnePlace(metric ? 1013.25*first.baromrelin/29.92 : first.baromrelin) + (metric ? " hPa" : " inHg");
				document.getElementById("windspeed").innerHTML = "Wind Speed: " + roundToOnePlace(metric ? first.windspeedmph*0.44704 : first.windspeedmph) + (metric ? " m/s" : " mph");
				document.getElementById("windgust").innerHTML = "Wind Gust: " + roundToOnePlace(metric ? first.windgustmph*0.44704 : first.windgustmph) + (metric ? " m/s" : " mph");

				var windDir = (first.winddir + 11.25) % 360;
				var possDirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
				document.getElementById("winddir").innerHTML = "Wind Direction: " + possDirs[Math.floor(windDir/22.5)];

				document.getElementById("rainfall").innerHTML = "Daily Rainfall: " + (metric ? first.dailyrainin*25.4 : first.dailyrainin) + (metric ? " mm" : '"');
				document.getElementById("rainrate").innerHTML = "Rain Rate: " + (metric ? first.hourlyrainin*25.4 : first.hourlyrainin) + (metric ? " mm/hr" : '"/hr');
				document.getElementById("radiation").innerHTML = "Solar Radiation: " + first.solarradiation + " W/m^2";
				document.getElementById("uvindex").innerHTML = "UV Index: " + first.uv;

				json = json.reverse();

				var graphArea = document.getElementById("temp-graph");

				var tempOptions = {
						"title": "Temperature/Dewpoint",
						"titleTextStyle": {
							"fontSize": 35
						},
						"backgroundColor": {
							"fill": "#eeeeee"
						},
						"width": graphArea.clientWidth*0.95,
						"height": 400,
						"vAxis": {
							"title": metric ? "Temperature (C)" : "Temperature (F)"
						},
						"series": {
							0: {"color": "#E30F0F"},
							1: {"color": "#18A21E"}
						}
				};

				var tempData = new google.visualization.DataTable();

				tempData.addColumn("string", 'Time');
				tempData.addColumn("number", metric ? 'Temperature (C)' : "Temperature (F)");
				tempData.addColumn("number", metric ? 'Dew Point (C)' : "Dew Point (F)");

				for(var i = 0; i < json.length; i++) tempData.addRow([timestampToTime(json[i].dateutc), metric ? fToC(json[i].tempf) : json[i].tempf, metric ? fToC(json[i].dewPoint) : json[i].dewPoint]);
				var tempChart = new google.charts.Line(graphArea);
				tempChart.draw(tempData, google.charts.Line.convertOptions(tempOptions));

				var pressureOptions = {
						"title": "Pressure",
						"titleTextStyle": {
							"fontSize": 35
						},
						"backgroundColor": {
							"fill": "#eeeeee"
						},
						"width": graphArea.clientWidth*0.95,
						"height": 400,
						"vAxis": {
							"title": metric ? 'Pressure (hPa)' : "Pressure (inHg)",
							"format": metric ? "####.#" : "##.##"
						},
						"series": {
							0: {"color": "#000000"}
						}
				};

				var pressureData = new google.visualization.DataTable();

				pressureData.addColumn("string", 'Time');
				pressureData.addColumn("number", metric ? 'Pressure (hPa)' : "Pressure (inHg)");

				for(var i = 0; i < json.length; i++) pressureData.addRow([timestampToTime(json[i].dateutc), metric ? roundToOnePlace(1013.25*json[i].baromrelin/29.92) : json[i].baromrelin]);
				var pressureChart = new google.charts.Line(document.getElementById("pressure-graph"));
				pressureChart.draw(pressureData, google.charts.Line.convertOptions(pressureOptions));

				var windspeedOptions = {
						"title": "Wind Speed/Gust",
						"titleTextStyle": {
							"fontSize": 35
						},
						"backgroundColor": {
							"fill": "#eeeeee"
						},
						"width": graphArea.clientWidth*0.95,
						"height": 400,
						"vAxis": {
							"title": metric ? 'Wind Speed (m/s)' : "Wind Speed (mph)",
						}
				};

				var windData = new google.visualization.DataTable();

				windData.addColumn("string", 'Time');
				windData.addColumn("number", metric ? 'Wind Speed (m/s)' : "Wind Speed (mph)");
				windData.addColumn("number", metric ? 'Wind Gust (m/s)' : "Wind Gust (mph)");

				for(var i = 0; i < json.length; i++) windData.addRow([timestampToTime(json[i].dateutc),
					metric ? roundToOnePlace(json[i].windspeedmph*0.44704) : json[i].windspeedmph,
					metric ? roundToOnePlace(json[i].windgustmph*0.44704) : json[i].windgustmph,]);
				var windChart = new google.charts.Line(document.getElementById("windspeed-graph"));
				windChart.draw(windData, google.charts.Line.convertOptions(windspeedOptions));

				var winddirOptions = {
						"title": "Wind Direction",
						"titleTextStyle": {
							"fontSize": 35
						},
						"backgroundColor": {
							"fill": "#eeeeee"
						},
						"width": graphArea.clientWidth*0.95,
						"height": 400,
						"vAxis": {
							"title": "Wind Direction (deg)",
							"viewWindow": {
									"min": 0,
									"max": 360
							}
						}
				}

				var winddirData = new google.visualization.DataTable();

				winddirData.addColumn("string", "Time");
				winddirData.addColumn("number", "Wind Direction (deg)");

				for(var i = 0; i < json.length; i++) winddirData.addRow([timestampToTime(json[i].dateutc), json[i].winddir]);
				var winddirChart = new google.charts.Scatter(document.getElementById("winddir-graph"));
				winddirChart.draw(winddirData, google.charts.Scatter.convertOptions(winddirOptions));

				var rainOptions = {
						"title": "Rainfall",
						"titleTextStyle": {
							"fontSize": 35
						},
						"backgroundColor": {
							"fill": "#eeeeee"
						},
						"width": graphArea.clientWidth*0.95,
						"height": 400,
						"vAxis": {
							"title": metric ? "Rainfall (mm)" : "Rainfall (in)"
						},
						"series": {
							0: {"color": "#0057e7"},
							1: {"color": "#0fd666"}
						}
				};

				var rainData = new google.visualization.DataTable();

				rainData.addColumn("string", 'Time');
				rainData.addColumn("number", metric ? 'Daily Rainfall (mm)' : "Daily Rainfall (in)");
				rainData.addColumn("number", metric ? 'Rain Rate (mm/hr)' : "Rain Rate (in/hr)");

				for(var i = 0; i < json.length; i++) rainData.addRow([timestampToTime(json[i].dateutc),
					metric ? 25.4*(json[i].dailyrainin) : json[i].dailyrainin,
					metric ? 25.4*(json[i].hourlyrainin) : json[i].hourlyrainin]);
				var rainChart = new google.charts.Line(document.getElementById("rain-graph"));
				rainChart.draw(rainData, google.charts.Line.convertOptions(rainOptions));

				var solarOptions = {
						"title": "Solar Radiation",
						"titleTextStyle": {
							"fontSize": 35
						},
						"backgroundColor": {
							"fill": "#eeeeee"
						},
						"width": graphArea.clientWidth*0.95,
						"height": 400,
						"vAxis": {
							"title": "Solar Radiation (W/m^2)",
						},
						"series":{
							0: {"color": "#ffda0c"}
						}
				};

				var solarData = new google.visualization.DataTable();

				solarData.addColumn("string", 'Time');
				solarData.addColumn("number", "Solar Radiation (W/m^2)");

				for(var i = 0; i < json.length; i++) solarData.addRow([timestampToTime(json[i].dateutc), json[i].solarradiation]);
				var solarChart = new google.charts.Line(document.getElementById("solar-graph"));
				solarChart.draw(solarData, google.charts.Line.convertOptions(solarOptions));
		});
}

setInterval(update, 300000);

function timestampToTime(timestamp) {
  	var date = new Date(timestamp);
		var dateString = date.toLocaleString();
	 	return dateString.substring(dateString.indexOf(",") + 2);
}

function fToC(temp) {
  	return roundToOnePlace(5*(temp - 32)/9.0);
}

function CtoF(temp) {
		return roundToOnePlace(1.8*temp + 32);
}

function roundToOnePlace(num) {
  	return Math.round(num*10)/10;
}

function generateForecast() {
		var list = document.getElementById("fcst");
    while(list.firstChild) list.removeChild(list.firstChild);

		fetch('https://api.weather.gov/gridpoints/MTR/97,106').then(data => {
				// console.log("Request sent");
				return data.json();
		}).then(json => {
				var temps = json.properties;
				for(var i = 0; i < temps.maxTemperature.values.length; i++) {
						var node = document.createElement("LI");
						var p = document.createElement("p");

						p.textContent = (temps.maxTemperature.values)[i].validTime.substring(5, 10)  + ": "
						 	+ roundToOnePlace(metric ? (temps.maxTemperature.values)[i].value : CtoF((temps.maxTemperature.values)[i].value)) + " | "
							+ roundToOnePlace(metric ? (temps.minTemperature.values)[i].value : CtoF((temps.minTemperature.values)[i].value))
							+ (metric ? " C" : " F");
						node.appendChild(p);
						list.appendChild(node);
				}
		});
}

function getAlerts() {
		var list = document.getElementById("alerts");
		while(list.firstChild) list.removeChild(list.firstChild);

		fetch("https://api.weather.gov/alerts/active?point=37,-122").then(data => {
				return data.json();
		}).then(json => {
				console.log(json);
				var alerts = json.features;
				for(var i = 0; i < alerts.length; i++) {
						var node = document.createElement("LI");
						var p = document.createElement("p");

						p.textContent = alerts[i].properties.headline;
						node.appendChild(p);
						list.appendChild(node);
				}
		});
}
