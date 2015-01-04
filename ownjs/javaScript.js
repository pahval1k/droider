


var maxPubInPage = 4; // limit of number of publication in one page
var publLength = publications.length; //number of all publications

$(document).ready(function () { // when DOM is ready
    $("body").css({padding:0,margin:0});
    $("#menu-toggle").click(function(e) { // sidebar toggle 
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })
    sideBarEvents("#HomePage",clickHomePage);
    sideBarEvents("#Search",searchData);
    sideBarEvents("#About",aboutData);
    sideBarEvents("#Contact",contactData);
    addButtonArticle();
    homePageData(publications);
    
}); 
function sideBarEvents(id,func) { // set animation and action on sidebar elements 
   $(id).mouseenter(function(){bipbipUp(id);}).mouseleave(function(){bipbipDown(id);}).on("click",func); 
}
function bottomFooter() { //push footer to bottom of the page
    var f = function() {
        $(".ndra-container").css({position:"relative"});
        var h1 = $("body").height();
        var h2 = $(window).height();
        var d = h2 - h1;
        var h = $(".ndra-container").height() + d;    
        var ruler = $("<div>").appendTo(".ndra-container");       
        h = Math.max(ruler.position().top,h);
        ruler.remove();    
        $(".ndra-container").height(h);
    };
    $(window).resize(f);
    f();
}
function createPagination(array) { // creating pagination (bottom of page)
    removePagination();
    var previousButton = "<li><a href='#' id='Previous'><span aria-hidden='true'>&laquo;</span><span class='sr-only'>Previous</span></a></li>";
    $(previousButton).appendTo("nav .pagination");
    var nextButton = "<li><a href='#' id='Next'><span aria-hidden='true'>&raquo;</span><span class='sr-only'>Next</span></a></li>";
    $(nextButton).appendTo("nav .pagination");
    var pagesLength = (array.length/maxPubInPage)+1;
    for (var i=1;i<pagesLength;i++) {
		var source = "<li id='pg_"+ i + "'><a href='#'>" + i + "</a></li>"
        $(source).insertAfter($("nav .pagination").children().eq(i-1));
        $("#pg_" + i).click(function(event) {
            page($(this).index(),array);
        });
    }
}
function removePagination() { // removing pagination from bottom on page
    $("nav .pagination").children().each(function() { 
        $(this).remove();   
    });  
    
}
function printPublications(arr) { // gets array and prints publications
    var source   = $("#publTemplate").html();
    var template = Handlebars.compile(source);
    var tmp = template(arr);
    $("#publication").last().append(tmp);
    $(document).waitForImages(function() {
        fullScreenImage();
        bottomFooter();
    });

}
function prepareArrForDate(arr) { // preparing array for publications (change date into simple format)
    return arr.map(function( d ) { 
        return {title: d.title, content: d.content, date: d.date.toLocaleDateString(), img: d.img};
    });
}
function createFromTo(from,to,array) { // creating publications on page (from, to)
    var arr = array.slice(from,to);
    var tmp1 = prepareArrForDate(arr);
    printPublications(tmp1);

}
function changeContent(indexFrom,array) { // changing publications 
    if (publLength-indexFrom<maxPubInPage) { // if number of publications are less than the maximum number of publications on a page. 
        createFromTo(indexFrom,publLength,array);
    } else { 
        createFromTo(indexFrom,indexFrom+maxPubInPage,array);
    } 
}
function removeAllPublications() { // remove all publications
    $("#publication").children().not(":first").remove();
}
function page(page,array) { // set appropriate information on given page
    $("#publication").children().slice(2).remove();
    if (page<1) {page=1;}
    var maxPageLen = Math.floor((array.length/maxPubInPage)+1);
    if (page>maxPageLen){ page = maxPageLen;}
    var i=(page-1)*maxPubInPage;
    changeContent(i,array);
    changePrevAndNext(page,array);
}
function previousAndNext(i,array) { //set listener to buttons of pagination
    $("#Previous").click(function() { page(i-1,array); });
    $("#Next").click(function() { page (i+1,array); });
}
function changePrevAndNext(i,array) { // change listeners paginations' button
    $("#Previous").unbind('click');
    $("#Next").unbind('click');
    previousAndNext(i,array);
}
function addData(template) { // 
    removePagination();
    removeAllPublications();
    var source   = $(template).html();
    $("#publication").append(source);
    bottomFooter();
    $("#menu-toggle").click();
}
function bipbipUp(id) { // set size of font 1.3em
    $(id).animate({fontSize: "1.3em"},70);
}
function bipbipDown(id) { // set size of font 1em
    $(id).animate({fontSize: "1em"},70);
}
function contactData() { 
    addData("#ContactTemplate");
}
function aboutData() { 
    addData("#AboutTemplate");

}
function homePageData(array) { // function gets array and create publications with pagination on page
    previousAndNext(1,array);
    page(1,array);
    createPagination(array); 
}
function addButtonArticle() { // add button for adding article  
    var button = $("#buttonTemplate").html();
    $("#publication").append(button);
}
function clickHomePage() { // event when user clicks Home Page
    removeAllPublications();
    addButtonArticle(); 
    homePageData(publications);
    $("#menu-toggle").click();
}
function searchResults() { // functions of search
    var title = $("#titleSearch").val();
    var dateFrom = $("#dateFrom").val(); 
    var dateTo = $("#dateTo").val();
    var results = new Array();
    if (title == "" && dateFrom == '' && dateTo=="") { // if no data
        results[0] = {title: "NO DATA",content: "Please, write something", date : new Date()};
    } else { // else if all right
        (dateFrom!="") ? dateFrom = new Date(dateFrom) : dateFrom = null;
        (dateTo!="") ? dateTo = new Date(dateTo) : dateTo = new Date();
        results = publications.filter(function( d ) { 
            if (d.title.search(title)!=-1 && d.date>=dateFrom && d.date<=dateTo)
                    return d;
        });
        // if no appropriate results
        if (results.length==0) {results[0] = {title: "NOT FOUND",content: "I'm sorry, but there's no found publications", date : new Date()}};
    }   
    $("#publication").children().slice(2).remove();
    homePageData(results);
}
function searchData() { 
    addData("#SearchTemplate");
}
function sortDownDate(array) { // sort array down date
    var arr = array.sort(function(a, b) {
        a = a.date;
        b = b.date;
        return a>b ? -1 : a<b ? 1 : 0;
    });
    removeAllPublications();
    addButtonArticle(); 
    homePageData(arr);

}
function sortUpDate(array) { // sort array up date
    var arr = array.sort(function(a, b) {
        a = a.date;
        b = b.date;
        return a>b ? 1 : a<b ? -1 : 0;
    });
    removeAllPublications();
    addButtonArticle(); 
    homePageData(arr);
}
function fullScreenImage() { 
    // initialize the slideshow
  $('.image img').fullscreenslides();
  
  // All events are bound to this container element
  var $container = $('#fullscreenSlideshowContainer');
  $container
    //This is triggered once:
    .bind("init", function() { 

      // The slideshow does not provide its own UI, so add your own
      // check the fullscreenstyle.css for corresponding styles
      $container
        .append('<div class="ui" id="fs-close">&times;</div>')
        .append('<div class="ui" id="fs-loader">Loading...</div>')
        .append('<div class="ui" id="fs-prev">&lt;</div>')
        .append('<div class="ui" id="fs-next">&gt;</div>')
        .append('<div class="ui" id="fs-caption"><span></span></div>');
      
      // Bind to the ui elements and trigger slideshow events
      $('#fs-prev').click(function(){
        // You can trigger the transition to the previous slide
        $container.trigger("prevSlide");
      });
      $('#fs-next').click(function(){
        // You can trigger the transition to the next slide
        $container.trigger("nextSlide");
      });
      $('#fs-close').click(function(){
        // You can close the slide show like this:
        $container.trigger("close");
      });
      
    })
    // When a slide starts to load this is called
    .bind("startLoading", function() { 
      // show spinner
      $('#fs-loader').show();
    })
    // When a slide stops to load this is called:
    .bind("stopLoading", function() { 
      // hide spinner
      $('#fs-loader').hide();
    })
    // When a slide is shown this is called.
    // The "loading" events are triggered only once per slide.
    // The "start" and "end" events are called every time.
    // Notice the "slide" argument:
    .bind("startOfSlide", function(event, slide) { 
      // set and show caption
      //$('#fs-caption span').text(slide.title);
      //$('#fs-caption').show();
    })
    // before a slide is hidden this is called:
    .bind("endOfSlide", function(event, slide) { 
      //$('#fs-caption').hide();
    });
}


