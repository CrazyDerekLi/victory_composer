/**
 * Created by 李鑫 on 17/9/5.
 */

(function(){
    $.DragUtil = {
        getContainer:function(){
            return $("#dragContainer");
        }
    };
    $.DragUtil.saveAll = function(container){
        var result = {
            //typeList : $.DragUtil.typeList,
            data:[]
        };
        container.find(".drag_move_o").each(function(ind,val){
            var o = {};
            o.position = $(val).data("position");
            o.data = $(val).data("data");
            o.dragType = $(val).data("dragType");
            if(o.dragType == "text"){
                o.textValue = $(val).data("textValue");
            }
            result.data.push(o);
        });
        return result;
    };
    $.DragUtil.loadSaveData = function(saveData){
        if(saveData){
            for(i=0;i<saveData.data.length;i++){
                o = saveData.data[i];
                var _options = {
                    x: o.position.x,
                    y: o.position.y,
                    w: o.position.w,
                    h: o.position.h,
                    dragType:o.dragType,
                    data:o.data
                };
                if(o.dragType == "text"){
                    _options.textValue = o.textValue;
                }
                var dragMoveO = new $.DragMoveO(_options);
                this.getContainer().append(dragMoveO.box);
            }
        }
    };
    $.DragUtil.beforeInit = function(options){
        return true;
    };
    $.DragUtil.defaultTool = {
        iconCls:'destroy_btn',
        clickEvent:function(e,obj){
            obj.destroyAll();
        }
    };
    $.DragUtil.typeList = {
        div:{
            head:function(){
                return "div";
            },
            body:function(val){
                return $("<div>");
            }
        },
        iframe:{
            head:function(){
                return "iframe";
            },
            body:function(val){
                if(val.link){
                    return $("<iframe>").attr("src",val.link).css({
                        display:"block",
                        position:"relative",
                        border:"none",
                        width:'100%',
                        height:'100%'
                    });
                }
                return $("<div>").html(val.name+"--"+val.id);
            }
        },
        img:{
            head:function(){
                return "img";
            },
            body:function(val){
                return $("<img>").attr("src",val.url).css({
                    width:20,
                    height:20,
                    display:"block"
                });
            }
        },
        text:{
            head:function(){
                return "text";
            },
            body:function(val){
                return $("<img>").attr("src",val.url).css({
                    width:20,
                    height:20,
                    display:"block"
                });
            }
        }
    };
    $.DragO = function(options){
        this.box = $('<div>').addClass("drag_o").data("options",options);
        this.nameKey = options.nameKey||"name";
        this.data = options.data||{name:1};
        this.dragType = options.dragType||"div";
        this.formatter = options.formatter||function(val){
            return val[this.nameKey];
        };
        this.box.html(this.formatter(this.data));
    };
    $.DragMoveO = function(options){
        var _this = this;
        this.x = options.x||0;
        this.y = options.y||0;
        this.w = options.w||100;
        this.h = options.h||100;
        this.textValue = options.textValue||'';
        this.dragType = options.dragType||"div";//div-text-img-iframe
        this.formatterBody = options.formatterBody||function(val){
            return "";
        };
        this.data = options.data||{};
        this.body = $("<div>").addClass("drag_move_body");
        this.head = $("<div>").addClass("drag_move_head").html($.DragUtil.typeList[this.dragType].head());
        this.tools = $("<div>").addClass("drag_move_tools");
        this.head.append(this.tools);
        this.head.dblclick(function(){
            _this.x = 0;
            _this.y = 0;
            _this.w = '100%';
            _this.h = '100%';
            _this.resizeAndMove();
        });
        var _o = $.DragUtil.defaultTool;
        var _btn = $("<a>").addClass("drag_tool").addClass(_o.iconCls);
        _btn.data("clickEvent", _o);
        _btn.click(function(e){
            $(this).data("clickEvent").clickEvent(e,$(this).parents(".drag_move_o").first().data("obj"));
        });
        this.tools.append(_btn);


        var tools = $.DragUtil.typeList[this.dragType].tools;
        if(tools&&tools.length>0){
            for(var i=0;i<tools.length;i++){
                var o = tools[i];
                var btn = $("<a>").addClass("drag_tool").addClass(o.iconCls);
                btn.data("clickEvent", o);
                btn.click(function(e){
                    $(this).data("clickEvent").clickEvent(e,$(this).parents(".drag_move_o").first().data("obj"));
                });
                this.tools.append(btn);
            }
        }

        this.bodyMask = $("<div>").addClass("body_mask");

        var position = {
            x:this.x,
            y:this.y,
            w:this.w,
            h:this.h
        };
        var dragFlag = false;
        this.box = $('<div>')
            .addClass("drag_move_o")
            .data("position",position)
            .data("data",this.data)
            .data("dragType",this.dragType)
            .data("textValue",this.textValue)
            .append(this.head)
            .append(this.body)
            .append(this.bodyMask)
            .css({
                width:this.w,
                height:this.h,
                left:this.x,
                top:this.y
            })
            .draggable({
                handle:'.drag_move_head',
                onStartDrag:function(){
                    _this.bodyMask.show();
                    _this.head.css({
                        opacity:0.3
                    });
                    dragFlag = true;
                },
                onStopDrag:function(){
                    _this.bodyMask.hide();
                    _this.head.css({
                        opacity:1
                    });
                    dragFlag = false;
                    var x = $(this).position().left;
                    var y = $(this).position().top;
                    var _p = $(this).data("position");
                    var container = $.DragUtil.getContainer();
                    var maxX = container.width();
                    var maxY = container.height();
                    _p.x = x<0?0:x>maxX?maxX-28:x;
                    _p.y = y<0?0:y>maxY?maxY-28:y;
                    $(this).css({
                        left:_p.x,
                        top:_p.y
                    });
                    $(this).data("position",_p);
                }
            })
            .resizable({
                handles:'n, e, s, w, ne, se, sw,nw',
                onStartResize:function(){
                    _this.bodyMask.show();
                },
                onStopResize:function(e){
                    _this.bodyMask.hide();
                    var w = $(this).width();
                    var h = $(this).height();
                    var x = $(this).position().left;
                    var y = $(this).position().top;
                    var _p = $(this).data("position");
                    _p.w = w;
                    _p.h = h;
                    _p.x = x;
                    _p.y = y;
                    var container = $.DragUtil.getContainer();
                    var maxX = container.width();
                    var maxY = container.height();
                    _p.x = x<0?0:x>maxX?maxX-28:x;
                    _p.y = y<0?0:y>maxY?maxY-28:y;
                    $(this).css({
                        left:_p.x,
                        top:_p.y
                    });
                    $(this).data("position",_p);

                }

            })
            .mouseover(function(e){
                $("#dragContainer").find(".drag_move_o").removeClass("selected");
                $(this).addClass("selected");
            })
            .mouseleave(function(e){
                if(!dragFlag){
                    $("#dragContainer").find(".drag_move_o").removeClass("selected");
                }
            });
        if(this.dragType == "text"){
            this.box.addClass("drag_move_input");
            this.inputBox = $("<div>").addClass('drag_move_input_box');
            this.input = $('<textarea>').val(this.textValue);
            this.input.click(function(){
                $(this).focus();
            }).change(function(){
                _this.textValue = $(this).val();
                _this.box.data("textValue", _this.textValue);
            });
            this.body.append(this.inputBox);
            this.inputBox.append(this.input);
        }else{
            this.body.append($.DragUtil.typeList[this.dragType].body(this.data));
        }
        this.box.data("obj",this);
    };
    $.DragMoveO.prototype.resizeAndMove = function(setting){
        var x = this.x;
        var y = this.y;
        var w = this.w;
        var h = this.h;
        if(setting){
            x = setting.x==undefined?x:setting.x;
            y = setting.y==undefined?y:setting.y;
            w = setting.w==undefined?w:setting.w;
            h = setting.h==undefined?h:setting.h;
        }
        this.box.data("position",{
            x:x,
            y:y,
            w:w,
            h:h
        });
        this.box.css({
            left:x,
            top:y,
            width:w,
            height:h
        });
    };
    $.DragMoveO.prototype.destroyAll = function(){
        this.box.remove();
        delete this;
    };
    $.DragMoveO.prototype.syncUI = function(){
        this.body.html($.DragUtil.typeList[this.dragType].body(this.data));
    };
    $(function(){
        var start = false;
        var moveObj = undefined;
        $("body").delegate(".drag_o","mousedown",function(e){
            e.preventDefault();
            start = true;
            if(!moveObj){
                moveObj = $("<div>").addClass("drag_o_clone");
                moveObj.appendTo($("body"));
            }
            moveObj.css({
                left: e.pageX,
                top: e.pageY
            });
            moveObj.html($(this).clone());
            moveObj.data("data",$(this).data("options"));
        }).delegate("*","mousemove",function(e){
            e.preventDefault();
            if(start&&moveObj){
                moveObj.css({
                    left: e.pageX,
                    top: e.pageY
                });
            }

        })
        //.mouseleave(function(e){
        //    if(start&&moveObj){
        //        start = false;
        //        moveObj.html("");
        //    }
        //})
        .delegate("*","mouseup",function(e){
            e.preventDefault();
            if(start&&moveObj){
                start = false;
                var container = $.DragUtil.getContainer();
                var containerArea = {
                    xStart:container.offset().left,
                    xEnd:container.offset().left+container.width(),
                    yStart:container.offset().top,
                    yEnd:container.offset().top+container.height()
                };
                if(
                    e.pageX>=containerArea.xStart
                    &&e.pageX<=containerArea.xEnd
                    &&e.pageY>=containerArea.yStart
                    &&e.pageY<=containerArea.yEnd
                ){
                    var data = moveObj.data("data");
                    var _options = {
                        x: e.pageX - containerArea.xStart,
                        y: e.pageY - containerArea.yStart,
                        w: 100,
                        h: 100,
                        dragType:data.dragType,
                        data:data.data
                    };
                    var flag = $.DragUtil.beforeInit(_options);
                    if(flag){
                        var dragMoveO = new $.DragMoveO(_options);
                        container.append(dragMoveO.box);
                    }

                }
                moveObj.html("");
            }
        });
    });
}());