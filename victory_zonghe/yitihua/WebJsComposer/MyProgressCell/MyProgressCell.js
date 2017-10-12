(function(){
    $.MyProgressCell = function(options){
        this.box = options.box||undefined;
        this.leftWidth = options.leftWidth||75;
        this.leftFontSize = options.leftFontSize||12;
        this.rightFontSize = options.rightFontSize||12;
        this.rightWidth = options.rightWidth||80;
        this.yPadding = options.yPadding||5;
        this.splitWidth = options.splitWidth||5;
        this.cellHeight = options.cellHeight||20;
        this.cellColor = options.cellColor||'#b194d1';
        this.title = options.title||'测试六个字啊';
        this.context = options.context||'注释';
        this.value = options.value||100;
        this.initBox();
    };
    $.MyProgressCell.prototype.initBox = function(){
        if(this.box.get(0)){
            this.box.addClass("progress_cell_box").html("");
            this.titleBox = $('<div>').addClass("progress_cell_title");
            this.progressCellDom = $('<div>').addClass("progress_cell_all");
            this.progressCellInfoDom = $('<div>').addClass("progress_cell_info");
            this.progressCellDom.html(this.progressCellInfoDom);
            this.contextBox = $('<div>').addClass("progress_cell_context");

            this.box.append(this.titleBox);
            this.box.append(this.progressCellDom);
            this.box.append(this.progressBg);
            this.box.append(this.contextBox);

            this.box.css({
                height:this.cellHeight+"px",
                padding:this.yPadding+"px 0"
            });
            this.titleBox.css({
                'line-height':this.cellHeight+"px",
                height:this.cellHeight+"px",
                padding:this.yPadding+"px 0",
                width:this.leftWidth+"px",
                'font-size':this.leftFontSize+"px"
            });
            this.contextBox.css({
                'line-height':this.cellHeight+"px",
                height:this.cellHeight+"px",
                padding:this.yPadding+"px 0",
                width:this.rightWidth+"px",
                'font-size':this.rightFontSize+"px"
            });
            this.titleBox.html(this.title);
            this.progressCellInfoDom.css({
                width:0,
                height:this.cellHeight,
                background:this.cellColor
            });
            this.progressCellDom.css({
                left:this.leftWidth + this.splitWidth + "px",
                right:this.rightWidth + this.splitWidth + "px"
            });
            this.contextBox.html(this.context);


            this.loadData(this.value);
        }
    };
    $.MyProgressCell.prototype.loadData = function(value){
        this.value = value;
        this.progressCellInfoDom.animate({
           width:value+'%'
        });
    };


}());