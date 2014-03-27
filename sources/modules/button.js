Module.register(function() {

    var MODULE_NAME = 'configuration_panel';

    /******************
     * Module context *
     ******************/

    var D2NE_CONFIG_HASH = '#d2ne/configuration';

    /**
     * Add the i18n strings for this module.
     */
    function add_i18n()
    {
        var i18n = {};

        i18n[I18N.LANG.EN] = {};
        i18n[I18N.LANG.EN][MODULE_NAME + '_description'] = 'Die2Nite Enhancer allows you to enhance your game experience.';
        i18n[I18N.LANG.EN][MODULE_NAME + '_configuration_panel_button'] = 'Configuration Panel';
        i18n[I18N.LANG.EN][MODULE_NAME + '_contact_button'] = 'Contact the developer';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_description'] = 'Die2Nite Enhancer vous permet d\'améliorer votre expérience de jeu.';
        i18n[I18N.LANG.FR][MODULE_NAME + '_configuration_panel_button'] = 'Panneau de configuration';
        i18n[I18N.LANG.EN][MODULE_NAME + '_contact_button'] = 'Contacter le développeur';

        I18N.set(i18n);
    }

    function insert_button_style()
    {
        JS.injectCSS(
            '#sites {' +
                'z-index: 14;' +
            '}' +

            '#d2ne_button {' +
                'margin-top: -210px;' +
                'position: absolute;' +
                'margin-left: 43px;' +
                'z-index: 13;' +
                'background-color: #5c2b20;' +
                'border: 1px solid #000000;' +
                'max-width: 862px;' +
                'font-size: 0.9em;' +
                'line-height: 23px;' +
                'border: 1px solid #f0d79e;' +
                'outline: 1px solid black;' +
                'padding-left: 5px;' +
                'padding-right: 5px;' +
            '}' +

            '#d2ne_button > h1 {' +
                'height: auto;' +
                'font-size: 8pt;' +
                'text-transform: none;' +
                'font-variant: small-caps;' +
                'background: none;' +
                'cursor: help;' +
                'margin: 0;' +
                'padding: 0;' +
            '}' +
            '#d2ne_button:hover > h1 {' +
                'border-bottom: 1px solid #b37c4a;' +
                'margin-bottom: 5px;' +
            '}' +

            '#d2ne_button > h1 > span {' +
                'display: none;' +
            '}' +
            '#d2ne_button:hover > h1 > span {' +
                'display: inline;' +
            '}' +

            '#d2ne_button > div {' +
                'display: none;' +
                'width: 430px;' +
            '}' +
            '#d2ne_button:hover > div {' +
                'display: block;' +
            '}' +

            '#d2ne_button a.button {' +
                'margin-bottom: 4px;' +
            '}'
        );
    }

    function insert_button_dom()
    {
        var button = JS.jsonToDOM(["div", { "id": "d2ne_button" },
            ["h1", {},
                ["img", { "src": "/gfx/forum/smiley/h_city_up.gif", "alt": "" }],
                ["span", {}, ' ' + I18N.get(MODULE_NAME + '_title')]
            ],

            ["div", {},
                ["p", {}, I18N.get(MODULE_NAME + '_description')],
                ["a", { class: "button", href: '/' + D2NE_CONFIG_HASH }, I18N.get(MODULE_NAME + '_configuration_panel_button') ],
                ["a", { class: "button", href: 'mailto:aymeric@beaumet.me?Subject=[D2NE]%20' }, I18N.get(MODULE_NAME + '_contact_button') ]
            ]
        ], document);

        JS.wait_for_id('main2', function(node) {
            node.insertBefore(button, node.firstChild);
        });
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
                insert_button_style();
                insert_button_dom();
            }
        }

    };
});
