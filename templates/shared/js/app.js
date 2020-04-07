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
     * VEEVA MENU LINKS
     */

    $('.goTo-Homepage').on('click', function(e) {
        e.preventDefault();

        if (!$(this).hasClass('active') || ($(this).hasClass('active') && $(this).hasClass('allow'))) {
            if (isPublished) {
                com.veeva.clm.gotoSlide('Homepage.zip', '');
            } else {
                document.location.href = 'Homepage.html';
            }
        }
    });
    $('.goTo-KeyMessage1').on('click', function(e) {
        e.preventDefault();

        if (!$(this).hasClass('active') || ($(this).hasClass('active') && $(this).hasClass('allow'))) {
            if (isPublished) {
                com.veeva.clm.gotoSlide('KeyMessage1.zip', '');
            } else {
                document.location.href = 'KeyMessage1.html';
            }
        }
    });
    $('.goTo-KeyMessage2').on('click', function(e) {
        e.preventDefault();

        if (!$(this).hasClass('active') || ($(this).hasClass('active') && $(this).hasClass('allow'))) {
            if (isPublished) {
                com.veeva.clm.gotoSlide('KeyMessage2.zip', '');
            } else {
                document.location.href = 'KeyMessage2.html';
            }
        }
    });
    $('.goTo-KeyMessage3').on('click', function(e) {
        e.preventDefault();

        if (!$(this).hasClass('active') || ($(this).hasClass('active') && $(this).hasClass('allow'))) {
            if (isPublished) {
                com.veeva.clm.gotoSlide('KeyMessage3.zip', '');
            } else {
                document.location.href = 'KeyMessage3.html';
            }
        }
    });
    $('.goTo-KeyMessage4').on('click', function(e) {
        e.preventDefault();

        if (!$(this).hasClass('active') || ($(this).hasClass('active') && $(this).hasClass('allow'))) {
            if (isPublished) {
                com.veeva.clm.gotoSlide('KeyMessage4.zip', '');
            } else {
                document.location.href = 'KeyMessage4.html';
            }
        }
    });
    $('.goTo-KeyMessage5').on('click', function(e) {
        e.preventDefault();

        if (!$(this).hasClass('active') || ($(this).hasClass('active') && $(this).hasClass('allow'))) {
            if (isPublished) {
                com.veeva.clm.gotoSlide('KeyMessage5.zip', '');
            } else {
                document.location.href = 'KeyMessage5.html';
            }
        }
    });
    $('.goTo-KeyMessage6').on('click', function(e) {
        e.preventDefault();

        if (!$(this).hasClass('active') || ($(this).hasClass('active') && $(this).hasClass('allow'))) {
            if (isPublished) {
                com.veeva.clm.gotoSlide('KeyMessage6.zip', '');
            } else {
                document.location.href = 'KeyMessage6.html';
            }
        }
    });
    $('.goTo-KeyMessage7').on('click', function(e) {
        e.preventDefault();

        if (!$(this).hasClass('active') || ($(this).hasClass('active') && $(this).hasClass('allow'))) {
            if (isPublished) {
                com.veeva.clm.gotoSlide('KeyMessage7.zip', '');
            } else {
                document.location.href = 'KeyMessage7.html';
            }
        }
    });
    $('.goTo-Summary').on('click', function(e) {
        e.preventDefault();

        if (!$(this).hasClass('active') || ($(this).hasClass('active') && $(this).hasClass('allow'))) {
            if (isPublished) {
                com.veeva.clm.gotoSlide('Summary.zip', '');
            } else {
                document.location.href = 'Summary.html';
            }
        }
    });
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