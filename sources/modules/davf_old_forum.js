Module.register(function() {

    var MODULE_NAME = 'davf_old_forum';

    /******************
     * Module context *
     ******************/

    /**
     * Add the i18n strings for this module.
     */
    function add_i18n()
    {
        var i18n = {};

        i18n[I18N.LANG.EN] = {};
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Old forum menu design (by Davf)';
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'More information here [fr]: http://userstyles.org/styles/97652/hordes-forum-ancien. Script by Davf, integrated with his permission.';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Hordes Forum Ancien (par Davf)';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Plus d\'information ici : http://userstyles.org/styles/97652/hordes-forum-ancien. Script par Davf, intégré avec sa permission.';

        I18N.set(i18n);
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
                category: Module.PROPERTY_CATEGORY.FORUM,
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
                JS.injectCSS(
                    // From: http://userstyles.org/styles/97652/hordes-forum-ancien
                    // Credit: Davf, thanks to him for giving his permission to use his CSS
                    // Integrated on: Mar 18, 2014
                    '#tid_forum .tid_forumThread .tid_actionBar .tid_pages {' +
                        'width: 248px !important;' +
                    '}' +
                    '#tid_forum .tid_actionBar .tid_buttonBar {' +
                        'margin: 0px !important;' +
                        'margin-left: 1px !important;' +
                        'margin-top: -2px !important;' +
                    '}' +
                    '.tid_actionBar.tid_bg4 {' +
                        'background-color: #965c36 !important;' +
                    '}' +
                    '.tid_cur.tid_tip.tid_parsed {' +
                        'background-color: transparent !important;' +
                        'background-image: url("http://data.hordes.fr/gfx/design/button.gif") !important;' +
                        'border: 1px solid #98341c !important;' +
                        'border-bottom: 1px solid black !important;' +
                        'margin-top: auto !important;' +
                        'color: #f0d79e !important;' +
                    '}' +
                    '.tid_cur.tid_tip.tid_parsed:hover {' +
                        'border: 1px solid #98341c !important;' +
                        'border-top: 2px solid black !important;' +
                        'border-bottom: 0px solid #98341c !important; ' +
                        'outline: 1px solid #f0d79e !important;' +
                        'color: white !important;' +
                    '}' +
                    '.tid_buttonBar a {' +
                        'background-image: url("http://data.hordes.fr/gfx/design/button.gif") !important;' +
                        'border: 1px solid #98341c !important;' +
                        'border-bottom: 1px solid black !important;' +
                        'margin-right: 1px !important;' +
                        'color: #f0d79e !important;' +
                    '}' +
                    '' +
                    '.tid_buttonBar a:hover {' +
                        'opacity: 0.99 !important;' +
                        'border: 1px solid #98341c !important;' +
                        'border-top: 2px solid black !important;' +
                        'border-bottom: 0px solid #98341c !important; ' +
                        'outline: 1px solid #f0d79e !important;' +
                        'color: white !important;' +
                    '}' +
                    '.tid_buttonBar .tid_off:hover {' +
                        'border: 1px solid #7c5a50 !important;' +
                        'opacity: 1 !important;' +
                        'outline: 1px solid #421d15 !important;' +
                        'color: #dddbd8 !important;' +
                    '}' +
                    '.tid_buttonBar .tid_off {' +
                        'background-image: url("http://data.hordes.fr/gfx/design/button_off.gif") !important;' +
                        'border: 1px solid #7c5a50 !important;' +
                        'opacity: 1 !important;' +
                        'outline: 1px solid #421d15 !important;' +
                        'color: #dddbd8 !important;' +
                    '}' +
                    '.tid_buttonBar a.tid_off img {' +
                        'opacity: 0.3 !important;      ' +
                    '}' +
                    '.tid_postForm button {' +
                        'background-color: transparent !important;' +
                        'margin-top: 4px !important;' +
                        'background-image: url("http://data.hordes.fr/gfx/design/button.gif") !important;' +
                        'border: 1px solid #98341c !important;' +
                        'outline: 1px solid black !important;' +
                        'color: #f0d79e !important;' +
                        '-moz-box-shadow : none !important;' +
                        '-webkit-box-shadow : none !important;' +
                        'box-shadow : none !important;' +
                    '}' +
                    '.tid_postForm button:hover {' +
                        'opacity: 0.99 !important;' +
                        'border: 1px solid #98341c !important;' +
                        'border-top: 2px solid #98341c !important;' +
                        'border-bottom: 0px solid #98341c !important;  ' +
                        'outline: 1px solid #f0d79e !important;' +
                        'color: white !important;' +
                        'padding: 2px 20px !important;' +
                        '-moz-box-shadow : none !important;' +
                        '-webkit-box-shadow : none !important;' +
                        'box-shadow : none !important;' +
                    '}' +
                    '#tid_forum .tid_mainBar .tid_actionBar {' +
                        'opacity: 1;' +
                    '}'
                );
            }
        }

    };
});
