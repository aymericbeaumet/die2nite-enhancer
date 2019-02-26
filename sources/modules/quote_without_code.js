Module.register(function() {

	var MODULE_NAME = 'quote_without_code';

	/******************
	 * Module context *
	 ******************/

	/**
	 * Add the i18n strings for this module.
	 */
	function add_i18n()
	{
		var i18n = {};

		i18n[I18N.LANG.FR] = {};
		i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Citer sans [cite]';
		i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Ajoute un bouton "Citer sans balises" pour citer sans mettre la balise [cite].';

		i18n[I18N.LANG.EN] = {};
		i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Quote without [cite]';
		i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Add a "Quote without code" in order to quote without the [cite] stuff.';

		I18N.set(i18n);
	}

	function add_quote_button(){
		JS.wait_for_selector_all('.tid_tools a[onclick^="_tid.forum.cite"]', function(nodes) {
			for(var i = 0 ; i < nodes.length ; i++){
				var newquote = $("<a>");
				newquote.html(I18N.get(MODULE_NAME + "_short_desc"));
				newquote.attr("onclick", "return false;");
				newquote.attr("href", "#");
				/* jshint ignore:start */
				newquote.click(function(){
					var quoteBtn = $(this).siblings('a[onclick^="_tid.forum.cite"]').click();
					JS.wait_for_id("tid_forumMsg", function(node){
						var content = $(node).val();
						content = content.replace(/\n?\[\/?cite(=.*\n)?]?/g, "");
						$(node).val(content);
					});
				});
				/* jshint ignore:end */
				newquote.insertAfter($(nodes[i]));
			}
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
			isProtected: false
		},

		configurable: {
			enabled: {
				category: Module.PROPERTY_CATEGORY.FORUM,
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
				if(!D2N.is_on_forum()){
					return;
				}
				
				document.addEventListener('d2n_forum_topic', function() {
					if(!D2N.is_on_forum()){
						return;
					}
					add_quote_button();
				}, false);
			}
		}

	};
});
