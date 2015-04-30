/**
 * Created by Administrator on 2015/3/26.
 */
define(function () {
    var checkAll=function(checkallid,subbox){
        $(checkallid).click(function(){
            $('input[name='+subbox+']').prop("checked",this.checked);
        });
        var $subBox = $("input[name="+subbox+"]");
        $subBox.click(function(){
            $(checkallid).attr("checked",$subBox.length == $("input[name="+subbox+"]:checked").length ? true : false);
        });

    }


    /**
     * settimeend:倒计时关闭dialog.
     * s:倒计时秒数
     * id：倒计时 dom ID
     * demo:settimeend(3,"domID")
     */
    var settimeend=function(s,id){
        var time=s;
        function closeWindow(){
            var set=window.setTimeout(closeWindow,1000);
            if(time>0){
                document.getElementById(id).innerHTML=" <font color=red>"+time+"</font> 秒后关闭窗口";
                time--;
            }
            else{
                clearTimeout(set)
                $.nmTop().close()
            }
        }
        return closeWindow()
    }


    /**
     * nmdialog:nyromodal弹窗
     * Doc:http://nyromodal.nyrodev.com/
     */
    var nmdialog=function(){
        $('.nyroModal').nyroModal({closeButton: '<a href="#" class="nyroModalClose nyroModalCloseButton nmReposition fa fa-times-circle fa-2x" title="close"></a>'});
    }


    var bindpage=function(){
        $(".fa-check").on("click",function(){
            settimeend(3,"timeend")
        })
        nmdialog()
    }


    /*大图列表*/
    var space=function(){
        nmdialog()
        $(".cmspages-space-content-large-bd").find("li").hover(
            function(){
                $(this).find(".down").stop().animate({bottom:0,opacity:"0.8"},200)
            },
            function(){
                $(this).find(".down").stop().animate({bottom:"-38px",opacity:"0"},200)
            }
        )
    }

    /**
     * selectcity:省市区select.
     * dom:包裹元素id，class
     * demo:selectcity(3,"domID")
     */
    var selectcity=function(dom){
        var first=$(dom).find("select").eq(0),
            md=$(dom).find("select").eq(1),
            last=$(dom).find("select").eq(2);
        $.ajax({
            type:"GET",
            url:"http://api.dangqian.com/apidiqu2/api.asp?format=json&callback=?&id=000000000000",
            dataType:"jsonp",
            success:function(msg){
                first.empty();
                var html;
                $.each(msg.list,function(key,val){
                    html+="<option value="+val.daima+">"+val.diming+"</option>";
                })
                first.append(html)
                first.change()
            }
        })

        $("#s,#c").on("change",function(){
            var s=$(this).val();
            var idd=$(this).attr("name");
            if(s==710000000000 || s==810000000000 || s==820000000000){
                $("#c,#d").empty();
                return
            }
            $.ajax({
                type: "GET",
//                    url: "http://supermanzero.sinaapp.com/city?id="+idd+"&s="+s,
                url:"http://api.dangqian.com/apidiqu2/api.asp?format=json&callback=?&id="+s,
//                    jsonp:"callbackparam",
                dataType:"jsonp",
                success: function(msg){
                    if(idd=="s"){
                        md.empty();
                        var html;
                        $.each(msg.list,function(key,val){
                            html+="<option value="+val.daima+">"+val.diming+"</option>";
                        })
                        md.append(html)
//                            for(c in msg){
//                                var html="<option value="+msg[c][0]+">"+msg[c][1]+"</option>";
//                                $("#c").append(html)
//                            }
                        var index=md.find("option").first().attr("value")
                        $.ajax({
                            type:"GET",
                            url:"http://api.dangqian.com/apidiqu2/api.asp?format=json&callback=?&id="+index,
//                                jsonp:"callbackparam",
                            dataType:"jsonp",
                            success:function(msgg){
                                last.empty();
                                var html;
                                $.each(msgg.list,function(key,val){
                                    html+="<option value="+val.daima+">"+val.diming+"</option>";
                                })
                                last.append(html)
//                                    for(c in msgg){
//                                        var html="<option value="+msgg[c][0]+">"+msgg[c][1]+"</option>";
//                                        $("#d").append(html)
//
//                                    }
                            }
                        })
                    }else{
                        last.empty();
                        var html;
                        $.each(msg.list,function(key,val){
                            html+="<option value="+val.daima+">"+val.diming+"</option>";
                        })
                        last.append(html)
//                            for(c in msg){
//                                var html="<option value="+msg[c][0]+">"+msg[c][1]+"</option>";
//                                $("#d").append(html)
//
//                            }
                    }
                }
            });
        })
    }


    return {
        settimeend:settimeend,
        nmdialog:nmdialog,
        space:space,
        bindpage:bindpage,
        checkAll:checkAll,
        selectcity:selectcity
    };
});