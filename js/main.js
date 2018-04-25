(function($) {
  // add code type
  let addCodeType = () => {
    $(".highlight").each(function() {
      let code_type = $(this).attr("class").split(" ")[1].toUpperCase();
      $(this).attr("data-code-type", code_type);
    });
  }

  // add img wrapper and caption
  let wrapImages = () => {
    let loadingImgBase64 = "data:image/png;base64,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";
    $(".post-content img").each(function (){
      let img = $(this),
          src = img.attr('data-original'),
          title = img.attr('title');
      
      // prepare for lazyload
      img.attr('src', loadingImgBase64);
      img.addClass("lazy");
      
      // wrap img
      img.wrap('<div class="img-wrapper"></div>');
      img.after(`<p class="img-caption">${title}</p>`);
      img.wrap(`<a href="${src}" title="${title}" class="fancybox" rel="article"></a>`);
    });
  }

  addCodeType();
  wrapImages();

  // activate fancybox and lazyload
  $(".fancybox").fancybox();
  $(".lazy").lazyload({ effect: "fadeIn", threshold: 200 });
})(jQuery);
