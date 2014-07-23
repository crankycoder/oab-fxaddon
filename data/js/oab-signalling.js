$(document).ready(function(){
    itemsManager = new ItemsManager();

  $("a[href='/wiki/Digital_object_identifier']").next('a.external').each(function() {
    var doi = $(this).text();
    console.log("DOI: ", doi);
    itemsManager.add(doi, $(this));
  });

});
