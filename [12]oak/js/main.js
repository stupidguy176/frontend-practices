"use strict";

//Esc Key 
$.fn.escape = function (callback) {
    return this.each(function () {
        jQuery(document).on("keydown", this, function (e) {
            var keycode = ((typeof e.keyCode != 'undefined' && e.keyCode) ? e.keyCode : e.which);
            if (keycode === 27) {
                callback.call(this, e);
            };
        });
    });
};

//Menu Navigation Hamburger
var navigationRight = jQuery('.menu-wrap');
console.log({ navigationRight })

function Navigation() {
    var bodyEl = document.body,
        content = document.querySelector('#close-button'),
        openbtn = document.getElementById('open-button'),
        closebtn = document.getElementById('close-button'),
        isOpen = false;

    function init() {
        initEvents();
    }

    function initEvents() {
        console.log('initEvents');
        openbtn.addEventListener('click', toggleMenu);
        if (closebtn) {
            closebtn.addEventListener('click', toggleMenu);
        }

        // close the menu element if the target it´s not the menu element or one of its descendants..
        content.addEventListener('click', function (ev) {
            var target = ev.target;
            if (isOpen && target !== openbtn) {
                toggleMenu();
            }
        });
    }

    function toggleMenu() {
        console.log('tooglge')
        if (isOpen) {
            classie.remove(bodyEl, 'show-menu');
        } else {
            classie.add(bodyEl, 'show-menu');
        }
        isOpen = !isOpen;
    }

    navigationRight.escape(function () {
        if (isOpen) {
            classie.remove(bodyEl, 'show-menu');
            classie.remove(openbtn, 'active')
        }
        isOpen = !isOpen;
    });

    init();
};

//Search
var wrap = jQuery('.js-ui-search');
var close = jQuery('.js-ui-close');
var input = jQuery('.js-ui-text');
close.on('click', function () {
    wrap.toggleClass('open');
});
input.on('transitionend webkitTransitionEnd oTransitionEnd', function () {
    if (wrap.hasClass('open')) {
        input.focus();
    } else {
        return;
    }
});

//Scroll Top 
$.fn.scrollToTop = function () {
    jQuery(this).hide().removeAttr('href');
    if (jQuery(window).scrollTop() != '0') {
        jQuery(this).fadeIn('slow')
    }
    var scrollDiv = jQuery(this);
    jQuery(window).scroll(function () {
        if (jQuery(window).scrollTop() == '0') {
            jQuery(scrollDiv).fadeOut('slow')
        } else {
            jQuery(scrollDiv).fadeIn('slow')
        }
    });
    jQuery(this).on('click', function () {
        jQuery('html, body').animate({
            scrollTop: 0
        }, 'slow')
    })
};

//Document Ready
jQuery(document).ready(function ($) {

    //Navigation Sub Menu Triggering
    jQuery('.menu-item-has-children, .page_item_has_children').hover(function () {
        jQuery(this).children('.sub-menu').stop().slideDown(400);
    },
        function () {
            jQuery(this).children('.sub-menu').stop().slideUp(200);
        });

    //Menu Right Side
    if (navigationRight.length > 0) {
        Navigation();
    };

    // Switch class on filter
    var showfilter = jQuery('.works-filter');
    jQuery('button.nav').on('click', function () {
        var self = jQuery(this);
        self.toggleClass('open');
        showfilter.toggleClass('open');
    });

    //Scroll Top
    jQuery('#scroll-top').scrollToTop();
})

//Window Load
jQuery(window).ready(function ($) {
    console.log('window ready')
})