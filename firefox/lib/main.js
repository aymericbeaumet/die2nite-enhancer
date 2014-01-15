var pageMod = require('sdk/page-mod');
var self = require('sdk/self');

// Fix setTimeout
var setTimeout = require('sdk/timers').setTimeout;

pageMod.PageMod({
  include: __MATCHING_URL_JSON_ARRAY__,
  contentScriptFile: self.data.url("userscript.user.js"),
  contentScriptWhen: "ready"
});
