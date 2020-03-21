Module.register(function() {

	var MODULE_NAME = 'savva_calcpa';
	var style = 'background-color: #5c2b20;';
	style += 'outline: 1px solid black;';
	style += 'border: 1px solid #ad8051;';
	style += 'font: normal 10pt Century Gothic, Arial, Trebuchet MS, Verdana, sans-serif;';
	style += 'color: white;';
	style += 'width: auto;';
	style += 'padding-left: 6px;';
	style += 'padding-top: 2px;';
	style += 'padding-bottom: 2px;';
	style += 'margin-left: 1px;';
	style += 'margin-top: 3px;';
	style += 'cursor: help;';

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
		i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Affichage des PAs potentiels (par -SAVVA-)';
		i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Calcule les PAs potentiels lors d\'une expédition (oui, c\'est inutile). Script par -SAVVA-, intégré et traduit avec sa permission.';

		i18n[I18N.LANG.FR][MODULE_NAME + '_ap_icon'] = '<img src="http://data.hordes.fr/gfx/loc/fr/small_pa.gif" />';

		i18n[I18N.LANG.FR][MODULE_NAME + '_water_ghoul'] = 'Vous ne pouvez pas vous regénérer avec de l\\\'eau, vous êtes une goule.';
		i18n[I18N.LANG.FR][MODULE_NAME + '_water_already_drunk'] = 'Vous avez déjà bu.';
		i18n[I18N.LANG.FR][MODULE_NAME + '_water_available'] = 'Vous n\\\'avez pas encore bu et vous possédez au moins une ration d\\\'eau.';
		i18n[I18N.LANG.FR][MODULE_NAME + '_water_none'] = 'Vous n\\\'avez pas encore bu mais vous ne possédez pas de ration d\\\'eau.';

		i18n[I18N.LANG.FR][MODULE_NAME + '_meal_already_ate'] = 'Vous avez déjà mangé.';
		i18n[I18N.LANG.FR][MODULE_NAME + '_meal_6_available'] = 'Vous n\\\'avez pas encore mangé et vous possédez au moins une bouffe 6 PA.';
		i18n[I18N.LANG.FR][MODULE_NAME + '_meal_7_available'] = 'Vous n\\\'avez pas encore mangé et vous possédez au moins une bouffe 7 PA.';
		i18n[I18N.LANG.FR][MODULE_NAME + '_meal_none'] = 'Vous n\\\'avez pas encore mangé mais vous ne possédez pas de bouffe.';

		i18n[I18N.LANG.FR][MODULE_NAME + '_alcohol_drunk'] = 'Vous ne pouvez pas boire d\\\'alcool.';
		i18n[I18N.LANG.FR][MODULE_NAME + '_alcohol_available'] = 'Vous pouvez boire votre bouteille d\\\'alcool.';
		i18n[I18N.LANG.FR][MODULE_NAME + '_alcohol_none'] = 'Vous pouvez boire de l\\\'alcool mais vous n\\\'en avez pas.';

		i18n[I18N.LANG.FR][MODULE_NAME + '_coffee_available'] = 'Vous possédez <strong>[NB]</strong> café(s).';
		i18n[I18N.LANG.FR][MODULE_NAME + '_coffee_none'] = 'Vous ne possédez aucun café.';

		i18n[I18N.LANG.FR][MODULE_NAME + '_hurt'] = 'Vous êtes blessé ! (Vos régénérations de PA sont diminués).';
		i18n[I18N.LANG.FR][MODULE_NAME + '_not_hurt'] = 'Vous n\\\'êtes pas blessé.';
		i18n[I18N.LANG.FR][MODULE_NAME + '_not_hurt_sport'] = 'Vous n\\\'êtes pas blessé et vous possédez un Sport-Elec chargé.';

		i18n[I18N.LANG.FR][MODULE_NAME + "_drugs"] = 'Vous possédez <strong>[NBSTERO]</strong> stéroïdes, <strong>[NBTWINO]</strong> Twinoïdes, <strong>[NBRISK]</strong> drogues à risque et <strong>[NBCIDRE]</strong> cidres.';
		i18n[I18N.LANG.FR][MODULE_NAME + "_current_ap"] = 'Vous possédez <strong>[NB]</strong> <img src=&quot;http://data.hordes.fr/gfx/loc/fr/small_pa.gif&quot;> en réserve.';
		i18n[I18N.LANG.FR][MODULE_NAME + "_misc"] = 'Vous possédez <strong>[NB]</strong> objets de régénérations divers.';

		i18n[I18N.LANG.FR][MODULE_NAME + '_text_ap_exact'] = 'Vous possédez <strong>[NB]</strong> <img src="http://data.hordes.fr/gfx/loc/fr/small_pa.gif" />.';
		i18n[I18N.LANG.FR][MODULE_NAME + '_text_ap_approx'] = 'Vous possédez de <strong>[NBMIN]</strong> à <strong>[NBMAX]</strong> <img src="http://data.hordes.fr/gfx/loc/fr/small_pa.gif"> potentiels.';

		i18n[I18N.LANG.FR][MODULE_NAME + '_text_pdc'] = 'Il a <strong>[NB]</strong> PDC.';
		i18n[I18N.LANG.FR][MODULE_NAME + '_text_pdc_vs_zeds'] = 'Les humains sont à <strong>[PDC]</strong> contre <strong>[ZEDS]</strong>.';

		i18n[I18N.LANG.EN] = {};
		i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Display potentials APs (by -SAVVA-)';
		i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Calculate the potentials APs during an expedition (yes, this is useless). Script by -SAVVA-, integrated and translated with his permission.';

		i18n[I18N.LANG.EN][MODULE_NAME + '_ap_icon'] = '<img src="http://data.hordes.fr/gfx/loc/en/small_pa.gif" />';

		i18n[I18N.LANG.EN][MODULE_NAME + '_water_ghoul'] = 'You cannot get more AP with water, you are a ghoul.';
		i18n[I18N.LANG.EN][MODULE_NAME + '_water_already_drunk'] = 'You drank already.';
		i18n[I18N.LANG.EN][MODULE_NAME + '_water_available'] = 'You didn\\\'t drink and you have a water ration.';
		i18n[I18N.LANG.EN][MODULE_NAME + '_water_none'] = 'You didn\\\'t drink but you don\\\'t have a water ration.';

		i18n[I18N.LANG.EN][MODULE_NAME + '_meal_already_ate'] = 'You are fed.';
		i18n[I18N.LANG.EN][MODULE_NAME + '_meal_6_available'] = 'You didn\\\'t eat and you have a 6 AP meal.';
		i18n[I18N.LANG.EN][MODULE_NAME + '_meal_7_available'] = 'You didn\\\'t eat and you have a 7 AP meal.';
		i18n[I18N.LANG.EN][MODULE_NAME + '_meal_none'] = 'You didn\\\'t eat but you don\\\'t have any meal.';

		i18n[I18N.LANG.EN][MODULE_NAME + '_alcohol_drunk'] = 'You can\\\'t drink any alcohol.';
		i18n[I18N.LANG.EN][MODULE_NAME + '_alcohol_available'] = 'You can drink your alcohol.';
		i18n[I18N.LANG.EN][MODULE_NAME + '_alcohol_none'] = 'You can drink alcohol but you don\\\'t have any.';

		i18n[I18N.LANG.EN][MODULE_NAME + '_coffee_available'] = 'You have <strong>[NB]</strong> coffee(s).';
		i18n[I18N.LANG.EN][MODULE_NAME + '_coffee_none'] = 'You don\\\'t have any coffee.';

		i18n[I18N.LANG.EN][MODULE_NAME + '_hurt'] = 'You are hurt ! (Your AP recovery is 1 less).';
		i18n[I18N.LANG.EN][MODULE_NAME + '_not_hurt'] = 'You are not hurt.';
		i18n[I18N.LANG.EN][MODULE_NAME + '_not_hurt_sport'] = 'You are not hurt and you have a charged EMS System.';

		i18n[I18N.LANG.EN][MODULE_NAME + "_drugs"] = 'You have <strong>[NBSTERO]</strong> steroids, <strong>[NBTWINO]</strong> Twinoids, <strong>[NBRISK]</strong> risky drugs and <strong>[NBCIDRE]</strong> Ergot Homebrew.';
		i18n[I18N.LANG.EN][MODULE_NAME + "_current_ap"] = 'You currently have <strong>[NB]</strong> <img src=&quot;http://data.hordes.fr/gfx/loc/fr/small_pa.gif&quot;>.';
		i18n[I18N.LANG.EN][MODULE_NAME + "_misc"] = 'You have <strong>[NB]</strong> miscellaneous regenerating items.';

		i18n[I18N.LANG.EN][MODULE_NAME + '_text_ap_exact'] = 'You have <strong>[NB]</strong> <img src="http://data.hordes.fr/gfx/loc/en/small_pa.gif" />.';		
		i18n[I18N.LANG.EN][MODULE_NAME + '_text_ap_approx'] = 'You can have from <strong>[NBMIN]</strong> to <strong>[NBMAX]</strong> potential <img src="http://data.hordes.fr/gfx/loc/en/small_pa.gif">.';		

		i18n[I18N.LANG.EN][MODULE_NAME + '_text_pdc'] = 'He has <strong>[NB]</strong> CP.';
		i18n[I18N.LANG.EN][MODULE_NAME + '_text_pdc_vs_zeds'] = 'Humans are <strong>[PDC]</strong> vs <strong>[ZEDS]</strong>.';
		
		I18N.set(i18n);
	}

	function refresh() {
		if($('div.sectionArt').length === 1){
			var el = $('div.infoBar ul.inv li img[src*="small_empty_inv.gif"]').length;
			var pa = +$('div.counter').text().substr(1,1);
			var dejaBu = $('div.infoBar ul.status li img[src*="/gfx/icons/status_hasDrunk.gif"]').length;
			var goule = $('div.infoBar ul.status li img[src*="/gfx/icons/small_ghoul.gif"]').length;
			var dejaBouffe = $('div.infoBar ul.status li img[src*="/gfx/icons/status_hasEaten.gif"]').length;
			var pasAlcool = $('div.infoBar ul.status li img[src*="/gfx/icons/status_drunk.gif"]').length + $('ul#myStatus.status img[src*="/gfx/icons/status_hung_over.gif"]').length;
			var blesse = $('div.infoBar ul.status li img[src*="/gfx/icons/status_wound.gif"]').length;
			var eau = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_water.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_potion.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_water_can_1.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_water_can_2.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_water_can_3.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_water_cup.gif"]').length;
			var b6 = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_food_chick.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_food_tarte.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_can_open.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_cadaver.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_food_bar3.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_food_sandw.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_vegetable.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_food_bar2.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_food_noodles.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_bone_meat.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_food_bar1.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_food_biscuit.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_food_pims.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_dish.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_fruit.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_hmeat.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_undef.gif"]').length;
			var b7 = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_dish_tasty.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_chama_tasty.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_vegetable_tasty.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_food_noodles_hot.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_egg.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_food_candies.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_apple.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_meat.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_woodsteak.gif"]').length;
			var alcool = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_vodka.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_rhum.gif"]').length;
			var cidre = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_hmbrew.gif"]').length;
			var stero = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_drug.gif"]').length;
			var twino = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_drug_hero.gif"]').length;
			var drogueRisk = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_drug_random.gif"]').length + $('div.infoBar ul.inv li img[src*="/gfx/icons/item_beta_drug_bad.gif"]').length;
			var cafe = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_coffee.gif"]').length;
			var sport = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_sport_elec.gif"]').length;
			var autre = $('div.infoBar ul.inv li img[src*="/gfx/icons/item_lsd.gif"]').length;
			var paPotentiels = pa;

			// Gestion de l'eau
			var outEau = "";
			if(goule){
				outEau = I18N.get(MODULE_NAME + "_water_ghoul");
				eau = 0;
			} else {
				if(dejaBu){
					outEau = I18N.get(MODULE_NAME + "_water_already_drunk");
					eau = 0;
				} else {
					if(eau) {
						outEau = I18N.get(MODULE_NAME + "_water_available");
						paPotentiels += 6-blesse;
					} else {
						outEau = I18N.get(MODULE_NAME + "_water_none");
					}
				}
			}

			// Gestion du repas
			var outBouffe = "";
			if(dejaBouffe) {
				outBouffe = I18N.get(MODULE_NAME + "_meal_already_ate");
				b6 = 0;
				b7 = 0;
			} else {
				if(!b6 && !b7){
					outBouffe = I18N.get(MODULE_NAME + "_meal_none");
				} else if (b6){
					outBouffe = I18N.get(MODULE_NAME + "_meal_6_available");
					paPotentiels += 6-blesse;
				} else {
					outBouffe = I18N.get(MODULE_NAME + "_meal_7_available");
					paPotentiels += 7-blesse;
					b6 = 0;
				}
			}

			// Gestion alcool
			var outAlcool = "";
			if(pasAlcool){
				outAlcool = I18N.get(MODULE_NAME + "_alcohol_drunk");
				alcool = 0;
			} else {
				if(alcool){
					outAlcool = I18N.get(MODULE_NAME + "_alcohol_available");
					paPotentiels += 6-blesse;
				} else {
					outAlcool = I18N.get(MODULE_NAME + "_alcohol_none");
				}
			}

			// Gestion café
			var outCafe = "";
			if(cafe === 0) {
				outCafe = I18N.get(MODULE_NAME + "_coffee_none");
			} else {
				outCafe = I18N.get(MODULE_NAME + "_coffee_available").replace('[NB]', cafe);
				paPotentiels += cafe * 4;
			}

			var outSport = "";
			if(blesse) {
				outSport = I18N.get(MODULE_NAME + "_hurt");
				sport = 0;
			} else {
				if(sport){
					outSport = I18N.get(MODULE_NAME + "_not_hurt_sport");
					paPotentiels += 5;
				} else {
					outSport = I18N.get(MODULE_NAME + "_not_hurt");
				}
			}
			var outDrogues = I18N.get(MODULE_NAME + "_drugs").replace("[NBSTERO]", stero).replace("[NBTWINO]", twino).replace("[NBRISK]", drogueRisk).replace("[NBCIDRE]", cidre);
			paPotentiels += stero * (6-blesse) + twino * (8-blesse) + cidre * (6-blesse);
			var paPotentielsMin = paPotentiels;
			paPotentiels += drogueRisk*(7-blesse);
			var outPa = "";
			if(paPotentiels == paPotentielsMin) {
				outPa = I18N.get(MODULE_NAME + "_text_ap_exact").replace("[NB]", paPotentiels);
			}
			if(paPotentiels != paPotentielsMin) {
				outPa = I18N.get(MODULE_NAME + "_text_ap_approx").replace("[NBMIN]", paPotentielsMin).replace("[NBMAX]", paPotentiels);
			}
			var outHoot = I18N.get(MODULE_NAME + "_ap_icon") + ' ('+pa+')';
			var PA6 = 6-blesse;
			var PA7 = 7-blesse;
			var PA8 = 8-blesse;

			if(eau >= 1)
				outHoot += ' + <img src="http://data.hordes.fr/gfx/icons/item_water.gif"> ('+PA6+')';
			if(b6 >= 1)
				outHoot += ' + <img src="/gfx/icons/item_can_open.gif"> ('+PA6+')';
			if(b7 >= 1)
				outHoot += ' + <img src="/gfx/icons/item_meat.gif"> ('+PA7+')';
			if(alcool >= 1)
				outHoot += ' + <img src="/gfx/icons/item_vodka.gif"> ('+PA6+')';
			if(stero >= 1)
				outHoot += ' + '+stero+'<img src="/gfx/icons/item_drug.gif"> ('+stero*PA6+')';
			if(twino >= 1)
				outHoot += ' + '+twino+'<img src="/gfx/icons/item_drug_hero.gif"> ('+twino*PA8+')';
			if(drogueRisk >= 1)
				outHoot += ' + '+drogueRisk+'<img src="/gfx/icons/item_drug_random.gif"> (0-'+drogueRisk*PA7+')';
			if(cafe >= 1)
				outHoot += ' + '+cafe+'<img src="/gfx/icons/item_coffee.gif"> ('+4*cafe+')';
			if(sport >= 1)
				outHoot += ' + <img src="/gfx/icons/item_sport_elec.gif"> (5)';
			if(cidre >= 1)
				outHoot += ' + '+cidre+'<img src="/gfx/icons/item_hmbrew.gif"> ('+PA6*cidre+')';

			var toInject = '<div style="'+style+'" id="CalcPa" ';
			toInject += 'onmouseover="js.HordeTip.showSpecialTip(this, \'simpleTip\', \'\', \'';
			toInject += '<div><img src=&quot;//data.twinoid.com/proxy/www.hordes.fr/gfx/forum/smiley/h_middot.gif&quot;>' + I18N.get(MODULE_NAME + '_current_ap').replace("[NB]", pa) + '<br />';
			toInject += '<img src=&quot;//data.twinoid.com/proxy/www.hordes.fr/gfx/forum/smiley/h_middot.gif&quot;> '+outEau+'<br />';
			toInject += '<img src=&quot;//data.twinoid.com/proxy/www.hordes.fr/gfx/forum/smiley/h_middot.gif&quot;> '+outBouffe+'<br />';
			toInject += '<img src=&quot;//data.twinoid.com/proxy/www.hordes.fr/gfx/forum/smiley/h_middot.gif&quot;> '+outAlcool+'<br />';
			toInject += '<img src=&quot;//data.twinoid.com/proxy/www.hordes.fr/gfx/forum/smiley/h_middot.gif&quot;> '+outDrogues+'<br />';
			toInject += '<img src=&quot;//data.twinoid.com/proxy/www.hordes.fr/gfx/forum/smiley/h_middot.gif&quot;> '+outCafe+'<br />';
			toInject += '<img src=&quot;//data.twinoid.com/proxy/www.hordes.fr/gfx/forum/smiley/h_middot.gif&quot;> '+outSport+'<br />';
			toInject += '<img src=&quot;//data.twinoid.com/proxy/www.hordes.fr/gfx/forum/smiley/h_middot.gif&quot;> '+I18N.get(MODULE_NAME + '_misc').replace('[NB]', autre) +'\', event);" ';
			toInject += 'onmouseout="js.HordeTip.hide(event);">'+outPa+'<br />'+outHoot+'</div><br />';

			if($('div#CalcPa').length == 0){
				$(toInject).insertAfter('div.sectionArt');
			}

			var a;
			var H;
			var Z;
			$('ul.logs li.entry.CL_OutsideMessage').each(function(){
				var messageContent = "";
				var Text = "";
				var regex = /\(h=([0-9]+) z=([0-9]+)(?: me=([0-9]+))?\)/;
				if($(this).children('span').length == 2) {
					// Départ
					messageContent = $(this).children('span').next().text();
					var matches = messageContent.match(regex);
					H = matches[1]*1;
					Z = matches[2]*1;
				} else {
					// Arrivée ou rappat
					messageContent = $(this).children('span').text();
					var matches = messageContent.match(regex);
					H = matches[1]*1;
					Z = matches[2]*1;
					if(matches[3] !== undefined){
						// 4 matches (toute la string, H,Z et ME, c'est une arrivée)
						var ME = matches[3]*1;
						Text = I18N.get(MODULE_NAME + "_text_pdc").replace("[NB]", ME);
						H = H + ME;
					}
				} 

				Text += '<br />' + I18N.get(MODULE_NAME + "_text_pdc_vs_zeds").replace("[PDC]", H).replace("[ZEDS]", Z);
				$(this).append('<span>'+Text+'<span>');
			});
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
					if(!D2N.is_outside()){
						return;
					}
					refresh();
					$('div.who table.table tbody tr td.name').each(function(){
						var mouseover = $(this).children('a').eq(0).attr('onmouseover');
						$(this).children('a').eq(1).attr('onmouseover', mouseover);

						var mouseout = $(this).children('a').eq(0).attr('onmouseout');
						$(this).children('a').eq(1).attr('onmouseout', mouseout);
					});
				}, false);
			}
		}
	};
});
