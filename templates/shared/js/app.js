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
                com.veeva.clm.gotoSlide('VEYVONDI-Homepage.zip', '');
            } else {
                document.location.href = 'VEYVONDI-Homepage.html';
            }
        }
    });
    $('.goTo-vWD').on('click', function(e) {
        e.preventDefault();

        if (!$(this).hasClass('active') || ($(this).hasClass('active') && $(this).hasClass('allow'))) {
            if (isPublished) {
                com.veeva.clm.gotoSlide('VEYVONDI-vWD.zip', '');
            } else {
                document.location.href = 'VEYVONDI-vWD.html';
            }
        }
    });
    $('.goTo-Product').on('click', function(e) {
        e.preventDefault();

        if (!$(this).hasClass('active') || ($(this).hasClass('active') && $(this).hasClass('allow'))) {
            if (isPublished) {
                com.veeva.clm.gotoSlide('VEYVONDI-VEYVONDI.zip', '');
            } else {
                document.location.href = 'VEYVONDI-VEYVONDI.html';
            }
        }
    });
    $('.goTo-Dosing').on('click', function(e) {
        e.preventDefault();

        if (!$(this).hasClass('active') || ($(this).hasClass('active') && $(this).hasClass('allow'))) {
            if (isPublished) {
                com.veeva.clm.gotoSlide('VEYVONDI-Independent-dosing.zip', '');
            } else {
                document.location.href = 'VEYVONDI-Independent-dosing.html';
            }
        }
    });
    $('.goTo-OnDemand').on('click', function(e) {
        e.preventDefault();

        if (!$(this).hasClass('active') || ($(this).hasClass('active') && $(this).hasClass('allow'))) {
            if (isPublished) {
                com.veeva.clm.gotoSlide('VEYVONDI-On-demand.zip', '');
            } else {
                document.location.href = 'VEYVONDI-On-demand.html';
            }
        }
    });
    $('.goTo-Surgery').on('click', function(e) {
        e.preventDefault();

        if (!$(this).hasClass('active') || ($(this).hasClass('active') && $(this).hasClass('allow'))) {
            if (isPublished) {
                com.veeva.clm.gotoSlide('VEYVONDI-Surgery.zip', '');
            } else {
                document.location.href = 'VEYVONDI-Surgery.html';
            }
        }
    });
    $('.goTo-Storage').on('click', function(e) {
        e.preventDefault();

        if (!$(this).hasClass('active') || ($(this).hasClass('active') && $(this).hasClass('allow'))) {
            if (isPublished) {
                com.veeva.clm.gotoSlide('VEYVONDI-Storage.zip', '');
            } else {
                document.location.href = 'VEYVONDI-Storage.html';
            }
        }
    });
    $('.goTo-Safety').on('click', function(e) {
        e.preventDefault();

        if (!$(this).hasClass('active') || ($(this).hasClass('active') && $(this).hasClass('allow'))) {
            if (isPublished) {
                com.veeva.clm.gotoSlide('VEYVONDI-Safety.zip', '');
            } else {
                document.location.href = 'VEYVONDI-Safety.html';
            }
        }
    });
    $('.goTo-Summary').on('click', function(e) {
        e.preventDefault();

        if (!$(this).hasClass('active') || ($(this).hasClass('active') && $(this).hasClass('allow'))) {
            if (isPublished) {
                com.veeva.clm.gotoSlide('VEYVONDI-Summary.zip', '');
            } else {
                document.location.href = 'VEYVONDI-Summary.html';
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