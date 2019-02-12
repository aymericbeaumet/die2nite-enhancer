Module.register(function() {

	var MODULE_NAME = 'postit';

	/******************
	 * Module context *
	 ******************/

	var POSTIT_BASE_CLASS = 'd2ne_postit';
	var ADD_POSTIT_BTN_ID = 'add_d2ne_postit';

	/**
	 * Add the i18n strings for this module.
	 */
	function add_i18n()
	{
		var i18n = {};

		i18n[I18N.LANG.EN] = {};
		i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Post-it';
		i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Display some post-its where you need them.';
		i18n[I18N.LANG.EN][MODULE_NAME + '_add_new'] = 'New post-it';

		i18n[I18N.LANG.FR] = {};
		i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Ajouter des post-its';
		i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Ajoute des post-its où vous en avez besoin.';
		i18n[I18N.LANG.FR][MODULE_NAME + '_add_new'] = "Nouveau post-it";

		I18N.set(i18n);
	}

	function add_new_postit(content){
		this.properties.cpt++;
		this.save_properties();

		if($("#postit-" + this.properties.cpt).length > 0) return;

		// Le premier postit est à 40px du haut (a cause de la toolbar Twinoid)
		var toppx = $("#tid_bar").height() + 10;

		// Si on a des postits
		if($("." + POSTIT_BASE_CLASS).length > 0) {
			// On cherche la première place disponible
			for(var i = 1 ; i <= this.properties.cpt ; i++) {
				if($("#postit-" + i).length) {
					// Le postit I existe, on ajoute sa hauteur + la marge entre 2 postit
					toppx += $("." + POSTIT_BASE_CLASS).height() + 10;
				} else {
					// il n'existe pas, on se casse
					break;
				}
			}
		}

		var leftpx = $("#contentBg").offset().left + $("#contentBg").width() + 20;

		var postit = $("#main").append("<div class='" + POSTIT_BASE_CLASS + "' id='postit-" + this.properties.cpt + "' style='top: " + toppx + "px;left:"+leftpx+"px;'>");
		var wrapper = $("#postit-" + this.properties.cpt).append("<div class='d2ne_postit_wrapper'>");
		wrapper.append("<textarea data-target='" + this.properties.cpt + "'>");
		wrapper.append("<a style='position: absolute;right: 5px;top: 5px;color: black;cursor: pointer;' data-target='" + this.properties.cpt + "'>X</a>");

		if(content != null){
			$("#postit-" + this.properties.cpt + " textarea").val(content);
		}

		$("#postit-" + this.properties.cpt + " textarea").keyup(function(ev){
			var cpttarget = $(ev.target).data("target");
			this.properties.postits[cpttarget] = $("#postit-" + cpttarget + " textarea").val();
			this.save_properties();
		}.bind(this));

		$("#postit-" + this.properties.cpt + " a").click(function(ev){
			var cpttarget = $(ev.target).data("target");
			$("#postit-" + cpttarget).remove();
			this.properties.postits[cpttarget] = null;
			this.save_properties();
		}.bind(this));
	}

	function add_button(){
		if($("#" + ADD_POSTIT_BTN_ID).length > 0) 
			return;
		var clss = "";

		if(D2N.is_on_forum()) {
			$("#backReboot").after("<div id='" + ADD_POSTIT_BTN_ID + "'>");
			clss = "postit_add_btn";
		} else if (D2N.is_outside()) {
			$(".left").append("<div id='" + ADD_POSTIT_BTN_ID + "'>");
			clss = "button";
		} else {
			if(D2N.is_on_page_in_city("overview") || D2N.is_on_page_in_city("bank")) {
				$(".right").append("<div id='" + ADD_POSTIT_BTN_ID + "'>");
			} else if (D2N.is_on_page_in_city("home")) {
				$(".home > .left").append("<div id='" + ADD_POSTIT_BTN_ID + "'>");
			} else if (D2N.is_on_page_in_city("well")) {
				$(".wellPane").append("<div id='" + ADD_POSTIT_BTN_ID + "'>");
			} else if (D2N.is_on_page_in_city("buildings")) {
				$("#generic_section .button:first").after("<div id='" + ADD_POSTIT_BTN_ID + "'>");
			} else if (D2N.is_on_page_in_city("doors") || D2N.is_on_page_in_city("refine")) {
				$("#generic_section .button:last").after("<div id='" + ADD_POSTIT_BTN_ID + "'>");
			} else if (D2N.is_on_page_in_city("tower")) {
				$(".tower").append("<div id='" + ADD_POSTIT_BTN_ID + "'>");
			} else if (D2N.is_on_page_in_city("upgrades")) {
				$("#generic_section .button").after("<div id='" + ADD_POSTIT_BTN_ID + "'>");
			}
			clss = "button";
		}
		var link = $("<a class='" + clss + "'>").click(function(){
			add_new_postit.call(this);
		}.bind(this)).html("<img src='//data.hordes.fr/gfx/icons/small_rp.gif'> " + I18N.get(MODULE_NAME + "_add_new"));

		$("#" + ADD_POSTIT_BTN_ID).append(link);
	}

	/************************
	 * Module configuration *
	 ************************/

	return {

		name: MODULE_NAME,
		type: Module.TYPE.INTERFACE_ENHANCEMENT,

		properties: {
			enabled: false,
			cpt: 0,
			postits: []
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
				JS.injectCSS(
					'.postit_add_btn {' +
						'cursor: pointer;' +
						'background-image: url("http://data.hordes.fr/gfx/design/button.gif");' +
						'border: 1px solid black;' +
					'}' +
					'.' + POSTIT_BASE_CLASS + ' {' +
						'position: absolute;' +
					    "z-index: 999;" +
					'}' +
					'.' + POSTIT_BASE_CLASS + ' textarea {' +
						'width: 200px;' +
						'height: 200px;' +
					'}' +
					'.d2ne_postit_wrapper {' +
						'position: absolute;' +
					    "z-index: 999;" +
					'}'
				);

				$(window).resize(function() {
					$("." + POSTIT_BASE_CLASS).css("left", ($("#contentBg").offset().left + $("#contentBg").width() + 20) + "px");
				});

				if(D2N.is_on_forum()){
					JS.injectCSS(
						'#' + ADD_POSTIT_BTN_ID + ' {' +
							'position: absolute;' +
							'top: 210px;' +
							'margin-left: 110px;' +
							'padding-top: 9px;' +
						'}' +
						'.postit_add_btn {' +
							'color: #f0d79e;' + 
							'padding: 2px 5px;' +
							'font-size: 8pt;' +
							'font-variant: small-caps;' +
						'}'
					);
					add_button.call(this);

					this.properties.cpt = 0;

					for(var i = this.properties.postits.length - 1 ; i > 0 ; i--){
						var value = this.properties.postits[i];
						if(value == undefined || value == null || value == ""){
							this.properties.postits.splice(i, 1);
						}
					}

					for(var post = 1 ; post < this.properties.postits.length ; post++){
						add_new_postit.call(this, this.properties.postits[post]);
					}

					this.save_properties();
				} else {
					document.addEventListener('d2n_gamebody_reload', function() {
						add_button.call(this);

						this.properties.cpt = 0;

						for(var i = this.properties.postits.length - 1 ; i > 0 ; i--){
							var value = this.properties.postits[i];
							if(value == undefined || value == null || value == ""){
								this.properties.postits.splice(i, 1);
							}
						}

						$(this.properties.postits).each(function(index, value){
							if(value != undefined && value != null && value != ""){
								add_new_postit.call(this, value);
							}
						}.bind(this));

						this.save_properties();
					}.bind(this), false);
				}
			}
		}
	};
});
