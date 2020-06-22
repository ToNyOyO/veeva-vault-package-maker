$(function() {

    // PUBLISH
    var isPublished = false;

    // links
    var pagesLink = $('.pages-link');
    var refsLink = $('.refs-link');
    var piLink = $('.pi-link');

    // page elements
    var refsOverlay = $('#refs-overlay');
    var references = $('#references');
    var refCloseBtn = $('.ref-close-button');

    var popupOverlay = $('#popup-overlay');
    var popup = $('.popup-link');
    var popCloseBtn = $('.pop-close-button');


    /******************************************************************************
     * Nav highlighting
     */

    var pageName = '.goTo-' + $(location).attr('href').split('/').pop().split('.').shift().replace(/-/g, ' ').toCamelCase();

    $('nav').find(pageName).each(function (e) {
        $(this).addClass('active');
        $(this).parent().parent().addClass('active');
        $(this).parent().parent().siblings('a').first().addClass('active');
    });


    /******************************************************************************
     * Cheeky page flip
     */

    if (!isPublished) {
        var l = $('<input type="button" class="secret-button" id="secret-left" value="&lt;" />');
        var r = $('<input type="button" class="secret-button" id="secret-right" value="&gt;" />');

        $("nav").prepend(r);
        $("nav").prepend(l);

        var nextMenuItem = '', prevMenuItem = '';

        $.getJSON( "../keymessages.json", function( data ) {

            var items = [];

            $.each( data, function( key, val ) {
                items.push(key);
            });

            // exclude 0/1 for pres and shared res
            for (var i=2; i<items.length; i++) {

                if (pageName === '.goTo-' + items[i].replace(/-/g, ' ').toCamelCase()) {

                    prevMenuItem = (i>2) ? items[i-1].replace(/ /g, '-') : '';
                    nextMenuItem = (i<=items.length-1) ? items[i+1].replace(/ /g, '-') : '';
                }
            }

            $('.secret-button').on('click', function (e) {

                if ($(this).attr('id') === 'secret-left' && prevMenuItem !== '') {
                    location.href = prevMenuItem + '.html';
                } else
                if ($(this).attr('id') === 'secret-right' && nextMenuItem !== '') {
                    location.href = nextMenuItem + '.html';
                }
            });
        });
    }


    /******************************************************************************
     * References link (toggle)
     */

    refsLink.on('click', function (e) {
        e.preventDefault();

        refsOverlay.toggleClass('show');
        references.toggleClass('show');
    });

    /******************************************************************************
     * Popup open link (using data-attr)
     */

    popup.on('click', function (e) {
        e.preventDefault();

        var popupId = $(this).attr('data-popup-id');

        popupOverlay.addClass('show');
        $('body').find('#'+popupId).addClass('show');
    });

    /******************************************************************************
     * Ref close button
     */

    refCloseBtn.on('click', function (e) {
        e.preventDefault();

        refsOverlay.removeClass('show');
        $(this).parent().removeClass('show');
    });

    /******************************************************************************
     * Popup close button
     */

    popCloseBtn.on('click', function (e) {
        e.preventDefault();

        popupOverlay.removeClass('show');
        $(this).parent().parent().removeClass('show');
    });


    /******************************************************************************
     * Links out to other presentations
     *
     */

    /** INSERT LINK TO OTHER PRES HERE **/


    /******************************************************************************
     * VEEVA MENU LINKS
     */

    /** INSERT NEW KEYMESSAGE LINK HERE **/
});

(function($) {
    $.fn.animateNumbers = function(start, stop, commas, duration, delay, ease) {
        return this.each(function() {
            var $this = $(this);
            start = (start !== null) ? start : parseInt($this.text().replace(/,/g, "")) ;
            commas = (commas === undefined) ? true : commas;
            delay = (delay === undefined) ? 0 : delay;

            setTimeout(function () {
                $({value: start}).animate({value: stop}, {
                    duration: duration === undefined ? 1000 : duration,
                    easing: ease === undefined ? "swing" : ease,
                    step: function() {
                        $this.text(Math.floor(this.value));
                        if (commas) { $this.text($this.text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")); }
                    },
                    complete: function() {
                        if (parseInt($this.text()) !== stop) {
                            $this.text(stop);
                            if (commas) { $this.text($this.text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")); }
                        }
                    }
                });
            }, delay);
        });
    };
})(jQuery);

// convert string to camelcase
String.prototype.toCamelCase = function() {
    return this
        .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
        .replace(/\s/g, '')
        .replace(/\^(.)/g, function($1) { return $1.toLowerCase(); });
}