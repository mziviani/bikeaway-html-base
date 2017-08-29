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
	var campi = $('.row.dettagli .col-md-6:nth-child(2) strong');
	var lunghezza = $('.lunghezza div');

	for (var i = 0; i<lunghezza.length; i++) {
		var secondi = (parseInt($(lunghezza[i]).text())/velocitaDaUsare)*60*60;

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

//gestione mappa
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
																			fullscreenControl: false
																		});

																		//marker esempi
																		addMarker(mapHome,'1',45.43838419999999,10.991621500000065 )
																		addMarker(mapHome,'2',46.43838419999999,11.991621500000065 )

																		alert(mapHome.getZoom())
		 }

		 function addMarker(map,label,lat,lng) {
			 /*var image = {
    url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(20, 32),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    anchor: new google.maps.Point(0, 32)
  };*/

			 var marker = new google.maps.Marker({
					 position: {lat: lat, lng: lng},
					 map: map,
					 label: {text: label, color: "white"},
					 image: 'url',
					 clickable: true
				 });

				 var infowindow = new google.maps.InfoWindow({
    	 			content: '<h1>ciao</h1>'
  				});

				marker.addListener('click', function() {
	    														infowindow.open(map, marker);
	  														});
		 }
