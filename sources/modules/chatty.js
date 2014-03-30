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
        i18n[I18N.LANG.EN][MODULE_NAME + '_world_room'] = 'World';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Activer le module de chat';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Vous permet de parler avec les joueurs de votre ville.';
        i18n[I18N.LANG.FR][MODULE_NAME + '_send_button'] = 'Ecrire';
        i18n[I18N.LANG.FR][MODULE_NAME + '_world_room'] = 'Monde';

        I18N.set(i18n);
    }

    /**************************************************************************/
    // Read from the socket

    /**
     * Wait for a new message.
     */
    function socket_wait_for_new_message()
    {
      socket_.on('newMessage', function(data) {
          add_new_message(data.room, data.user, data.content);
      });
    }

    /**
     * Wait for a new room to init.
     */
    function socket_wait_for_new_room()
    {
      socket_.on('newRoom', function(data) {
          var m;
          for (var i = data.messages.length - 1; i >= 0; i--) {
              m = data.messages[i];
              add_new_message(data.name, m.user, m.content);
          }
      });
    }

    /**************************************************************************/
    // Write on the socket

    /**
     * Send a message to the given room.
     */
    function socket_emit_send_message(room, user, content)
    {
        socket_.emit('sendMessage', {
            room: room,
            user: user,
            content: content
        });
    }

    /**
     * Leave the given room.
     */
    function socket_emit_leave_room(roomName)
    {
        socket_.emit('leaveRoom', {
            room: roomName
        });
    }

    /**
     * Join the given room.
     */
    function socket_emit_join_room(roomName)
    {
        socket_.emit('joinRoom', {
            room: roomName
        });
    }

    /**************************************************************************/

    /**
     * Return the full name of the active room.
     */
    function get_active_room()
    {
        var el = document.querySelector('.d2ne_chatty_tab input[type="radio"]:checked');

        if (!el) {
            return null;
        }
        return el.id.replace(/^tab-room-/, '');
    }

    /**
     * Display the messages for the active room.
     */
    function display_active_room_messages()
    {
        // Remove all the d2ne_chatty_active class
        var els = document.getElementsByClassName('d2ne_chatty_active');
        for (var i = 0; i < els.length; i++) {
            els[i].classList.remove('d2ne_chatty_active');
        }

        // Add the class for the active room
        var active_room = get_active_room();
        var el = document.getElementById('messages-room-' + active_room);
        el.classList.add('d2ne_chatty_active');

        // Scroll room to top
        JS.scroll_to_bottom(el.parentNode);
    }

    /**
     * Add the room tab + messages container. Also subscribe to the new
     * messages.
     */
    function join_room(room_name)
    {
        var full_name = window.location.hostname + '|' + room_name;

        // Add the room tab
        var is_first_tab = document.getElementsByClassName('d2ne_chatty_tab').length === 0;
        var unique_tab_id = 'tab-room-' + full_name;
        var tab = ['div', { class: 'd2ne_chatty_tab' },
            ['input', { name: 'tab-room', type: 'radio', id: unique_tab_id, onclick: function() { display_active_room_messages(); }}],
            ['label', { for: unique_tab_id }, room_name]
        ];
        if (is_first_tab) {
            tab[2][1].checked = 'checked'; // Check the first radio button
        }
        document.querySelector('.d2ne_chatty_rooms td').appendChild(JS.jsonToDOM(tab, document));

        // Add the messages container
        var unique_messages_id = 'messages-room-' + full_name;
        var container = ['ul', { class: 'd2ne_chatty_messages_container', id: unique_messages_id }];
        document.querySelector('.d2ne_chatty_messages > td > div').appendChild(JS.jsonToDOM(container, document));

        // Inform the server we want to join the room
        socket_emit_join_room(full_name);
    }

    /**
     * Add a new message into the container for the given room. Nothing happen
     * if the room container can not be found.
     */
    function add_new_message(room, user, content)
    {
        var container = document.getElementById('messages-room-' + room);
        var li = JS.jsonToDOM(['li', {}, user + ': ' + content], document);

        if (!container) {
            return;
        }

        container.appendChild(li);
        JS.scroll_to_bottom(container.parentNode);
    }

    /**
     * Return true if the chat is displayed.
     */
    function is_chat_displayed()
    {
        var chat = document.getElementById('d2ne_chatty');

        if (!chat) {
            return false;
        }

        var style = getComputedStyle(chat);

        return parseInt(style.bottom) === 0;
    }

    /**
     * Called when the header is clicked.
     */
    function on_header_click()
    {
        var chat = document.getElementById('d2ne_chatty');

        if (is_chat_displayed()) {
            // Hide it
            chat.style.bottom = -(chat.scrollHeight - 25) + 'px';
        } else {
            // Show it
            chat.style.bottom = 0;
        }
    }

    /**
     * Called either when the form is submitted (with enter) or when the send
     * button is clicked.
     */
    function on_form_submit()
    {
        // Find the input
        var input = document.querySelector('#d2ne_chatty .d2ne_chatty_input input[type="text"]');
        if (!input) { return; }

        // Ensure that the message is not empty
        var content = input.value.trim();
        if (!content || content.length === 0) { return; }

        // Send the message
        var active_room = get_active_room();
        if (!active_room) { // if the active room can not be found, abort
            return;
        }
        socket_emit_send_message(active_room, D2N.get_player_name(), content);

        // Empty the input
        input.value = '';

        // Cancel form submit
        return false;
    }

    function insert_chat_dom()
    {
        var json = ["table", { id: 'd2ne_chatty' },
            ["tr", { class: 'd2ne_chatty_header', onclick: on_header_click },
                ["td", {},
                    I18N.get(MODULE_NAME + '_title'),
                ]
            ],
            ["tr", { class: 'd2ne_chatty_rooms' },
                ["td", {}]],
            ["tr", { class: 'd2ne_chatty_messages' },
                ["td", {},
                    ["div", {}]
                ]
            ],
            ["tr", { class: 'd2ne_chatty_input' }, ["td", {},
                ["form", { action: 'javascript:void(0);', onsubmit: on_form_submit },
                    ["input", { type: 'text', class: 'field' }],
                    ["a", { class: 'button', onclick: on_form_submit }, I18N.get(MODULE_NAME + '_send_button')]
                ]
            ]]
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
                'bottom: -281px;' + // -(input height + messages height + tab height)
                'left: 0;' +
                'right: 0;' +
                'margin: 0 auto;' +
                'z-index: 2;' +
                'width: 500px;' +
                'border-collapse: collapse;' +
                '-webkit-transition: all 0.5s ease;' +
                '-moz-transition: all 0.5s ease;' +
                'transition: all 0.5s ease;' +
                'border: 1px solid orange;' +
                'border-bottom: none;' +
            '}' +

                '#d2ne_chatty .d2ne_chatty_header td {' +
                    'height: 25px;' +
                    'background: rgb(41, 35, 26);' +
                    'text-align: center;' +
                    'vertical-align: middle;' +
                    'cursor: pointer;' +
                '}' +

                '#d2ne_chatty .d2ne_chatty_rooms td {' +
                    'height: 40px;' +
                    'background: rgb(63, 56, 32);' +
                    'vertical-align: middle;' +
                '}' +
                    '#d2ne_chatty .d2ne_chatty_rooms td .d2ne_chatty_tab {' +
                        'float: left;' +
                    '}' +
                    '#d2ne_chatty .d2ne_chatty_rooms td .d2ne_chatty_tab + .d2ne_chatty_tab {' +
                        'padding-left: 10px;' +
                    '}' +

                '#d2ne_chatty .d2ne_chatty_messages td {' +
                    'height: 205px;' +
                    'background: rgb(105, 74, 80);' +
                '}' +
                    '#d2ne_chatty .d2ne_chatty_messages td div {' +
                        'overflow-y: scroll;' +
                        'height: 100%;' +
                    '}' +
                    '#d2ne_chatty .d2ne_chatty_messages td ul {' +
                        'margin: 0;' +
                        'padding: 0;' +
                        'list-style: none;' +
                        'display: none;' +
                    '}' +
                    '#d2ne_chatty .d2ne_chatty_messages td ul.d2ne_chatty_active {' +
                        'display: initial;' +
                    '}' +

                '#d2ne_chatty .d2ne_chatty_input td {' +
                    'height: 30px;' +
                    'background: rgb(80, 51, 80);' +
                '}' +
                    '#d2ne_chatty .d2ne_chatty_input td a.button {' +
                        'float: right;' +
                        'margin: 0px;' +
                        'padding: 0px;' +
                        'width: 85px;' +
                        'text-align: center;' +
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

                // Only continue when the city name is accessible
                D2N.get_city_name(function() {
                    socket_ = io.connect(SERVER_URL);

                    socket_wait_for_new_message();
                    socket_wait_for_new_room();

                    join_room(I18N.get(MODULE_NAME + '_world_room'));
                    var city_name = D2N.get_city_name();
                    if (city_name) {
                        join_room(city_name);
                    }

                    display_active_room_messages();
                });
            }
        }

    };
});
