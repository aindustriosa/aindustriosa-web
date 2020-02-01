/* eslint no-undef: 0 */
tarteaucitron.init({
  privacyUrl: '',
  hashtag: '#tarteaucitron',
  cookieName: 'phpvigocc',
  orientation: 'bottom',
  showAlertSmall: true,
  cookieslist: true,

  adblocker: false,
  AcceptAllCta: true,
  highPrivacy: false,
  handleBrowserDNTRequest: false,

  removeCredit: true,
  moreInfoLink: true,
  useExternalCss: false,

  readmoreLink: '/legal'
})

tarteaucitron.user.analyticsUa = 'UA-98368785-1'
tarteaucitron.user.analyticsMore = function() {
  /* add here your optionnal ga.push() */
};

(tarteaucitron.job = tarteaucitron.job || []).push('analytics')

