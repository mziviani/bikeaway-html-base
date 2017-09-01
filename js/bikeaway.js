//riga 219 cambira url immagine pin mappa

//funzione controllo dimensione finestra
function windowMobile() {
	var size = $(window).width();
	if(size<768) {
		return true;
	} else {
		return false;
	}
}
//variabile per timeout funzione di resize
var resizeAction;

//inizializzazione larghezza barra ricerca avanzata
function initLarghezzaSearch() {
	resizeLarghezzaSearch();
	$(window).resize(function() {clearTimeout(resizeAction);
															resizeAction = setTimeout(resizeLarghezzaSearch, 150);
															});
	//botton filtri avanzati
	$('#search-advanced-view a:nth-child(1)').click(visualizzaFiltriAvanzati);

}

//ridimensionamento ricerca avanzata
function resizeLarghezzaSearch() {
		var sao = $('#search-advanced-options');

		if(!windowMobile()){
			var larghezza = $('#search-field #search-field-group').outerWidth();
			larghezza += $('#search-field input[type="submit"]').outerWidth();
			larghezza += 40;
			sao.attr('style', 'width:'+larghezza+'px;'+sao.attr('style'));

		} else {
			sao.removeAttr('style');
		}
}

//set visibilità ed etichetta filtri avanzati
function visualizzaFiltriAvanzati() {
	var sao = $('#search-advanced-options');
	var a = $('#search-advanced-view a:nth-child(1)');
	var span = $('#search-advanced-view a:nth-child(1) span');

	if(sao.hasClass('hidden')) {
		sao.removeClass('hidden');
		span.removeClass('glyphicon-option-horizontal');
		span.addClass('glyphicon-trash');
		a.addClass('remove');
	} else {
		sao.addClass('hidden');
		span.removeClass('glyphicon-trash');
		span.addClass('glyphicon-option-horizontal');
		a.removeClass('remove');

		//svuotare i valori dei campi di input
		$("#search-advanced-options input[type='text']").val(null);
		$("#search-advanced-options select").val(0);
		$('#search-advanced-options input:checkbox:checked').prop('checked', false);

	}
}


//gestione cookie per preferenza velocità
function initCookie() {

	var cookieVel = $.cookie('velPref');

	if(cookieVel==null) {
		setVelocita();
	} else {
		setVelocita(cookieVel);
	}

	//imposto il bottone per il cambio
	$('#setVelocita').click(btnVelocita);
}

//cambio velocità preferenza
function btnVelocita() {
	var velocita = $('#velocita').val();

	if (!isNaN(velocita) && velocita > 0 && velocita < 100) {
		//1. disabilito i bottoni
		$('#velocita').attr('disabled', 'disabled');
		$('#setVelocita').attr('disabled', 'disabled');

		//2. visualizzo il messaggio
		$('#piede #preference').append('<p class="msg wait">ricalcolo</p>');
		$('#piede #preference p.msg.wait').hide().fadeIn();



		//3. imposto la velocita
		setVelocita(velocita);

		//4. imposto il cookie
		$.cookie('velPref', velocita, { expires: 365 });

		//5. riabilito i pulsanti
		setTimeout(abilitaBtnPreferenze, 1500);
	} else {
		$('#velocita').attr('disabled', 'disabled');
		$('#setVelocita').attr('disabled', 'disabled');
		$('#piede #preference').append('<p class="msg error">valore non valido</p>');
		$('#piede #preference p.msg.error').hide().fadeIn().delay(1500).fadeOut(function() {	this.remove();
																																													$('#velocita').removeAttr('disabled');
																																													$('#setVelocita').removeAttr('disabled');

																																													//carico il cookie o il valore di default
																																													var velocitaSdt = $.cookie('velPref');

																																													if (velocitaSdt == null || isNaN(velocitaSdt)) {
																																														$('#velocita').val(8);
																																													} else {
																																															$('#velocita').val(velocitaSdt);
																																													}
																																												});

	}
}

// messaggio preferenza e abilitazione pulsanti
function abilitaBtnPreferenze() {
	$('#piede #preference p.msg').replaceWith('<p class="msg ok">salvato</p>');
	$('#piede #preference p.msg.ok').delay(1500).fadeOut(function() {
																				this.remove();
																				$('#velocita').removeAttr('disabled');
																				$('#setVelocita').removeAttr('disabled');
																			});
}

//funzione per impostare e calcolare il tempo del percorso in base della velocità
function setVelocita(vel) {
	var velocitaDaUsare = 0;
	if ((isNaN(vel) || vel==null) || vel<1 || vel> 99)   {
		//velocità di default
		velocitaDaUsare = 8;
	} else {
		//velocità carcata da cookie
		velocitaDaUsare = vel;

	}

	//funzione di calcolo della velocità
	var campi = $('.row.dettagli .col-md-6:nth-child(2) strong, #dettagli #tempo strong');
	var lunghezza = $('.lunghezza strong');

	for (var i = 0; i<lunghezza.length; i++) {
		var secondi = (parseInt($(lunghezza[i]).text())/velocitaDaUsare)*60*60;

		console.log(parseInt($(lunghezza[i]).text()));

		 var hours   = Math.floor(secondi / 3600);
		var minutes = Math.floor((secondi - (hours * 3600)) / 60);
		var seconds = Math.ceil(secondi - (hours * 3600) - (minutes * 60));

		if(hours<10) {hours = '0'+hours};
		if(minutes<10) {minutes = '0'+minutes};
		if (seconds<10) {seconds = '0'+seconds};

		$(campi[i]).text(hours+":"+minutes+":"+seconds);
	}

	//imposto le preferenze con il numero corretto
	$('#velocita').val(velocitaDaUsare);

}

//gestione mappa home
var mapHome;

//posizione verona centro
var latDefault = 45.43838419999999;
var lngDefault = 10.991621500000065;

		 function initMapHome() {
				if (navigator.geolocation) {
				     navigator.geolocation.getCurrentPosition(setLatLngDefault, fallbackMap);
				} else {
					setMapHome();
				}
		 }

		function setLatLngDefault(position) {
			 latDefault = position.coords.latitude;
			 lngDefault = position.coords.longitude;
			 setMapHome();
		 }

		 function fallbackMap() {
			 setMapHome();
			}

		 function setMapHome() {
			 mapHome = new google.maps.Map(document.getElementById('map'), {
																			center: {lat: latDefault, lng: lngDefault},
																			zoom: 13,
																			streetViewControl: false,
																			fullscreenControl: false,
																			mapTypeControl: false

																		});

																		//marker esempi chiamata ajax
																		addMarker(mapHome,'1',45.43838419999999,10.991621500000065 )
																		addMarker(mapHome,'1',45.44,10.99163 )


		 }

		 function addMarker(map,label,lat,lng) {

			 var marker = new google.maps.Marker({
					 position: {lat: lat, lng: lng},
					 map: map,
					 label: {text:label, color:'white'},
					 icon: 'http://localhost/html-template/images/pinhome.png',
					 clickable: true
				 });
				 var infowindow = new google.maps.InfoWindow({
    	 			content: '<h6 class="titlemap"><a href="#">I monumenti di verona</a></h6><p class="textmap">Difficoltà <span class="full"></span><span class="full"></span><span></span></p><p class="textmap">Strada <strong>Asfalto</strong></p><p class="textmap">Pendenza <strong>2%</strong></p><p class="tagsmap"><span class="glyphicon glyphicon-tags" aria-hidden="true"></span> Relax</p>'
  				});

				marker.addListener('click', function() {
	    														infowindow.open(map, marker);
	  														});



		 }
		 function addMarkerNoLabel(map,lat,lng) {

			var marker = new google.maps.Marker({
					position: {lat: lat, lng: lng},
					map: map,
					icon: 'http://localhost/html-template/images/pinhome.png',
					clickable: true
				});
				var infowindow = new google.maps.InfoWindow({
					 content: '<h6 class="titlemap"><a href="#">I monumenti di verona</a></h6><p class="textmap">Difficoltà <span class="full"></span><span class="full"></span><span></span></p><p class="textmap">Strada <strong>Asfalto</strong></p><p class="textmap">Pendenza <strong>2%</strong></p><p class="tagsmap"><span class="glyphicon glyphicon-tags" aria-hidden="true"></span> Relax</p>'
				 });

			 marker.addListener('click', function() {
																 infowindow.open(map, marker);
															 });


		}






		 /********* category map *****/
		 function initMapCategory() {

			 mapHome = new google.maps.Map(document.getElementById('map'), {
																		 center: {lat: latDefault, lng: lngDefault},
																		 zoom: 12,
																		 streetViewControl: false,
																		 fullscreenControl: false,
																		 mapTypeControl: false

																	 });



																	//test
																	 addMarkerNoLabel(mapHome,45.43838419999999,10.991621500000065 )
																	 addMarkerNoLabel(mapHome,44.5,10.99163 )
																	 addMarkerNoLabel(mapHome,45.42,9.98 )
																	 addMarkerNoLabel(mapHome,45.5,11 )
																	 addMarkerNoLabel(mapHome,45.6,10.8 )
																	 addMarkerNoLabel(mapHome,45.3,12 )
																	addMarkerNoLabel(mapHome,48,12 )

																		var bounds = new google.maps.LatLngBounds();

																		bounds.extend(new google.maps.LatLng(45.43838419999999, 10.991621500000065));
																		bounds.extend(new google.maps.LatLng(44.5, 10.99163));
																		bounds.extend(new google.maps.LatLng(45.42, 9.98));
																		bounds.extend(new google.maps.LatLng(45.5, 11));
																		bounds.extend(new google.maps.LatLng(45.6, 10.8));
																		bounds.extend(new google.maps.LatLng(45.3, 12));
																		bounds.extend(new google.maps.LatLng(48, 12));
																		mapHome.fitBounds(bounds);

		 }

		function initCategory() {
			var btnfiltri = $('#filter button');
			var order = $('#order #orderInput');

			btnfiltri.click(attivaFiltri);
			order.change(attivaOrdinamento);
		}

		function attivaOrdinamento() {
			alert("creare la funzione di ordinamento 1. disabilitare pulsanti 2. disabilitare visualizzazione 3. ordinare 4. riabilitare")
		}

		function attivaFiltri() {
			var queryRaw = window.location.search.substring(1);
			var queryObj = null;

			var inputLung = $("#lung");
			var inputPend = $("#pend");
			var selectStrada = $("#type");
			var selectDifficolta = $("#diff");
			var inputCheckbox = $("#filter input[type='checkbox']");

			if (queryRaw.length>0 && queryRaw.indexOf("=")>-1) {
					queryObj = $.parseJSON('{"' + decodeURI(queryRaw).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
			}
			if(queryObj!= null) {

				if (queryObj.lung != inputLung.val() && inputLung.val().trim() != '') {
						queryObj.lung =inputLung.val().trim();
				} else if ((inputLung.val().trim() == '' || inputLung.val() == null) && queryObj.lung != null) {
					delete queryObj.lung;
				}

				if (queryObj.pend != inputPend.val() && inputPend.val().trim() != '') {
						queryObj.pend =inputPend.val().trim();
				} else if ((inputPend.val().trim() == '' || inputPend.val() == null) && queryObj.pend != null) {
					delete queryObj.pend;
				}

				if (queryObj.type != selectStrada.val()) {
						queryObj.type =selectStrada.val().trim();
				}

				if (queryObj.diff != selectDifficolta.val()) {
						queryObj.diff =selectDifficolta.val().trim();
				}


				switch (inputCheckbox[0].checked) {
					case true:
							queryObj.vicino=1;
						break;
					case false:
						queryObj.vicino=0;
					break;
				}

				switch (inputCheckbox[1].checked) {
					case true:
							queryObj.bambini=1;
						break;
					case false:
						queryObj.bambini=0;
					break;
				}




			} else {

				queryObj = new Object();

				if (inputLung.val().trim().length>0) {
						queryObj.lung = inputLung.val().trim();
				}

				if (inputPend.val().trim().length>0) {
						queryObj.pend = inputPend.val().trim();
				}
					queryObj.type = selectStrada.val();
					queryObj.diff = selectDifficolta.val();

				if (inputCheckbox[1].checked) {
					queryObj.bambini = 1;
				} else {
					queryObj.bambini = 0;
				}

				if (inputCheckbox[0].checked) {
					queryObj.vicino = 1;
				}	else {
					queryObj.vicino = 0;
				}
			}

			console.log("checked: " + inputCheckbox[1].checked + "\n obj: " + queryObj.bambini);

			//cambio url
			window.history.pushState({}, window.document.title, "?"+$.param(queryObj));
		}
