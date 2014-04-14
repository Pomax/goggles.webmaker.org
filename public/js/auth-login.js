(function() {
  var csrf = document.getElementById("require-js").getAttribute("data-csrf");

  var loginEl = document.querySelector('#webmaker-nav .loginbutton');
  var logoutEl = document.querySelector('#webmaker-nav .logoutbutton');

  var auth = window.gogglesAuth = new WebmakerAuthClient({
    csrfToken: csrf,
    prefix: 'webmaker-',
    timeout: 10,
    handleNewUserUI: true
  });

  // Use auth.login and auth.logout to login and out!
  loginEl.addEventListener('click', auth.login);
  logoutEl.addEventListener('click', auth.logout);
}());
