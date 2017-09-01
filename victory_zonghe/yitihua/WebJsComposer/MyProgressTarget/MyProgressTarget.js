(function(){
    $.MyProgressTarget = function(options){
        this.box = options.box;
        this.id = options.id||'';
        this.title = options.title||'';

        this.formatterVal = options.formatterVal||function(val){return val;};
        this.formatterBg = options.formatterBg||function(val){return val;};

        this.progressColor = options.progressColor||'#7bc9ea';
        this.progressBgColor = options.progressBgColor||'#cccccc';
        this.progressTargetColor = options.progressTargetColor||'red';

        this.value = options.value||0;
        this.targetValue = options.targetValue||0;
        this.bgValue = options.bgValue||1;
        this.initBox();
    };
    $.MyProgressTarget.prototype.initBox = function(){
        var _this = this;
        if(this.id){
            this.box = $("<div>");
            $("#"+this.id).html(this.box);
        }
        if(this.box){
            this.box.addClass("progress_target_box").html("");
            this.headBox = $('<div>').addClass("progress_target_head").html(this.title);
            this.label1 = $('<div>').addClass('progress_target_label1');
            this.label2 = $('<div>').addClass('progress_target_label2');

            this.progressObj = $("<div>").addClass("progress_target_item");

            this.progressVal = $("<div>").addClass("progress_target_value");
            this.progressBg = $("<div>").addClass("progress_target_bg");
            this.progressTar = $('<div>').addClass("progress_target_pointer").append('<div class="progress_target_pointer_circle"></div><div class="progress_target_pointer_label">进度目标</div>');
            this.kedu = $('<div class="progress_kedu_up"><div class="progress_line"></div></div>');

            this.progressValPointer = $('<div>').addClass("progress_target_value_pointer");
            this.progressValLabel = $('<div>').addClass('progress_target_value_pointer_label');
            this.progressValPointer.append(this.progressValLabel);
            this.progressVal.append(this.progressValPointer);



            this.progressObj.append(this.progressBg);
            this.progressObj.append(this.progressVal);
            this.progressObj.append(this.progressTar);
            this.progressObj.append(this.kedu);


            this.box.append(this.headBox);
            this.box.append(this.label1);
            this.box.append(this.label2);
            this.box.append(this.progressObj);

            this.loadData(this.value,this.bgValue,this.targetValue);
        }
    };
    $.MyProgressTarget.prototype.loadData = function(value,bgValue,targetValue){
        var _this = this;
        this.value = value;
        this.bgValue = bgValue;
        this.targetValue = targetValue;

        this.label1.html(this.formatterBg(this.bgValue));
        this.label2.html(this.formatterVal(this.value));

        var count1 = (value*1000-value*1000%bgValue)/10/bgValue;
        var count2 = (targetValue*1000-targetValue*1000%bgValue)/10/bgValue;
        if(value<=bgValue){
            this.progressBg.css({width:'100%'});
            this.kedu.hide();
        }else{
            count1 = 100;
            count2 =(targetValue*1000-targetValue*1000%value)/10/value;
            var bgWidth = (bgValue*1000-bgValue*1000%value)/10/value;
            this.progressBg.css({width:bgWidth+'%'});
            this.kedu.css({left:bgWidth+"%"}).show();
        }

        this.progressTar.css({left:count2+'%'});
        _this.progressValLabel.html('');
        _this.progressValPointer.hide();
        this.progressVal.animate({
            width:count1+"%"
        },function(){
            _this.progressValLabel.html(count1+'%');
            _this.progressValPointer.show();
        });

    };
}());