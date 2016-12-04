/**
 * Created by iceleaf on 2016/12/3.
 */
// $(function () {
$(document).ready(function () {
    $(".nav a").on("click", function(){
        $(".nav").find(".active").removeClass("active");
        $(this).parent().addClass("active");
    });

    $('.navbar a').on('click', function()
    {
        //點擊時，如果已經沒有下一層選單的話，則再關閉navbar
        if($(this).attr("data-toggle") == undefined)
        {
            $('.navbar-toggle').click();
        }
    });


});