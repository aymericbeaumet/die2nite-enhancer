Module.register(function() {

    var MODULE_NAME = 'chatty';

    /******************
     * Module context *
     ******************/

    var SERVER_URL = 'http://die2nite-chatty.herokuapp.com';

    var socket_ = null;

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

    /**************************************************************************/
    // Read from the socket

    function socket_wait_for_new_message()
    {
      socket_.on('newMessage', function(data) {
        add_new_message(data.room, data.user, data.content);
      });
    }

    function socket_wait_for_new_room()
    {
      socket_.on('newRoom', function(data) {
          var m;
          for (var i = data.messages.length - 1; i >= 0; i--) {
              m = data.messages[i];
              add_new_message(m.room, m.user, m.content);
          }
      });
    }

    /**************************************************************************/
    // Write on the socket

    function socket_emit_send_message(room, user, content)
    {
        socket_.emit('sendMessage', {
            room: room,
            user: user,
            content: content
        });
    }

    function socket_emit_leave_room(roomName)
    {
        socket_.emit('leaveRoom', {
            room: roomName
        });
    }

    function socket_emit_join_room(roomName)
    {
        socket_.emit('joinRoom', {
            room: roomName
        });
    }

    /**************************************************************************/

    function add_new_message(room, user, content)
    {
        var li = JS.jsonToDOM(['li', {}, user + ': ' + content], document);
        document.getElementById('d2ne_messages_list').appendChild(li);
    }

    function on_form_submit()
    {
        // Find the input
        var input = document.querySelector('#d2ne_chatty .d2ne_input input[type="text"]');
        if (!input) { return; }

        // Ensure that the message is not empty
        var content = input.value.trim();
        if (!content || content.length === 0) { return; }

        // Send the message
        socket_emit_send_message(window.location.hostname + '|world', D2N.get_player_name(), content);

        // Empty the input
        input.value = '';

        // Cancel form submit
        return false;
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

                // Only connect the chat module once the page is loaded
                var onPageLoaded = function() {
                    document.removeEventListener('d2n_gamebody_reload', onPageLoaded, false);

                    socket_ = io.connect(SERVER_URL);
                    socket_emit_join_room(window.location.hostname + '|' + 'world');
                    socket_emit_join_room(window.location.hostname + '|' + D2N.get_city_name());
                    socket_wait_for_new_message();
                    socket_wait_for_new_room();
                };
                document.addEventListener('d2n_gamebody_reload', onPageLoaded, false);
            }
        }

    };
});
