Module.register(function() {

    var MODULE_NAME = 'konami';

    /******************
     * Module context *
     ******************/

    var KONAMI_CODE = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 13];

    /**
     * Add the i18n strings for this module.
     */
    function add_i18n()
    {
        var i18n = {};

        i18n[I18N.LANG.EN] = {};
        i18n[I18N.LANG.EN][MODULE_NAME + '_enable_features'] = 'Congratulation ! You can enjoy the Die2Nite Enhancer advanced features by validating this popup. However, know that some of them might be unstable, source of issues and/or forbidden by the Motion Twin EULA. Under no circumstances this script developer can be held responsable of the consequences of their use. Also note that you will have to do the Konami code again to disable them.\n\nDo you want to continue?';
        i18n[I18N.LANG.EN][MODULE_NAME + '_disable_features'] = 'Do you want to disable the Die2Nite Enhancer advanced features?';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_enable_features'] = 'Félicitations ! Vous pouvez bénéficier des fonctionalités avancées de Die2Nite Enhancer en validant cette popup. Sachez toutefois que certaines d\'entre elles peuvent être instables, sources de problèmes et/ou interdites par les CGU Motion-Twin. En aucun cas le développeur de ce script ne saurait être tenu pour responsable des conséquences de leur utilisation. Notez également qu\'il faudra ressaisir le code Konami si vous souhaitez les désactiver.\n\nVoulez-vous continuer ?';
        i18n[I18N.LANG.FR][MODULE_NAME + '_disable_features'] = 'Souhaitez-vous désactiver les fonctionnalités avancées de Die2Nite Enhancer ?';

        I18N.set(i18n);
    }

    function on_konami_code()
    {
        var old_restricted_mode = D2NE.is_restricted_mode();

        if (D2NE.is_restricted_mode()) {
            D2NE.set_restricted_mode(!confirm(I18N.get(MODULE_NAME + '_enable_features')));
        } else {
            D2NE.set_restricted_mode(confirm(I18N.get(MODULE_NAME + '_disable_features')));
        }

        // if a change occured, reload the page
        if (old_restricted_mode !== D2NE.is_restricted_mode()) {
            JS.reload();
        }
    }

    var actual_index_ = -1;
    function keyboard_listener(code)
    {
        if (actual_index_ < 0 || actual_index_ >= KONAMI_CODE.length) {
            actual_index_ = 0;
        }

        if (KONAMI_CODE[actual_index_] === code) {
            actual_index_ += 1;

            if (actual_index_ >= KONAMI_CODE.length) {
                on_konami_code();
            }
        } else {
            actual_index_ = -1;
        }
    }

    /************************
     * Module configuration *
     ************************/

    return {

        name: MODULE_NAME,
        type: Module.TYPE.CONTAINER,

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
                document.addEventListener('keydown', function(event) {
                    // Cancel event if the cursor is in an input field or textarea
                    if (event.target.nodeName === 'INPUT' || event.target.nodeName === 'TEXTAREA') {
                        return;
                    }

                    keyboard_listener(event.keyCode);
                }, false);
            }
        }

    };
});
