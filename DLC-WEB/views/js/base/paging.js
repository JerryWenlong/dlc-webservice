$.fn.myPaging=function(options){
		$options=$.extend({
			total:'',
			currentPage:'',
			box:'',
			pageT:'',
            fun:""
		},options);

		$options.total=parseInt($options.total);
		$options.currentPage=parseInt($options.currentPage);
		$options.pageT=$options.total;
		var pageHtml='';
		if($options.currentPage>2){
			pageHtml+='<button id="indexpage" class="indexpage itemPage">首页</button>';
		};
		if($options.currentPage>1){
			pageHtml+='<button id="prevpage"  class="prevpage itemPage">上一页</button>';
		};
		if($options.currentPage>1){
			pageHtml+='<button id="nub0"  class="num itemPage">'+($options.currentPage-1)+'</button>';
		};

		pageHtml+='<button id="nub" class="active num itemPage">'+$options.currentPage+'</button>';

		if($options.total-$options.currentPage>1){
			pageHtml+='<button  id="nub1" class="num itemPage">'+($options.currentPage+1)+'</button>';
		};
		if($options.total-$options.currentPage>2){
			pageHtml+='<button  id="nub2" class="num itemPage">'+($options.currentPage+2)+'</button>';
		};
		if($options.total-$options.currentPage>3){
			pageHtml+='<span>...</span>';
		};
		if($options.total-$options.currentPage>=1){
			pageHtml+='<button id="nubT" class="num itemPage">'+$options.total+'</button>';
			pageHtml+='<button id="nextpage"  class="nextpage itemPage">下一页</button>';
		};
		if($options.total-$options.currentPage>1){			
			pageHtml+='<button id="endpage"  class="endpage itemPage" total="'+$options.total+'">尾页</button>';
		}
        var id=null;
		var highlight=function()
        {
        //    $(id).removeClass("itemPage");
        //    $(id).addClass("itemPageH");
        }

		$options.box.html(pageHtml);
        $(document).off("click",'#indexpage');
        $(document).on("click",'#indexpage',function(){
            id='#indexpage';
            $options.fun(1,highlight);

        });
        $(document).off("click",'#prevpage');
        $(document).on("click",'#prevpage',function(){
            id='#prevpage';
            $options.fun($options.currentPage-1,highlight);
        });
        $(document).off("click",'#nub0');
        $(document).on("click",'#nub0',function(){
            $options.fun($options.currentPage-1,highlight);
        });
        $(document).off("click",'#nub');
        $(document).on("click",'#nub',function(){
            id='#nub';
            $options.fun($options.currentPage,highlight);
        });
        $(document).off("click",'#nub1');
        $(document).on("click",'#nub1',function(){
            id='#nub1';
            $options.fun($options.currentPage+1,highlight);
        });
        $(document).off("click",'#nub2');
        $(document).on("click",'#nub2',function(){
            id='#nub2';
            $options.fun($options.currentPage+2,highlight);
        });
       $(document).off("click",'#nubT');
        $(document).on("click",'#nubT',function(){
            id='#nubT';
            $options.fun($options.total,highlight);
        });
       $(document).off("click",'#nextpage');
        $(document).on("click",'#nextpage',function(){
            id='#nextpage';
            $options.fun($options.currentPage+1,highlight);
        });
       $(document).off("click",'#endpage');
        $(document).on("click",'#endpage',function(){
            id='#endpage';
            $options.fun($options.total,highlight);
        });
}
