$(window).scroll(function() {
    var scrollVal = $(this).scrollTop(); // It will return scroll value
    $("#logo").css("transform",'translate(0px,-'+scrollVal/2+'%)');
    $("#btn").css("transform",'translate(-50%,'+scrollVal/3+'%)');
});