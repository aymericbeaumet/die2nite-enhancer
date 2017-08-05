Module.register(function() {

    var MODULE_NAME = 'gui_enhancement';
    var OKGIF = browser.extension.getURL("images/ok.png");
    var NOKGIF = browser.extension.getURL("images/nok.png");
    var CAUTIONGIF = browser.extension.getURL("images/caution.png");

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
        i18n[I18N.LANG.FR][MODULE_NAME + '_ok_escort'] = 'Escorte activée.';
        i18n[I18N.LANG.FR][MODULE_NAME + '_nok_escort'] = 'Escorte désactivée.';
        i18n[I18N.LANG.FR][MODULE_NAME + '_distance_text'] = 'Le citoyen est à $[1] km.';

        i18n[I18N.LANG.EN] = {};
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'GUI enhancement';
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Add some graphical enhancements to the general UI of Die2Nite.';
        i18n[I18N.LANG.EN][MODULE_NAME + '_ok_save'] = 'Can be saved.';
        i18n[I18N.LANG.EN][MODULE_NAME + '_nok_save'] = 'Cannot be saved.';
        i18n[I18N.LANG.EN][MODULE_NAME + '_ok_escort'] = 'Escort options enabled.';
        i18n[I18N.LANG.EN][MODULE_NAME + '_nok_escort'] = 'Escort options disabled.';
        i18n[I18N.LANG.EN][MODULE_NAME + '_distance_text'] = 'The citizen is $[1] km away.';

        I18N.set(i18n);
    }

    /**
     * Add icon if citizen is outside and beyong reach (for the hero action "Rescue")
     */
    function enhance_citizen_interface(){
    	JS.wait_for_selector('div.citizens table', function(el) {
    		var citizensRows = el.querySelectorAll("tr");
    		for(var i = 1 ; i < citizensRows.length ; i++){
    			var row = citizensRows[i];
    			// No coordinates columns (dead citizen)
    			if(row.children[4] === undefined) continue;
    			
    			// Get the citizen's location, and if it's "--", then he is in town
    			var location = row.children[4].innerText;
    			if(location.trim() === "--") continue;

				// Here, the citizen is outside
				// It's time to see if he is farther than 11km (for the Rescue)
				/* jshint ignore:start */
				var coordinates = eval(location);
				/* jshint ignore:end */
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

                if(distance > 11) {
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

    /**
     * Add icon to quickly see if a citizen escorted has the good escort options
     */
    function enhance_outside_interface(){
    	JS.wait_for_selector('div.who table', function(el) {
    		var citizensRows = el.querySelectorAll("tr");
    		
    		// We go 2 by 2 because between each citizen row, there is a useless hidden row...
    		for(var i = 1 ; i < citizensRows.length ; i += 2){
    			var citizenRow = citizensRows[i];
    			var actions = citizenRow.children[2];

    			// If there is no actions possibles, it may be possible that the row is the player himself
    			if(actions === undefined || actions === null || actions.innerHTML.trim() === "&nbsp;") continue;

    			var escortInfosBtn = actions.querySelector('a img[src^="/gfx/icons/small_more.gif"]');

    			var imgEscort = document.createElement("img");
    			imgEscort.setAttribute("id", "infoEscort" + i);

                // We cannot know if the good escort options are set
    			if(escortInfosBtn === null)
    				continue;

				var escortRow = citizensRows[i+1];
				var escortInfos = escortRow.querySelectorAll("div.extraInfos p");

                if(escortInfos.length > 0){
    				imgEscort.setAttribute("src", NOKGIF);
					imgEscort.setAttribute("alt", I18N.get(MODULE_NAME + '_nok_escort'));
                    /*imgEscort.setAttribute("onmouseover", "js.HordeTip.showSpecialTip(this, 'helpTip', '', " + JSON.stringify(escortInfos[0].innerText) + ", event);");
                    imgEscort.setAttribute("onomuseout", "js.HordeTip.hide(event);");*/
                } else {
                    imgEscort.setAttribute("src", OKGIF);
                    imgEscort.setAttribute("alt", I18N.get(MODULE_NAME + '_ok_escort'));
                }

    			if(document.getElementById("infoEscort" + i) !== null)
                    $("#infoEscort" + i).remove();

    			actions.appendChild(imgEscort);

                i++; // to skip the "more" row
    		}
    	});
    }

    function getDistance(x1,y1,x2,y2) {
		var a = x1 - x2;
		var b = y1 - y2;

		var c = Math.sqrt(a * a + b * b);
		return Math.round(c);
	}

    /************************
     * Module configuration *
     ************************/

    return {

        name: MODULE_NAME,
        type: Module.TYPE.INTERFACE_ENHANCEMENT,

        properties: {
            enabled: false
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

	                if(D2N.is_outside()){
	                	enhance_outside_interface();
	                }
                }, false);
            }
        }
    };
});
