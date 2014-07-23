var ItemsManager = function() {
  var manager = this;
  var items = [];
  var STORAGE_KEYS = {
    email: 'auth.email',
    session_token: 'auth.session_token',
    confirmed: 'auth.confirmed'
  };
  manager.auth_email = localStorage.getItem(STORAGE_KEYS.email);
  manager.auth_session_token = localStorage.getItem(STORAGE_KEYS.session_token);

  var Item = function(_doi, $_elt) {
    var _this = this;

    var BASE_CROSSREF_URL = "http://api.crossref.org/works/";
    var BASE_OAB_URL = "https://openaccessbutton.org/apiv2/";
    var OAB_DOI_STUMBLE_URL = BASE_OAB_URL + "doi_stumble/";
    var OAB_BLOCKED_URL = BASE_OAB_URL + "blocked/";

    _this.doi = _doi;
    _this.$elt = $_elt;

    _this.fetchFromCrossRef = function() {
      if(!_this.doi) {
        return;
      }

      $.ajax({
        type: "GET",
        url: BASE_CROSSREF_URL + _this.doi
      }).success(function(data) {
        var message = data.message;
        console.log("SUCCESS", message);
        _this.sendToOAB(message);
      }).error(function(data) {
        console.log("ERROR", data);
      });
    };

    _this.sendToOAB = function(data) {
      if(!_this.doi || !manager.auth_email || !manager.auth_session_token) {
        return;
      }

      $.ajax({
        type: "POST",
        url: OAB_DOI_STUMBLE_URL,
        data: {
          email: manager.auth_email,
          session_token: manager.auth_session_token,
          data: JSON.stringify(data)
        },
      }).success(function(data) {
        // nothing to do
      }).error(function(data) {
        // handle error
      });
    };

    _this.fetchFromOAB = function() {
      if(!_this.doi || !manager.auth_email || !manager.auth_session_token) {
        return;
      }

      $.ajax({
        type: "GET",
        url: OAB_BLOCKED_URL,
        data: {
          email: manager.auth_email,
          session_token: manager.auth_session_token,
          doi: _this.doi,
          url: window.location.href,
        },
      }).success(function(data) {
        console.log("data:", data);
        var nbOfBlocks = data.block_count;
        var eltContent = "";
        if(nbOfBlocks > 0) {
          eltContent = "(" + nbOfBlocks + " blocks)";
        } else {
          eltContent = "no blocks";
        }
        _this.$elt.after(
          $('<span>').addClass('oab-signalling-doi')
            .text(eltContent)
        );
    }).error(function(data) {
        // handle error
      });
    };

  };

  manager.add = function(_doi, $_elt) {
    var item = new Item(_doi, $_elt);
    items.push(item);
    item.fetchFromCrossRef();
    item.fetchFromOAB();
  };
};


$(document).ready(function(){
    itemsManager = new ItemsManager();

  $("a[href='/wiki/Digital_object_identifier']").next('a.external').each(function() {
    var doi = $(this).text();
    console.log("DOI: ", doi);
    itemsManager.add(doi, $(this));
  });

});