Module.register(function() {

    var MODULE_NAME = 'sync_hll';

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
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Affiche les informations Hordes La Loi d\'un citoyen';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Permet d\'afficher les recommandations et plaintes d\'un citoyen sur le site externe Hordes La Loi.';
        i18n[I18N.LANG.FR][MODULE_NAME + '_column_head'] = 'HLL';
        i18n[I18N.LANG.FR][MODULE_NAME + '_unknown'] = 'Inconnue';

        I18N.set(i18n);
    }

    function add_citizens_note(response){
        // Parsing XML answer
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(response, "text/xml");
        var citizens = xmlDoc.getElementsByTagName("citizen");

        // Adding header
        var tableCitizens = document.querySelectorAll("#generic_section table tr");
        var head = document.createElement("th");
        head.innerHTML = I18N.get(MODULE_NAME + '_column_head');
        tableCitizens[0].appendChild(head);

        // Adding HLL vote
        for(var i = 0 ; i < citizens.length ; i++){
            var percent = citizens[i].getAttribute("percent");
            var id = citizens[i].getAttribute("id");

            var red = 255;
            var green = 255;
            var blue = 0;

            if(isNaN(percent)){
                percent = I18N.get(MODULE_NAME + '_unknown');
                red = 128;
                green = 128;
                blue = 128;
            } else {
                percent = (+percent);
                if(percent > 0){
                    red = (100 - percent) / 100 * 255;
                    green = (percent / 100) * 255;
                } else if (percent < 0) {
                    red = (-percent / 100) * 255;
                    green = (100  + percent) / 100 * 255;
                } else {
                    red = 255;
                    green = 255;
                }
            }

            var details    = "<div>";
            
            var councils   = citizens[i].getElementsByTagName("councils")[0];
            var councilsNb = councils.getAttribute("nb");
            
            var complaints = citizens[i].getElementsByTagName("complaints")[0];
            var complaintsNb = complaints.getAttribute("nb");

            details    += "<div style='color: limegreen;'>Conseils : " + councilsNb + "</div>";
            var lstCouncils = councils.childNodes;
            var j = 0;
            if(lstCouncils.length > 0){
                details += "<ul>";
                for(j = 0 ; j < lstCouncils.length ; j++){

                    details += "<li>" + lstCouncils[j].getAttribute("lib") + " (" +  lstCouncils[j].childNodes.length + ")</li>";
                }
                details += "</ul>";
            }
            details    += "<div style='color: red;'>Plaintes : " + complaintsNb + "</div>";
            var lstComplaints = complaints.childNodes;
            if(lstComplaints.length > 0){
                details += "<ul>";
                for(j = 0 ; j < lstComplaints.length ; j++){

                    details += "<li>" + lstComplaints[j].getAttribute("lib") + " (" +  lstComplaints[j].childNodes.length + ")</li>";
                }
                details += "</ul>";
            }
            details    += "</div>";
            var info = document.createElement("td");
            info.setAttribute("data-id", id);
            info.setAttribute("style", "color: rgb(" + red + "," + green + "," + blue + ");");
            info.setAttribute("onmouseover", "js.HordeTip.showSpecialTip(this, 'helpTip', '', " + JSON.stringify(details) + ", event);");
            info.setAttribute("onmouseout", "js.HordeTip.hide(event);");
            info.innerHTML = "<a href='https://hordes-la-loi.fr/users/" + id + "/' target='_blank' style='color: rgb(" + red + "," + green + "," + blue + ");'>" + percent + "</a>";
            tableCitizens[i+1].appendChild(info);
        }
    }


    function network_failure(){

    }

    function extract_citizens_id(selector)
    {
        var citizens_link = document.querySelectorAll(selector);
        var ret = [];
        var regex = /uid=(\d+)/;
        var regex_results;

        for (var i = 0, max = citizens_link.length; i < max; i++) {
            regex_results = regex.exec(citizens_link[i].href);
            if (regex_results.length > 1) {
                ret.push(regex_results[1]);
            }
        }

        return ret;
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
                category: Module.PROPERTY_CATEGORY.CITIZENS,
                type: Module.PROPERTY.BOOLEAN,
                short_desc_I18N: MODULE_NAME + '_short_desc',
                full_desc_I18N: MODULE_NAME + '_full_desc'
            }
        },

        actions: {
            can_run: function() {
                return D2N.is_on_hordes();
            },

            init: function() {
                add_i18n();
            },

            load: function() {
                document.addEventListener('d2n_gamebody_reload', function() {
                    if (!D2N.is_on_page_in_city('citizens')) {
                        return;
                    }

                    JS.wait_for_selector('div.citizens', function(el) {
                        var citizens = extract_citizens_id('a.tid_user[href^="/#ghost/city?go=ghost/user?uid="]');

                        JS.network_request(
                            "GET",
                            "https://hordes-la-loi.fr/xml/users/search.xml:" + citizens.join(','),
                            null,
                            null,
                            add_citizens_note,
                            network_failure
                        );
                    });
                }, false);
            }
        }

    };
});
