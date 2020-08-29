

/////////////////////////////////////////// Facilities Select Buttons /////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", function() {
	
	// set 0 for lat selection
	window.cat = 0;
	
	////////////////////map 1 아파트 ///////////////////////////////////
	var mapDiv = document.getElementById('map');
	var map = new naver.maps.Map(mapDiv, {
	zoom: 5,
	center: new naver.maps.LatLng(35.868, 128.599)
	});
	
	
	////////////////////map 2 원룸 ///////////////////////////////////
	
	var mapDiv2 = document.getElementById('map2');
	var map2 = new naver.maps.Map(mapDiv2, {
	zoom: 5,
	center: new naver.maps.LatLng(35.868, 128.599)
	});
	
	
	////////////////////map 3 모텔,호텔 ///////////////////////////////////
	
	var mapDiv3 = document.getElementById('map3');
	var map3 = new naver.maps.Map(mapDiv3, {
	zoom: 5,
	center: new naver.maps.LatLng(35.868, 128.599)
	});
	
	////////////////////map 4 1인 가구 수 ///////////////////////////////////
	
	var mapDiv4 = document.getElementById('map4');
	var map4 = new naver.maps.Map(mapDiv4, {
	zoom: 5,
	center: new naver.maps.LatLng(35.868, 128.599)
	});
	
	////////////////////////////대구 부산 데이터 합치기
	
	////////////////////map 5 인구 수 ///////////////////////////////////
	
	
	var map5 = new naver.maps.Map(document.getElementById('map5'), {
	zoom: 5,
	mapTypeId: 'normal',
	center: new naver.maps.LatLng(35.868, 128.599)
	});
	
	////////////////////map 6 행정동 레이블 ///////////////////////////////////
	
	var map6 = new naver.maps.Map(document.getElementById('map6'), {
	zoom: 5,
	mapTypeId: 'normal',
	center: new naver.maps.LatLng(35.868, 128.599)
	});
		
	
	
	var adrr = document.querySelector('#addr_click');
	adrr.addEventListener('click',function(){	
		document.querySelector('#action').innerHTML = document.querySelector('#action_addr').innerText;	
		window.cat = 1; // 1 for address search
		console.log("어드레스");
		
	});
	
	var latt = document.querySelector('#lat_click');
	latt.addEventListener('click',function(){
		document.querySelector('#action').innerHTML = document.querySelector('#action_lat').innerText;				
		window.cat = 0; // 0 for latitude search
				
	});
	
	
	function getDist(lat1,lon1,lat2,lon2) {
	    var R = 6371; // Radius of the earth in km
	    var dLat = deg2rad(lat2-lat1);  // deg2rad below
	    var dLon = deg2rad(lon2-lon1); 
	    var a = 
	      Math.sin(dLat/2) * Math.sin(dLat/2) +
	      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
	      Math.sin(dLon/2) * Math.sin(dLon/2)
	      ; 
	    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	    var d = R * c; // Distance in km
	    return d*1000; // in meters
	 }
	  
	 function deg2rad(deg) {
	    return deg * (Math.PI/180)
	 }
	


	
	var result = document.querySelector('.submit');
	result.addEventListener('click',function(){	
		

		console.log("clicked");
		var x = 0, y = 0;
		if (window.cat == 0) {
			console.log("lnglat");
			x = document.getElementById('lng').value;
			y = document.getElementById('lat').value;
			dist = document.getElementById('dist').value;
			document.querySelector('.title').innerHTML = "선택한 좌표: "+ x + ", " + y + "  거리: "+ (dist/1000) + "km"; 		
			
			mapByCoordinates(x,y,dist);
			
		} else {
			console.log("addr");
			address = document.getElementById('addr_text').value;
			console.log(address);
			dist = document.getElementById('dist').value;
			document.querySelector('.title').innerHTML = "선택한 주소: "+ address + "  거리: "+ (dist/1000) + "km"; 		
			
			mapByAddress(address,dist);


		}
		
		function mapByAddress(addres,dist){
			naver.maps.Service.geocode({
		        address: addres
		    }, function(status, response) {
		        if (status !== naver.maps.Service.Status.OK) {
		            return alert('Something wrong!');
		        }

	        	//var x = response['v2']['addresses'][0]['x'];
	        	//var y = response['v2']['addresses'][0]['y'];

	            var htmlAddresses = [],
		            item = response.v2.addresses[0],
		            point = new naver.maps.Point(item.x, item.y);
	            
	            
	            mapByCoordinates(item.y,item.x,dist);
	            
				return;
		    });	
		}			
				

		function mapByCoordinates(x,y,dist) {
			console.log("x:"+x+"y:"+y+"dist:"+dist);
	/////////////////  map 1
			var map = new naver.maps.Map(mapDiv, {
			    zoom: 13,
			    center: new naver.maps.LatLng(x, y)
			});
	
			var circle = new naver.maps.Circle({
			    map: map,
			    center: new naver.maps.LatLng(x, y),
			    radius: dist,
				strokeColor: 'red',
				strokeOpacity: 1,
				strokeWeight: 2
			});
	
			naver.maps.Event.once(map, 'init_stylemap', function () {
			      $.getJSON("./busandaegu_apt.json", function(data){
			    	  
			    	  var cnt = 0;
			    	  
			    	  for(let i=0; i < data['coordinates'].length; i++) {
			    		  lng = data['coordinates'][i][1];
			    		  lat = data['coordinates'][i][0];
			    		  dt = getDist(y,x,lat,lng);
			    		  
			    		  if (dt < dist) { cnt++; }
			    		  else {
			    		  	  //data['coordinates'][i][1] = 0;
			    		  	  //data['coordinates'][i][0] = 0;
		    			  }
			    	  }
			    	  console.log("yes");
			    	  console.log(cnt);
			    	  
			    	  document.querySelector('#total1').innerHTML = cnt;
			    	  
			          startHeatMap(data);
			          console.log("1");
			      }).fail(function(){
			          console.log("An error has occurred.");
			      });
	
			    
			}); //startHeatMap(mydata)
	
			function startHeatMap(data) {
			    var heatmap = new naver.maps.visualization.HeatMap({
			        map: map,
			        data: data.coordinates
			    });
			}
			
			// Facility location
			var circle1_x = new naver.maps.Circle({
			    map: map,
			    center: new naver.maps.LatLng(x, y),
			    radius: 10,
				strokeColor: 'black',
				strokeOpacity: 1,
				strokeWeight: 5
			});
			
	/////////////////  map 2
	
			var map2 = new naver.maps.Map(mapDiv2, {
			    zoom: 13,
			    center: new naver.maps.LatLng(x, y)
			});
	
			var circle = new naver.maps.Circle({
			    map: map2,
			    center: new naver.maps.LatLng(x, y),
			    radius: dist,
				strokeColor: 'red',
				strokeOpacity: 1,
				strokeWeight: 2
			});
	
			naver.maps.Event.once(map2, 'init_stylemap', function () {
			      $.getJSON("./bd_jutaek.json", function(data2){
			    	  
			    	  var cnt2 = 0;
			    	  
			    	  for(let i=0; i < data2['coordinates'].length; i++) {
			    		  lng = data2['coordinates'][i][1];
			    		  lat = data2['coordinates'][i][0];
			    		  dt = getDist(y,x,lat,lng);
			    		  
			    		  if (dt < dist) { cnt2++; }
			    		  else {
			    		  	  //data2['coordinates'][i][1] = 0;
			    		  	  //data2['coordinates'][i][0] = 0;
		    			  }
			    	  }
			    	  console.log("yes");
			    	  console.log(cnt2);
			    	  
			    	  document.querySelector('#total2').innerHTML = cnt2; 	  
			    	  
			          startHeatMap2(data2)
			          console.log("1")
			      }).fail(function(){
			          console.log("An error has occurred.");
			      });
	
			    
			}); //startHeatMap(mydata)
	
			function startHeatMap2(data2) {
			    var heatmap = new naver.maps.visualization.HeatMap({
			        map: map2,
			        data: data2.coordinates
			    });
			} 
			
			// Facility location
			var circle2_x = new naver.maps.Circle({
			    map: map2,
			    center: new naver.maps.LatLng(x, y),
			    radius: 10,
				strokeColor: 'black',
				strokeOpacity: 1,
				strokeWeight: 5
			});
			
	/////////////////  map 3
	
			var map3 = new naver.maps.Map(mapDiv3, {
			    zoom: 13,
			    center: new naver.maps.LatLng(x, y)
			});
	
			var circle3 = new naver.maps.Circle({
			    map: map3,
			    center: new naver.maps.LatLng(x, y),
			    radius: dist,
				strokeColor: 'red',
				strokeOpacity: 1,
				strokeWeight: 2
			});
	
			naver.maps.Event.once(map3, 'init_stylemap', function () {
			      $.getJSON("./bd_hotel.json", function(data3){
	    	  
			    	  var cnt3 = 0;
			    	  
			    	  for(let i=0; i < data3['coordinates'].length; i++) {
			    		  lng = data3['coordinates'][i][1];
			    		  lat = data3['coordinates'][i][0];
			    		  dt = getDist(y,x,lat,lng);
			    		  
			    		  if (dt < dist) { cnt3++; }
			    		  else {
			    		  	  //data3['coordinates'][i][1] = 0;
			    		  	  //data3['coordinates'][i][0] = 0;
		    			  }
			    	  }
			    	  console.log("yes");
			    	  console.log(cnt3);
			    	  
			    	  document.querySelector('#total3').innerHTML = cnt3;		    	  
			          startHeatMap3(data3)
			          console.log("1")
			      }).fail(function(){
			          console.log("An error has occurred.");
			      });
	
			    
			}); //startHeatMap(mydata)
	
			function startHeatMap3(data3) {
			    var heatmap = new naver.maps.visualization.HeatMap({
			        map: map3,
			        data: data3.coordinates
			    });
			} 
	
			// Facility location
			var circle3_x = new naver.maps.Circle({
			    map: map3,
			    center: new naver.maps.LatLng(x, y),
			    radius: 10,
				strokeColor: 'black',
				strokeOpacity: 1,
				strokeWeight: 5
			});
			
	/////////////////  map 4
			
			regionGeoJson1 = [];
			idx1 = 0;
			
			var map4 = new naver.maps.Map(document.getElementById('map4'), {
			zoom: 13,
			mapTypeId: 'normal',
			center: new naver.maps.LatLng(x,y)
			});
			
	
			
			
			naver.maps.Event.once(map, 'init_stylemap', function () {
			    $.getJSON("./bu_dae_geo.json", function(data){
					
			    	for (var i = 0; i < data.features.length; i++) {
			    		regionGeoJson1[i] = data.features[i];
			
			    	}
			
			 		startDataLayer1();
			    		
			    }).fail(function(){
			        console.log("An error has occurred.");
			    });
			
			});
			var tooltip = $('<div style="position:absolute;z-index:1000;padding:5px 10px;background-color:#fff;border:solid 2px #000;font-size:14px;pointer-events:none;display:none;"></div>');
	
			tooltip.appendTo(map4.getPanes().floatPane);		
			
			function startDataLayer1() {
				map4.data.setStyle(function(feature) {
					//console.log(feature.property_population); //이런식으로 데이터 찾아서 티어 정해서 색칠 ㄱㄱ..
					if(feature.property_single > 50000) { // 1st population tier 
					    var styleOptions = {
						        fillColor: '#0d47a1',
						        fillOpacity: 0.5,
						        strokeColor: 'black',
						        strokeWeight: 2,
						        strokeOpacity: 0.4
						    };	
					} else if (feature.property_single > 40000 && feature.property_single < 50000) { // 2nd population tier 
					    var styleOptions = {
					        fillColor: '#2962ff',
					        fillOpacity: 0.5,
					        strokeColor: 'black',
					        strokeWeight: 2,
					        strokeOpacity: 0.4
					    };	
					} else if (feature.property_single > 30000 && feature.property_single < 40000) { // 2nd population tier 
					    var styleOptions = {
					        fillColor: '#448aff',
					        fillOpacity: 0.5,
					        strokeColor: 'black',
					        strokeWeight: 2,
					        strokeOpacity: 0.4
					    };			
					} else if (feature.property_single > 20000 && feature.property_single < 30000) {  // 3rd population tier
					    var styleOptions = {
					        fillColor: '#64b5f6',
					        fillOpacity: 0.5,
					        strokeColor: 'black',
					        strokeWeight: 2,
					        strokeOpacity: 0.4
					    };			
					} else if (feature.property_single > 10000 && feature.property_single < 20000) { // 4th population tier
					    var styleOptions = {
					        fillColor: '#bbdefb',
					        fillOpacity: 0.5,
					        strokeColor: 'black',
					        strokeWeight: 2,
					        strokeOpacity: 0.4
					    };			
					} else if (feature.property_single < 10000) { // 5th population tier
					    var styleOptions = {
						        fillColor: '#e3f2fd',
						        fillOpacity: 0.5,
						        strokeColor: 'black',
						        strokeWeight: 2,
						        strokeOpacity: 0.4
						    };			
					} else {
					
					    var styleOptions = {
					        fillColor: 'white',
					        fillOpacity: 0.5,
					        strokeColor: 'black',
					        strokeWeight: 2,
					        strokeOpacity: 0.4
					    };
					}
					
				
				    return styleOptions;
				});
				
				regionGeoJson1.forEach(function(geojson) {
				    map4.data.addGeoJson(geojson);
			
				});
				
				// region data
			    map4.data.addListener('mouseover', function(e) {
			        var feature = e.feature,
			            regionName = feature.getProperty('SIG_KOR_NM'),
			            sin = feature.getProperty('single'),
			            inc = feature.getProperty('income').toString(),
			            regionIncome = inc.concat("만원");
	
			        tooltip.css({
			            display: '',
			            left: e.offset.x,
			            top: e.offset.y
			        }).text(regionName + ",인구:"+sin+"명"+",월소득:"+regionIncome);
	
			        map4.data.overrideStyle(feature, {
			            fillOpacity: 0.6,
			            strokeWeight: 4,
			            strokeOpacity: 1
			        });
			    });
				
			    map4.data.addListener('mouseout', function(e) {
			        tooltip.hide().empty();
			        map6.data.revertStyle();
			    });
				
	
				var circle = new naver.maps.Circle({
				    map: map4,
				    center: new naver.maps.LatLng(x, y),
				    radius: dist,
					strokeColor: 'black',
					strokeOpacity: 1,
					strokeWeight: 3
				});
			    
			    
				// Facility location
				var circle4_x = new naver.maps.Circle({
				    map: map4,
				    center: new naver.maps.LatLng(x, y),
				    radius: 10,
					strokeColor: 'black',
					strokeOpacity: 1,
					strokeWeight: 5
				});
				
				
			}
			
			
	/////////////////  map 5
	
			regionGeoJson = [];
			idx = 0;
			
			var map5 = new naver.maps.Map(document.getElementById('map5'), {
			zoom: 13,
			mapTypeId: 'normal',
			center: new naver.maps.LatLng(x,y)
			});
			
	
	
			var tooltip2 = $('<div style="position:absolute;z-index:1000;padding:5px 10px;background-color:#fff;border:solid 2px #000;font-size:14px;pointer-events:none;display:none;"></div>');
	
			tooltip2.appendTo(map5.getPanes().floatPane);
			
			naver.maps.Event.once(map, 'init_stylemap', function () {
			    $.getJSON("./bu_dae_geo.json", function(data){
					
			    	for (var i = 0; i < data.features.length; i++) {
			    		regionGeoJson[i] = data.features[i];
			
			    	}
			
			 		startDataLayer();
			    		
			    }).fail(function(){
			        console.log("An error has occurred.");
			    });
			
			});
			
			
			function startDataLayer() {
				map5.data.setStyle(function(feature) {
					if(feature.property_population > 400000) { // 1st population tier 
					    var styleOptions = {
						        fillColor: '#1b5e20',
						        fillOpacity: 0.8,
						        strokeColor: 'black',
						        strokeWeight: 2,
						        strokeOpacity: 0.4
						    };	
					} else if (feature.property_population > 300000 && feature.property_population < 400000) { // 2nd population tier 
					    var styleOptions = {
					        fillColor: '#2e7d32',
					        fillOpacity: 0.8,
					        strokeColor: 'black',
					        strokeWeight: 2,
					        strokeOpacity: 0.4
					    };	
					} else if (feature.property_population > 200000 && feature.property_population < 300000) { // 2nd population tier 
					    var styleOptions = {
					        fillColor: '#43a047',
					        fillOpacity: 0.8,
					        strokeColor: 'black',
					        strokeWeight: 2,
					        strokeOpacity: 0.4
					    };			
					}  else if (feature.property_population < 100000) { // 5th population tier
					    var styleOptions = {
						        fillColor: '#c8e6c9',
						        fillOpacity: 0.8,
						        strokeColor: 'black',
						        strokeWeight: 2,
						        strokeOpacity: 0.4
						    };			
					} else {
					
					    var styleOptions = {
					        fillColor: '#e8f5e9',
					        fillOpacity: 0.5,
					        strokeColor: 'black',
					        strokeWeight: 2,
					        strokeOpacity: 0.4
					    };
					}
					
				
				    return styleOptions;
				});
				
				regionGeoJson.forEach(function(geojson) {
				    map5.data.addGeoJson(geojson);
			
				});
	
				// region data
			    map5.data.addListener('mouseover', function(e) {
			        var feature = e.feature,
		            regionName = feature.getProperty('SIG_KOR_NM'),
		            pop = feature.getProperty('population'),
		            inc = feature.getProperty('income').toString(),
		            regionIncome = inc.concat("만원");
			        
			        tooltip2.css({
			            display: '',
			            left: e.offset.x,
			            top: e.offset.y
			        }).text(regionName + ",인구:"+pop+"명"+",월소득:"+ regionIncome);
	
			        map5.data.overrideStyle(feature, {
			            fillOpacity: 0.6,
			            strokeWeight: 4,
			            strokeOpacity: 1
			        });
			    });
				
			    map5.data.addListener('mouseout', function(e) {
			        tooltip2.hide().empty();
			        map5.data.revertStyle();
			    });		
			    
				var circle = new naver.maps.Circle({
				    map: map5,
				    center: new naver.maps.LatLng(x,y),
				    radius: dist,
					strokeColor: 'black',
					strokeOpacity: 1,
					strokeWeight: 3
				});			
				
				// Facility location
				var circle5_x = new naver.maps.Circle({
				    map: map5,
				    center: new naver.maps.LatLng(x, y),
				    radius: 10,
					strokeColor: 'black',
					strokeOpacity: 1,
					strokeWeight: 5
				});
				
				
			}
	//////////////////////////////////// map 6		
			regionGeoJson3 = [];
			idx = 0;
			
			var map6 = new naver.maps.Map(document.getElementById('map6'), {
			zoom: 13,
			mapTypeId: 'normal',
			center: new naver.maps.LatLng(x,y)
			});
			
	
	
			var tooltip3 = $('<div style="position:absolute;z-index:1000;padding:5px 10px;background-color:#fff;border:solid 2px #000;font-size:14px;pointer-events:none;display:none;"></div>');
	
			tooltip3.appendTo(map6.getPanes().floatPane);
	
			naver.maps.Event.once(map6, 'init_stylemap', function () {
			    $.getJSON("./bd_hjd_orders.json", function(data){
					
			    	for (var i = 0; i < data.features.length; i++) {
			    		regionGeoJson3[i] = data.features[i];
			
			    	}
			
			 		startDataLayer3();
			    		
			    }).fail(function(){
			        console.log("An error has occurred.");
			    });
			
			});
			
			function startDataLayer3() {
				map6.data.setStyle(function(feature) {
					if(feature.property_l6m_order > 600000) { // 1st population tier 
					    var styleOptions = {
						        fillColor: '#b71c1c',
						        fillOpacity: 0.8,
						        strokeColor: 'black',
						        strokeWeight: 2,
						        strokeOpacity: 0.4
						    };	
					} else if (feature.property_l6m_order > 400000 && feature.property_l6m_order < 600000) { // 2nd population tier 
					    var styleOptions = {
					        fillColor: '#d32f2f',
					        fillOpacity: 0.7,
					        strokeColor: 'black',
					        strokeWeight: 2,
					        strokeOpacity: 0.4
					    };	
					} else if (feature.property_l6m_order > 200000 && feature.property_l6m_order < 400000) { // 2nd population tier 
					    var styleOptions = {
					        fillColor: '#f44336',
					        fillOpacity: 0.7,
					        strokeColor: 'black',
					        strokeWeight: 2,
					        strokeOpacity: 0.4
					    };			
					}  else if (feature.property_l6m_order > 100000 && feature.property_l6m_order < 200000) { // 5th population tier
					    var styleOptions = {
						        fillColor: '#ef5350',
						        fillOpacity: 0.6,
						        strokeColor: 'black',
						        strokeWeight: 2,
						        strokeOpacity: 0.4
						    };		
					}  else if (feature.property_l6m_order > 50000 && feature.property_l6m_order < 100000) { // 5th population tier
					    var styleOptions = {
						        fillColor: '#e57373',
						        fillOpacity: 0.6,
						        strokeColor: 'black',
						        strokeWeight: 2,
						        strokeOpacity: 0.4
						    };	
					}  else if (feature.property_l6m_order > 10000 && feature.property_l6m_order < 50000) { // 5th population tier
					    var styleOptions = {
						        fillColor: '#ef9a9a',
						        fillOpacity: 0.5,
						        strokeColor: 'black',
						        strokeWeight: 2,
						        strokeOpacity: 0.4
						    };	
					}  else if (feature.property_l6m_order < 10000) { // 5th population tier
					    var styleOptions = {
						        fillColor: '#ffcdd2',
						        fillOpacity: 0.5,
						        strokeColor: 'black',
						        strokeWeight: 2,
						        strokeOpacity: 0.4
						    };	
					} else {
					
					    var styleOptions = {
					        fillColor: '#ffebee',
					        fillOpacity: 0.5,
					        strokeColor: 'black',
					        strokeWeight: 2,
					        strokeOpacity: 0.4
					    };
					}
					
						
				    return styleOptions;
				});
				
				regionGeoJson3.forEach(function(geojson) {
				    map6.data.addGeoJson(geojson);
			
				});
	
				// region data
			    map6.data.addListener('mouseover', function(e) {
			        var feature = e.feature,
		            regionName = feature.getProperty('adm_nm'),
		            order = feature.getProperty('l6m_order');
			        
			        tooltip3.css({
			            display: '',
			            left: e.offset.x,
			            top: e.offset.y
			        }).text(regionName + ", order:"+ order);
	
			        map6.data.overrideStyle(feature, {
			            fillOpacity: 0.6,
			            strokeWeight: 4,
			            strokeOpacity: 1
			        });
			    });
				
			    map6.data.addListener('mouseout', function(e) {
			        tooltip3.hide().empty();
			        map6.data.revertStyle();
			    });			
	
				var circle3 = new naver.maps.Circle({
				    map: map6,
				    center: new naver.maps.LatLng(x,y),
				    radius: dist,
					strokeColor: 'black',
					strokeOpacity: 1,
					strokeWeight: 3
				});
			    
				// Facility location
				var circle6_x = new naver.maps.Circle({
				    map: map6,
				    center: new naver.maps.LatLng(x, y),
				    radius: 10,
					strokeColor: 'black',
					strokeOpacity: 1,
					strokeWeight: 5
				});
				
				
			}	
		}	
	});
	
////////////////////////////////////////////// end //////////////////////////////////////////
	
	
});