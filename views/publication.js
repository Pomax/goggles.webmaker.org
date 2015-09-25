/**
 *
 */
function DeferredTimeout(ms) {
  var deferred = jQuery.Deferred();
  setTimeout(function() { deferred.resolve(); }, ms);
  return deferred;
}

/**
 *
 */
function DeferredPublish(html, originalURL, hackpubURL) {

  var csrf = $("#require-js").data("csrf");

  return jQuery.ajax({
    type: 'POST',
    url: hackpubURL + "publish",
    data: {
      'html': html,
      'original-url': originalURL
    },
    headers: {
      'X-CSRF-Token': csrf
    },
    crossDomain: true,
    dataType: 'json'
  });
}

/**
 *
 */
function setupUI(html, originalURL, hackpubURL) {
  $(".to-internet.big-button").click(function() {
    $("#choose-publish-method").fadeOut(function() {
      $("#to-internet").fadeIn(function() {
        var timeout = DeferredTimeout(1000);
        var publish = DeferredPublish(html, originalURL, hackpubURL);
        jQuery.when(publish, timeout).then(
          function onSuccess(publishArgs) {
            $("#to-internet .loading").fadeOut(function() {
              var data = publishArgs[0];
              var url = data['published-url'];
              $(".published-url a").attr("href", url).text(url);
              $("#to-internet .finished").fadeIn();
            });
          },
          function onFailure() {
            $("#to-internet .loading").fadeOut(function(){
              $("#to-internet .failure").fadeIn();
            });
          }
        );
      });
    });
  });
  $(".view-html.big-button").click(function() {
    $("#choose-publish-method").fadeOut(function() {
      $("#view-html textarea").val(html).focus().select();
      $("#view-html").fadeIn();
    });
  });
}

/**
 *
 */
function init(html, originalURL, hackpubURL) {
  var ppxURL = "http://toolness.github.com/postmessage-proxied-xhr/";

  yepnope({
    test: jQuery.support.cors,
    nope: [ppxURL + 'ppx.min.js', ppxURL + 'ppx.jquery.min.js'],
    complete: function() {
      if (!jQuery.support.cors)
        jQuery.proxyAjaxThroughPostMessage(hackpubURL + 'ppx-server');
      setupUI(html, originalURL, hackpubURL);
    }
  });
}

/**
 * run immediately
 */
(function(){
  window.addEventListener("message", function(event) {
    $("#close").click(function() {
      window.parent.postMessage("close", "*");
    });
    var data = JSON.parse(event.data);
    // only run this is it's really a hackpub message. Otherwise, don't trigger.
    if(data.html && data.originalURL && data.hackpubURL) {
      init(data.html, data.originalURL, data.hackpubURL);
    }
  }, false);
}());
