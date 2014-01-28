Module.register(function() {

    var MODULE_NAME = 'external_tools_bar';

    /******************
     * Module context *
     ******************/

    /**
     * Remember if an external tool update is currently in progress.
     */
    var update_in_progress_ = false;

    /**
     * Add the i18n strings for this module.
     */
    function add_i18n()
    {
        var i18n = {};

        i18n[I18N.LANG.EN] = {};
        i18n[I18N.LANG.EN][MODULE_NAME + '_update_button'] = 'Update the external tools';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.EN][MODULE_NAME + '_update_button'] = 'Mettre à jour les outils externes';

        I18N.set(i18n);
    }

    /**
     * Inject the CSS for the external tools bar.
     */
    function inject_external_tools_bar_css()
    {
        JS.injectCSS(
            '#d2ne_external_tools_bar {' +
                'background-color: #5D321E;' +
                'width: 303px;' +
                'height: 30px;' +
                'margin-left: 3px;' +
                'margin-top: 5px;' +
                'margin-bottom: 7px;' +
                'border: 1px solid rgb(240, 215, 158);' +
                'border-radius: 9px;' +
                'padding: 5px;' +
                'padding-left: 8px;' +
            '}' +
            '#d2ne_external_tools_bar a.button {' +
                'margin-right: auto;' +
                'margin-left: auto;' +
            '}' +
            '#d2ne_external_tools_bar span {' +
                'float: left;' +
                'display: inline-block;' +
                'vertical-align: middle;' +
                'margin-top: 3px;' +
                'margin-bottom: 3px;' +
                'padding: 2px;' +
                'cursor: help;' +
                'background-color: #5c2b20;' +
                'outline: 1px solid black;' +
                'border: 1px solid #ad8051;' +
                'padding-left: 7px;' +
                'padding-right: 4px;' +
            '}' +
            '#d2ne_external_tools_bar a img {' +
                'vertical-align: middle;' +
                'margin-right: 4px;' +
            '}'
        );
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

            init: function(){
                add_i18n();
            },

            load: function() {
                inject_external_tools_bar_css();
            }
        }

    };
});
