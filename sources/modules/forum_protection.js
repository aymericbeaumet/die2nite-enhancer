Module.register(function() {

	var MODULE_NAME = 'forum_protection';
	var CHANGE_TEXT_ID = 'd2ne_converttext';

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
		i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Enable forum post protection';
		i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Avoid your post on the forum from being altered by the alcohol or the terror.';
		i18n[I18N.LANG.EN][MODULE_NAME + '_protect'] = 'Protect my text';

		i18n[I18N.LANG.FR] = {};
		i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = "Protéger contre les effets sur les messages du forum";
		i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = "Empêche le message posté sur le forum d'être altéré par les effets de l'alcool ou de la terreur.";
		i18n[I18N.LANG.FR][MODULE_NAME + '_protect'] = 'Protéger mon texte';

		I18N.set(i18n);
	}

	function add_button(){
		JS.wait_for_id("tid_forumMsg", function(node){
			if($("#" + CHANGE_TEXT_ID).length > 0)  {
				return;
			}

			var div = $("<div>");
			div.css("display", "inline-block");
			div.css("margin-left", "5px");

			var link = $("<a>");
			link.click(protect.bind(this));
			link.addClass("d2n_protect_btn");
			link.attr("id", CHANGE_TEXT_ID);
			link.html(I18N.get(MODULE_NAME + "_protect"));

			$(".tid_postForm form button").after(div);
			div.append(link);
		})
	}

	function protect(event){
		event.preventDefault();
		event.stopPropagation();

		var text = $("#tid_forumMsg").val();

		text = text.replace(/\n/gi, "=====");

		// Requête GET sur https://qaz.wtf/u/convert.cgi?text=[Contenu du champ texte]
		JS.network_request("GET", "https://qaz.wtf/u/convert.cgi?text=" + text, null, null, function(response) {
			var doc = document.createElement("html");
			doc.innerHTML = response;
			var line = doc.querySelector("table tr:nth-child(9)");
			var textChanged = line.cells[1].innerText;
			textChanged = textChanged.replace(/=====/gi, "\n").trim();
			$("#tid_forumMsg").val(textChanged);
		}, function(response){
			alert("Impossible de protéger ce texte");
		});
	}


	/************************
	 * Module configuration *
	 ************************/

	return {

		name: MODULE_NAME,
		type: Module.TYPE.INTERFACE_ENHANCEMENT,

		properties: {
			enabled: false,
			isProtected: true
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
				return !D2NE.is_restricted_mode();
			},

			init: function() {
				add_i18n();
			},

			load: function() {
				if(!D2N.is_on_forum()){
					return;
				}

				JS.injectCSS(
					'.d2n_protect_btn {' +
						'cursor: pointer;' +
						'background-image: url("http://data.hordes.fr/gfx/design/button.gif");' +
						'border: 1px solid #98341c !important;' +
						'outline: 1px solid black !important;' +
						'padding: 1px 10px;' +
						'font-weight: bold;' +
						'font-size: 12pt;' +
						'color: #f0d79e !important;' +
					'}');

				JS.wait_for_selector("#tid_forum_left .tid_actionBar a:nth-child(4)", function(node){
					$(node).click(add_button);
				})

				
				document.addEventListener('d2n_forum_topic', function() {
					JS.wait_for_selector_all("#tid_forum_right .tid_actions .tid_buttonBar a:first-child", function(nodes){
						$(nodes).click(add_button);
					});

					JS.wait_for_selector_all('.tid_tools a[onclick^="_tid.forum.cite"]', function(nodes) {
						$(nodes).click(add_button);
					});
				}, false);
			}
		}

	};
});
