$(function(){
    var start = {};
    start.init = function(){
        $('.index-content').hide();
        this.createNode();
        this.startAnimate();
    };
    start.createNode = function(){
        var winWidth = $(window).width(),
            winHeight = $(window).height(),
            nodeNum = 50,
            nodeRowNum = 10,
            nodeListNum = 5,
            nodeWidth = winWidth / nodeRowNum,
            nodeHeight = winHeight / nodeListNum,
            $startNode = '<div class="start-node" style="float:left; width: ' + nodeWidth + 'px; height:' + nodeHeight + 'px; background: #7ddafc;"></div>',
            $startBox = $('.start-box');
        var addNode = ''
        for(var i = 0; i < nodeNum; i++){
            addNode += $startNode;
        }
        $startBox.append(addNode);
    };
    start.animateFcun = function(element){
            element.each(function(){
                d = Math.random()*2000; //1ms to 2000ms delay
                $(this).delay(d).animate({opacity: 0}, {
                    step: function(n){
                        s = 1-n; //scale - will animate from 0 to 1
                        $(this).css("transform", "scale("+s+")");
                    },
                    duration: 1000
                }).promise().done(function(){
                    $('.index-content').delay(1860).fadeIn(2000);
                    $('.start-box').delay(2500).fadeOut();
                })
            })
    };
    start.startAnimate = function(){
        var startNode = $('.start-node');
        than = this;
        var animateGo = function(){
            than.animateFcun(startNode);
        };
        $('.start-logo').fadeIn(3000,function(){
            $('.start-logo').delay(200).fadeOut(1200);
            animateGo();
            //setTimeout(animateGo,200);
        })


    }
    start.init();

})