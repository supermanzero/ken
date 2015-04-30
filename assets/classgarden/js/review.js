$(function(){
    var $_review = $('.review');
    $_review.on('click', function(){
        var controls =  $(this).attr('aria-controls'),
            labelledby = $("[aria-labelledby = " + controls + "]");
        if(!labelledby.hasClass('open')){
            labelledby.show().addClass('open');
        }
        else{
            labelledby.hide().removeClass('open');
        }
    })
})