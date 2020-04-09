$(function() {

    // PUBLISH
    const isPublished = false;

    // links
    const pagesLink = $('.pages-link');
    const refsLink = $('.refs-link');
    const piLink = $('.pi-link');

    // page elements
    const refsOverlay = $('#refs-overlay');
    const references = $('#references');
    const refCloseBtn = $('.ref-close-button');

    const popupOverlay = $('#popup-overlay');
    const popup = $('.popup-link');
    const popCloseBtn = $('.pop-close-button');

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

        let popupId = $(this).attr('data-popup-id');

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
     * VEEVA MENU LINKS
     */

    /** INSERT NEW KEYMESSAGE LINK HERE **/
});

(function($) {
    $.fn.animateNumbers = function(start, stop, commas, duration, delay, ease) {
        return this.each(function() {
            let $this = $(this);
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
