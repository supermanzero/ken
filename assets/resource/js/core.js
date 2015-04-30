/**
 * Created by Administrator on 2015/4/24.
 */
define(["easyui/easyloader","lib/dialog"],function () {
    var resource=resource || {};

    resource.dialog=function(){
        $('.nyroModal').nyroModal({closeButton: '<a href="#" class="nyroModalClose nyroModalCloseButton nmReposition fa fa-times-circle fa-2x" title="close"></a>'});
    };

    resource.init=function(){
        $(".pub-list-pic").find("li").hover(
            function(){
                $(this).find(".down").stop().animate({bottom:0,opacity:"0.8"},200)
            },
            function(){
                $(this).find(".down").stop().animate({bottom:"-38px",opacity:"0"},200)
            }
        )
        resource.dialog()
    }

    return resource
});