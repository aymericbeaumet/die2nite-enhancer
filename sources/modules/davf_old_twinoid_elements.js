Module.register(function() {

    var MODULE_NAME = 'davf_old_twinoid_elements';

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
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Old Twinoid elements (by Davf)';
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'More information here [fr]: http://userstyles.org/styles/99207/hordes-elements-twinoidien. Script by Davf, integrated with his permission.';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Hordes Elements Twinoidien (par Davf)';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Plus d\'information ici : http://userstyles.org/styles/99207/hordes-elements-twinoidien. Script par Davf, intégré avec sa permission.';

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
                category: Module.PROPERTY_CATEGORY.CITIZEN,
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
                    // From: http://userstyles.org/styles/99207/hordes-elements-twinoidien
                    // Credit: Davf, thanks to him for giving his permission to use his CSS
                    // Integrated on: Mar 19, 2014
                    '#tid_userMenu > div.tid_content {' +
                        'background-color: #5c2b20 !important;' +
                        'background-image: none !important;' +
                        'border: 1px solid #ddab76 !important;' +
                    '}' +
                    '#tid_userMenu > div.tid_content div.tid_links div.tid_minorLinks a {' +
                        'color: #ddab76 !important;' +
                    '}' +
                    '#tid_userMenu > div.tid_content div.tid_links div.tid_minorLinks a:hover {' +
                        'background-color: #79432b !important;' +
                    '}' +
                    '#tid_userMenu > div.tid_content.tid_modinit div.tid_links div.tid_majorLinks a {' +
                        'background-color: #79432b !important;' +
                        'color: #f0d79e !important;' +
                    '}' +
                    '#tid_userMenu > div.tid_content.tid_modinit div.tid_links div.tid_majorLinks a:hover {' +
                        'background-color: #996739 !important;' +
                        'color: white !important;' +
                    '}' +
                    '#tid_userMenu .tid_rel.tid_isUnknown {' +
                        'background-color: #5C0000 !important;' +
                        'border: 1px solid #ddab76 !important;' +
                        'border-radius: 0px !important;' +
                    '}' +
                    '#tid_userMenu .tid_links .tid_majorLinks span.tid_placeHolder {' +
                        'border: 1px dashed #ddab76 !important;' +
                    '}' +
                    '#tid_userMenu .tid_sep {' +
                        'border-bottom: 1px dashed #f0d79e !important;' +
                    '}' +
                    '#tid_userMenu .tid_baseInfos .tid_asv div{' +
                        'color: #f0d79e !important;' +
                        'text-shadow: none !important;' +
                        'line-height: 12px;' +
                    '}' +
                    '#tid_userMenu .tid_baseInfos .tid_userStatus .tid_bubble {' +
                        'max-height: 120px !important;' +
                    '}' +
                    '#tid_userMenu .tid_links .tid_tinyLinks a{' +
                        'color: #ddab76 !important;' +
                        'text-decoration: underline !important;' +
                    '}' +
                    '.tid_user.tid_userBg.tid_userFriend {' +
                        'background-image: url("http://data.hordes.fr/gfx/icons/small_online.gif") !important;' +
                        'background-color: #7e4e2a !important;' +
                        'border-top: 1px solid #965c36 !important;' +
                        'border-radius: 4px !important;' +
                        'padding-right: 16px !important;' +
                        'color: #f0d79e !important;' +
                        'font-weight: bold;' +
                    '}' +
                    '.tid_user.tid_userBg.tid_userFriend:hover {' +
                        'border-top: 1px solid #6b3d25 !important;' +
                    '}' +
                    '.tid_user.tid_userBg.tid_userUnknown {' +
                        'background-image: url("http://data.hordes.fr/gfx/icons/small_offline.gif") !important;' +
                        'background-color: #5C0000 !important;' +
                        'border-top: 1px solid #98341c !important;' +
                        'border-radius: 4px !important;' +
                        'padding-right: 16px !important;' +
                        'color: #f0d79e !important;' +
                        'font-weight: bold !important;' +
                    '}' +
                    '.tid_user.tid_userBg.tid_userUnknown:hover {' +
                    'border-top: 1px solid #490000 !important;' +
                    '}' +

                    // Grabbed from: http://userstyles.org/styles/97652/hordes-forum-ancien
                    // (also by Davf)
                    // I find it more appropriate in this module.
                    'div.tid_bubble {' +
                        'background-color: #79432b !important;' +
                        'color: #ddab76 !important;' +
                        'box-shadow: 0px 0px 2px #79432b !important;' +
                        '-webkit-box-shadow: 0px 0px 2px #79432b !important;' +
                        'border: 0px solid transparent !important;' +
                        'border-radius: 4px;' +
                    '}' +
                    '.tid_userStatus .tid_bubble .tid_content .tid_editorContent a {' +
                        'color: #ddab76 !important;' +
                    '}' +
                    '.tid_userStatus .tid_bubble .tid_content .tid_editorContent a:hover {' +
                        'color: white !important;' +
                    '}' +
                    '.tid_bubble  a {' +
                        'text-decoration: underline !important;' +
                    '}' +
                    '.tid_userStatus .tid_bubble  .tid_editorContent strong {' +
                        'color: #afb3cf !important;' +
                        'font-weight: bold !important;' +
                    '}'
                );
            }
        }

    };
});
