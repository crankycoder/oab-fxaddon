$(function() {
  $("a[href='/wiki/Digital_object_identifier']").next('a.external').each(function() {
    console.log($(this), $(this).text());
    $(this).after(
      $('<span>').addClass('oab-signalling-doi')
        .text('foobar')
    );

  });
});
