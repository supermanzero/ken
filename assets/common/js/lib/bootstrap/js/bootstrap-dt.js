/**
 * 上传组件
 *
 * @vars 变量以属性的方式在标签中进行定义
 * @param upload-url <string> 上传的路径（必填）
 * @param button-img <string> 上传按钮的图片路径（必填）
 * @param file-size-limit <number> 允许上传的最大文件限制，单位MB，默认4 MB
 * @param file-types <string> 上传文件类型筛选，默认*.*
 * @param file-types-description <string> 文件类型描述，默认All Files
 * @param file-upload-limit <number> 允许上传的最大文件个数，默认无限制
 *
 * @events 事件以参数的方式在upload方法调用时作为参数进行定义
 * @param onFileDialogComplete <function> 当选择文件窗口关闭时触发
 * @param onFileDialogComplete file_count <number> 文件数量
 *
 * @param onUploadStart <function> 当文件开始上传时触发
 * @param onUploadStart file <object> 上传的文件对象
 *
 * @param onUploadProgress <function> 文件上传进度监听接口
 * @param onUploadProgress file <object> 上传的文件对象
 * @param onUploadProgress bytesComplete <number> 已上传的比特数
 * @param onUploadProgress bytesTotal <number> 总的比特数
 *
 * @param onUploadSuccess <function> 当文件上传成功时触发
 * @param onUploadSuccess file <object> 上传的文件对象
 * @param onUploadSuccess serverData <string> 服务端返回的消息
 *
 * @param onUploadError <function> 当文件上传失败时触发
 * @param onUploadError code <number> 错误代码
 * @param onUploadError message <string> 错误信息
 * @param onUploadError file <object, null> 出错的文件，如果不是上传过程中的错误，则该值为null
 *
 * @param onUploadComplete <function> 当文件上传结束时触发，该触发在success或error之后
 * @param onUploadComplete file <object> 上传完成的文件
 *
 * @param onFileQueued <function> 当文件选择框结束时，swfupload会将每个文件加入上传队列，这时候每个加入队列的文件都会触发一次事件
 * @param onFileQueued file <object> 加入队列的文件
 *
 * @return <object> swfUpload对象
 *
 * @tips
 * @serverData 服务器返回的数据建议格式为{error:0, key1: val1, key2: val2}、{error:1, message: 错误原因}
 * @error_code http://www.leeon.me/upload/other/swfupload.html#queue_error
 * @recommend 建议重写onUploadError方法，在上传出错的时候给予用户明显的提示
 *
 */
$.fn.upload = function(param){
    var ERROR = {
        QUEUE: {
            '-100': '选择的文件数量超过限制',
            '-110': '选择的文件大小超过限制',
            '-120': '不允许上传空文件',
            '-130': '无效的文件类型'
        },
        UPLOAD: {
            '-200': 'HTTP错误',
            '-210': '缺少上传地址',
            '-220': 'IO出错',
            '-230': '安全出错',
            '-240': '上传上限超出',
            '-250': '上传失败',
            '-260': '指定的ID未找到',
            '-270': '文件未通过验证',
            '-280': '上传被取消',
            '-290': '上传被中止'
        }
    };
    var STATUS = {
        FILE: {
            '-1': '等待中',
            '-2': '上传中',
            '-3': '上传出错',
            '-4': '上传成功',
            '-5': '已取消'
        }
    };
    var $this = $(this);
    var button_width = $this.width() +
        parseFloat($this.css('paddingLeft') || 0) +
        parseFloat($this.css('paddingRight') || 0) +
        parseFloat($this.css('borderLeftWidth') || 0) +
        parseFloat($this.css('borderRightWidth') || 0);
    var button_height = $this.height() +
        parseFloat($this.css('paddingTop') || 0) +
        parseFloat($this.css('paddingBottom') || 0) +
        parseFloat($this.css('borderTopWidth') || 0) +
        parseFloat($this.css('borderBottomWidth') || 0);
    var settings = {
        post_params:{PHPSESSID:$.cookie('PHPSESSID')},
        flash_url:"/js/swfupload/swfupload.swf",
        upload_url: $this.attr('upload-url'),
        file_size_limit: ($this.attr('file-size-limit') || 4) + ' MB',
        file_types: $this.attr('file-types') || "*.*",
        file_types_description: $this.attr('file-types-description') || "All Files",
        file_upload_limit: $this.attr('file-upload-limit') || 0,
        file_queue_limit: 0,
        debug: false,
        button_image_url: $this.attr('button-img'),
        button_width: button_width,
        button_height: button_height,
        button_placeholder_id: $this.attr('id'),
        button_cursor : SWFUpload.CURSOR.HAND,
        moving_average_history_size: 40,
        custom_settings: {
            onFileDialogComplete: function() {
                this.startUpload();
            },
            onUploadProgress: function() {
                console.log();
            },
            onUploadError: function(file, code, message) {
                if (file) {
                    throw '上传错误! 上传文件（{0}）时发生错误，错误代码：{1}，错误信息：{2}'.format(
                        file.name, code, message
                    );
                } else {
                    throw '上传错误！错误代码：{0}，错误信息：{1}'.format(
                        code, message
                    );
                }
            }
        },
        upload_error_handler: function(file, errorCode, message) {alert(222);
            if (this.customSettings.onUploadError) {
                this.customSettings.onUploadError.call(this, file, errorCode, ERROR.UPLOAD[errorCode]);
            }
        },
        file_queue_error_handler: function(file, errorCode, message) {
            if (this.customSettings.onUploadError) {
                this.customSettings.onUploadError.call(this, file, errorCode, ERROR.QUEUE[errorCode]);
            }
        },
        upload_progress_handler: function(file, bytesComplete, bytesTotal) {
            file.status = file.filestatus;
            file.message = STATUS.FILE[file.status];
            if (this.customSettings.onUploadProgress) {
                this.customSettings.onUploadProgress.call(this, file, bytesComplete, bytesTotal);
            }
        },
        upload_success_handler: function(file, serverData) {
            var data;
            eval('data = ' + serverData);
            if ('object' === typeof data && data.error) {
                if (this.customSettings.onUploadError) {
                    this.customSettings.onUploadError.call(this, file, -250, data.message);
                }
            } else {
                if (this.customSettings.onUploadSuccess) {
                    this.customSettings.onUploadSuccess.call(this, file, data);
                }
            }
        }
    };
    $.extend(settings.custom_settings, param);
    settings.file_dialog_complete_handler = settings.custom_settings.onFileDialogComplete;
    settings.file_queued_handler = settings.custom_settings.onFileQueued;
    settings.upload_start_handler = settings.custom_settings.onUploadStart;
    settings.upload_complete_handler = settings.custom_settings.onUploadComplete;
    if (undefined === settings.upload_url) {
        throw '上传组件未指定接收文件的服务端地址(upload-url)';
    }
    if (undefined === settings.button_image_url) {
        throw '上传组件未指定用于渲染按钮的图片(button-img)';
    }
    try{
        new SWFUpload(settings);
    } catch (e) {
        $.getScript('/js/swfupload/swfupload.js', function(){
            new SWFUpload(settings);
        });
    }
};

/**
 * flash组件
 * @param param <object>
 * @param param onLoad <function> 当flash加载完成时触发，如果需要使用swf对象，可以在函数中使用this.swf进行操作
 * @param param
 */
$.fn.flash = function (param) {
    var $this = $(this);
    var swfVersionStr = "9.0.0";
    var xiSwfUrlStr = "/swfupload/expressInstall.swf";
    var flashvars = {};
    var params = {};
    params.quality = "high";
    params.bgcolor = "#FFFFFF";
    params.allowscriptaccess = "always";
    params.allowfullscreen = "true";
    params.wmode = "transparent";

    var attributes = {id: $this.attr('id'), name: 'player', align: 'middle'};
    var loadSwf = function(){
        this.swf = swfobject.embedSWF(
            $this.attr('swf'),
            $this.attr('id'),
            $this.width(),
            $this.height(),
            swfVersionStr,
            xiSwfUrlStr,
            flashvars,
            params,
            attributes
        );
    };
    var onLoad = function(){
        try {
            param.onload && param.onload.call(param.scope, param.params);
        } catch (e) {
            setTimeout(onLoad, 10);
        }
    };
    try{
        loadSwf()
    } catch (e) {
        $.getScript('/swfobject/swfobject.js', function(){
            loadSwf();
        });
    }
    onLoad();
};

/**
 * 树形组件
 */
$.fn.tree = function () {
    var $tree = $(this);
    var $li = $tree.find('li');
    $.each($li, function(){
        var $this = $(this);
        if (!$this.hasClass('leaf') && !$this.hasClass('expand')) {
            $this.find('> ul').hide();
        }
    });
    $li.bind('click', function (e) {
        var $this = $(this);
        var $target = $(e.target);
        if ($this.children('ul').length) {
            var $header = $this.children(':first');
            var $icon = $header.children(':first');
            var $ul = $header.next();
            var toggle_on_icon = !!$this.find('> span a').length;
            if (!(toggle_on_icon && !$target.is($icon)) && !(!toggle_on_icon && !$header.find($target).length)) {
                if ($this.hasClass('expand')) {
                    $this.removeClass('expand');
                    $icon.removeClass('icon-minus').addClass('icon-plus');
                    $ul.hide();
                } else {
                    $this.addClass('expand');
                    $icon.removeClass('icon-plus').addClass('icon-minus');
                    $ul.show();
                }
            }
        }
        if ('a' === $target.get(0).tagName.toLowerCase() && !$this.hasClass('active')) {
            $tree.find('.active').removeClass('active');
            //$this.addClass('active');
        }
        return false;
    });
};

/**
 * 多级列表
 * @param param hideAfterClick <boolean|true> 点击后是否隐藏列表，默认为隐藏
 */

$.fn.multilist = function(param){
    var $li = $(this).find('li');
    $li.bind('mouseenter', function () {
        var $this = $(this);
        var width = $(this).width();
        var height = $(this).height();
        $(this).find('> ul').css({
            top: -1, left: width
        }).show();
    }).bind('mouseleave', function () {
        $(this).find('> ul').hide();
    });
    param = param || {};
    if (false == param.hideAfterClick) {
        $li.bind('click', function (e) {
            var $target = $(e.target);
            if ('a' == $target.get(0).tagName.toLowerCase()) {
                $li.removeClass('active');
                $(this).addClass('active');
            }
            return false;
        });
    }
};

$(document).ready(function(){
    $.browser = {};
    $.browser.mozilla = /firefox/.test(navigator.userAgent.toLowerCase());
    $.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
    $.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
    $.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
    $.browser.safari = /safari/.test(navigator.userAgent.toLowerCase()) && !$.browser.webkit;
    if ($.browser.mozilla) {
        $.browser.version = navigator.userAgent.match(/firefox\/([0-9\.]+)/i)[1];
    } else if ($.browser.webkit) {
        $.browser.version = navigator.userAgent.match(/webkit\/([0-9\.]+)/i)[1];
    } else if ($.browser.opera) {
        $.browser.version = navigator.userAgent.match(/opera\/([0-9\.]+)/i)[1];
    } else if ($.browser.msie) {
        $.browser.version = navigator.userAgent.match(/msie\s([0-9\.]+)/i)[1];
    } else if ($.browser.safari) {
        $.browser.version = navigator.userAgent.match(/safari\/([0-9\.]+)/i)[1];
    }
    if ($.browser.msie && (parseFloat($.browser.version) < 8)){
        $('.bad-ie')
            .show().alert()
            .find('.btn-danger').bind('click', function(){
            $(this).parents('.alert').children(':first').trigger('click');
        });
    }

   // $('.modal-dialog').draggable({handle: '.modal-header .modal-title'});

    $(window).resize(function(){
        var $fluid = $('.fixed-fluid').find('.span-fluid');
        var $no_fluid = $fluid.siblings();
        var fixed_width = 0;
        $.each($no_fluid, function(){
            fixed_width += $(this).width();
            fixed_width += parseInt($(this).css('paddingLeft')) || 0;
            fixed_width += parseInt($(this).css('paddingRight')) || 0;
            fixed_width += parseInt($(this).css('marginLeft')) || 0;
            fixed_width += parseInt($(this).css('marginRight')) || 0;
            fixed_width += parseInt($(this).css('borderLeft')) || 0;
            fixed_width += parseInt($(this).css('borderRight')) || 0;
        });
        fixed_width += parseInt($fluid.css('paddingLeft')) || 0;
        fixed_width += parseInt($fluid.css('paddingRight')) || 0;
        fixed_width += parseInt($fluid.css('marginLeft')) || 0;
        fixed_width += parseInt($fluid.css('marginRight')) || 0;
        fixed_width += parseInt($fluid.css('borderLeft')) || 0;
        fixed_width += parseInt($fluid.css('borderRight')) || 0;
        $fluid.width($fluid.parent().width() - fixed_width);
    }).trigger('resize');
});