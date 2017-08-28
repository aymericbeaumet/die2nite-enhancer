Module.register(function() {

	var MODULE_NAME = 'camping_predict_injector';
	/******************
	 * Module context *
	 ******************/

	/**
	* Add the i18n strings for this module.
	*/
	function add_i18n() {
		var i18n = {};

		i18n[I18N.LANG.FR] = {};
		i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Camping Predict';
		i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Ajoute les prévisions de Camping Predict. Plus d\'informations ici : http://zenoo.fr/. Script par Zenoo, intégré avec sa permission. Cliquez pour ouvrir le lien.';
		i18n[I18N.LANG.FR][MODULE_NAME + '_city_hard'] = 'Pandémonium';

		i18n[I18N.LANG.FR][MODULE_NAME + '_search_text'] = 'Rechercher';
		i18n[I18N.LANG.FR][MODULE_NAME + '_search_desc'] = 'Cliquez sur ce lien pour effectuer une recherche sur Camping Predict.';
		i18n[I18N.LANG.FR][MODULE_NAME + '_settings_text'] = 'Paramètres';
		i18n[I18N.LANG.FR][MODULE_NAME + '_settings_desc'] = 'Cliquez sur ce lien pour modifier vos paramètres Camping Predict.';

		i18n[I18N.LANG.FR][MODULE_NAME + '_improvements'] = 'Aménagements';
		i18n[I18N.LANG.FR][MODULE_NAME + '_defense_objects'] = 'ODs d\'amélioration';
		i18n[I18N.LANG.FR][MODULE_NAME + '_hiding_citizens'] = 'Campeurs enterrés';
		i18n[I18N.LANG.FR][MODULE_NAME + '_improvements_required'] = 'Aménagements nécessaires';
		i18n[I18N.LANG.FR][MODULE_NAME + '_tomb'] = 'Tombe creusée';
		i18n[I18N.LANG.FR][MODULE_NAME + '_night'] = 'Nuit';
		i18n[I18N.LANG.FR][MODULE_NAME + '_pro_camper'] = 'Campeur pro';
		i18n[I18N.LANG.FR][MODULE_NAME + '_nights_camped'] = 'Nuits campées';
		i18n[I18N.LANG.FR][MODULE_NAME + '_lighthouse'] = 'Phare';
		i18n[I18N.LANG.FR][MODULE_NAME + '_devastated'] = 'Dévasté';
		i18n[I18N.LANG.FR][MODULE_NAME + '_close'] = 'Fermer';

		i18n[I18N.LANG.FR][MODULE_NAME + '_hero_guide'] = 'Manuel de survie';
		i18n[I18N.LANG.FR][MODULE_NAME + '_hero_hood'] = 'Camouflage';
		i18n[I18N.LANG.FR][MODULE_NAME + '_hero_camera'] = 'Appareil photo';

		i18n[I18N.LANG.FR][MODULE_NAME + '_status_title'] = 'Statut';
		i18n[I18N.LANG.FR][MODULE_NAME + '_status_very_high'] = 'Optimal';
		i18n[I18N.LANG.FR][MODULE_NAME + '_status_high'] = 'Élevé';
		i18n[I18N.LANG.FR][MODULE_NAME + '_status_correct'] = 'Correct';
		i18n[I18N.LANG.FR][MODULE_NAME + '_status_medium'] = 'Satisfaisant';
		i18n[I18N.LANG.FR][MODULE_NAME + '_status_decent'] = 'Limité';
		i18n[I18N.LANG.FR][MODULE_NAME + '_status_limited'] = 'Faible';
		i18n[I18N.LANG.FR][MODULE_NAME + '_status_very_low'] = 'Très faible';
		i18n[I18N.LANG.FR][MODULE_NAME + '_status_null'] = 'Quasi nul';
		i18n[I18N.LANG.FR][MODULE_NAME + '_status_highest'] = 'Correct max';

		i18n[I18N.LANG.FR][MODULE_NAME + '_buildings_none'] = 'Aucun';
		i18n[I18N.LANG.FR][MODULE_NAME + '_buildings_unknown'] = 'Bâtiment non-déterré';
		i18n[I18N.LANG.FR][MODULE_NAME + '_buildings_ambulance'] = 'Ambulance';
		i18n[I18N.LANG.FR][MODULE_NAME + '_buildings_cave'] = 'Caverne';
		i18n[I18N.LANG.FR][MODULE_NAME + '_buildings_home_depot'] = 'BricoTout';
		i18n[I18N.LANG.FR][MODULE_NAME + '_buildings_kebab'] = 'Kebab “Chez Coluche”';
		i18n[I18N.LANG.FR][MODULE_NAME + '_buildings_plane'] = 'Carlingue d\'avion';
		i18n[I18N.LANG.FR][MODULE_NAME + '_buildings_pump'] = 'Vieille Pompe Hydraulique';
		i18n[I18N.LANG.FR][MODULE_NAME + '_buildings_small_house'] = 'Petite maison';
		i18n[I18N.LANG.FR][MODULE_NAME + '_buildings_villa'] = 'Villa délabrée';


		i18n[I18N.LANG.EN] = {};
		i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Camping Predict';
		i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Add Camping Predict predictions. More informations here [FR]: http://zenoo.fr/. Script by Zenoo, integrated with his permission. Click to open link.';
		i18n[I18N.LANG.EN][MODULE_NAME + '_city_hard'] = 'Hardcore';

		i18n[I18N.LANG.EN][MODULE_NAME + '_search_text'] = 'Search';
		i18n[I18N.LANG.EN][MODULE_NAME + '_search_desc'] = 'Click here to search on Camping Predict.';
		i18n[I18N.LANG.EN][MODULE_NAME + '_settings_text'] = 'Settings';
		i18n[I18N.LANG.EN][MODULE_NAME + '_settings_desc'] = 'Click here to edit your Camping Predict settings.';

		i18n[I18N.LANG.EN][MODULE_NAME + '_improvements'] = 'Improvements';
		i18n[I18N.LANG.EN][MODULE_NAME + '_defense_objects'] = 'Improving DO\'s';
		i18n[I18N.LANG.EN][MODULE_NAME + '_hiding_citizens'] = 'Hiding citizens';
		i18n[I18N.LANG.EN][MODULE_NAME + '_improvements_required'] = 'Required improvements';
		i18n[I18N.LANG.EN][MODULE_NAME + '_tomb'] = 'Tomb digged';
		i18n[I18N.LANG.EN][MODULE_NAME + '_night'] = 'Night';
		i18n[I18N.LANG.EN][MODULE_NAME + '_pro_camper'] = 'Pro camper';
		i18n[I18N.LANG.EN][MODULE_NAME + '_nights_camped'] = 'Nights camped';
		i18n[I18N.LANG.EN][MODULE_NAME + '_lighthouse'] = 'Lighthouse';
		i18n[I18N.LANG.EN][MODULE_NAME + '_devastated'] = 'Devastated';
		i18n[I18N.LANG.EN][MODULE_NAME + '_close'] = 'Close';

		i18n[I18N.LANG.EN][MODULE_NAME + '_hero_guide'] = 'Survival Guide';
		i18n[I18N.LANG.EN][MODULE_NAME + '_hero_hood'] = 'Camouflage suit';
		i18n[I18N.LANG.EN][MODULE_NAME + '_hero_camera'] = 'Pre-war Camera';

		i18n[I18N.LANG.EN][MODULE_NAME + '_status_title'] = 'Status';
		i18n[I18N.LANG.EN][MODULE_NAME + '_status_very_high'] = 'Optimal';
		i18n[I18N.LANG.EN][MODULE_NAME + '_status_high'] = 'High';
		i18n[I18N.LANG.EN][MODULE_NAME + '_status_correct'] = 'Correct';
		i18n[I18N.LANG.EN][MODULE_NAME + '_status_medium'] = 'Largely satisfactory';
		i18n[I18N.LANG.EN][MODULE_NAME + '_status_decent'] = 'Decent';
		i18n[I18N.LANG.EN][MODULE_NAME + '_status_limited'] = 'Limited';
		i18n[I18N.LANG.EN][MODULE_NAME + '_status_very_low'] = 'Really poor';
		i18n[I18N.LANG.EN][MODULE_NAME + '_status_null'] = 'Hee haw';
		i18n[I18N.LANG.EN][MODULE_NAME + '_status_highest'] = 'Highest possible';

		i18n[I18N.LANG.EN][MODULE_NAME + '_buildings_none'] = 'None';
		i18n[I18N.LANG.EN][MODULE_NAME + '_buildings_unknown'] = 'Unsearchable zone';
		i18n[I18N.LANG.EN][MODULE_NAME + '_buildings_ambulance'] = 'Ambulance';
		i18n[I18N.LANG.EN][MODULE_NAME + '_buildings_cave'] = 'Cave';
		i18n[I18N.LANG.EN][MODULE_NAME + '_buildings_home_depot'] = 'Home depot';
		i18n[I18N.LANG.EN][MODULE_NAME + '_buildings_kebab'] = 'Fraser D\'s Kebab-ish';
		i18n[I18N.LANG.EN][MODULE_NAME + '_buildings_plane'] = 'Plane Crash Site';
		i18n[I18N.LANG.EN][MODULE_NAME + '_buildings_pump'] = 'Old Hydraulic Pump';
		i18n[I18N.LANG.EN][MODULE_NAME + '_buildings_small_house'] = 'Small House';
		i18n[I18N.LANG.EN][MODULE_NAME + '_buildings_villa'] = 'Derelict Villa';

		I18N.set(i18n);

		batList[I18N.get(MODULE_NAME + "_buildings_none")] = 0;
		batList[I18N.get(MODULE_NAME + "_buildings_unknown")] = 1;
		batList[I18N.get(MODULE_NAME + "_buildings_plane")] = 2;
		batList[I18N.get(MODULE_NAME + "_buildings_pump")] = 3;
		batList[I18N.get(MODULE_NAME + "_buildings_villa")] = 4;
		batList["Supermarché pillé"] = 5;
		batList["Laboratoire cosmétique"] = 6;
		batList["Carcasses de voitures"] = 7;
		batList["Ancien commissariat"] = 8;
		batList["Bar Miteux"] = 9;
		batList["Abri anti-atomique"] = 10;
		batList["Stand de fête foraine"] = 11;
		batList[I18N.get(MODULE_NAME + "_buildings_small_house")] = 12;
		batList["Petit Bois obscur"] = 13;
		batList["Parking désaffecté"] = 14;
		batList["Chantier à l'abandon"] = 15;
		batList["Ecole maternelle brulée"] = 16;
		batList["Pharmacie Détruite"] = 17;
		batList["Fast-food"] = 18;
		batList[I18N.get(MODULE_NAME + "_buildings_home_depot")] = 19;
		batList["Maison d'un citoyen"] = 20;
		batList["Centrale hydraulique"] = 21;
		batList["Armurerie Guns'N'Zombies"] = 22;
		batList[I18N.get(MODULE_NAME + "_buildings_kebab")] = 23;
		batList["Ancien Velib"] = 24;
		batList["Villa de Duke"] = 25;
		batList[I18N.get(MODULE_NAME + "_buildings_cave")] = 27;
		batList["Caveau familial"] = 28;
		batList["Parc à l'abandon"] = 29;
		batList["Carrière effondrée"] = 30;
		batList["Route barrée"] = 31;
		batList["Tranchée aménagée"] = 32;
		batList["Cache de contrebandiers"] = 33;
		batList["Entrepôt désaffecté"] = 34;
		batList["Camion en panne"] = 35;
		batList[I18N.get(MODULE_NAME + "_buildings_ambulance")] = 36;
		batList["Cimetière indien"] = 37;
		batList["Atomic' Café"] = 38;
		batList["Silos à l'abandon"] = 39;
		batList["Meubles kiela"] = 40;
		batList["Epicerie Fargo"] = 41;
		batList["Mini-Market"] = 42;
		batList["Abri de chantier"] = 43;
		batList["Cabane de jardin"] = 44;
		batList["Bibliothèque de quartier"] = 45;
		batList["Bureau de poste"] = 46;
		batList["Hangars de stockage"] = 47;
		batList["Ancien aérodrome"] = 48;
		batList["Immeuble délabré"] = 49;
		batList["Tente d'un citoyen"] = 50;
		batList["Motel “Dusk”"] = 51;
		batList["Mine effondrée"] = 52;
		batList["Gare de triage désertée"] = 53;
		batList["Vieil hôpital de campagne"] = 54;
		batList["Avant-poste militaire"] = 55;
		batList["Camion mairie-mobile"] = 56;
		batList["Caverne anciennement habitée"] = 57;
		batList["Char d'assaut en panne"] = 58;
		batList["Un étrange appareil circulaire"] = 59;
		batList["Puits abandonné"] = 60;
		batList["Relais autoroutier"] = 61;
		batList["Le bar des illusions perdues"] = 62;
		batList["Bunker abandonné"] = 100;
		batList["Hôtel abandonné"] = 101;
		batList["Hôpital abandonné"] = 102;
	}

	var finalStatut, correct, customFinalStatut, customCorrect;

	var storedCityType = localStorage.getItem('storedCityType');
	if(storedCityType === null) storedCityType = 0;
	var storedJob = localStorage.getItem('storedJob');
	if(storedJob === null) storedJob = 0;
	var storedKm = localStorage.getItem('storedKm');
	if(storedKm === null) storedKm = 1;
	var storedBat = localStorage.getItem('storedBat');
	if(storedBat === null) storedBat = 0;
	var storedZomb = localStorage.getItem('storedZomb');
	if(storedZomb === null) storedZomb = 0;
	var storedUpgrade = localStorage.getItem('storedUpgrade');
	if(storedUpgrade === null) storedUpgrade = 0;
	var storedOdUpgrade = localStorage.getItem('storedOdUpgrade');
	if(storedOdUpgrade === null) storedOdUpgrade = 0;
	var storedAlreadyCamped = localStorage.getItem('storedAlreadyCamped');
	if(storedAlreadyCamped === null) storedAlreadyCamped = 0;
	var storedAlreadyHidden = localStorage.getItem('storedAlreadyHidden');
	if(storedAlreadyHidden === null) storedAlreadyHidden = 0;
	var storedPelures = localStorage.getItem('storedPelures');
	if(storedPelures === null) storedPelures = 0;
	var storedToiles = localStorage.getItem('storedToiles');
	if(storedToiles === null) storedToiles = 0;
	var storedTomb = localStorage.getItem('storedTomb');
	if(storedTomb === null) storedTomb = 0;
	var storedNight = localStorage.getItem('storedNight');
	if(storedNight === null) storedNight = 1;
	var storedFurtif = localStorage.getItem('storedFurtif');
	if(storedFurtif === null) storedFurtif = 0;
	var storedCP = localStorage.getItem('storedCP');
	if(storedCP === null) storedCP = 1;
	var storedPhare = localStorage.getItem('storedPhare');
	if(storedPhare === null) storedPhare = 0;
	var storedDevastated = localStorage.getItem('storedDevastated');
	if(storedDevastated === null) storedDevastated = 0;

	var permUpgrade = localStorage.getItem('permUpgrade');
	if(permUpgrade === null) permUpgrade = 0;
	var permOdUpgrade = localStorage.getItem('permOdUpgrade');
	if(permOdUpgrade === null) permOdUpgrade = 0;
	var permAlreadyCamped = localStorage.getItem('permAlreadyCamped');
	if(permAlreadyCamped === null) permAlreadyCamped = 0;
	var permTomb = localStorage.getItem('permTomb');
	if(permTomb === null) permTomb = 1;
	var permNight = localStorage.getItem('permNight');
	if(permNight === null) permNight = 1;
	var permCP = localStorage.getItem('permCP');
	if(permCP === null) permCP = 1;
	var permPhare = localStorage.getItem('permPhare');
	if(permPhare === null) permPhare = 0;
	var permDevastated = localStorage.getItem('permDevastated');
	if(permDevastated === null) permDevastated = 0;

	var batList = {};

	function loadCustomChances() {
		var villeVal = +typeVille(storedCityType);
		var kmVal = +distance(storedKm);
		var zoneVal = +zone(storedBat);
		var zombVal = +zombie(storedZomb, storedFurtif);
		var ameVal = +storedUpgrade;
		var ODVal = +calcBonusOD(storedOdUpgrade);
		var cingVal = +camping(storedAlreadyCamped, storedCP, storedCityType);
		var ceurVal = +campeur(storedAlreadyHidden);
		var peauVal = +calcBonusPeau(storedPelures);
		var tenteVal = +calcBonusTente(storedToiles);
		var tombVal = +calcBonusTomb(storedTomb);
		var nuitVal = +calcBonusNuit(storedNight);
		var pharVal = +calcBonusPhare(storedPhare);
		var devastVal = +calcMalusDevast(storedDevastated);

		var result = +villeVal + kmVal + zoneVal + zombVal + ameVal + ODVal + cingVal + ceurVal + peauVal + tenteVal + tombVal + nuitVal + pharVal + devastVal;

		result = round100(result);
		var opti = round10(-result);
		customCorrect = round10(opti - 2);

		var statut = "Error";

		if (result >= 0)
			statut = I18N.get(MODULE_NAME + '_status_very_high');
		else if (result < 0 && result > -2)
			statut = I18N.get(MODULE_NAME + '_status_high');
		else if (result <= -2 && result > -4)
			statut = I18N.get(MODULE_NAME + '_status_correct');
		else if (result <= -4 && result > -7)
			statut = I18N.get(MODULE_NAME + '_status_medium');
		else if (result <= -7 && result > -10)
			statut = I18N.get(MODULE_NAME + '_status_decent');
		else if (result <= -10 && result > -14)
			statut = I18N.get(MODULE_NAME + '_status_limited');
		else if (result <= -14 && result > -18)
			statut = I18N.get(MODULE_NAME + '_status_very_low');
		else if (result <= -18)
			statut = I18N.get(MODULE_NAME + '_status_null');

		var statut2 = statut;

		if (result >= -2)
			statut2 = I18N.get(MODULE_NAME + "_status_highest");

		if(storedJob == 1)
			customFinalStatut = statut;
		else
			customFinalStatut = statut2;

		$('#editor').next().find('.searchResult').show();
		$('#finalStatut').text(customFinalStatut);
		if(storedJob == 1)
			$('#correct').text(opti);
		else
			$('#correct').text(customCorrect);
	}

	function updateParam() {
		$('#permUpgrade input').val(permUpgrade);

		$('#permOdUpgrade input').val(permOdUpgrade);

		$('#permAlreadyCamped input').val(permAlreadyCamped);

		if(permTomb == 1) $('#permTomb input').prop( "checked", true );

		if(permNight == 1) $('#permNight input').prop( "checked", true );

		if(permCP == 1) $('#permCP input').prop( "checked", true );

		if(permPhare == 1) $('#permPhare input').prop( "checked", true );

		if(permDevastated == 1) $('#permDevastated input').prop( "checked", true );

		loadChances();
		$('#finalStatut').text(finalStatut);
		$('#correct').text(correct);
	}

	function updateSearch() {
		$('#storedCityType span[data-value="'+storedCityType+'"]').css({
			'text-decoration':'none',
			'color':'#f0d79e'
		});
		$('#storedCityType span[data-value!="'+storedCityType+'"]').css({
			'text-decoration':'line-through',
			'color':'grey'
		});

		$('#storedJob img[data-value="'+storedJob+'"]').css('opacity','1');
		$('#storedJob img[data-value!="'+storedJob+'"]').css('opacity','0.4');

		$('#storedKm input').val(storedKm);

		displayBat();
		$('#storedBat select option[value="'+storedBat+'"]').prop('selected', true);

		$('#storedZomb input').val(storedZomb);

		$('#storedUpgrade input').val(storedUpgrade);

		$('#storedOdUpgrade input').val(storedOdUpgrade);

		$('#storedAlreadyCamped input').val(storedAlreadyCamped);

		$('#storedAlreadyHidden input').val(storedAlreadyHidden);

		$('#storedPelures input').val(storedPelures);

		$('#storedToiles input').val(storedToiles);

		if(storedTomb == 1)
			$('#storedTomb input').prop( "checked", true );

		if(storedNight == 1)
			$('#storedNight input').prop( "checked", true );

		if(storedFurtif == 1)
			$('#storedFurtif input').prop( "checked", true );
		if(storedJob == 2)
			$('#storedFurtif').show();

		if(storedCP == 1)
			$('#storedCP input').prop( "checked", true );

		if(storedPhare == 1)
			$('#storedPhare input').prop( "checked", true );

		if(storedDevastated == 1)
			$('#storedDevastated input').prop( "checked", true );

		loadCustomChances();
	}

	function displayBat() {
		var km=storedKm;
		if (km >= 0 && km <= 28) {
			var liste = '<option value="0">-------------------' + I18N.get(MODULE_NAME + "_buildings_none") + '-------------------</span></option>';
			if (km >= 1 && km <= 24) {
				liste += '<option value="1">' + I18N.get(MODULE_NAME + "_buildings_unknown") + '</option>';
			}

			if (km >= 10 && km <= 13) {
				liste += '<option value="10">Abri anti-atomique</option>';
			}

			if (km >= 6 && km <= 9) {
				liste += '<option value="43">Abri de chantier</option>';
			}

			if (km >= 2 && km <= 5) {
				liste += '<option value="36">' + I18N.get(MODULE_NAME + "_buildings_ambulance") + '</option>';
			}

			if (km >= 12 && km <= 15) {
				liste += '<option value="48">Ancien Aerodrome</option>';
			}

			if (km >= 6 && km <= 9) {
				liste += '<option value="8">Ancien commissariat</option>';
			}

			if (km >= 4 && km <= 7) {
				liste += '<option value="24">Ancien Velib</option>';
			}

			if (km >= 5 && km <= 8) {
				liste += '<option value="22">Armurerie Guns\'N\'Zombies</option>';
			}

			if (km >= 6 && km <= 9) {
				liste += '<option value="38">Atomic\' Café</option>';
			}

			if (km >= 16 && km <= 19) {
				liste += '<option value="55">Avant-Poste Militaire</option>';
			}

			if (km >= 5 && km <= 8) {
				liste += '<option value="9">Bar Miteux</option>';
			}

			if (km >= 6 && km <= 9) {
				liste += '<option value="45">Bibliothèque de quartier</option>';
			}

			if (km >= 5 && km <= 8) {
				liste += '<option value="19">' + I18N.get(MODULE_NAME + "_buildings_home_depot") + '</option>';
			}

			if (km >= 5 && km <= 28) {
				liste += '<option value="100">Bunker abandonné (ruine)</option>';
			}

			if (km >= 8 && km <= 11) {
				liste += '<option value="46">Bureau de poste</option>';
			}

			if (km >= 6 && km <= 9) {
				liste += '<option value="44">Cabane de jardin</option>';
			}

			if (km >= 2 && km <= 5) {
				liste += '<option value="33">Cache de contrebandiers</option>';
			}

			if (km >= 2 && km <= 5) {
				liste += '<option value="35">Camion en panne</option>';
			}

			if (km >= 16 && km <= 19) {
				liste += '<option value="56">Camion mairie-mobile</option>';
			}

			if (km >= 3 && km <= 6) {
				liste += '<option value="7">Carcasses de voitures</option>';
			}

			if (km >= 4 && km <= 7) {
				liste += '<option value="2">' + I18N.get(MODULE_NAME + "_buildings_plane") + '</option>';
			}

			if (km >= 3 && km <= 6) {
				liste += '<option value="30">Carrière effondrée</option>';
			}

			if (km >= 3 && km <= 6) {
				liste += '<option value="28">Caveau familial</option>';
			}

			if (km >= 3 && km <= 6) {
				liste += '<option value="27">' + I18N.get(MODULE_NAME + "_buildings_cave") + '</option>';
			}

			if (km >= 16 && km <= 19) {
				liste += '<option value="57">Caverne anciennement habitée</option>';
			}

			if (km >= 5 && km <= 8) {
				liste += '<option value="21">Centrale hydraulique</option>';
			}

			if (km >= 4 && km <= 7) {
				liste += '<option value="15">Chantier à l\'abandon</option>';
			}

			if (km >= 21 && km <= 28) {
				liste += '<option value="58">Char d\'assaut en panne</option>';
			}

			if (km >= 3 && km <= 6) {
				liste += '<option value="37">Cimetière indien</option>';
			}

			if (km >= 3 && km <= 6) {
				liste += '<option value="16">Ecole maternelle brulée</option>';
			}

			if (km >= 2 && km <= 5) {
				liste += '<option value="34">Entrepôt désaffecté</option>';
			}

			if (km >= 6 && km <= 9) {
				liste += '<option value="41">Epicerie Fargo</option>';
			}

			if (km >= 6 && km <= 9) {
				liste += '<option value="18">Fast Food</option>';
			}

			if (km >= 10 && km <= 13) {
				liste += '<option value="53">Gare de triage désertée</option>';
			}

			if (km >= 15 && km <= 18) {
				liste += '<option value="47">Hangars de stockage</option>';
			}

			if (km >= 5 && km <= 28) {
				liste += '<option value="102">Hôpital abandonné (ruine)</option>';
			}

			if (km >= 5 && km <= 28) {
				liste += '<option value="101">Hôtel abandonné (ruine)</option>';
			}

			if (km >= 10 && km <= 13) {
				liste += '<option value="49">Immeuble délabré</option>';
			}

			if (km >= 3 && km <= 6) {
				liste += '<option value="23">' + I18N.get(MODULE_NAME + "_buildings_kebab") + '</option>';
			}

			if (km >= 2 && km <= 5) {
				liste += '<option value="6">Laboratoire cosmétique</option>';
			}

			if (km >= 21 && km <= 28) {
				liste += '<option value="62">Le bar des illusions perdues</option>';
			}

			if (km >= 1 && km <= 4) {
				liste += '<option value="20">Maison d\'un citoyen</option>';
			}

			if (km >= 4 && km <= 7) {
				liste += '<option value="40">Meubles kiela</option>';
			}

			if (km >= 12 && km <= 15) {
				liste += '<option value="52">Mine effondrée</option>';
			}

			if (km >= 8 && km <= 11) {
				liste += '<option value="42">Mini-Market</option>';
			}

			if (km >= 12 && km <= 15) {
				liste += '<option value="51">Motel “Dusk”</option>';
			}

			if (km >= 4 && km <= 7) {
				liste += '<option value="29">Parc à l\'abandon</option>';
			}

			if (km >= 3 && km <= 6) {
				liste += '<option value="14">Parking désaffecté</option>';
			}

			if (km >= 2 && km <= 5) {
				liste += '<option value="13">Petit Bois obscur</option>';
			}

			if (km >= 2 && km <= 5) {
				liste += '<option value="12">' + I18N.get(MODULE_NAME + "_buildings_small_house") + '</option>';
			}

			if (km >= 4 && km <= 7) {
				liste += '<option value="17">Pharmacie Détruite</option>';
			}

			if (km >= 17 && km <= 20) {
				liste += '<option value="60">Puits abandonné</option>';
			}

			if (km >= 8 && km <= 11) {
				liste += '<option value="61">Relais autoroutier</option>';
			}

			if (km >= 4 && km <= 7) {
				liste += '<option value="31">Route barrée</option>';
			}

			if (km >= 8 && km <= 11) {
				liste += '<option value="39">Silos à l\'abandon</option>';
			}

			if (km >= 5 && km <= 8) {
				liste += '<option value="11">Stand de fête foraine</option>';
			}

			if (km >= 4 && km <= 7) {
				liste += '<option value="5">Supermarché pillé</option>';
			}

			if (km >= 12 && km <= 15) {
				liste += '<option value="50">Tente d\'un citoyen</option>';
			}

			if (km >= 5 && km <= 8) {
				liste += '<option value="32">Tranchée aménagée</option>';
			}

			if (km >= 21 && km <= 28) {
				liste += '<option value="59">Un étrange appareil circulaire</option>';
			}

			if (km >= 16 && km <= 19) {
				liste += '<option value="54">Vieil hôpital de campagne</option>';
			}

			if (km >= 3 && km <= 6) {
				liste += '<option value="3">' + I18N.get(MODULE_NAME + "_buildings_pump") + '</option>';
			}

			if (km >= 12 && km <= 15) {
				liste += '<option value="25">Villa de Duke</option>';
			}

			if (km >= 3 && km <= 6) {
				liste += '<option value="4">' + I18N.get(MODULE_NAME + "_buildings_villa") + '</option>';
			}

			$("#storedBat select").html(liste);
		}
	}

	function round10(val) {
		var valRound = (Math.round(val*10))/10;
		return valRound;
	}

	function round100(val) {
		var valRound = (Math.round(val*100))/100;
		return valRound;
	}

	function inArray(cible, tableau) {
		var length = tableau.length;
		for(var i = 0; i < length; i++) {
			if(tableau[i] == cible)
				return true;
		}
		return false;
	}

	function typeVille(ville) {
		var villeVal;
		if (ville == 0 || ville == 1) {
			villeVal = 0;
		} else if (ville == 2) {
			villeVal = -14;
		}

		return villeVal;
	}

	function distance(km) {
		if (km == 1)
			return -24;
		else if (km == 2)
			return -19;
		else if (km == 3)
			return -14;
		else if (km == 4)
			return -11;
		else if (km >= 5 && km <= 11)
			return -9;
		else if (km == 12)
			return -8;
		else if (km >= 13 && km <= 14)
			return -7;
		else if (km == 15)
			return -6;
		else if (km >= 16)
			return -5;
	}

	function zone(bat) {
		var suicide0 = [28];
		var suicide1 = [60];
		var suicide2 = [0,100,101,102];
		var suicide3 = [37];
		var rien = [5];
		var bien = [2,3,4,6,7,9,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,27,29,30,31,34,35,36,38,39,40,41,42,43,44,45,46,47,48,49,51,52,53,54,56,57,59,61];
		var correctes = [32,55,58,62];
		var bonnes = [8,50];
		var ideal = [10];

		if (inArray(bat, suicide0)) //suicide0
			return 2;
		else if (inArray(bat, suicide1)) //suicide1
			return 1;
		else if (inArray(bat, suicide2)) //suicide2
			return 0;
		else if (inArray(bat, suicide3)) //suicide3
			return -5;
		else if (inArray(bat, rien)) //rien
			return 5;
		else if (inArray(bat, bien)) //bien
			return 7;
		else if (inArray(bat, correctes)) //correctes
			return 9;
		else if (inArray(bat, bonnes)) //bonnes
			return 11;
		else if (inArray(bat, ideal)) //ideal2
			return 15;
		else if (bat == 1 || bat == 33) //cas particulie du batiment non deterre et de la cache du contrebandier
			return 8;
		else
			return 0;
	}

	function zombie(zomb, furtif) {
		var Z;
		if (furtif == 1) {
			Z = -0.6*zomb;
		} else if (furtif == 0) {
			Z = -1.4*zomb;
		}
		return Z;
	}

	/**
	 * Calcule le bonus donné par un nombre d'ODs
	 * @param  {int} OD Nombre d'OD installés
	 * @return {int}    Bonus total
	 */
	function calcBonusOD(OD) {
		var O = 1.8*OD;
		return O;
	}

	function camping(cing, pro, ville) {
		var C = 0;

		if (ville == 0 || ville == 1) {
			//RE ou RNE
			if (pro == 0) {
				// Non campeur pro
				if (cing == 1)
					C = -4; //S8
				else if (cing == 2)
					C = -9; //S8
				else if (cing == 3)
					C = -13; //S8
				else if (cing == 4)
					C = -16; //S8
				else if (cing == 5)
					C = -26; //S8
				else if (cing == 6)
					C = -36; //S8
			} else if (pro == 1) {
				// Campeur pro
				if (cing == 1)
					C = -2; //S8
				else if (cing == 2)
					C = -4; //S8
				else if (cing == 3)
					C = -8;
				else if (cing == 4)
					C = -10;
				else if (cing == 5)
					C = -12;
				else if (cing == 6)
					C = -16;
				else if (cing == 7)
					C = -26;
				else if (cing == 8)
					C = -37;
			}
		}
		else if (ville == 2) {
			// Pande
			if (pro == 0) {
				// Non campeur pro
				if (cing == 1)
					C = -4;
				else if (cing == 2)
					C = -6;
				else if (cing == 3)
					C = -8;
				else if (cing == 4)
					C = -10;
			} else if (pro == 1) {
				// Campeur pro
				if (cing == 1)
					C = -1; //S8
				else if (cing == 2)
					C = -2; //S8
				else if (cing == 3)
					C = -4; //S8
				else if (cing == 4)
					C = -6; //S8
				else if (cing == 5)
					C = -8; //S8
				else if (cing == 6)
					C = -10; //S8
				else if (cing == 7)
					C = -20; //S8
			}
		}

		return C;
	}

	function campeur(ceur)
	{
		var C;
		if (ceur == 0)
			C = 0;
		else if (ceur == 1)
			C = 0;
		else if (ceur == 2)
			C = -2;
		else if (ceur == 3)
			C = -5;
		else if (ceur == 4)
			C = -10;
		else if (ceur == 5)
			C = -14;
		else if (ceur == 6)
			C = -14;
		else if (ceur == 7)
			C = -14;

		return C;
	}

	/**
	 * Calcule le bonus donné par un nombre de peaux posées
	 * @param  {int} OD Nombre de peaux posées
	 * @return {int}    Bonus total
	 */
	function calcBonusPeau(peau)
	{
		var P = peau * 1;
		return P;
	}

	/**
	 * Calcule le bonus donné par un nombre de tentes posées
	 * @param  {int} OD Nombre de tentes posées
	 * @return {int}    Bonus total
	 */
	function calcBonusTente(tente)
	{
		var T = tente * 1;
		return T;
	}

	/**
	 * Renvoi le bonus de la tombe si creusée  
	 * @param  {bool}	tomb	Tombe creusée
	 * @return {int}			Bonus total
	 */
	function calcBonusTomb(tomb)
	{
		var T = tomb * 1.9;
		return T;
	}

	/**
	 * Retourne le bonus de la nuit (19h - 7h)
	 * @param  {bool}   nuit    Nuit tombée
	 * @return {int}			Bonus total
	 */
	function calcBonusNuit(nuit)
	{
		var N = nuit * 2;
		return N;
	}

	/**
	 * Retourne le bonus donné par le phare
	 * @param  {bool} phar Phare construit
	 * @return {int}      Bonus total
	 */
	function calcBonusPhare(phar)
	{
		var P = phar * 5;
		return P;
	}

	/**
	 * Retourne le malus donnée par la ville dévastée
	 * @param  {bool} devast Ville dévastée
	 * @return {int}        Malus donné
	 */
	function calcMalusDevast(devast)
	{
		var D = devast * -10;
		return D;
	}

	function loadChances(){
		// RE = 0 / RNE = 1 / PANDE = 2
		var cityType;
		if($('div#clock div.day span.hard').text() == '[' + I18N.get(MODULE_NAME + "_city_hard") + ']') cityType = 2;
		else cityType = 0;

		// Mite = 1 / Eclai = 2 / Autre = 0
		var job;

		// Bonus de héros
		if($('div.infoBar ul.inv li:first-child img[src*="small_more2.gif"]').length == 0) {
			if($('div.infoBar ul.inv li:first-child img').attr('onmouseover').indexOf(I18N.get(MODULE_NAME + "_hero_camera")) >= 0) {
				// APAG
				if($('div.infoBar ul.inv li:eq(1) img').attr('onmouseover').indexOf(I18N.get(MODULE_NAME + "_hero_guide")) >= 0)
					job = 1;
				else if($('div.infoBar ul.inv li:eq(1) img').attr('onmouseover').indexOf(I18N.get(MODULE_NAME + "_hero_hood")) >= 0)
					job = 2;
				else
					job = 0;
			} else {
				// No APAG
				if($('div.infoBar ul.inv li:eq(0) img').attr('onmouseover').indexOf(I18N.get(MODULE_NAME + "_hero_guide")) >= 0)
					job = 1;
				else if($('div.infoBar ul.inv li:eq(0) img').attr('onmouseover').indexOf(I18N.get(MODULE_NAME + "_hero_hood")) >= 0)
					job = 2;
				else
					job = 0;
			}
		} else {
			if($('div.infoBar ul.inv li:eq(1) img').attr('onmouseover').indexOf(I18N.get(MODULE_NAME + "_hero_camera")) >= 0){ //APAG
				if($('div.infoBar ul.inv li:eq(2) img').attr('onmouseover').indexOf(I18N.get(MODULE_NAME + "_hero_guide")) >= 0)
					job = 1;
				else if($('div.infoBar ul.inv li:eq(2) img').attr('onmouseover').indexOf(I18N.get(MODULE_NAME + "_hero_hood")) >= 0)
					job = 2;
				else
					job = 0;
			}
			else{ // No APAG
				if($('div.infoBar ul.inv li:eq(1) img').attr('onmouseover').indexOf(I18N.get(MODULE_NAME + "_hero_guide")) >= 0)
					job = 1;
				else if($('div.infoBar ul.inv li:eq(1) img').attr('onmouseover').indexOf(I18N.get(MODULE_NAME + "_hero_hood")) >= 0)
					job = 2;
				else
					job = 0;
			}
		}

		// Distance de la ville
		var kmregex = /([0-9]+) ?km/i;
		var km = +$('div#scoutStatus div.scoutStatus p').text().match(kmregex)[1];
		var bat;
		if($('div.outSpot h2').text() !== null && $('div.outSpot h2').text() != '') 
			bat = batList[$('div.outSpot h2').text()];
		else{
			if($('div.outSpot').text().indexOf('Toute la zone est envahie') >= 0) bat = 1;
			else bat = 0;
		}

		var zomb = +$('div#zombiePts').text().split(" ")[1];
		var upgrade = +permUpgrade;
		var odUpgrade = +permOdUpgrade;
		var alreadyCamped = +permAlreadyCamped;
		var alreadyHidden = $('div.who table.table tbody tr td img[onmouseover*="pour passer la nuit ici"]').length;
		var pelures = $('div.infoBar ul.inv li img[src*="item_smelly_meat.gif"]').length;
		var toiles = $('div.infoBar ul.inv li img[src*="item_sheet.gif"]').length;

		// tomb = 1 / not(tomb) = 0
		var tomb = +permTomb;
		
		// night = 1 / not(night) = 0
		var night = +permNight;
		
		// furtif = 1 / not(furtif) = 0
		var furtif = +(job == 2);
		
		// CP = 1 / not(CP) = 0
		var CP = +permCP;
		
		// phare = 1 / not(phare) = 0
		var phare = +permPhare;
		
		// devastated = 1 / not(devastated) = 0
		var devastated = +permDevastated;

		var finalUrl = 'http://www.camping-predict.nadazone.fr/index.php?ville='+cityType+'&metier='+job+'&km='+km+'&bat='+bat+'&z='+zomb+'&ame='+upgrade+'&od='+odUpgrade+'&cg='+alreadyCamped+'&cr='+alreadyHidden+'&pdp='+pelures+'&tdt='+toiles+'&tomb='+tomb+'&nuit='+night+'&furtif='+furtif+'&pro='+CP+'&phar='+phare+'&devast='+devastated;
		console.log(finalUrl);

		var villeVal = typeVille(cityType);
		var kmVal = distance(km);
		var zoneVal = zone(bat);
		var zombVal = zombie(zomb, furtif);
		var ameVal = upgrade;
		var ODVal = calcBonusOD(odUpgrade);
		var cingVal = camping(alreadyCamped, CP, cityType);
		var ceurVal = campeur(alreadyHidden);
		var peauVal = calcBonusPeau(pelures);
		var tenteVal = calcBonusTente(toiles);
		var tombVal = calcBonusTomb(tomb);
		var nuitVal = calcBonusNuit(night);
		var pharVal = calcBonusPhare(phare);
		var devastVal = calcMalusDevast(devastated);

		var result = villeVal + kmVal + zoneVal + zombVal + ameVal + ODVal + cingVal + ceurVal + peauVal + tenteVal + tombVal + nuitVal + pharVal + devastVal;

		result = round100(result);
		var opti = round10(-result);
		correct = round10(opti - 2);

		var statut = "Error";

		if (result >= 0)
		{
			statut = I18N.get(MODULE_NAME + '_status_very_high');
		}
		else if (result < 0 && result > -2)
		{
			statut = I18N.get(MODULE_NAME + '_status_high');
		}
		else if (result <= -2 && result > -4)
		{
			statut = I18N.get(MODULE_NAME + '_status_decent');
		}
		else if (result <= -4 && result > -7)
		{
			statut = I18N.get(MODULE_NAME + '_status_medium');
		}
		else if (result <= -7 && result > -10)
		{
			statut = I18N.get(MODULE_NAME + '_status_decent');
		}
		else if (result <= -10 && result > -14)
		{
			statut = I18N.get(MODULE_NAME + '_status_limited');
		}
		else if (result <= -14 && result > -18)
		{
			statut = I18N.get(MODULE_NAME + '_status_very_low');
		}
		else if (result <= -18)
		{
			statut = I18N.get(MODULE_NAME + '_status_null');
		}

		var statut2 = statut;
		if (result >= -2)
		{
			statut2 = I18N.get(MODULE_NAME + "_status_highest");
		}

		if(job == 1) finalStatut = statut;
		else finalStatut = statut2;

		if(job == 1) correct = opti;

	}

	var refresh = function() {
		if($('div#sideMap').next().attr('class') == 'block tutorialBlock' && $('div.factions div.zombies').text() != '--' && $('#cpedit').length == 0){

			console.log('CPI loaded.');

			loadChances();
			var toInject = '' +
			'<div style="float: right;font-size: 8pt;"><a style="cursor:pointer;text-decoration:underline;" id="cpreload" onmouseover="js.HordeTip.showSpecialTip(this, \'simpleTip\', \'\', \'' + I18N.get(MODULE_NAME + "_settings_desc") + '\', event);" onmouseout="js.HordeTip.hide(event)">' + I18N.get(MODULE_NAME + "_settings_text") + '</a>' +
			'&nbsp;<a id="cpedit" style="cursor:pointer;text-decoration:underline;" onmouseover="js.HordeTip.showSpecialTip(this, \'simpleTip\', \'\', \'' + I18N.get(MODULE_NAME + "_search_desc") + '\', event);" onmouseout="js.HordeTip.hide(event)">' + I18N.get(MODULE_NAME + "_search_text") + '</a></div>' +
			'<h2>Camping Predict</h2>' +
			'<div id="cpiparam" style="background-color: #5c2b20;color: #f0d79e;font-weight:bold;font-variant: small-caps;font-family: \'Century Gothic\', \'Arial\', \'Trebuchet MS\', Verdana, sans-serif;margin-top:-13px;margin-bottom:-13px;display:none"><ul style="list-style-type:none;margin-left:-35px;">' +
			'<li style="height:1px;"> </li>' +
			'<li id="permUpgrade" style="margin-top:5px"><input class="field tid_defParsed" style="width:15px;" value=""> ' + I18N.get(MODULE_NAME + "_improvements") + '</li>' +
			'<li id="permOdUpgrade"><input class="field tid_defParsed" style="width:15px;" value=""> ' +  I18N.get(MODULE_NAME + "_defense_objects") + '</li>' +
			'<li id="permAlreadyCamped"><input class="field tid_defParsed" style="width:15px;" value=""> ' + I18N.get(MODULE_NAME + "_nights_camped") + '</li>' +
			'<li id="permTomb" style="cursor:pointer;"><input type="checkbox"> <span class="others"><img src="http://data.hordes.fr/gfx/icons/small_gather.gif"> ' + I18N.get(MODULE_NAME + "_tomb") + '</span></li>' +
			'<li id="permNight" style="cursor:pointer;"><input type="checkbox"> <span class="others"><img src="http://data.hordes.fr/gfx/icons/r_doutsd.gif"> ' + I18N.get(MODULE_NAME + "_night") + '</span></li>' +
			'<li id="permCP" style="cursor:pointer;"><input type="checkbox"> <span class="others"><img src="http://data.hordes.fr/gfx/icons/small_camp.gif"> ' + I18N.get(MODULE_NAME + "_pro_camper") + '</span></li>' +
			'<li id="permPhare" style="cursor:pointer;"><input type="checkbox"> <span class="others"><img src="http://data.hordes.fr/gfx/icons/small_lighthouse.gif"> ' + I18N.get(MODULE_NAME + "_lighthouse") + '</span></li>' +
			'<li id="permDevastated" style="cursor:pointer;"><input type="checkbox"> <span class="others"><img src="http://data.hordes.fr/gfx/icons/item_out_def_broken.gif"> ' + I18N.get(MODULE_NAME + "_devastated") + '</span></li>' +
			'</ul></div>' +
			'<div class="list" id="editor" style="background-color: #5c2b20;color: #f0d79e;font-weight:bold;font-variant: small-caps;font-family: \'Century Gothic\', \'Arial\', \'Trebuchet MS\', Verdana, sans-serif;display:none;"><ul style="list-style-type:none;margin-left:-35px;">' +
			'<li id="storedCityType" style="cursor:pointer;" ><span style="text-decoration:line-through;color:grey;" data-value="0">RE</span> <span style="text-decoration:line-through;color:grey;" data-value="1">RNE</span> <span style="text-decoration:line-through;color:grey;" data-value="2">' + I18N.get(MODULE_NAME + "_city_hard") + '</span> </li>' +
			'<li id="storedJob" style="cursor:pointer;"><img style="opacity:0.4;margin-left:10px;" data-value="0" src="http://data.hordes.fr/gfx/icons/item_basic_suit.gif"><img style="opacity:0.4;margin-left:10px;" data-value="1" src="http://data.hordes.fr/gfx/icons/item_surv_book.gif"><img style="opacity:0.4;margin-left:10px;" data-value="2" src="http://data.hordes.fr/gfx/icons/item_vest_on.gif"></li>' +
			'<li id="storedKm"><input class="field tid_defParsed" style="width:15px;" value=""> km </li>' +
			'<li id="storedBat"><select></select></li>' +
			'<li id="storedZomb"><input class="field tid_defParsed" style="width:15px;" value=""> <img src="http://data.hordes.fr/gfx/icons/small_zombie.gif"></li>' +
			'<li id="storedUpgrade"><input class="field tid_defParsed" style="width:15px;" value=""> ' + I18N.get(MODULE_NAME + "_improvements") + '</li>' +
			'<li id="storedOdUpgrade"><input class="field tid_defParsed" style="width:15px;" value=""> ' +  I18N.get(MODULE_NAME + "_defense_objects") + '</li>' +
			'<li id="storedAlreadyCamped"><input class="field tid_defParsed" style="width:15px;" value=""> ' + I18N.get(MODULE_NAME + "_nights_camped") + '</li>' +
			'<li id="storedAlreadyHidden"><input class="field tid_defParsed" style="width:15px;" value=""> ' + I18N.get(MODULE_NAME + "_hiding_citizens") + '</li>' +
			'<li id="storedPelures"><input class="field tid_defParsed" style="width:15px;" value=""> <img src="http://data.hordes.fr/gfx/icons/item_smelly_meat.gif"></li>' +
			'<li id="storedToiles"><input class="field tid_defParsed" style="width:15px;" value=""> <img src="http://data.hordes.fr/gfx/icons/item_sheet.gif"></li>' +
			'<li id="storedTomb" style="cursor:pointer;"><input type="checkbox"> <span class="others"><img src="http://data.hordes.fr/gfx/icons/small_gather.gif"> ' + I18N.get(MODULE_NAME + "_tomb") + '</span></li>' +
			'<li id="storedNight" style="cursor:pointer;"><input type="checkbox"> <span class="others"><img src="http://data.hordes.fr/gfx/icons/r_doutsd.gif"> ' + I18N.get(MODULE_NAME + "_night") + '</span></li>' +
			'<li id="storedFurtif" style="display:none;cursor:pointer;"><input type="checkbox"> <span class="others"><img src="http://data.hordes.fr/gfx/icons/r_jrangr.gif"> Camouflé</span></li>' +
			'<li id="storedCP" style="cursor:pointer;"><input type="checkbox"> <span class="others"><img src="http://data.hordes.fr/gfx/icons/small_camp.gif"> ' + I18N.get(MODULE_NAME + "_pro_camper") + '</span></li>' +
			'<li id="storedPhare" style="cursor:pointer;"><input type="checkbox"> <span class="others"><img src="http://data.hordes.fr/gfx/icons/small_lighthouse.gif"> ' + I18N.get(MODULE_NAME + "_lighthouse") + '</span></li>' +
			'<li id="storedDevastated" style="cursor:pointer;"><input type="checkbox"> <span class="others"><img src="http://data.hordes.fr/gfx/icons/item_out_def_broken.gif"> ' + I18N.get(MODULE_NAME + "_devastated") + '</span></li>' +
			'</ul></div>' +
			'<ul style="background-image: url(http://data.hordes.fr/gfx/design/inv_ground.gif);color:#DAC69A" class="tools outInv">' +
			'<li class="clear"></li>' +
			'<li class="empty" style="font-weight:bold;width:100%;text-align:left;margin-top:4px;color:inherit;">' + I18N.get(MODULE_NAME + "_status_title") + ' : <span id="finalStatut">'+finalStatut+'</span> </li>' +
			'<li class="clear"></li>' +
			'<li class="empty" style="width:100%;text-align:left;color:inherit;">' + I18N.get(MODULE_NAME + "_improvements_required") + ' : <span id="correct">'+correct+'</span> </li>' +
			'<li class="clear">' +
			'</li><li class="searchResult" style="text-align:right;display:none;">Résultat de la recherche</li></ul>';

			$(toInject).insertAfter('ul.tools.shortTools.nada.outInv');

			$('#cpreload').on('click',function(){
				if(!$('#cpiparam').is(":visible")){

					if($('#editor').is(":visible")){
						$('#editor').slideUp('slow');
						$('#cpedit').text(I18N.get(MODULE_NAME + "_search_text"));
					}

					updateParam();
					$('.searchResult').parent().next().css('margin-top','10px');

					$('#permUpgrade input').unbind('keyup focusout');
					$('#permUpgrade input').keyup(function(e){
						if(e.keyCode == 13)
						{
							if(+$(this).val() >= 0){
								$('#permUpgrade .notvalid').remove();
								localStorage.setItem('permUpgrade', +$(this).val());
								permUpgrade = +$(this).val();
								updateParam();
							}
							else{
								if($('.notvalid', $(this).parent()).length == 0) $(this).parent().append('<img class="notvalid" src="http://zenoo0.fr/hordes/resources/icons/small_warning.gif">');
							}
						}
					});
					$('#permUpgrade input').focusout(function(e){
						if(+$(this).val() >= 0){
							$('#permUpgrade .notvalid').remove();
							localStorage.setItem('permUpgrade', +$(this).val());
							permUpgrade = +$(this).val();
							updateParam();
						}
						else{
							if($('.notvalid', $(this).parent()).length == 0) $(this).parent().append('<img class="notvalid" src="http://zenoo0.fr/hordes/resources/icons/small_warning.gif">');
						}
					});

					$('#permOdUpgrade input').unbind('keyup focusout');
					$('#permOdUpgrade input').keyup(function(e){
						if(e.keyCode == 13)
						{
							if(+$(this).val() >= 0){
								$('#permOdUpgrade .notvalid').remove();
								localStorage.setItem('permOdUpgrade', +$(this).val());
								permOdUpgrade = +$(this).val();
								updateParam();
							}
							else{
								if($('.notvalid', $(this).parent()).length == 0) $(this).parent().append('<img class="notvalid" src="http://zenoo0.fr/hordes/resources/icons/small_warning.gif">');
							}
						}
					});
					$('#permOdUpgrade input').focusout(function(e){
						if(+$(this).val() >= 0){
							$('#permOdUpgrade .notvalid').remove();
							localStorage.setItem('permOdUpgrade', +$(this).val());
							permOdUpgrade = +$(this).val();
							updateParam();
						}
						else{
							if($('.notvalid', $(this).parent()).length == 0) $(this).parent().append('<img class="notvalid" src="http://zenoo0.fr/hordes/resources/icons/small_warning.gif">');
						}
					});

					$('#permAlreadyCamped input').unbind('keyup focusout');
					$('#permAlreadyCamped input').keyup(function(e){
						if(e.keyCode == 13)
						{
							if(+$(this).val() >= 0 && +$(this).val() <= 7){
								$('#permAlreadyCamped .notvalid').remove();
								localStorage.setItem('permAlreadyCamped', +$(this).val());
								permAlreadyCamped = +$(this).val();
								updateParam();
							}
							else{
								if($('.notvalid', $(this).parent()).length == 0) $(this).parent().append('<img class="notvalid" src="http://zenoo0.fr/hordes/resources/icons/small_warning.gif">');
							}
						}
					});
					$('#permAlreadyCamped input').focusout(function(e){
						if(+$(this).val() >= 0 && +$(this).val() <= 7){
							$('#permAlreadyCamped .notvalid').remove();
							localStorage.setItem('permAlreadyCamped', +$(this).val());
							permAlreadyCamped = +$(this).val();
							updateParam();
						}
						else{
							if($('.notvalid', $(this).parent()).length == 0) $(this).parent().append('<img class="notvalid" src="http://zenoo0.fr/hordes/resources/icons/small_warning.gif">');
						}
					});

					$('#permTomb input').unbind('change');
					$('#permTomb input').change(function() {
						if(this.checked) {
							localStorage.setItem('permTomb', 1);
							permTomb = 1;
						}
						else{
							localStorage.setItem('permTomb', 0);
							permTomb = 0;
						}
						updateParam();
					});
					$('#permTomb .others').unbind('click');
					$('#permTomb .others').on('click',function(){$('#permTomb input').prop( "checked", !$('#permTomb input').prop("checked")).trigger('change') ;});

					$('#permNight input').unbind('change');
					$('#permNight input').change(function() {
						if(this.checked) {
							localStorage.setItem('permNight', 1);
							permNight = 1;
						}
						else{
							localStorage.setItem('permNight', 0);
							permNight = 0;
						}
						updateParam();
					});
					$('#permNight .others').unbind('click');
					$('#permNight .others').on('click',function(){$('#permNight input').prop( "checked", !$('#permNight input').prop("checked")).trigger('change') ;});

					$('#permCP input').unbind('change');
					$('#permCP input').change(function() {
						if(this.checked) {
							localStorage.setItem('permCP', 1);
							permCP = 1;
						}
						else{
							localStorage.setItem('permCP', 0);
							permCP = 0;
						}
						updateParam();
					});
					$('#permCP .others').unbind('click');
					$('#permCP .others').on('click',function(){$('#permCP input').prop( "checked", !$('#permCP input').prop("checked")).trigger('change') ;});

					$('#permPhare input').unbind('change');
					$('#permPhare input').change(function() {
						if(this.checked) {
							localStorage.setItem('permPhare', 1);
							permPhare = 1;
						}
						else{
							localStorage.setItem('permPhare', 0);
							permPhare = 0;
						}
						updateParam();
					});
					$('#permPhare .others').unbind('click');
					$('#permPhare .others').on('click',function(){$('#permPhare input').prop( "checked", !$('#permPhare input').prop("checked")).trigger('change') ;});

					$('#permDevastated input').unbind('change');
					$('#permDevastated input').change(function() {
						if(this.checked) {
							localStorage.setItem('permDevastated', 1);
							permDevastated = 1;
						}
						else{
							localStorage.setItem('permDevastated', 0);
							permDevastated = 0;
						}
						updateParam();
					});
					$('#permDevastated .others').unbind('click');
					$('#permDevastated .others').on('click',function(){$('#permDevastated input').prop( "checked", !$('#permDevastated input').prop("checked")).trigger('change') ;});

					$('#cpiparam').slideDown('slow');
				}
				else{
					$('#cpiparam').slideUp('slow');
				}
			});

			$('#cpedit').on('click',function(){
				if(!$('#editor').is(":visible")){

					if($('#cpiparam').is(":visible")) $('#cpiparam').slideUp('slow');

					$('#cpedit').text(I18N.get(MODULE_NAME + "_close"));
					$('.searchResult').parent().next().css('margin-top','10px');

					updateSearch();

					$('#storedCityType span').unbind('click');
					$('#storedCityType span').on('click',function(){
						localStorage.setItem('storedCityType', +$(this).attr('data-value'));
						storedCityType = +$(this).attr('data-value');
						updateSearch();
					});

					$('#storedJob img').unbind('click');
					$('#storedJob img').on('click',function(){
						localStorage.setItem('storedJob', +$(this).attr('data-value'));
						storedJob = +$(this).attr('data-value');
						updateSearch();

						if(+$(this).attr('data-value') != 2) $('#storedFurtif').hide();
					});

					$('#storedKm input').unbind('keyup focusout');
					$('#storedKm input').keyup(function(e){
						if(e.keyCode == 13)
						{
							if(+$(this).val() >= 0 && +$(this).val() <= 28){
								$('#storedKm .notvalid').remove();
								localStorage.setItem('storedKm', +$(this).val());
								storedKm = +$(this).val();
								updateSearch();
							}
							else{
								if($('.notvalid', $(this).parent()).length == 0) $(this).parent().append('<img class="notvalid" src="http://zenoo0.fr/hordes/resources/icons/small_warning.gif">');
							}
						}
					});
					$('#storedKm input').focusout(function(){
						if(+$(this).val() >= 1 && +$(this).val() <= 28){
							$('#storedKm .notvalid').remove();
							localStorage.setItem('storedKm', +$(this).val());
							storedKm = +$(this).val();
							updateSearch();
						}
						else{
							if($('.notvalid', $(this).parent()).length == 0) $(this).parent().append('<img class="notvalid" src="http://zenoo0.fr/hordes/resources/icons/small_warning.gif">');
						}
					});

					$('#storedBat select').unbind('change');
					$('#storedBat select').change(function() {
						localStorage.setItem('storedBat', +$(this).val());
						storedBat = +$(this).val();
						updateSearch();
					});

					$('#storedZomb input').unbind('keyup focusout');
					$('#storedZomb input').keyup(function(e){
						if(e.keyCode == 13)
						{
							if(+$(this).val() >= 0){
								$('#storedZomb .notvalid').remove();
								localStorage.setItem('storedZomb', +$(this).val());
								storedZomb = +$(this).val();
								updateSearch();
							}
							else{
								if($('.notvalid', $(this).parent()).length == 0) $(this).parent().append('<img class="notvalid" src="http://zenoo0.fr/hordes/resources/icons/small_warning.gif">');
							}
						}
					});
					$('#storedZomb input').focusout(function(e){
						if(+$(this).val() >= 0){
							$('#storedZomb .notvalid').remove();
							localStorage.setItem('storedZomb', +$(this).val());
							storedZomb = +$(this).val();
							updateSearch();
						}
						else{
							if($('.notvalid', $(this).parent()).length == 0) $(this).parent().append('<img class="notvalid" src="http://zenoo0.fr/hordes/resources/icons/small_warning.gif">');
						}
					});

					$('#storedUpgrade input').unbind('keyup focusout');
					$('#storedUpgrade input').keyup(function(e){
						if(e.keyCode == 13)
						{
							if(+$(this).val() >= 0){
								$('#storedUpgrade .notvalid').remove();
								localStorage.setItem('storedUpgrade', +$(this).val());
								storedUpgrade = +$(this).val();
								updateSearch();
							}
							else{
								if($('.notvalid', $(this).parent()).length == 0) $(this).parent().append('<img class="notvalid" src="http://zenoo0.fr/hordes/resources/icons/small_warning.gif">');
							}
						}
					});
					$('#storedUpgrade input').focusout(function(e){
						if(+$(this).val() >= 0){
							$('#storedUpgrade .notvalid').remove();
							localStorage.setItem('storedUpgrade', +$(this).val());
							storedUpgrade = +$(this).val();
							updateSearch();
						}
						else{
							if($('.notvalid', $(this).parent()).length == 0) $(this).parent().append('<img class="notvalid" src="http://zenoo0.fr/hordes/resources/icons/small_warning.gif">');
						}
					});

					$('#storedOdUpgrade input').unbind('keyup focusout');
					$('#storedOdUpgrade input').keyup(function(e){
						if(e.keyCode == 13)
						{
							if(+$(this).val() >= 0){
								$('#storedOdUpgrade .notvalid').remove();
								localStorage.setItem('storedOdUpgrade', +$(this).val());
								storedOdUpgrade = +$(this).val();
								updateSearch();
							}
							else{
								if($('.notvalid', $(this).parent()).length == 0) $(this).parent().append('<img class="notvalid" src="http://zenoo0.fr/hordes/resources/icons/small_warning.gif">');
							}
						}
					});
					$('#storedOdUpgrade input').focusout(function(e){
						if(+$(this).val() >= 0){
							$('#storedOdUpgrade .notvalid').remove();
							localStorage.setItem('storedOdUpgrade', +$(this).val());
							storedOdUpgrade = +$(this).val();
							updateSearch();
						}
						else{
							if($('.notvalid', $(this).parent()).length == 0) $(this).parent().append('<img class="notvalid" src="http://zenoo0.fr/hordes/resources/icons/small_warning.gif">');
						}
					});

					$('#storedAlreadyCamped input').unbind('keyup focusout');
					$('#storedAlreadyCamped input').keyup(function(e){
						if(e.keyCode == 13)
						{
							if(+$(this).val() >= 0 && +$(this).val() <= 7){
								$('#storedAlreadyCamped .notvalid').remove();
								localStorage.setItem('storedAlreadyCamped', +$(this).val());
								storedAlreadyCamped = +$(this).val();
								updateSearch();
							}
							else{
								if($('.notvalid', $(this).parent()).length == 0) $(this).parent().append('<img class="notvalid" src="http://zenoo0.fr/hordes/resources/icons/small_warning.gif">');
							}
						}
					});
					$('#storedAlreadyCamped input').focusout(function(e){
						if(+$(this).val() >= 0 && +$(this).val() <= 7){
							$('#storedAlreadyCamped .notvalid').remove();
							localStorage.setItem('storedAlreadyCamped', +$(this).val());
							storedAlreadyCamped = +$(this).val();
							updateSearch();
						}
						else{
							if($('.notvalid', $(this).parent()).length == 0) $(this).parent().append('<img class="notvalid" src="http://zenoo0.fr/hordes/resources/icons/small_warning.gif">');
						}
					});

					$('#storedAlreadyHidden input').unbind('keyup focusout');
					$('#storedAlreadyHidden input').keyup(function(e){
						if(e.keyCode == 13)
						{
							if(+$(this).val() >= 0 && +$(this).val() <= 7){
								$('#storedAlreadyHidden .notvalid').remove();
								localStorage.setItem('storedAlreadyHidden', +$(this).val());
								storedAlreadyHidden = +$(this).val();
								updateSearch();
							}
							else{
								if($('.notvalid', $(this).parent()).length == 0) $(this).parent().append('<img class="notvalid" src="http://zenoo0.fr/hordes/resources/icons/small_warning.gif">');
							}
						}
					});
					$('#storedAlreadyHidden input').focusout(function(e){
						if(+$(this).val() >= 0 && +$(this).val() <= 7){
							$('#storedAlreadyHidden .notvalid').remove();
							localStorage.setItem('storedAlreadyHidden', +$(this).val());
							storedAlreadyHidden = +$(this).val();
							updateSearch();
						}
						else{
							if($('.notvalid', $(this).parent()).length == 0) $(this).parent().append('<img class="notvalid" src="http://zenoo0.fr/hordes/resources/icons/small_warning.gif">');
						}
					});

					$('#storedPelures input').unbind('keyup focusout');
					$('#storedPelures input').keyup(function(e){
						if(e.keyCode == 13)
						{
							if(+$(this).val() >= 0){
								$('#storedPelures .notvalid').remove();
								localStorage.setItem('storedPelures', +$(this).val());
								storedPelures = +$(this).val();
								updateSearch();
							}
							else{
								if($('.notvalid', $(this).parent()).length == 0) $(this).parent().append('<img class="notvalid" src="http://zenoo0.fr/hordes/resources/icons/small_warning.gif">');
							}
						}
					});
					$('#storedPelures input').focusout(function(e){
						if(+$(this).val() >= 0){
							$('#storedPelures .notvalid').remove();
							localStorage.setItem('storedPelures', +$(this).val());
							storedPelures = +$(this).val();
							updateSearch();
						}
						else{
							if($('.notvalid', $(this).parent()).length == 0) $(this).parent().append('<img class="notvalid" src="http://zenoo0.fr/hordes/resources/icons/small_warning.gif">');
						}
					});

					$('#storedToiles input').unbind('keyup focusout');
					$('#storedToiles input').keyup(function(e){
						if(e.keyCode == 13)
						{
							if(+$(this).val() >= 0){
								$('#storedToiles .notvalid').remove();
								localStorage.setItem('storedToiles', +$(this).val());
								storedToiles = +$(this).val();
								updateSearch();
							}
							else{
								if($('.notvalid', $(this).parent()).length == 0) $(this).parent().append('<img class="notvalid" src="http://zenoo0.fr/hordes/resources/icons/small_warning.gif">');
							}
						}
					});
					$('#storedToiles input').focusout(function(e){
						if(+$(this).val() >= 0){
							$('#storedToiles .notvalid').remove();
							localStorage.setItem('storedToiles', +$(this).val());
							storedToiles = +$(this).val();
							updateSearch();
						}
						else{
							if($('.notvalid', $(this).parent()).length == 0) $(this).parent().append('<img class="notvalid" src="http://zenoo0.fr/hordes/resources/icons/small_warning.gif">');
						}
					});

					$('#storedTomb input').unbind('change');
					$('#storedTomb input').change(function() {
						if(this.checked) {
							localStorage.setItem('storedTomb', 1);
							storedTomb = 1;
						}
						else{
							localStorage.setItem('storedTomb', 0);
							storedTomb = 0;
						}
						updateSearch();
					});
					$('#storedTomb .others').unbind('click');
					$('#storedTomb .others').on('click',function(){$('#storedTomb input').prop( "checked", !$('#storedTomb input').prop("checked")).trigger('change') ;});

					$('#storedNight input').unbind('change');
					$('#storedNight input').change(function() {
						if(this.checked) {
							localStorage.setItem('storedNight', 1);
							storedNight = 1;
						}
						else{
							localStorage.setItem('storedNight', 0);
							storedNight = 0;
						}
						updateSearch();
					});
					$('#storedNight .others').unbind('click');
					$('#storedNight .others').on('click',function(){$('#storedNight input').prop( "checked", !$('#storedNight input').prop("checked")).trigger('change') ;});

					$('#storedFurtif input').unbind('change');
					$('#storedFurtif input').change(function() {
						if(this.checked) {
							localStorage.setItem('storedFurtif', 1);
							storedFurtif = 1;
						}
						else{
							localStorage.setItem('storedFurtif', 0);
							storedFurtif = 0;
						}
						updateSearch();
					});
					$('#storedFurtif .others').unbind('click');
					$('#storedFurtif .others').on('click',function(){$('#storedFurtif input').prop( "checked", !$('#storedFurtif input').prop("checked")).trigger('change') ;});

					$('#storedCP input').unbind('change');
					$('#storedCP input').change(function() {
						if(this.checked) {
							localStorage.setItem('storedCP', 1);
							storedCP = 1;
						}
						else{
							localStorage.setItem('storedCP', 0);
							storedCP = 0;
						}
						updateSearch();
					});
					$('#storedCP .others').unbind('click');
					$('#storedCP .others').on('click',function(){$('#storedCP input').prop( "checked", !$('#storedCP input').prop("checked")).trigger('change') ;});

					$('#storedPhare input').unbind('change');
					$('#storedPhare input').change(function() {
						if(this.checked) {
							localStorage.setItem('storedPhare', 1);
							storedPhare = 1;
						}
						else{
							localStorage.setItem('storedPhare', 0);
							storedPhare = 0;
						}
						updateSearch();
					});
					$('#storedPhare .others').unbind('click');
					$('#storedPhare .others').on('click',function(){$('#storedPhare input').prop( "checked", !$('#storedPhare input').prop("checked")).trigger('change') ;});

					$('#storedDevastated input').unbind('change');
					$('#storedDevastated input').change(function() {
						if(this.checked) {
							localStorage.setItem('storedDevastated', 1);
							storedDevastated = 1;
						}
						else{
							localStorage.setItem('storedDevastated', 0);
							storedDevastated = 0;
						}
						updateSearch();
					});
					$('#storedDevastated .others').unbind('click');
					$('#storedDevastated .others').on('click',function(){$('#storedDevastated input').prop( "checked", !$('#storedDevastated input').prop("checked")).trigger('change') ;});

					$('#editor').slideDown('slow');
				}
				else{
					$('#editor').slideUp('slow');
					$('.searchResult').hide();
					$('#finalStatut').text(finalStatut);
					$('#correct').text(correct);
					$('#cpedit').text(I18N.get(MODULE_NAME + "_search_text"));
				}

			});

		}

	};

	/************************
	 * Module configuration *
	 ************************/

	return {

		name: MODULE_NAME,
		type: Module.TYPE.INTERFACE_ENHANCEMENT,

		properties: {
			enabled: false,
			tool: {
				update_method: 'GET',
				update_url: 'https://data.zenoo.fr/cpi.user.js'
			}
		},

		configurable: {
			enabled: {
				category: Module.PROPERTY_CATEGORY.OUTSIDE,
				type: Module.PROPERTY.BOOLEAN,
				short_desc_I18N: MODULE_NAME + '_short_desc',
				full_desc_I18N: MODULE_NAME + '_full_desc',
				url: "http://zenoo.fr/"
			}
		},

		actions: {
			can_run: function() {
				return D2N.is_on_hordes() || D2N.is_on_die2nite();
			},

			init: function() {
				add_i18n();
			},

			load: function() {
				var method = this.properties.tool.update_method;
				var url = this.properties.tool.update_url;

				document.addEventListener('d2n_gamebody_reload', function() {
					if(!D2N.is_outside()){
						return;
					}

					refresh();
				}, false);
			}
		}
	};
});
