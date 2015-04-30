/**
 * Created by Colin on 2015/3/23.
 * 首页菜单动画
 */

$(function(){
    $(".contant-menu").find("a").hover(
        function(){
            $(this).addClass("on")
        },
        function(){
            $(this).removeClass("on")
        }
    )

    $(".ebook").hover(
        function(){
            $(this).find("img").stop().animate({
                width:600
            }, 300);
        },
        function(){
            $(this).find("img").stop().animate({
                width:574
            }, 300);
        }
    )

    $(".teach").hover(
        function(){
            $(this).find("img").stop().animate({
                width:235
            }, 300);
        },
        function(){
            $(this).find("img").stop().animate({
                width:222
            }, 300);
        }
    )

    var settimes;
    $(".blackboard").hover(
        function(){
            var that=$(this);
            that.find("img").stop().animate({right:-40}, 600).animate({right:-20}, 600).animate({right:-40}, 600).animate({right:-20}, 600)
            settimes=setInterval(function(){
                that.find("img").stop().animate({right:-40}, 600).animate({right:-20}, 600).animate({right:-40}, 600).animate({right:-20}, 600)
                console.log(12)
            },3600)
        },
        function(){
            clearInterval(settimes)
            $(this).find("img").stop().animate({right:-20}, 600);
        }
    )

    $(".footer-bd-link div").hover(
        function(){
            $(this).addClass("on")
        },
        function(){
            $(this).removeClass("on")
        }
    )
})