(function(){
    $.MyTab = function(options){
        this.ul = undefined;
        this.ulBox = undefined;
        this.leftBtn = undefined;
        this.rightBtn = undefined;
        this.maxWidth = 0;
        this.left = 0;
        this.right = 0;

        this.id = options.id||'';
        this.box = options.box||undefined;
        this.index = options.index||0;
        this.scrollIndex = options.scrollIndex||0;
        this.data = options.data||[];
        this.nameKey = options.dataKey||"name";
        this.checkKey = options.checkKey||"name";
        this.clickEvent = options.onClick||function(e,row){
            //console.log(row);
        };
        this.step = options.step||90;
        this.initBox();
    };
    $.MyTab.prototype.getOptions = function(){
        var o = {};
        o.id = this.id;
        o.box = this.box;
        o.index = this.index;
        o.data = this.data;
        o.nameKey = this.nameKey;
        o.checkKey = this.checkKey;
        o.clickEvent = this.clickEvent;
        o.step = this.step;
        return o;
    };
    $.MyTab.prototype.initBox = function(){
        var _this = this;
        if(this.id){
            this.box = $("#"+this.id);
        }
        if(this.box){
            this.box.addClass("my_tab").html("");

            $(window).resize(function(e){
                _this.scrollIndex = _this.ulBox.scrollLeft();
                _this.checkBoxWidth();
            });
            this.leftBtn = $("<div>").addClass("tab_left_btn").click(function(){
                _this.checkBoxWidth();
                var curr = _this.getCurrentIndex();
                var prev = curr.start-1;
                prev = prev<0?0:prev;
                _this.go2ScrollIndex(prev);
            });
            this.ulBox = $("<div>").addClass("scroll_box");
            this.ul = $("<ul>");
            this.ulBox.append(this.ul);
            this.rightBtn = $("<div>").addClass("tab_right_btn").click(function(){
                _this.checkBoxWidth();
                var curr = _this.getCurrentIndex();
                var next = curr.end+1;
                _this.go2ScrollIndex(next,curr.start);
            });

            this.box.append(this.leftBtn).append(this.ulBox).append(this.rightBtn);

            if(this.data){
                this.loadData(this.data);
            }
        }
    };
    $.MyTab.prototype.checkBoxWidth = function(){
        if(this.ulBox.width() >= this.maxWidth){
            this.leftBtn.hide();
            this.rightBtn.hide();
            this.left = 0;
            this.right = 0;
        }else{
            if(this.scrollIndex>0){
                this.leftBtn.show();
                this.left = 15;
            }else{
                this.leftBtn.hide();
                this.left = 0;
            }

            if(this.scrollIndex+this.ulBox.width() < this.ul.width()){
                this.rightBtn.show();
                this.right = 15;
            }else{
                this.rightBtn.hide();
                this.right = 0;
            }
        }
        this.ulBox.css({
            left:this.left,
            right:this.right
        });
    };
    $.MyTab.prototype.go2ScrollIndex = function(index,start){
        var _scroll = this.scrollIndex;
        var _this = this;
        if(index*this.step-_scroll<0){
            this.scrollIndex = index*this.step;
            this.ulBox.animate({
                scrollLeft:this.scrollIndex
            },function(){
                _this.checkBoxWidth();
            });
        }else if((index+1)*this.step>_scroll+this.ulBox.width()){
            this.scrollIndex = (index+1)*this.step-this.ulBox.width();
            if(start!=undefined&&start == 0){
                this.scrollIndex += 15;
            }
            this.ulBox.animate({
                scrollLeft:this.scrollIndex
            },function(){
                _this.checkBoxWidth();
            });
        }
    };
    $.MyTab.prototype.getCurrentIndex = function(){
        var _left = this.ulBox.scrollLeft();
        var _right = this.ulBox.scrollLeft()+this.ulBox.width();
        var start = _left%this.step==0?_left/this.step:(_left-_left%this.step)/this.step+1;
        var end = _right%this.step==0?_right/this.step-1:(_right-_right%this.step)/this.step-1;
        return {
            start:start,
            end:end
        };
    };
    $.MyTab.prototype.loadData = function(data){
        var _this = this;
        this.ul.html("");
        if(this.id){
            this.data = data;
            this.maxWidth = data.length*_this.step;
            this.checkBoxWidth();
            this.ul.css({width:this.maxWidth});
            for(var i=0;i<data.length;i++){
                var li = $("<li>").css({
                    width:_this.step
                }).append($("<a>").html(data[i][_this.nameKey]));
                li.data("index",i);
                li.click(function(e){
                    _this.ul.find("li").removeClass("choose");
                    var _index = $(this).data("index");
                    _this.go2ScrollIndex(_index);
                    $(this).addClass("choose");
                    _this.clickEvent(e,_this.data[_index]);
                });
                this.ul.append(li);
            }
            this.checkBoxWidth();
            this.chooseLi(this.index);
        }
    };

    $.MyTab.prototype.chooseLi = function(index){
        this.index = index;
        this.ul.find("li:eq("+index+")").trigger("click");
    };
    $.MyTab.prototype.select = function(tabObj){
        var index = -1;
        for(var i=0;i<this.data.length;i++){
            if(this.data[i][this.checkKey] == tabObj[this.checkKey]){
                index = i;
                break;
            }
        }
        if(index!=-1){
            this.chooseLi(index);
        }
    };
    $.MyTab.prototype.addTab = function(tabObj){
        var index = -1;
        var _this = this;
        for(var i=0;i<this.data.length;i++){
            if(this.data[i][this.checkKey] == tabObj[this.checkKey]){
                index = i;
                break;
            }
        }
        if(index!=-1){
            this.chooseLi(index);
        }else{
            this.data.push(tabObj);

            var li = $("<li>").css({
                width:_this.step
            }).append($("<a>").html(tabObj[_this.nameKey]));
            li.data("index",this.data.length-1);
            li.click(function(e){
                _this.ul.find("li").removeClass("choose");
                var _index = $(this).data("index");
                _this.go2ScrollIndex(_index);
                $(this).addClass("choose");
                _this.clickEvent(e,_this.data[_index]);
            });
            this.ul.append(li);

            this.maxWidth = this.data.length*_this.step;
            this.checkBoxWidth();
            this.ul.css({width:this.maxWidth});
            this.checkBoxWidth();
            this.chooseLi(this.data.length-1);
        }
    };
}());

        