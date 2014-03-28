Module.register(function() {

    var MODULE_NAME = 'chatty';

    /******************
     * Module context *
     ******************/

    var SERVER_URL = 'http://die2nite-chatty.herokuapp.com';

    /**
     * Add the i18n strings for this module.
     */
    function add_i18n()
    {
        var i18n = {};

        i18n[I18N.LANG.EN] = {};
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Enable the chat module';
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Allow you to chat with the players in your town.';
        i18n[I18N.LANG.EN][MODULE_NAME + '_title'] = 'Die2Nite Enhancer - Chatty';
        i18n[I18N.LANG.EN][MODULE_NAME + '_send_button'] = 'Send';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Activer le module de chat';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Vous permet de parler avec les joueurs de votre ville.';
        i18n[I18N.LANG.FR][MODULE_NAME + '_send_button'] = 'Ecrire';

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
                'height: 200px;' +
                'overflow-y: scroll;' +
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
                ["ul", { id: 'd2ne_messages_list' }]
            ],
            ["div", { class: 'd2ne_input' },
                ["form", { action: 'javascript:void(0);', onsubmit: on_form_submit },
                    ["input", { type: 'text', class: 'field' }],
                    ["a", { class: 'button', onclick: on_form_submit }, I18N.get(MODULE_NAME + '_send_button')]
                ]
            ]
        ];

        JS.wait_for_tag('body', function(nodes) {
            nodes[0].appendChild(JS.jsonToDOM(json, document));
        });
    }

    function sync_chat()
    {
        var cityName = encodeURIComponent(D2N.get_city_name());
        var serverName = encodeURIComponent(D2N.get_server_name());

        var url = SERVER_URL + '/message?serverName=' + serverName + '&cityName=' + cityName;

        JS.network_request('GET', url, null, null, function on_success(data) {
            data = JSON.parse(data);
            var container = document.getElementById('d2ne_messages_list');
            JS.delete_all_children(container);

            for (var i = 0; i < data.length; i++) {
                container.insertBefore(JS.jsonToDOM(["li", {}, data[i].playerName + ': ' + data[i].message], document), container.firstChild);
            }

            container.scrollTop = container.scrollHeight;
        }, function on_failure() {
        });
    }

    function send_message(message)
    {
        var serverName = encodeURIComponent(D2N.get_server_name());
        var cityName = encodeURIComponent(D2N.get_city_name());
        var playerName = encodeURIComponent(D2N.get_player_name());
        message = encodeURIComponent(message);

        var url = SERVER_URL + '/message';
        var data = 'serverName=' + serverName + '&cityName=' + cityName + '&playerName=' + playerName + '&message=' + message;
        var headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

        JS.network_request('POST', url, data, headers, function on_success() {
        }, function on_failure() {
        });
    }

    function on_form_submit()
    {
        var input = document.querySelector('#d2ne_chatty .d2ne_input input[type="text"]');
        if (!input) { return; }

        var message = input.value.trim();
        if (!message || message.length === 0) { return; }

        send_message(message);
        input.value = '';

        // Cancel form submit
        return false;
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

                // Load Socket.io from CloudFlare
                JS.loadScript('//cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.16/socket.io.min.js', function() {
                    // Sync chat once the connection is made
                    setInterval(function() { sync_chat(); }, 500);
                });
            }
        }

    };
});
