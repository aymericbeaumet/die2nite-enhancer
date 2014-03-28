Module.register(function() {

    var MODULE_NAME = 'chatty';

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
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Enable the chat module';
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Allow you to chat with the players in your town.';
        i18n[I18N.LANG.EN][MODULE_NAME + '_title'] = 'Die2Nite Enhancer - Chatter';
        i18n[I18N.LANG.EN][MODULE_NAME + '_send_button'] = 'Send';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Activer le module de chat';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Vous permet de parler avec les joueurs de votre ville.';
        i18n[I18N.LANG.EN][MODULE_NAME + '_send_button'] = 'Ecrire';

        I18N.set(i18n);
    }

    function insert_chat_style()
    {
        JS.injectCSS(
            '#d2ne_chatty {' +
                'position: fixed;' +
                'bottom: 0;' +
                'left: 0;' +
                'right: 0;' +
                'margin: 0 auto;' +
                'z-index: 2;' +
                'width: 100%;' +
                'width: 500px;' +
                'border: 1px solid yellow;' +
                'background: green;' +
            '}' +

            '#d2ne_chatty .d2ne_menu {' +
                'height: 40px;' +
                'width: 100%;' +
                'background: orange;' +
            '}' +

            '#d2ne_chatty .d2ne_notif {' +
                'position: absolute;' +
                'right: 0;' +
                'height: 40px;' +
                'width: 40px;' +
            '}' +

            '#d2ne_chatty .d2ne_messages {' +
                'background: pink;' +
                'height: 200px;' +
                'width: 100%;' +
                'overflow-y: scroll;' +
                'position: relative;' +
            '}' +

            '#d2ne_chatty .d2ne_messages ul {' +
                'overflow-y: scroll;' +
                'vertical-align: bottom;' +
                'height: 200px;' +
            '}' +

            '#d2ne_chatty .d2ne_input {' +
                'height: 30px;' +
                'width: 100%;' +
                'background: purple;' +
            '}' +

            '#d2ne_chatty .d2ne_input a.button {' +
                'float: right;' +
                'margin: 0px;' +
                'padding: 0px;' +
                'width: 85px;' +
                'text-align: center;' +
            '}' +

            '#d2ne_chatty .d2ne_input input {' +
            '}'
        );
    }

    function insert_chat_dom()
    {
        var json = ["div", { id: 'd2ne_chatty' },
            ["div", { class: 'd2ne_menu' },
                I18N.get(MODULE_NAME + '_title'),
                ["div", { class: 'd2ne_notif' },
                    2
                ]
            ],
            ["div", { class: 'd2ne_messages' },
                ["ul", {},
                    ["li", {}, 'Message: 1'],
                    //["li", {}, 'Message: 2'],
                    //["li", {}, 'Message: 3'],
                    //["li", {}, 'Message: 4'],
                    //["li", {}, 'Message: 5'],
                    //["li", {}, 'Message: 6'],
                    //["li", {}, 'Message: 7'],
                    //["li", {}, 'Message: 8'],
                    //["li", {}, 'Message: 9'],
                    //["li", {}, 'Message: 10'],
                    //["li", {}, 'Message: 11'],
                    //["li", {}, 'Message: 12'],
                    //["li", {}, 'Message: 13'],
                    //["li", {}, 'Message: 14'],
                    //["li", {}, 'Message: 15'],
                    //["li", {}, 'Message: 16'],
                    //["li", {}, 'Message: 17'],
                    //["li", {}, 'Message: 18'],
                    //["li", {}, 'Message: 19'],
                    ["li", {}, 'Message: 20']
                ]
            ],
            ["div", { class: 'd2ne_input' },
                ["form", {},
                    ["input", { type: 'text', class: 'field' }],
                    ["a", { class: 'button' }, I18N.get(MODULE_NAME + '_send_button')]
                ]
            ]
        ];

        JS.wait_for_tag('body', function(nodes) {
            nodes[0].appendChild(JS.jsonToDOM(json, document));
        });
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
                category: Module.PROPERTY_CATEGORY.GENERAL,
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
                insert_chat_style();
                insert_chat_dom();
            }
        }

    };
});
