Module.register(function() {

    var MODULE_NAME = 'button';

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
        i18n[I18N.LANG.EN][MODULE_NAME + '_title'] = 'Die2Nite Enhancer';
        i18n[I18N.LANG.EN][MODULE_NAME + '_description'] = 'Die2Nite Enhancer allows you to enhance your game experience.';
        i18n[I18N.LANG.EN][MODULE_NAME + '_configuration_panel_button'] = 'Configuration Panel';
        i18n[I18N.LANG.EN][MODULE_NAME + '_contact_link'] = 'Contact the developer';
        i18n[I18N.LANG.EN][MODULE_NAME + '_support_link'] = 'Support the developer';
        i18n[I18N.LANG.EN][MODULE_NAME + '_bug_tracker_link'] = 'Bug tracker';
        i18n[I18N.LANG.EN][MODULE_NAME + '_license_link'] = 'License';
        i18n[I18N.LANG.EN][MODULE_NAME + '_version'] = 'Version';
        i18n[I18N.LANG.EN][MODULE_NAME + '_google_chrome_link'] = 'Google Chrome';
        i18n[I18N.LANG.EN][MODULE_NAME + '_firefox_link'] = 'Mozilla Firefox';
        i18n[I18N.LANG.EN][MODULE_NAME + '_opera_link'] = 'Opera';
        i18n[I18N.LANG.EN][MODULE_NAME + '_safari_link'] = 'Safari';
        i18n[I18N.LANG.EN][MODULE_NAME + '_userscript_link'] = 'Userscript';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_description'] = 'Die2Nite Enhancer vous permet d\'améliorer votre expérience de jeu.';
        i18n[I18N.LANG.FR][MODULE_NAME + '_configuration_panel_button'] = 'Panneau de configuration';
        i18n[I18N.LANG.FR][MODULE_NAME + '_contact_link'] = 'Contacter le développeur';
        i18n[I18N.LANG.FR][MODULE_NAME + '_support_link'] = 'Supporter le développeur';
        i18n[I18N.LANG.FR][MODULE_NAME + '_version'] = 'Version';

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

            '#d2ne_button p {' +
                'margin: 0;' +
            '}' +

            '#d2ne_button ul {' +
                'margin: 0;' +
                'padding: 0;' +
                'list-style: none;' +
                'margin-bottom: 8px;' +
                'font-size: 13px;' +
            '}' +

            '#d2ne_button ul li {' +
                'margin: 0;' +
                'padding: 0;' +
            '}' +

            '#d2ne_button li img {' +
                'width: 16px;' +
                'height: 16px;' +
                'margin-right: 5px;' +
                'vertical-align: -11%;' +
            '}' +

            '#d2ne_button li a {' +
                'display: block;' +
                'width: 205px;' +
                'height: 18px;' +
                'overflow: hidden;' +
                'text-decoration: none;' +
            '}' +
            '#d2ne_button li a:hover {' +
                'background-color: #696486;' +
            '}' +

            '#d2ne_button li a span {' +
                'text-decoration: underline;' +
            '}' +

            '#d2ne_button a.button {' +
                'margin: 12px auto;' +
            '}' +

            '#d2ne_button hr {' +
                'margin: 0;' +
                'margin: 10px 0;' +
                'border-bottom: 1px solid rgba(148, 87, 52, 0.21);' +
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

                ["a", { class: "button", onclick: function() {
                    JS.dispatch_event('d2ne_load_configuration_panel');
                }}, I18N.get(MODULE_NAME + '_configuration_panel_button') ],

                ["ul", {},
                    ["li", {},
                        ["a", { href: 'mailto:aymeric@beaumet.me?Subject=[D2NE]%20' },
                            ["img", { src: '/gfx/icons/small_mail.gif' }],
                            ["span", {}, I18N.get(MODULE_NAME + '_contact_link')]
                        ]
                    ],
                    ["li", {},
                        ["a", { href: 'https://www.gittip.com/aymericbeaumet/', target: '_blank' },
                            ["img", { src: '/gfx/icons/item_fest.gif' }],
                            ["span", {}, I18N.get(MODULE_NAME + '_support_link')]
                        ]
                    ],
                    ["li", {},
                        ["a", { href: '<%= bugs.url %>', target: '_blank' },
                            ["img", { src: '/gfx/icons/small_rocket.gif' }],
                            ["span", {}, I18N.get(MODULE_NAME + '_bug_tracker_link')]
                        ]
                    ],
                    ["li", {},
                        ["a", { href: '<%= licenses[0].url %>', target: '_blank' },
                            ["img", { src: '/gfx/icons/small_nice_lock.gif' }],
                            ["span", {}, I18N.get(MODULE_NAME + '_license_link')]
                        ]
                    ],
                    ["li", {},
                        ["a", { href: '<%= homepage %>', target: '_blank' },
                            ["img", { src: (D2NE.is_restricted_mode() ? '/gfx/icons/item_tamed_pet.gif' : '/gfx/icons/item_tamed_pet_drug.gif') }],
                            ["span", {}, I18N.get(MODULE_NAME + '_version') + ' <%= version %>']
                        ]
                    ]
                ]
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
