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
		$('#piede #preference p.msg.error').hide().fadeIn().delay(1500).fadeOut(function() {this.remove();
																							$('#velocita').removeAttr('disabled');
																							$('#setVelocita').removeAttr('disabled');
																							});
	}
}

function abilitaBtnPreferenze() {
	$('#piede #preference p.msg').replaceWith('<p class="msg ok">salvato</p>');
	$('#piede #preference p.msg.ok').delay(1500).fadeOut(function() {
																				this.remove();
																				$('#velocita').removeAttr('disabled');
																				$('#setVelocita').removeAttr('disabled');
																			});
}

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

