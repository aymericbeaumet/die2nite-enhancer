Module.register(function() {

    var MODULE_NAME = 'davf_old_forum_tags';

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
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Old forum tags (by Davf)';
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'More information here [fr]: http://userstyles.org/styles/97674/hordes-balises-ancienne. Script by Davf, integrated with his permission. Click to open link.';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Hordes Balises Anciennes (par Davf)';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Plus d\'information ici : http://userstyles.org/styles/97674/hordes-balises-ancienne. Script par Davf, intégré avec sa permission. . Cliquez pour ouvrir le lien.';

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
                full_desc_I18N: MODULE_NAME + '_full_desc',
                url: "http://userstyles.org/styles/97674/hordes-balises-ancienne"
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
                    // From: http://userstyles.org/styles/97674/hordes-balises-ancienne
                    // Credit: Davf, thanks to him for giving his permission to use his CSS
                    // Integrated on: Mar 18, 2014
                    '.tid_editorContent .tid_spoil {' +
                        'cursor: help !important;' +
                        'background-image: url("http://data.hordes.fr/gfx/design/spoiler.gif") !important;' +
                        'display: block !important;' +
                        'background-repeat: no-repeat !important;' +
                        'background-color: #4c5536 !important;' +
                        'background-position: 4px 1px !important;' +
                        'color: #4d5537 !important;' +
                    '}' +
                    '.tid_editorContent .tid_spoil .tid_wspoil:first-child {' +
                        'padding-left: 60px !important;' +
                    '}' +
                    '.tid_editorContent .tid_spoil:hover {' +
                        'visibility: visible !important;' +
                        'background-image: url("http://data.hordes.fr/gfx/design/spoiler.gif") !important;' +
                        'background-color:transparent !important;' +
                        'color : #98a675 !important;' +
                    '}' +
                    '.tid_editorContent cite {' +
                        'color: #ddab76 !important;' +
                        'border-left: 1px dashed #ddab76 !important;' +
                        'border-bottom: 1px dashed #ddab76 !important;' +
                        'opacity: 0.9 !important;' +
                    '}  ' +
                    '.tid_containerWrapper .tid_editorContent .tid_roleplay .tid_wroleplay a {' +
                        'text-decoration: underline !important;' +
                        'color: #ddab76 !important;' +
                    '}' +
                    '#tid_forum .tid_threadNotice.tid_announce {' +
                        'background-image: url("http://data.hordes.fr/gfx/icons/small_help.gif") !important;' +
                        'background-color: #773939 !important;' +
                        'border: 1px solid #ddab76 !important;' +
                        'outline: 2px solid #5c2b20 !important;' +
                        'color: #f86 !important;' +
                        'border-radius: 0px !important;' +
                        '-moz-border-radius: 0px !important;' +
                        '-webkit-border-radius: 0px !important;' +
                        '-moz-box-shadow: none !important;' +
                        '-webkit-box-shadow: none !important;' +
                        'box-shadow: none !important;' +
                    '}' +
                    '#tid_forum .tid_threadNotice.tid_announce .tid_list {' +
                        'border-top: 1px dashed #f86 !important;' +
                        'padding: 4px 0px !important;' +
                        'margin: 4px 0px !important;' +
                    '}' +
                    '' +
                    '#tid_forum .tid_threadNotice.tid_niceLock {' +
                        'background-image: url("http://data.hordes.fr/gfx/icons/small_nice_lock.gif") !important;' +
                        'background-color: #5C0000 !important;' +
                        'border: 1px solid #ddab76 !important;' +
                        'outline: 2px solid #5c2b20 !important;' +
                        'border-radius: 0px !important;' +
                        '-moz-border-radius: 0px !important;' +
                        '-webkit-border-radius: 0px !important;' +
                        '-moz-box-shadow: none !important;' +
                        '-webkit-box-shadow: none !important;' +
                        'box-shadow: none !important;' +
                    '}' +
                    '#tid_forum .tid_threadNotice.tid_lock {' +
                        'background-color: #5C0000 !important;' +
                        'border: 1px solid #ddab76 !important;' +
                        'outline: 2px solid #5c2b20 !important;' +
                        'border-radius: 0px !important;' +
                        '-moz-border-radius: 0px !important;' +
                        '-webkit-border-radius: 0px !important;' +
                        '-moz-box-shadow: none !important;' +
                        '-webkit-box-shadow: none !important;' +
                        'box-shadow: none !important;' +
                    '}' +
                    '' +
                    '.tid_roleplay {' +
                        'background-color: #79432b !important;' +
                        'color: #ddab76 !important;' +
                        'border: 0px solid transparent !important;' +
                        'background-image: url("http://data.hordes.fr/gfx/icons/small_rp.gif") !important;' +
                        'background-repeat: no-repeat !important;' +
                        'background-position: 4px 3px !important;' +
                        'max-width: none !important;' +
                        'padding-left: 24px !important;' +
                        'margin-bottom: 0px !important;' +
                        '-moz-box-shadow: 0px 0px 2px #79432b !important;' +
                        '-webkit-box-shadow: 0px 0px 2px #79432b !important;' +
                        'box-shadow: 0px 0px 2px #79432b !important;' +
                    '}' +
                    '.tid_wroleplay {' +
                        'background-image: none !important;' +
                        'display: inline-block !important;' +
                    '}' +
                    '.tid_wroleplay .tid_roleplay {' +
                        'background: none !important;' +
                        'padding: 0px !important;' +
                        'margin: 0px !important;' +
                    '}' +
                    '' +
                    '.tid_containerWrapper .tid_editorContent .tid_roleplay .tid_wroleplay em {' +
                        'color: #f0d79e !important;' +
                        'opacity: 1 !important;' +
                    '}' +
                    '.tid_containerWrapper .tid_editorContent .tid_roleplay .tid_wroleplay strong {' +
                        'color: #afb3cf !important;' +
                        'opacity: 1 !important;' +
                    '}' +
                    '.tid_containerWrapper .tid_editorContent .tid_roleplay .tid_wroleplay em em{' +
                        'color: #f0d79e !important;' +
                        'opacity: 0.7 !important;' +
                    '}' +
                    '.tid_containerWrapper .tid_editorContent .tid_roleplay .tid_wroleplay strong strong{' +
                        'color: #afb3cf !important;' +
                        'opacity: 0.8 !important;' +
                    '}' +
                    '.tid_containerWrapper .tid_editorContent .tid_roleplay .tid_wroleplay em em em{' +
                        'color: #f0d79e !important;' +
                        'opacity: 0.7 !important;' +
                    '}' +
                    '.tid_containerWrapper .tid_editorContent .tid_roleplay .tid_wroleplay strong strong strong{' +
                        'color: #afb3cf !important;' +
                        'opacity: 0.8 !important;' +
                    '}'
                );
            }
        }

    };
});
