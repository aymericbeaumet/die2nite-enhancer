var pageMod = require('sdk/page-mod');
var self = require('sdk/self');

pageMod.PageMod({
  include: __MATCHING_URL_JSON_ARRAY__,
  contentScriptFile: self.data.url("userscript.user.js"),
  contentScriptWhen: "start"
});
