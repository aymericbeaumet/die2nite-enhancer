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

            var extract_username = function(next) {
                JS.wait_for_selector('div.tid_userName > span:last-child', function(node) {
                    ret.username = node.textContent;
                    next();
                });
            };

            var extract_icon = function(next) {
                JS.wait_for_selector('img.tid_avatarImg', function(node) {
                    ret.icon = node.src;
                    next();
                });
            };

            var extract_title = function(next) {
                JS.wait_for_selector('span.tid_userTitle', function(node) {
                    ret.title = node.textContent.trim();
                    next();
                });
            };

            var extract_profile_likes = function(next) {
                JS.wait_for_selector('span.tid_likeButtonCompact', function(node) {
                    ret.profileLikes = parseInt(node.textContent);
                    if (typeof ret.profileLikes !== 'number' || isNaN(ret.profileLikes)) {
                        ret.profileLikes = 0;
                    }
                    next();
                });
            };

            var extract_avatar_url = function(next) {
                JS.wait_for_selector('img.tid_avatarImg', function(node) {
                    ret.avatarURL = node.src;
                    next();
                });
            };

            var extract_sex = function(next) {
                JS.wait_for_selector('div.tid_age > img:first-child', function(node) {
                    var m = node.src.match(/\/([a-z]+)\.png$/);
                    switch (m) {
                        case 'male':
                            ret.sex = 'male'; break;
                        case 'female':
                            ret.sex = 'female'; break;
                    }
                    next();
                });
            };

            var extract_age = function(next) {
                JS.wait_for_selector('div.tid_age', function(node) {
                    ret.age = parseInt(node.textContent);
                    if (typeof ret.age !== 'number' || isNaN(ret.age)) {
                        delete ret.age;
                    }
                    next();
                });
            };

            var extract_city = function(next) {
                JS.wait_for_selector('div.tid_city', function(node) {
                    ret.city = node.textContent.trim();
                    if (ret.city === '--') {
                        delete ret.city;
                    }
                    next();
                });
            };

            var extract_country = function(next) {
                JS.wait_for_selector('div.tid_country', function(node) {
                    ret.country = node.textContent.trim();
                    if (ret.country === '--') {
                        delete ret.country;
                    }
                    next();
                });
            };

            var extract_description = function(next) {
                JS.wait_for_selector('div.tid_userStatus div.tid_content p', function(node) {
                    ret.descriptionHTML = node.innerHTML;
                    next();
                }, 1, next);
            };

            var extract_soul_score = function(next) {
                JS.wait_for_selector('div.score > strong', function(node) {
                    ret.soulScore = parseInt(node.textContent);
                    next();
                });
            };

            ret.D2NEVersion = '<%= version %>';
            ret.rootURL = window.location.host;
            ret.id = parseInt(citizen_id);

            extract_username(function() {
                extract_icon(function() {
                    extract_title(function() {
                        extract_profile_likes(function() {
                            extract_avatar_url(function() {
                                extract_sex(function() {
                                    extract_age(function() {
                                        extract_city(function() {
                                            extract_country(function() {
                                                extract_description(function() {
                                                    extract_soul_score(function() {
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
                    console.log('PUSH');
                    console.log(citizen_info);
                    ret.push(citizen_info);
                    handler(i + 1);
                });
            };

            // TODO: reset to 0
            handler(0);
            //handler(9);
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

                console.log(citizens_info);
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
