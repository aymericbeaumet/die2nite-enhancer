var pageMod = require('sdk/page-mod');
var self = require('sdk/self');

// Fix setTimeout
var setTimeout = require('sdk/timers').setTimeout;

pageMod.PageMod({
  include: [
    <% for (var i = 0, max = matching_urls.length; i < max; i += 1) {
    %>"http://<%- matching_urls[i] %>/*"<% if (i < (max - 1)) { %>,
    <% } %><% } %>
  ],
  contentScriptFile: self.data.url("<%= compiled_script %>"),
  contentScriptWhen: "ready"
});
