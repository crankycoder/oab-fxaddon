var Auth = function() {
  var _this = this;
  var BASE_OA_URL = "https://openaccessbutton.org/apiv2/";
  var STORAGE_KEYS = {
    email: 'auth.email',
    session_token: 'auth.session_token',
    confirmed: 'auth.confirmed'
  };
  var state = null;
  var STATES = {
    guest: 'GUEST',
    pending: 'PENDING',
    confirmed: 'CONFIRMED'
  };
  _this.email = null;
  _this.session_token = null;
  _this.isConfirmed = false;

  _this.reset = function() {
    _this.email = null;
    _this.session_token = null;
    _this.isConfirmed = false;
    _this.email = localStorage.removeItem(STORAGE_KEYS.email);
    _this.session_token = localStorage.removeItem(STORAGE_KEYS.session_token);
    _this.isConfirmed = localStorage.removeItem(STORAGE_KEYS.confirmed);
    updateUI();
  };

  var updateState = function() {
    _this.email = localStorage.getItem(STORAGE_KEYS.email);
    _this.session_token = localStorage.getItem(STORAGE_KEYS.session_token);
    _this.isConfirmed = localStorage.getItem(STORAGE_KEYS.confirmed);

    if(_this.email && _this.session_token) {
      if(_this.isConfirmed) {
        state = STATES.confirmed;
      } else {
        state = STATES.pending;
      }
      return;
    }

    state = STATES.guest;
  };

  var updateUI = function() {
    updateState();

    $(".row-state").hide();
    switch(state) {
      case STATES.confirmed:
        $("#row-state-ready").show();
      break;
      case STATES.pending:
        $("#row-state-pending").show();
        window.setInterval(_checkSessionConfirmation, 10000);
      break;
      case STATES.guest:
        $("#row-state-signup").show();
      break;
    }
  };

  var guid = function() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g,
      function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      }
    );
  };

  _this.signup = function(_email) {
    _this.isConfirmed = false;
    _this.email = _email;
    localStorage.setItem(STORAGE_KEYS.email, _this.email);
    _this.session_token = guid();
    localStorage.setItem(STORAGE_KEYS.session_token, _this.session_token);

    $.ajax({
      type: "POST",
      url: BASE_OA_URL + 'register/',
      data: {
        email: _this.email,
        session_token: _this.session_token
      },
    }).success(function(data) {
      // nothing to do
    }).error(function(data) {
      // TODO: handle that better
      _this.reset();
    });
    updateUI();
  };

  _this._checkSessionConfirmation = function() {
   $.ajax({
    type: "GET",
    url: BASE_OA_URL + 'register/',
    data: {
      email: _this.email,
      session_token: _this.session_token
    },
    }).success(function(data) {
      // the user is confirmed
      _this.isConfirmed = true;
      localStorage.setItem(STORAGE_KEYS.isConfirmed, _this.isConfirmed);
    }).error(function(data) {
      // TODO: handle that better
      _this.reset();
    });

    updateUI();
  };

  _this.init = function() {
    updateUI();
  };
};


$(document).ready(function(){
  var userAuth = new Auth();
  userAuth.init();

  $authForm = $('#auth-form');
  $authInput = $('#user-email');
  $authForm.bind('submit', function(ev) {
    ev.preventDefault();
    userAuth.signup($authInput.val());
  });

  $authCheckConfirm = $('#auth-check-confirm');
  $authCheckConfirm.bind('click', function(ev) {
    ev.preventDefault();
    userAuth._checkSessionConfirmation();
  });

});
