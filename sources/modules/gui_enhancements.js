Module.register(function() {

	var MODULE_NAME = 'gui_enhancement';
	var OKGIF = "https://d2ne.datw.tf/ok.png";
	var NOKGIF = "https://d2ne.datw.tf/nok.png";
	var CAUTIONGIF = "https://d2ne.datw.tf/caution.png";
	var timer;

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
		i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Améliorations de l\'interface';
		i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Modifie l\'interface de Hordes pour améliorer certains aspects du jeu.';
		i18n[I18N.LANG.FR][MODULE_NAME + '_ok_save'] = 'Peut être sauvé.';
		i18n[I18N.LANG.FR][MODULE_NAME + '_nok_save'] = 'Ne peut pas être sauvé.';
		i18n[I18N.LANG.FR][MODULE_NAME + '_ok_escort'] = 'Escorte bien paramétrée.';
		i18n[I18N.LANG.FR][MODULE_NAME + '_nok_escort'] = 'Escorte mal paramétrée.';
		i18n[I18N.LANG.FR][MODULE_NAME + '_distance_text'] = 'Le citoyen est à $[1] km.';

		i18n[I18N.LANG.EN] = {};
		i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'GUI enhancement';
		i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Add some graphical enhancements to the general UI of Die2Nite.';
		i18n[I18N.LANG.EN][MODULE_NAME + '_ok_save'] = 'Can be saved.';
		i18n[I18N.LANG.EN][MODULE_NAME + '_nok_save'] = 'Cannot be saved.';
		i18n[I18N.LANG.EN][MODULE_NAME + '_ok_escort'] = 'Good escort options set.';
		i18n[I18N.LANG.EN][MODULE_NAME + '_nok_escort'] = 'Good escort options not set.';
		i18n[I18N.LANG.EN][MODULE_NAME + '_distance_text'] = 'The citizen is $[1] km away.';

		I18N.set(i18n);
	}

	function getDistance(x1,y1,x2,y2) {
		var a = x1 - x2;
		var b = y1 - y2;

		var c = Math.sqrt(a * a + b * b);
		return Math.round(c);
	}

	/**
	 * Add icon if citizen is outside and beyong reach (for the hero action "Rescue")
	 */
	function enhance_citizen_interface(){
		if($("div.heroMode").length){
			// If we're a hero, shows a green or red sign if the citizen can be rescued
			JS.wait_for_selector('div.citizens table', function(el) {
				var citizensRows = el.querySelectorAll("tr");
				for(var i = 1 ; i < citizensRows.length ; i += 1){
					var row = citizensRows[i];
					// No coordinates columns (dead citizen)
					if(row.children[4] === undefined) {
						continue;
					}

					// Get the citizen's location, and if it's "--", then he is in town
					var location = row.children[4].innerText.trim();
					if(location === "--") {
						continue;
					}

					location = location.split(',');

					// Here, the citizen is outside
					// It's time to see if he is farther than 11km (for the Rescue)
					var coordinates = [];
					coordinates[0] = location[0].substr(1);
					coordinates[1] = location[1].substr(0, location[1].length - 1);

					var distance = getDistance(0, 0, coordinates[0], coordinates[1]);

					var imgSauvetage = null;
					if($("#infosSaving" + i).length === 0){
						imgSauvetage = $("<img>");
						imgSauvetage.attr("id", "infosSaving" + i);
					} else {
						imgSauvetage = $("#infosSaving" + i);
					}

					imgSauvetage.attr("onmouseover", "js.HordeTip.showSpecialTip(this, 'helpTip', '', " + JSON.stringify(I18N.get(MODULE_NAME + '_distance_text').replace("$[1]", distance)) + ", event);");
					imgSauvetage.attr("onomuseout", "js.HordeTip.hide(event);");

					if(distance > 2) {
						imgSauvetage.attr("src", NOKGIF);
						imgSauvetage.attr("alt", I18N.get(MODULE_NAME + '_nok_save'));

					} else {
						imgSauvetage.attr("src", OKGIF);
						imgSauvetage.attr("alt", I18N.get(MODULE_NAME + '_ok_save'));
					}

					if($("#infosSaving" + i).length === 0){
						$(row.children[4].children[0]).append("&nbsp;");
						$(row.children[4].children[0]).append(imgSauvetage);
					}
				}
			});
		}
	}

	/**
	 * Add icon to quickly see if a citizen escorted has the good escort options
	 */
	function enhance_outside_interface(){

		JS.wait_for_selector('div.who table', function(el) {
			if(D2N.is_outside_at_doors()){
				$(el).css("width", "350px");
			}
			var citizensRows = el.querySelectorAll("tr");
			
			// We go 2 by 2 because between each citizen row, there is a useless hidden row...
			for(var i = 1 ; i < citizensRows.length ; i += 2){
				var citizenRow = citizensRows[i];
				var actions = citizenRow.children[2];

				// If there is no actions possibles, it may be possible that the row is the player himself
				if(actions === undefined || actions === null || actions.innerHTML.trim() === "&nbsp;") {
					continue;
				}

				var escortInfosBtn = actions.querySelector('a img[src^="/gfx/icons/small_more.gif"]');

				var imgEscort = document.createElement("img");
				imgEscort.setAttribute("id", "infoEscort" + i);

				// We cannot know if the good escort options are set
				if(escortInfosBtn === null){
					continue;
				}

				var escortRow = citizensRows[i+1];

				// We move the "Stop escort" button
				var stopEscort = escortRow.querySelector("a[href^='#user/stopEscort']");
				stopEscort.setAttribute("class", "uact");
				$(stopEscort).insertBefore($(escortInfosBtn.parentNode.parentNode));
				$('<span>').html("&nbsp;").insertBefore($(escortInfosBtn.parentNode.parentNode));

				// We move the "Search Ground" button
				var searchGround = escortRow.querySelector("a[href^='#outside/remoteSearchGround']");
				searchGround.setAttribute("class", "uact");
				$(searchGround).insertBefore($(escortInfosBtn.parentNode.parentNode));
				$('<span>').html("&nbsp;").insertBefore($(escortInfosBtn.parentNode.parentNode));
				
				// If the citizen is already searching the ground, we disable the "search" button (as it is useless)
				var searching = citizenRow.children[1].querySelector("img[src='http://data.hordes.fr/gfx/icons/small_gather.gif']");
				if(searching !== null && searching !== undefined){
					searchGround.setAttribute("class", "uact uactOff off");
					searchGround.setAttribute("href", "#");
					searchGround.setAttribute("onclick", "return false;");
					searchGround.setAttribute("onmouseover", searching.getAttribute("onmouseover"));
				}


				// We get the escort infos
				var escortInfos = escortRow.querySelectorAll("div.extraInfos p");

				if(escortInfos.length > 0){
					imgEscort.setAttribute("src", NOKGIF);
					imgEscort.setAttribute("alt", I18N.get(MODULE_NAME + '_nok_escort'));
					var infos = "<p style='color: red;'>";
					for(var j = 0 ; j < escortInfos.length ; j += 1){
						infos += escortInfos[j].innerText + "<br />";
					}
					infos += "</p>";

					imgEscort.setAttribute("onmouseover", "js.HordeTip.showSpecialTip(this, 'helpTip', '', " + JSON.stringify(infos) + ", event);");
				} else {
					imgEscort.setAttribute("src", OKGIF);
					imgEscort.setAttribute("alt", I18N.get(MODULE_NAME + '_ok_escort'));
					imgEscort.setAttribute("onmouseover", "js.HordeTip.showSpecialTip(this, 'helpTip', '', " + JSON.stringify(I18N.get(MODULE_NAME + '_ok_escort')) + ", event);");
				}
				imgEscort.setAttribute("onmouseout", "js.HordeTip.hide(event);");

				if(document.getElementById("infoEscort" + i) !== null) {
					$("#infoEscort" + i).remove();
				}

				actions.appendChild(imgEscort);

				i += 1; // to skip the "more" row
			}
		});

		JS.wait_for_selector('#campInfos div.actions', function(el) {
			var actions = el.children;
			for(var i = 0 ; i <= actions.length ; i += 1){
				$(actions[i]).css("width", "auto");
			}
		});
	}

	/**
	 * Make the citizen's table wider
	 */
	function enhance_doors_interface(){
		JS.wait_for_selector("div.who", function(node){
			$(node).css("width", "300px");
		});
	}

	/**
	 * Make the building table better
	 */
	function enhancement_buildings_interface(){
		JS.wait_for_selector("table.table", function(node){
			JS.injectCSS(".bvote table tr td.reco { background-color: #ff0; color: black;} .bvote table tr.reco a.button {outline: 2px solid #ff0;}");
		});

		JS.wait_for_selector(".bvote div.reco", function(node){
			JS.injectCSS(".bvote div.reco { cursor: pointer; }");
			$(node).click(function(){
				var obj = $(".bvote table tr td.reco"); // Objet cible
				var speed = 750; // Durée de l'animation (en ms)
				$('html, body').animate( { scrollTop: $(obj).offset().top - $(window).height() / 2 }, speed ); // Go
				return false;
			});
		});
	}

	/**
	 * Make the bank display compatible with >999 items stacked
	 */
	function enhancement_bank_interface(){
		JS.wait_for_selector('ul.tools.stocks.cityInv', function(node){
			JS.injectCSS(
				"ul.stocks li.multi," +
				"ul.stocks li.multi a {" +
					"width: 42px;" +
				"}" +
				"ul.stocks li.multi img {"+
					"margin-right: -1px;" +
				"}" +
				"ul.stocks li {" +
					"margin-right: 0;" +
				"}");
		});
	}

	/**
	 * Make some general design better
	 */
	function enhance_general_interface(){
		JS.wait_for_selector("#serverTime", function(node){
			var currentHour = +node.innerText.split(":")[0];
			var currentMinutes = +node.innerText.split(":")[1];

			var startNight = 19;
			var endNight = 7;
			if(D2N.is_on_die2nite) {
				startNight = 18;
				endNight = 6;
			} else if(D2N.is_on_zombinoia) {
				startNight = 20;
				endNight = 8;
			}

			// From 19:00 to 07:00, it's the night
			if(currentHour >= startNight || currentHour < endNight ){
				// Use the default background (mono-chromatic)
				JS.injectCSS(".bigBg2 { background-image: url(http://data.hordes.fr/gfx/design/bg_big2.jpg); }");
			} else {
				// Use the login background (full of colors)
				JS.injectCSS(".bigBg2 { background-image: url(http://data.hordes.fr/gfx/design/bg_big.jpg); }");
			}
		});

		// Change the classic notification to a less intrusive one
		JS.wait_for_selector("#notificationText", function(node){
			var text = node.innerHTML;

			if(!document.getElementById("discreteNotif")) {
				var dom = JS.jsonToDOM(["div", {"id": "discreteNotif"}, text], document);

				JS.wait_for_selector("#body", function(node){
					node.appendChild(dom);
				});
			} else {
				$("#discreteNotif").html(text);
			}

			if($("#notification").hasClass("showNotif")) {
				$("#discreteNotif").css("height", "");
				$("#discreteNotif").css("opacity", "1");
				$("#discreteNotif").css("padding-top", "10px");
				$("#discreteNotif").css("padding-bottom", "10px");
				clearTimeout(timer);

				var timeout = node.innerText.length * 50;

				if (timeout < 2000)
					timeout = 2000;

				timer = setTimeout(function(){
					$("#discreteNotif").css("height", "0");
					$("#discreteNotif").css("opacity", "0");
					$("#discreteNotif").css("padding-top", "0");
					$("#discreteNotif").css("padding-bottom", "0");
				}, timeout);
			} else {
				$("#discreteNotif").css("height", "0");
				$("#discreteNotif").css("opacity", "0");
				$("#discreteNotif").css("padding-top", "0");
				$("#discreteNotif").css("padding-bottom", "0");
			}

			$('#body').removeClass('hideSwf'); 
			$('#notification').removeClass();

		});
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
				category: Module.PROPERTY_CATEGORY.GENERAL,
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
					if (D2N.is_on_page_in_city('citizens')) {
						enhance_citizen_interface();
					}

					if (D2N.is_outside()){
						enhance_outside_interface();
					}

					if (D2N.is_outside_at_doors()){
						enhance_doors_interface();
					}

					if(D2N.is_on_page_in_city('buildings')) {
						enhancement_buildings_interface();
					}

					if(D2N.is_on_page_in_city('bank')) {
						enhancement_bank_interface();
					}

					enhance_general_interface();
				}, false);

				JS.injectCSS(
					".bigBg2 {" +
						"background-attachment: fixed;" + 
					"}" +
					".newFooter {" +
						"background-position: -1px 0;" + 
					"}" +
					"#discreteNotif {" +
						"position: fixed;" +
						"top: " + $("#tid_bar").height() + "px;" +
						"z-index: 99;" +
						"overflow: hidden;" +
						"background-color: #5c2b20;" +
						"width: 100%;" +
						"opacity: 0;" +
						"padding-left: 10px;" +
						"padding-right: 10px;" +
						"transition: all 0.5s ease;" +
						"outline: 1px solid black;" +
						"border: 1px solid #ad8051;" +
					"}"
				);

				if($("#tid_bar_down").parents(".bigBg2").length === 0) {
					$("#tid_bar_down").appendTo(".bigBg2");
				}
			}
		}
	};
});
