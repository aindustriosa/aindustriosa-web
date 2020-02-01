import $ from 'jquery'

export default function() {
  $(() => {
    checkInTop()
    $(window).scroll((e) => {
      checkInTop()
    })


    $('#mobile-menu-toggle').click(() => toggleMenu())
    $('#mobile-menu .cover').click(() => closeMenu())


    function closeMenu() {
      $('#mobile-menu').removeClass('open')
    }

    function openMenu() {
      $('#mobile-menu').addClass('open')
    }

    function toggleMenu() {
      $('#mobile-menu').hasClass('open') ? closeMenu() : openMenu()
    }

    function checkInTop() {
      if (window.scrollY > 0 || !$('body').hasClass('body-front-page')) {
        $('#header').addClass('not-in-top')
        $('#header').removeClass('in-top')
      } else {
        $('#header').removeClass('not-in-top')
        $('#header').addClass('in-top')
      }
    }
  })
}
