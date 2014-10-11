(function() {
  require(['jquery', 'scrollspy'], function() {
    $(document).ready(function() {
        var bannerPadding = 20;
        $('#bookmarklet-wrapper').scrollspy({
          min: $('#bookmarklet-link').offset().top - bannerPadding,
          max: $('body').height(),
          onEnter: function(element, position) {
              $(".banner").addClass('padded');
              $("#bookmarklet-wrapper").addClass('fixed');
          },
          onLeave: function(element, position) {
              $(".banner").removeClass('padded');
              $("#bookmarklet-wrapper").removeClass('fixed');
          }
        });
    });
  });
})();
