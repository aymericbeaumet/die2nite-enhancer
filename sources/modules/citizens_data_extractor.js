Module.register(function() {

    var MODULE_NAME = 'citizen_data_extractor';

    /******************
     * Module context *
     ******************/

    var EXTRACT_CITIZENS_DATA_BUTTON_ID = 'd2ne_extract_citizen_data';

    /**
     * Add the i18n strings for this module.
     */
    function add_i18n()
    {
        var i18n = {};

        i18n[I18N.LANG.EN] = {};
        i18n[I18N.LANG.EN][MODULE_NAME + '_activation_button'] = 'Extract citizens data';
        i18n[I18N.LANG.EN][MODULE_NAME + '_warning'] = 'This could take some time, please do not stop the process. Do you want to continue?';
        i18n[I18N.LANG.EN][MODULE_NAME + '_result_prompt'] = 'You can copy/paste the results:';
        i18n[I18N.LANG.EN][MODULE_NAME + '_result_prompt'] = 'Below are the data of the town citizens:';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_activation_button'] = 'Extraire les données des citoyens';
        i18n[I18N.LANG.FR][MODULE_NAME + '_warning'] = 'Cette opération peut prendre quelques temps, merci de ne pas interrompre le processus. Voulez-vous continuer ?';
        i18n[I18N.LANG.FR][MODULE_NAME + '_result_prompt'] = 'Voici les données des citoyens en ville :';

        I18N.set(i18n);
    }

    function extract_citizen_info(citizen_id, session_key, on_finish)
    {
        var ret = {};

        var listener = function() {
            document.removeEventListener('d2n_gamebody_reload', listener);

            ret.rootURL = window.location.host;
            ret.id = citizen_id;

            console.log('1');
            // Extract username
            JS.wait_for_selector('div.tid_userName > span:last-child', function(node) {
                ret.username = node.textContent;

                console.log('2');
                // Extract icon
                JS.wait_for_selector('span.tid_userTitle > img', function(node) {
                    ret.icon = node.src;

                    console.log('3');
                    // Extract title
                    JS.wait_for_selector('span.tid_userTitle', function(node) {
                        ret.title = node.textContent.trim();

                        console.log('4');
                        // Extract like
                        JS.wait_for_selector('span.tid_likeButtonCompact', function(node) {
                            ret.profileLikes = parseInt(node.textContent);

                            console.log('5');
                            // Extract avatar
                            JS.wait_for_selector('img.tid_avatarImg', function(node) {
                                ret.avatarURL = node.src;

                                console.log('6');
                                // Extract sex
                                JS.wait_for_selector('div.tid_age > img:first-child', function(node) {
                                    ret.sex = (node.src.match(/\/male.png$/) !== null) ? 'male' : 'female';

                                    console.log('7');
                                    // Extract age
                                    JS.wait_for_selector('div.tid_age', function(node) {
                                        ret.age = parseInt(node.textContent);

                                        console.log('8');
                                        // Extract city
                                        JS.wait_for_selector('div.tid_city', function(node) {
                                            ret.city = node.textContent.trim();

                                            console.log('9');
                                            // Extract country
                                            JS.wait_for_selector('div.tid_country', function(node) {
                                                ret.country = node.textContent.trim();

                                                console.log('10');
                                                // Extract description
                                                JS.wait_for_selector('div.tid_userStatus div.tid_content p', function(node) {
                                                    ret.descriptionHTML = node.innerHTML;

                                                    console.log('11');
                                                    // Extract soul score
                                                    JS.wait_for_selector('div.score > strong', function(node) {
                                                        ret.soulScore = parseInt(node.textContent);

                                                        console.log('12');
                                                        // done extracting data for this user
                                                        on_finish(ret);
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });

                });
            });
        };
        document.addEventListener('d2n_gamebody_reload', listener, false);

        JS.redirect('/#ghost/city?go=ghost/user?uid=' + citizen_id + ';sk=' + session_key);
    }

    function extract_citizens_info(citizens_id, onFinish)
    {
        var ret = [];
        var max = citizens_id.length;
        // TODO: remove
        //max = 1;

        D2N.get_session_key(function(sk) {

            var handler = function(i) {
                if (i >= max) {
                    return onFinish(ret);
                }

                console.log('CURRENT CITIZEN: ' + i);
                extract_citizen_info(citizens_id[i], sk, function(citizen_info) {
                    ret.push(citizen_info);
                    handler(i + 1);
                });
            };

            handler(0);
        });
    }

    function extract_citizens_id()
    {
        var citizens_link = document.querySelectorAll('a.tid_user[href^="/#ghost/city?go=ghost/user?uid="]');
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

    function on_button_click()
    {
        if (confirm(I18N.get(MODULE_NAME + '_warning')) === false) {
            return;
        }

        var citizens_id = extract_citizens_id();
        extract_citizens_info(citizens_id, function(citizens_info) {

            var after_getting_back_to_citizens_list = function() {
                document.removeEventListener('d2n_gamebody_reload', after_getting_back_to_citizens_list, false);

                prompt(I18N.get(MODULE_NAME + '_result_prompt'), JSON.stringify(citizens_info));
            };
            document.addEventListener('d2n_gamebody_reload', after_getting_back_to_citizens_list, false);

            D2N.go_to_city_page('citizens');
        });
    }

    function get_button()
    {
        return JS.jsonToDOM(["a", { id: EXTRACT_CITIZENS_DATA_BUTTON_ID, class: "button",
                                    onclick: on_button_click },
            ["img", { "src": "/gfx/icons/item_book_gen_letter.gif" }],
            ' ' + I18N.get(MODULE_NAME + '_activation_button')
        ], document);
    }

    function inject_button()
    {
        // Add notifier
        JS.wait_for_selector('div.citizens', function(el) {
            el.appendChild(get_button());
        });
    }


    /************************
     * Module configuration *
     ************************/

    return {

        name: MODULE_NAME,
        type: Module.TYPE.INTERFACE_ENHANCEMENT,

        properties: {
            enabled: true
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
                    if (!D2N.is_on_page_in_city('citizens')) {
                        return;
                    }

                    if (JS.is_defined(document.getElementById(EXTRACT_CITIZENS_DATA_BUTTON_ID))) {
                        return;
                    }

                    inject_button();
                }, false);
            }
        }

    };
});
