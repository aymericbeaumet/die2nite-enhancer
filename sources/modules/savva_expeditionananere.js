Module.register(function() {

	var MODULE_NAME = 'savva_expedition';

	/******************
	 * Module context *
	 ******************/

	/**
	 * Add the i18n strings for this module.
	 */
	function add_i18n()
	{
		var i18n = {};

		i18n[I18N.LANG.FR] = {};
		i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Expéditionananère (par -SAVVA-)';
		i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Calcule les PAs à dépenser et dans quel ordre se ravitailler. Script par -SAVVA-, intégré et traduit avec sa permission.';
		i18n[I18N.LANG.FR][MODULE_NAME + '_title'] = 'Expéditionananère';
		
		i18n[I18N.LANG.FR][MODULE_NAME + '_ap_text'] = 'Points d\'action';
		i18n[I18N.LANG.FR][MODULE_NAME + '_ap_icon'] = '<img src="http://data.hordes.fr/gfx/loc/fr/small_pa.gif" />';

		i18n[I18N.LANG.FR][MODULE_NAME + '_advise_normal_text'] = 'Ordre conseillé pour expé à $[NB] PA normal';
		i18n[I18N.LANG.FR][MODULE_NAME + '_advise_thirsty_text'] = 'Ordre conseillé pour expé à $[NB] PA en soif';

		i18n[I18N.LANG.FR][MODULE_NAME + '_dehydration_title'] = 'Déshydratation';
		i18n[I18N.LANG.FR][MODULE_NAME + '_return_normal_text'] = 'Vous rentrerez en ville en état normal.';
		i18n[I18N.LANG.FR][MODULE_NAME + '_return_thirsty_text'] = 'Vous rentrerez en ville en étant assoiffé.';
		i18n[I18N.LANG.FR][MODULE_NAME + '_return_dehydrated_text'] = 'Vous rentrerez en ville en étant déshydraté.';
		i18n[I18N.LANG.FR][MODULE_NAME + '_return_died_text'] = 'Vous mourrez durant cet expédition !<br /><img src="//data.twinoid.com/proxy/www.hordes.fr/gfx/forum/smiley/h_warning.gif"> Le rationnement en eau est insuffisant !';

		i18n[I18N.LANG.FR][MODULE_NAME + '_weapons_title'] = 'Armes';
		i18n[I18N.LANG.FR][MODULE_NAME + '_discharge'] = 'déchargé';
		i18n[I18N.LANG.FR][MODULE_NAME + '_charge'] = 'charge';
		i18n[I18N.LANG.FR][MODULE_NAME + '_total_kills'] = 'Total approximatif : ';


		i18n[I18N.LANG.EN] = {};
		i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Expedition helper (By -SAVVA-)';
		i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Calculate the optimum order to regenerate APs while doing an expedition. Script by -SAVVA-, integrated and translated with his permission.';
		i18n[I18N.LANG.EN][MODULE_NAME + '_title'] = 'Expedition helper';

		i18n[I18N.LANG.EN][MODULE_NAME + '_ap_text'] = 'Action points';
		i18n[I18N.LANG.EN][MODULE_NAME + '_ap_icon'] = '<img src="http://data.hordes.fr/gfx/loc/en/small_pa.gif" />';

		i18n[I18N.LANG.EN][MODULE_NAME + '_advise_normal_text'] = 'Advised order to do an expe of $[NB] AP and coming back normal';
		i18n[I18N.LANG.EN][MODULE_NAME + '_advise_thirsty_text'] = 'Advised order to do an expe of $[NB] AP and coming back thirsty';

		i18n[I18N.LANG.EN][MODULE_NAME + '_dehydration_title'] = 'Dehydration';
		i18n[I18N.LANG.EN][MODULE_NAME + '_return_normal_text'] = 'You\'ll get home being normal.';
		i18n[I18N.LANG.EN][MODULE_NAME + '_return_thirsty_text'] = 'You\'ll get home being thirsty.';
		i18n[I18N.LANG.EN][MODULE_NAME + '_return_dehydrated_text'] = 'You\'ll get home being dehydrated.';
		i18n[I18N.LANG.EN][MODULE_NAME + '_return_died_text'] = 'You\'ll die during this expedition !<br /><img src="//data.twinoid.com/proxy/www.hordes.fr/gfx/forum/smiley/h_warning.gif"> You don\'t have enough water !';

		i18n[I18N.LANG.EN][MODULE_NAME + '_weapons_title'] = 'Weapons';
		i18n[I18N.LANG.EN][MODULE_NAME + '_discharge'] = 'discharged';
		i18n[I18N.LANG.EN][MODULE_NAME + '_chargee'] = 'load';
		i18n[I18N.LANG.EN][MODULE_NAME + '_total_kills'] = 'Rough total: ';


		I18N.set(i18n);
	}

	function refresh() {
		if($('div.sectionArt').length == 1){
			var pa = +$('div.counter').text().substr(1,1);

			var pasAlcool = $('div.infoBar ul.status li img[src*="/gfx/icons/status_drunk.gif"]').length + $('ul.status img[src*="/gfx/icons/status_hung_over.gif"]').length;
			var soif = $('div.infoBar ul.status li img[src*="/gfx/icons/status_thirst.gif"]').length;
			var goule = $('div.infoBar ul.status li img[src*="/gfx/icons/status_ghoul.gif"]').length;
			var blesse = $('div.infoBar ul.status li img[src*="/gfx/icons/status_wound.gif"]').length;
			var eau = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_water.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_potion.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_water_can_1.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_water_can_2.gif"]').length*2 + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_water_can_3.gif"]').length*3 + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_water_cup.gif"]').length;
			var b6 = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_food_pims.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_food_bar1.gif"]').length + $('div.infoBar ul.inv li img[src*="gfx/icons/item_food_biscuit.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_food_chick.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_food_tarte.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_can_open.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_cadaver.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_food_bar3.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_food_sandw.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_vegetable.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_food_bar2.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_food_noodles.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_dish.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_fruit.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_hmeat.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_undef.gif"]').length;
			var b7 = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_dish_tasty.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_chama_tasty.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_vegetable_tasty.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_food_noodles_hot.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_egg.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_food_candies.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_apple.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_meat.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_woodsteak.gif"]').length;
			var alcool = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_vodka.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_rhum.gif"]').length;
			var cidre = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_hmbrew.gif"]').length;
			var stero = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_drug.gif"]').length;
			var twino = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_drug_hero.gif"]').length;
			var drogueRisk = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_drug_random.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_beta_drug_bad.gif"]').length;
			var cafe = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_coffee.gif"]').length;
			var sport = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_sport_elec.gif"]').length;
			var autre = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_lsd.gif"]').length;
			var expe = pa;
			var outEau = "";
			if(eau >= 1) {
				outEau = ' + <img src="http://data.hordes.fr/gfx/icons/item_water.gif?v=44">'; expe += 6-blesse;
			}

			var outBouffe = "";
			if(b6 >= 1 && b7 == 0) {
				outBouffe = ' + <img src="http://data.hordes.fr/gfx/icons/item_can_open.gif?v=44">'; expe += 6-blesse;
			}
			if(b7 >=1) {
				outBouffe = ' + <img src="http://data.hordes.fr/gfx/icons/item_meat.gif?v=44">'; expe += 7-blesse; b7 = 1; b6 = 0;
			}

			var outAlcool = '';
			if(pasAlcool == 0 && alcool >= 1) {
				outAlcool = ' + <img src="http://data.hordes.fr/gfx/icons/item_vodka.gif?v=44">'; expe += 6-blesse;
			}
			if(pasAlcool == 1) {
				outAlcool = '';
			}

			var outCidre = '';
			if(cidre >= 1) {
				outCidre = ' + '+cidre+' <img src="http://data.hordes.fr/gfx/icons/item_hmbrew.gif?v=44">';
			}

			var outStero = '';
			if(stero >= 1) {
				outStero = ' + '+stero+' <img src="http://data.hordes.fr/gfx/icons/item_drug.gif?v=44">';
			}

			var outTwino = '';
			if(twino >= 1) {
				outTwino = ' + '+twino+' <img src="http://data.hordes.fr/gfx/icons/item_drug_hero.gif?v=44">';
			}

			var outDrogueRisk = '';
			if(drogueRisk >= 1) {
				outDrogueRisk = ' + '+drogueRisk+' <img src="http://data.hordes.fr/gfx/icons/item_drug_random.gif?v=44">';
			}

			expe += stero*(6-blesse) + twino*(8-blesse) + drogueRisk*(6-blesse) + cidre*(6-blesse);
			var outCafe = '';
			if(cafe >= 1) {
				outCafe = ' + '+cafe+'<img src="http://data.hordes.fr/gfx/icons/item_coffee.gif?v=44">'; expe += cafe*4;
			}

			var outBlesse = '';
			if(blesse == 1) {
				outBlesse = '<br />Vous êtes blessé ! (Vos régénérations de PA sont diminués)';
			}

			var outSport = '';
			if(sport == 1 && blesse == 0) {
				outSport = ' + <img src="http://data.hordes.fr/gfx/icons/item_sport_elec.gif?v=44">'; expe += 5;
			}

			var introEau = "";
			if(soif == 0) {
				introEau = I18N.get(MODULE_NAME + "_advise_normal_text").replace("$[NB]", expe);
			}
			if(soif == 1) {
				introEau = I18N.get(MODULE_NAME + "_advise_thirsty_text").replace("$[NB]", expe);
			}

			var ordreEau = I18N.get(MODULE_NAME + "_ap_icon");
			var Eau = '<img src="http://data.hordes.fr/gfx/icons/item_water.gif?v=44">';
			var EauA = '<img src="http://data.hordes.fr/gfx/icons/status_hasDrunk.gif">';
			var Bouffe = '<img src="http://data.hordes.fr/gfx/icons/item_can_open.gif?v=44">';
			var Steak = '<img src="http://data.hordes.fr/gfx/icons/item_meat.gif?v=44">';
			var Stero = '<img src="http://data.hordes.fr/gfx/icons/item_drug.gif?v=44">';
			var Twino = '<img src="http://data.hordes.fr/gfx/icons/item_drug_hero.gif?v=44">';
			var Arisk = '<img src="http://data.hordes.fr/gfx/icons/item_drug_random.gif?v=44">';
			var Alcool = '<img src="http://data.hordes.fr/gfx/icons/item_vodka.gif?v=44">';
			var Cidre = '<img src="http://data.hordes.fr/gfx/icons/item_hmbrew.gif?v=44">';
			var Cafe = '<img src="http://data.hordes.fr/gfx/icons/item_coffee.gif?v=44">';
			var Sport = '<img src="http://data.hordes.fr/gfx/icons/item_sport_elec.gif?v=44">';
			var e = ' <img src="//data.twinoid.com/proxy/www.hordes.fr/gfx/forum/smiley/h_arrow.gif"> ';
			var dejaBu = 0;
			var dejaBouffe = 0;
			var assoiffement = 0;

			if(soif == 1) {
				assoiffement = 11 + pa;
			} else {
				assoiffement = 0 + pa;
			}

			var i = 0 + pa;
			while(i < expe){
				ordreEau += e;
				if(assoiffement > 17 && cafe >= 1) {
					ordreEau += Cafe;
					cafe--;
					assoiffement += 4;
					i += 4;
				} else if(assoiffement > 15 && eau >= 1 && dejaBu == 0) {
					ordreEau += Eau;
					eau--;
					dejaBu = 1;
					assoiffement = 6;
					i += 6;
				} else if(assoiffement > 15 && eau >= 1 && dejaBu == 1) {
					ordreEau += EauA;
					eau--;
					assoiffement = 0;
				} else if(assoiffement <= 14 && b7 >= 1 && dejaBouffe == 0) {
					ordreEau += Steak;
					dejaBouffe = 1;
					assoiffement += 7;
					i += 7;
				} else if(assoiffement <= 15 && b6 >= 1 && dejaBouffe == 0) {
					ordreEau += Bouffe;
					dejaBouffe = 1;
					assoiffement += 6;
					i += 6;
				} else if(assoiffement <= 15 && stero >= 1) {
					ordreEau += Stero;
					stero--;
					assoiffement += 6;
					i += 6;
				} else if(assoiffement <= 13 && twino >= 1) {
					ordreEau += Twino;
					twino--;
					assoiffement += 8;
					i += 8;
				} else if(assoiffement <= 15 && alcool >= 1 && pasAlcool == 0) {
					ordreEau += Alcool;
					pasAlcool = 1;
					assoiffement += 6;
					i += 6;
				} else if(assoiffement <= 15 && cidre >= 1) {
					ordreEau += Cidre;
					cidre--;
					assoiffement += 6;
					i += 6;
				} else if(assoiffement <= 14 && drogueRisk >= 1) {
					ordreEau += Arisk;
					drogueRisk--;
					assoiffement += 6;
					i += 6;
				} else if(assoiffement <= 16 && sport >= 1 && blesse == 0) {
					ordreEau += Sport;
					blesse = 1;
					assoiffement += 5;
					i += 5;
				} else if(eau == 0 && b7 >= 1 && dejaBouffe == 0) {
					ordreEau += Steak;
					dejaBouffe = 1;
					assoiffement += 7;
					i+= 7;
				} else if(eau == 0 && b6 >= 1 && dejaBouffe == 0) {
					ordreEau += Bouffe;
					dejaBouffe = 1;
					assoiffement += 6;
					i += 6;
				} else if(eau == 0 && stero >= 1) {
					ordreEau += Stero;
					stero--;
					assoiffement += 6;
					i += 6;
				} else if(eau == 0 && twino >= 1) {
					ordreEau += Twino;
					twino--;
					assoiffement += 8;
					i += 8;
				} else if(eau == 0 && alcool >= 1 && pasAlcool == 0) {
					ordreEau += Alcool;
					pasAlcool = 1;
					assoiffement += 6;
					i += 6;
				} else if(eau == 0 && cidre >= 1) {
					ordreEau += Cidre;
					cidre--;
					assoiffement += 6;
					i += 6;
				} else if(eau == 0 && drogueRisk >= 1) {
					ordreEau += Arisk;
					drogueRisk--;
					assoiffement += 6;
					i += 6;
				} else if(eau == 0 && sport >= 1 && blesse == 0) {
					ordreEau += Sport;
					blesse = 1;
					assoiffement += 5;
					i += 5;
				} else if(eau == 0 && cafe >= 1) {
					ordreEau += Cafe;
					cafe--;
					assoiffement += 4;
					i += 4;
				} else if(eau >= 1 && dejaBu == 0) {
					ordreEau += Eau;
					eau--;
					assoiffement = 6;
					i +=6;
				}
			}
			if(assoiffement >= 0 && assoiffement < 11) {
				ordreEau += '<br /><img src="http://data.hordes.fr/gfx/icons/status_hasDrunk.gif"> ' + I18N.get(MODULE_NAME + '_return_normal_text');
			} else if(assoiffement >= 11 && assoiffement < 22) {
				ordreEau += '<br /><img src="http://data.hordes.fr/gfx/icons/status_thirst.gif"> ' + I18N.get(MODULE_NAME + '_return_thirsty_text');
			} else if(assoiffement >= 22 && assoiffement < 33) {
				ordreEau += '<br /><img src="http://data.hordes.fr/gfx/icons/status_dehyd.gif"> ' + I18N.get(MODULE_NAME + '_return_dehydrated_text');
			} else if(assoiffement >= 33) {
				ordreEau += '<br /><img src="//data.twinoid.com/proxy/www.hordes.fr/img/icons/r_cwater.gif"> ' + I18N.get(MODULE_NAME + '_return_died_text');
			}
			
			if(goule == 1) {
				ordreEau = '<img src="http://data.hordes.fr/gfx/icons/small_ghoul.gif"> Cet inconvénient n\'affecte pas les goules !';
			}

			var listeArme = '';
			var zombiesTuesMin = 0;
			var zombiesTuesMax = 0;
			var arme = 0;
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_boomfruit.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_boomfruit.gif"> Pamplemousse explosif ('+arme+'), 5 à 9 zombies, 100% détruit<br />';
				zombiesTuesMin += 5*arme;
				zombiesTuesMax += 9*arme;
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_grenade.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_grenade.gif"> Bombe à eau ('+arme+'), 1 à 4 zombies, 100% détruit<br />';
				zombiesTuesMin += 1*arme;
				zombiesTuesMax += 4*arme;
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_bgrenade.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_bgrenade.gif"> Bombe à eau explosive ('+arme+'), 5 à 12 zombies, 100% détruit<br />';
				zombiesTuesMin += 5*arme;
				zombiesTuesMax += 12*arme;
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_iphone.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_iphone.gif"> Téléphone portable ('+arme+'), 1 à 2 zombie, 100% transformé<br />';
				zombiesTuesMin += 1*arme;
				zombiesTuesMax += 2*arme;
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_angryc.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_angryc.gif"> Petit chaton furieux ('+arme+'), ???, 100% détruit<br />';
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_pet_dog.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_pet_dog.gif"> Chien hargneux ('+arme+'), 1 zombie, 5% détruit<br />';
				zombiesTuesMin += 1*arme;
				zombiesTuesMax += 20*arme;
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_pet_pig.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_pet_pig.gif"> Cochon malodorant (<img src="/gfx/icons/small_heavy.gif">), 1 zombie, 100% détruit<br />';
				zombiesTuesMin += 1;
				zombiesTuesMax += 1;
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_pet_cat.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_pet_cat.gif"> Gros chat mignon ('+arme+'), 1 zombie, 12% détruit<br />';
				zombiesTuesMin += 1*arme;
				zombiesTuesMax += 8*arme;
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_pet_chick.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_pet_chick.gif"> Poule ('+arme+'), 1 zombie, 100% détruit<br />';
				zombiesTuesMin += 1*arme;
				zombiesTuesMax += 1*arme;
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_pet_rat.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_pet_rat.gif"> Rat géant ('+arme+'), 1 zombie, 100% détruit<br />';
				zombiesTuesMin += 1*arme;
				zombiesTuesMax += 1*arme;
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_pet_snake.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_pet_snake.gif"> Serpent de 2 mètres (<img src="/gfx/icons/small_heavy.gif">), 1 zombie, 100% détruit<br />';
				zombiesTuesMin += 1;
				zombiesTuesMax += 1;
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_small_knife.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_small_knife.gif"> Canif dérisoire ('+arme+'), 1/4 1 zombie, 75% cassé<br />';
				zombiesTuesMin += 0;
				zombiesTuesMax += 1*arme;
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_chair_basic.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_chair_basic.gif"> Chaise (<img src="/gfx/icons/small_heavy.gif">), 1/2 1 zombie, 60% cassé<br />';
				zombiesTuesMin += 0;
				zombiesTuesMax += 1;
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_wrench.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_wrench.gif"> Clef à Molette ('+arme+'), 1/3 1 zombie, 20% cassé<br />';
				zombiesTuesMin += 0;
				zombiesTuesMax += 1*arme;
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_cutcut.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_cutcut.gif"> Coupe-coupe ('+arme+'), 2 zombie, 25% cassé<br />';
				zombiesTuesMin += 2*arme;
				zombiesTuesMax += 8*arme;
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_knife.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_knife.gif"> Couteau à dents ('+arme+'), 1 zombie, 20% cassé<br />';
				zombiesTuesMin += 1*arme;
				zombiesTuesMax += 5*arme;
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_swiss_knife.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_swiss_knife.gif"> Couteau suisse ('+arme+'), 1/3 1 zombie, 50% détruit<br />';
				zombiesTuesMin += 0;
				zombiesTuesMax += 1*arme;
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_cutter.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_cutter.gif"> Cutter ('+arme+'), 1/2 1 zombie, 90% cassé<br />';
				zombiesTuesMin += 0;
				zombiesTuesMax += 1*arme;
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_machine_2.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_machine_2.gif"> Four cancérigène (<img src="/gfx/icons/small_heavy.gif">), 1 zombie, 35% cassé<br />';
				zombiesTuesMin += 1;
				zombiesTuesMax += 3;
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_staff.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_staff.gif"> Grand Bâton Sec ('+arme+'), 1/2 1 zombie, 70% cassé<br />';
				zombiesTuesMin += 0;
				zombiesTuesMax += 1*arme;
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_chain.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_chain.gif"> Grosse chaîne rouillée ('+arme+'), 1/2 1 zombie, 30% cassé<br />';
				zombiesTuesMin += 0;
				zombiesTuesMax += 1*arme;
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_bone.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_bone.gif"> Os humain fêlé ('+arme+'), 1 zombie, 75% cassé<br />';
				zombiesTuesMin += 1*arme;
				zombiesTuesMax += 2*arme;
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_can_opener.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_can_opener.gif"> Ouvre-boîtes ('+arme+'), 1/3 1 zombie, 100% cassé<br />';
				zombiesTuesMin += 0;
				zombiesTuesMax += 1*arme;
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_concrete_wall.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_concrete_wall.gif"> Pavés de béton informe (<img src="/gfx/icons/small_heavy.gif">), 1 à 2 zombies, 70% cassé<br />';
				zombiesTuesMin += 1*arme;
				zombiesTuesMax += 2*arme;
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_machine_3.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_machine_3.gif"> Réfrigérateur d\'étudiant (<img src="/gfx/icons/small_heavy.gif">), 1 zombie, 30% cassé<br />';
				zombiesTuesMin += 1;
				zombiesTuesMax += 3;
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_lawn.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_lawn.gif"> Tondeuse à gazon (<img src="/gfx/icons/small_heavy.gif">), 2 zombies, 12.5% cassé<br />';
				zombiesTuesMin += 2;
				zombiesTuesMax += 16;
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_torch.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_torch.gif"> Torche ('+arme+'), 1/2 1 zombie, 80% transformé<br />';
				zombiesTuesMin += 0;
				zombiesTuesMax += 1*arme;
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_torch_off.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_torche_off.gif"> Torche consumée ('+arme+'), 1/4 1 zombie, 90% cassé<br />';
				zombiesTuesMin += 0;
				zombiesTuesMax += 1*arme;
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_screw.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_screw.gif"> Tournevis ('+arme+'), 1/4 1 zombie, 50% cassé<br />';
				zombiesTuesMin += 0;
				zombiesTuesMax += 1*arme;
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_machine_1.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_machine_1.gif"> Vieille machine à laver (<img src="/gfx/icons/small_heavy.gif">), 1 zombie, 40% cassé<br />';
				zombiesTuesMin += 1;
				zombiesTuesMax += 2;
			}
			
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_pc.gif"]').length;
			if(arme > 0) {
				listeArme += '<img src="/gfx/icons/item_pc.gif"> Unité centrale (<img src="/gfx/icons/small_heavy.gif">), 1 zombie, 55% cassé<br />';
				zombiesTuesMin += 1;
				zombiesTuesMax += 2*arme;
			}
			
			if(eau == $('div.infoBar ul.inv li img[src*="/gfx/icons/item_water.gif"]').length && goule == 0) {
				eau -= 1; 
				if(eau < 0) {
					eau = 0;
				}
			} else {
				eau = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_water.gif"]').length;
			}

			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_watergun_opt_empty.gif"]').length+$('div.infoBar ul.inv li img[src*="/gfx/icons/item_watergun_opt_1.gif"]').length+$('div.infoBar ul.inv li img[src*="/gfx/icons/item_watergun_opt_2.gif"]').length+$('div.infoBar ul.inv li img[src*="/gfx/icons/item_watergun_opt_3.gif"]').length+$('div.infoBar ul.inv li img[src*="/gfx/icons/item_watergun_opt_4.gif"]').length+$('div.infoBar ul.inv li img[src*="/gfx/icons/item_watergun_opt_5.gif"]').length;
			if(arme > 0) {
				arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_watergun_opt_empty.gif"]').length*0+$('div.infoBar ul.inv li img[src*="/gfx/icons/item_watergun_opt_1.gif"]').length*1+$('div.infoBar ul.inv li img[src*="/gfx/icons/item_watergun_opt_2.gif"]').length*2+$('div.infoBar ul.inv li img[src*="/gfx/icons/item_watergun_opt_3.gif"]').length*3+$('div.infoBar ul.inv li img[src*="/gfx/icons/item_watergun_opt_4.gif"]').length*4+$('div.infoBar ul.inv li img[src*="/gfx/icons/item_watergun_opt_5.gif"]').length*5 + eau*5;
				listeArme += '<img src="/gfx/icons/item_watergun_opt_empty.gif"> Aqua-splash ('+arme+'), 1 zombie, 100% -1 ' + I18N.get(MODULE_NAME + '_charge') + '<br />';
				zombiesTuesMin += 1*arme;
				zombiesTuesMax += 1*arme;
			}

			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_watergun_empty.gif"]').length+$('div.infoBar ul.inv li img[src*="/gfx/icons/item_watergun_1.gif"]').length+$('div.infoBar ul.inv li img[src*="/gfx/icons/item_watergun_2.gif"]').length+$('div.infoBar ul.inv li img[src*="/gfx/icons/item_watergun_3.gif"]').length;
			if(arme > 0) {
				arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_watergun_empty.gif"]').length*0+$('div.infoBar ul.inv li img[src*="/gfx/icons/item_watergun_1.gif"]').length*1+$('div.infoBar ul.inv li img[src*="/gfx/icons/item_watergun_2.gif"]').length*2+$('div.infoBar ul.inv li img[src*="/gfx/icons/item_watergun_3.gif"]').length*3+eau*3;
				listeArme += '<img src="/gfx/icons/item_watergun_empty.gif"> Pistolet à eau ('+arme+'), 1 zombie, 100% -1 ' + I18N.get(MODULE_NAME + '_charge') + '<br />';
				zombiesTuesMin += 1*arme;
				zombiesTuesMax += 1*arme;
			} 

			var pile = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_pile.gif"]').length;
			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_mixergun.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_mixergun_empty.gif"]').length;
			if(arme > 0) {
				arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_mixergun.gif"]').length*1 + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_mixergun_empty.gif"]').length*0 + pile;
				listeArme += '<img src="/gfx/icons/item_mixergun_empty.gif"> Batteur électrique ('+arme+'), 1 zombie, 40% ' + I18N.get(MODULE_NAME + '_discharge') + '<br />';
				zombiesTuesMin += 1*arme;
				zombiesTuesMax += 2*arme;
			}

			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_big_pgun.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_big_pgun_empty.gif"]').length;
			if(arme > 0) {
				arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_big_pgun.gif"]').length*1 + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_big_pgun_empty.gif"]').length*0 + pile;
				listeArme += '<img src="/gfx/icons/item_big_pgun_empty.gif"> Devastator ('+arme+'), 2 zombies, 100% ' + I18N.get(MODULE_NAME + '_discharge') + '<br />';
				zombiesTuesMin += 2*arme;
				zombiesTuesMax += 2*arme;
			}

			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_pilegun.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_pilegun_empty.gif"]').length;
			if(arme > 0) {
				arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_pilegun_empty.gif"]').length*0 + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_pilegun.gif"]').length*1 + pile;
				listeArme += '<img src="/gfx/icons/item_pilegun_empty.gif"> Lance-Pile 1-PDTG ('+arme+'), 0 à 1 zombie, 100% ' + I18N.get(MODULE_NAME + '_discharge') + '<br />';
				zombiesTuesMin += 0;
				zombiesTuesMax += 1*arme;
			}

			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_pilegun_up.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_pilegun_up_empty.gif"]').length;
			if(arme > 0) {
				arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_pilegun_up_empty.gif"]').length*0 + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_pilegun_up.gif"]').length*1 + pile;
				listeArme += '<img src="/gfx/icons/item_pilegun_up_empty.gif"> Lance-Pile Mark II ('+arme+'), 1 zombie, 20% ' + I18N.get(MODULE_NAME + '_discharge') + '<br />';
				zombiesTuesMin += 1*arme;
				zombiesTuesMax += 5*arme;
			}

			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_taser.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_taser_empty.gif"]').length;
			if(arme > 0) {
				arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_taser.gif"]').length*1 + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_taser_empty.gif"]').length*0 + pile;
				listeArme += '<img src="/gfx/icons/item_taser_empty.gif"> Taser d\'auto-défense ('+arme+'), 0 à 1 zombie, 100% ' + I18N.get(MODULE_NAME + '_discharge') + '<br />';
				zombiesTuesMin += 0*arme;
				zombiesTuesMax += 1*arme;
			}

			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_chainsaw.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_chainsaw_empty.gif"]').length;
			if(arme > 0) {
				arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_chainsaw_empty.gif"]').length*0 + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_pc.gif"]').length*1 + pile;
				listeArme += '<img src="/gfx/icons/item_chainsaw_empty.gif> Tronçonneuse ('+arme+'), 3 zombies, 30% ' + I18N.get(MODULE_NAME + '_discharge') + '<br />';
				zombiesTuesMin += 3*arme;
				zombiesTuesMax += 9*arme;
			}

			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_lpoint.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_lpoint1.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_lpoint2.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_lpoint3.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_lpoint4.gif"]').length;
			if(arme > 0) {
				arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_lpoint.gif"]').length*0 + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_lpoint1.gif"]').length*1 + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_lpoint2.gif"]').length*2 + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_lpoint3.gif"]').length*3 + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_lpoint4.gif"]').length*4 + pile*4;
				listeArme += '<img src="/gfx/icons/item_lpoint.gif"> Pointeur Laser Brûlant ('+arme+'), 2 zombies, 100% -1 ' + I18N.get(MODULE_NAME + '_charge') + '<br />';
				zombiesTuesMin += 2*arme;
				zombiesTuesMax += 2*arme;
			}

			arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_jerrygun.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_jerrygun_off.gif"]').length;
			if(arme > 0) {
				arme = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_jerrygun.gif"]').length*1 + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_jerrycan.gif"]').length*1;
				listeArme += '<img src="/gfx/icons/item_jerrygun.gif"> Pompe à Jerrycan ('+arme+'), 1 zombie, 15% ' + I18N.get(MODULE_NAME + '_discharge') + '<br />';
				zombiesTuesMin += 1*arme;
				zombiesTuesMax += 6*arme;
			}

			var cclArmes = "";
			if(zombiesTuesMin == zombiesTuesMax) {
				cclArmes = zombiesTuesMin;
			} else {
				cclArmes = 'de '+zombiesTuesMin+' à '+zombiesTuesMax;
			}

			var toInject = '<h2 style="text-align: center;"><strong>' + I18N.get(MODULE_NAME + "_title") +'</strong></h2>';
			toInject += '<h2>' + I18N.get(MODULE_NAME + "_ap_text") + '</h2>';
			toInject += I18N.get(MODULE_NAME + "_ap_icon") + outEau + outBouffe + outAlcool + outStero + outTwino + outDrogueRisk + outCafe + outCidre + outSport + ' = ' + expe + " " + I18N.get(MODULE_NAME + "_ap_icon") + outBlesse;
			toInject += '<h2>' + I18N.get(MODULE_NAME + "_dehydration_title") + '</h2>' + introEau + ':<br />'+ordreEau;
			toInject += '<h2>' + I18N.get(MODULE_NAME + "_weapons_title") + '</h2>' + listeArme + I18N.get(MODULE_NAME + "_total_kills") + cclArmes +' <img src="/gfx/icons/small_zombie.gif">';

			var inject = $('#Expedition').length == 0;

			var css = "";

			// Aux portes mais dedans
			if(D2N.is_on_page_in_city('doors')) {
				if(inject) {
					$("<div id='Expedition'>" + toInject + "</div>").insertAfter('p.ambiant');
					css = "#Expedition {";
					css += "margin-bottom: 10px;";
					css += "}";
				} else {
					$('#Expedition').html(toInject);
				}
			}

			// À la banque
			if(D2N.is_on_page_in_city('bank')) {
				if(inject) {
					$("<div id='Expedition'>" + toInject + "</div>").appendTo('div.right');
					css = "#Expedition {";
					css += "margin-top: 10px;";
					css += "}";
				} else {
					$('#Expedition').html(toInject);
				}
			}

			// Dans la maison
			if(D2N.is_on_page_in_city('home')) {
				if(inject) {
					$('<ul id="Expedition" class="tools shortTools homeInv">' + toInject + '</ul>').insertAfter('div.right ul.tools.shortTools.homeInv');
					css = "#Expedition h2 {";
					css += "margin-top: 0 !important;";
					css += "background-image: none !important;";
					css += "}";
				} else {
					$('#Expedition').html(toInject);
				}
			}

			// Dehors
			if(D2N.is_outside()) {
				if(inject) {
					$('<div class="block" id="Expedition" style="margin-top: 8px;"><div class="header"></div><div class="bg">' + toInject + '</div><div class="footer"></div></div>').appendTo('.sidePanel');
					css = "#Expedition h2 {";
					css += "margin-bottom: 10px;";
					css += "}";
					css += "#Expedition h2:first-child {";
					css += "margin-top: -7px !important;";
					css += "}";
				} else {
					$('#Expedition').html('<div class="header"></div><div class="bg">' + toInject + '</div><div class="footer"></div>');
				}
			}

			if (css != ""){
				JS.injectCSS(css);
			}
		}
	}

	/************************
	 * Module configuration *
	 ************************/

	return {

		name: MODULE_NAME,
		type: Module.TYPE.INTERFACE_ENHANCEMENT,

		properties: {
			enabled: false,
            isProtected: false
		},

		configurable: {
			enabled: {
				category: Module.PROPERTY_CATEGORY.OUTSIDE,
				type: Module.PROPERTY.BOOLEAN,
				short_desc_I18N: MODULE_NAME + '_short_desc',
				full_desc_I18N: MODULE_NAME + '_full_desc'
			}
		},

		actions: {
			can_run: function() {
				return true;
			},

			init: function() {
				add_i18n();
			},

			load: function() {
				document.addEventListener('d2n_gamebody_reload', function() {
					if(!D2N.is_outside() && !D2N.is_on_page_in_city('bank') && !D2N.is_on_page_in_city('home') && !D2N.is_on_page_in_city('doors')){
						return;
					}
					refresh();
				}, false);
			}
		}
	};
});
