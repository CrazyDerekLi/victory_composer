(function(){
    $.MyProgressItem = function(options){
        this.box = options.box;
        this.id = options.id||'';
        this.labelHeight = options.labelheight||20;
        this.progressHeight = options.progressHeight||10;
        this.progressColor = options.progressColor||'#7bc9ea';
        this.progressBgColor = options.progressBgColor||'#ccc';
        this.value = options.value||0;
        this.bgValue = options.bgValue||1;
        this.initBox();
    };
    $.MyProgressItem.prototype.initBox = function(){
        var _this = this;
        if(this.id){
            this.box = $("#"+this.id);
        }
        if(this.box){
            this.box.addClass("progress_box").css({
                height:this.labelHeight+this.progressHeight+10
            }).html("");
            this.labelBox = $('<div>').addClass("progress_label").css({
                height:this.labelHeight
            });
            this.leftLabel = $('<div>').addClass('label_left').css({
                height:this.labelHeight,
                'line-height':this.labelHeight+"px"
            });
            this.rightLabel = $('<div>').addClass('label_right').css({
                height:this.labelHeight,
                'line-height':this.labelHeight+"px"
            });
            this.labelBox.append(this.leftLabel).append(this.rightLabel);
            this.progressObj = $("<div>").addClass("progress").css({
                height:this.progressBg,
                "background":this.progressColor,
                "width":0
            });
            this.progressBg = $("<div>").addClass("progress_bg").css({
                height:this.progressBg,
                "background":this.progressBgColor,
                "width":0
            });
            this.keduBox = $('<div class="progress_kedu">').css({
                "border-bottom-color":this.progressBgColor
            });
            this.line = $('<div class="progress_line">').css({
                "background":this.progressBgColor
            });
            this.keduBox.append(this.line);
            this.box.append(this.labelBox);
            this.box.append(this.progressObj);
            this.box.append(this.progressBg);
            this.box.append(this.keduBox);
            $(window).resize(function(){
                _this.resizeLabelPosition();
            });
            this.loadData(this.value,this.bgValue);
        }
    };
    $.MyProgressItem.prototype.loadData = function(value,bgValue){
        var _this = this;
        this.value = value;
        this.bgValue = bgValue;
        _this.leftLabel.html("");
        _this.rightLabel.html("");
        _this.keduBox.hide();
        var maxCount = value>bgValue?value:bgValue;
        var bgWidth = bgValue*100/maxCount;
        var valWidth = value*100/maxCount;
        _this.progressObj.css({
            width:0
        });
        this.progressBg.css({
            width:0
        });

        this.progressBg.animate({
            width:bgWidth+"%"
        },function(){
            if(value>bgValue){
                _this.keduBox.show();
                _this.keduBox.css({
                    left:bgWidth+"%"
                });
            }
            _this.progressObj.animate({
                width:valWidth+"%"
            },function(){
                _this.resizeLabelPosition();
            });
        });
    };
    $.MyProgressItem.prototype.resizeLabelPosition = function(){
        var _this = this;
        var value = this.value;
        var bgValue = this.bgValue;
        var _right1 = _this.box.width();

        var maxCount = value>bgValue?value:bgValue;
        var _left_label_right = (maxCount - (value<=bgValue?value:bgValue))*100/maxCount ;
        var leftLabelWidth = 0;
        if(value>bgValue){
            _this.leftLabel.html("").append($("<div>").addClass("progress_temp").css({background:_this.progressBgColor,"top":(this.labelHeight-12)/2-1+'px'})).append(bgValue).css({
                color:_this.progressBgColor
            });
            _this.rightLabel.html("").append($("<div>").addClass("progress_temp").css({background:_this.progressColor,"top":(this.labelHeight-12)/2-1+'px'})).append(value).css({
                color:_this.progressColor
            });
            leftLabelWidth = _this.leftLabel.outerWidth();
            _right1 = _right1 - _this.progressBg.width()-leftLabelWidth/2;
        }else{
            _this.leftLabel.html("").append($("<div>").addClass("progress_temp").css({background:_this.progressColor,"top":(this.labelHeight-12)/2-1+'px'})).append(value).css({
                color:_this.progressColor
            });
            _this.rightLabel.html("").append($("<div>").addClass("progress_temp").css({background:_this.progressBgColor,"top":(this.labelHeight-12)/2-1+'px'})).append(bgValue).css({
                color:_this.progressBgColor
            });
            _this.leftLabel.css({
                right:_left_label_right+"%"
            });
            leftLabelWidth = _this.leftLabel.outerWidth();
            _right1 = _right1 - _this.progressObj.width()-leftLabelWidth/2;
        }
        var _right = _this.rightLabel.outerWidth();
        _this.leftLabel.css({
            display:'inline-block'
        });
        if(_right<_right1 && _this.box.width()-_right1>=leftLabelWidth){
            _this.leftLabel.css({
                right:_left_label_right+"%",
                'margin-right':-_this.leftLabel.width()/2
            });
        }else if(_this.box.width()-_right1<leftLabelWidth){
            console.log(2);
            _this.leftLabel.css({
                right:_this.box.width()-leftLabelWidth,
                'margin-right':0
            });
        }else{
            console.log(_right);
            _this.leftLabel.css({
                right:_right,
                'margin-right':0
            });
        }
    };

}());