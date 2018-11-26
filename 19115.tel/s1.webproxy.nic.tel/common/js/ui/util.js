
/*
 * calculate the color contrast by converting the RGB color space into YIQ
 * by Brian Suda, http://24ways.org/2010/calculating-color-contrast/
 */

function getContrastYIQ (hexcolor)
{
  // strip # if present
  hexcolor = hexcolor.substr (hexcolor.indexOf ("#") +1);

  var r = parseInt (hexcolor.substr (0,2), 16);
  var g = parseInt (hexcolor.substr (2,2), 16);
  var b = parseInt (hexcolor.substr (4,2), 16);
  var yiq = ((r*299)+(g*587)+(b*114))/1000;
  
  return (yiq >= 128) ? 'black' : 'white';
}


/**
 * converts a color value from RGB to hexadecimal representation
 */

function rgb2hex (rgbColorVal)
{
  var parts = rgbColorVal.match (/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  delete (parts[0]);
  
  for (var i = 1; i <= 3; ++i) {
    parts[i] = parseInt (parts[i]).toString (16);
    if (parts[i].length == 1) parts[i] = '0' + parts[i];
  }
  
  return ('#' + parts.join(''));
}

/**
 * initialize a toggle function to show/hide a DOM element (hidden on start)
 */

function initShowHidePanel (clickableAreaSelector, targetPanelSelector,
  infoTextSelector, hideTextKey, showTextKey)
{
  // hide on start, with suitable info text
  $(targetPanelSelector).hide ();
  $(infoTextSelector).text (getText (showTextKey));

  $(clickableAreaSelector).toggle (
  function () {
    $(targetPanelSelector).show ('fast');
    $(infoTextSelector).text (getText (hideTextKey));
  }, function () {
    $(targetPanelSelector).hide ('fast');
    $(infoTextSelector).text (getText (showTextKey));
  });
}


/**
 * initialize a toggle function to show/hide a DOM element (shown on start)
 */

function initHideShowPanel (clickableAreaSelector, targetPanelSelector,
  infoTextSelector, hideTextKey, showTextKey)
{
  // show on start, with suitable info text
  $(targetPanelSelector).show ();
  $(infoTextSelector).text (getText (hideTextKey));

  $(clickableAreaSelector).toggle (
  function () {
    $(targetPanelSelector).hide ('fast');
    $(infoTextSelector).text (getText (showTextKey));
  }, function () {
    $(targetPanelSelector).show ('fast');
    $(infoTextSelector).text (getText (hideTextKey));
  });
}


/**
 * initialize idangerous swiper for TelNames Image Gallery (TEL372 / SO-2418)
 */

function initGallerySwiper ()
{
  // skip if library not loaded / if no gallery images are present (SO-2522)
  if (typeof Swiper === 'undefined')
    return;

  var imagesLoaded = false;

  $(function () {
    var mySwiper = new Swiper ('.swiper-container', {
      pagination: '.swiper-pagination',
      loop: true,
      grabCursor: true,
      noSwiping: true,
      onSlideChangeEnd: function () {
        updateCaption ();
      },
      onTouchStart: function () {
        if (!imagesLoaded) loadGalleryImages ();
      }
    });

    // load images on demand
    function loadGalleryImages () {
      if (!imagesLoaded) {
        var gallerySel = "div#picgallery-panel .swiper-container .swiper-slide";
        var imgSelBase = "img.swiper-pic.slide";
        var imgContainerSel = "div.gallery-img-container " + imgSelBase;

        var tmpImages = [imgGalleryUrls.length];

        for (var i = 1; i < imgGalleryUrls.length; i++) {
          var imgSel = gallerySel + " " + imgContainerSel + i;
          var alt = imgGalleryCaps[i];
          var url = imgGalleryUrls[i];

          // avoid caching in IE versions prior 10 to make load event trigger
          if (isLteIE (9)) url += "?" + new Date ().getTime ();

          // load images in memory; trigger throbber replacement when ready
          tmpImages[i] = new Image ();
          tmpImages[i].src = url;
          tmpImages[i].alt = alt;
          tmpImages[i].imgSel = imgSel;

          tmpImages[i].onload = function () {
            insertImage (this.imgSel, this.src, this.alt);
          }

          imagesLoaded = true;
        }
      }
    }

    // nicely replace the spinning wheel with the real image when loaded
    function insertImage (imgSel, url, alt) {
      $(imgSel).fadeOut (100, function () {
        $(imgSel).attr ("src", url).attr ("alt", alt);
      }).fadeIn (300);
    }

    // update the caption
    function updateCaption () {
      var alt = $("div.swiper-slide-active img.swiper-pic").attr ("alt");
      $("div.cs-caption-content").html (alt);
    }

    updateCaption ();

    // left button / previous slide
    $('.arrow-left').click (function (e) {
      if (!imagesLoaded) loadGalleryImages ();
      e.preventDefault ();
      mySwiper.swipePrev ();
      updateCaption ();
    });

    // right button / next slide
    $('.arrow-right').click (function (e) {
      if (!imagesLoaded) loadGalleryImages ();
      e.preventDefault ();
      mySwiper.swipeNext ();
      updateCaption ();
    });
  })
}


/**
 * activate passbook for MacOS 10.8 and iOS 6 and higher (TEL-322, SO-2354)
 */

function initPassbook ()
{ 
  var userAgent = navigator.userAgent;
  // var userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8) AppleWebKit/535.18.5 (KHTML, like Gecko) Version/5.2 Safari/535.18.5";
  // var userAgent = "Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25";
  var regexIOS = /(iPhone|iPod)/; // fix for SO-2362: hide passbook on iPad
  var regexVersion6 = /OS [^2-5]_\d(_\d)?/;
  var regexMacOs = /Mac OS X [\d_\.]+/;
  var regexMacVersion = /[\d_\.]+/;

  var isIOS6 = regexIOS.test (userAgent) && regexVersion6.test (userAgent);

  var macOsVersion = ["0", "0"]; // main version and sub version number
  var macOsVersionStr = userAgent.match (regexMacOs); // Mac OS X 10_8
  
  if (macOsVersionStr != null)
  {
    versionStr = regexMacVersion.exec (macOsVersionStr).toString ();

    if (versionStr.indexOf ("_") != -1)
      macOsVersion = versionStr.split ("_");
    else
      macOsVersion = versionStr.split (".");
  }
  
  var isMacOs10_8 = ((parseInt (macOsVersion[0]) >= 10) &&
    (parseInt (macOsVersion[1]) >= 8));

  if (isIOS6 || isMacOs10_8)
    $("div#offer-panel div.passbook").attr ("style", "display: block");
}


/**
 *  apply rounded corners where necessary for IE versions 6 to 8
 */

function roundedCornersIE ()
{
  if (!isLteIE (8)) return;

  var telnamesCustomColorIcons = "\
    div.icon_left.unknown, \
    div.icon_left.business, \
    div.icon_left.cssemail, \
    div.icon_left.fax, \
    div.icon_left.ftp, \
    div.icon_left.c2c, \
    div.icon_left.im, \
    div.icon_left.aim, \
    div.icon_left.googleim, \
    div.icon_left.msn, \
    div.icon_left.individual, \
    div.icon_left.username, \
    div.icon_left.infoicon, \
    div.icon_left.keywords, \
    div.icon_left.location, \
    div.icon_left.messaging, \
    div.icon_left.mobile, \
    div.icon_left.more, \
    div.icon_left.phone, \
    div.icon_left.voip, \
    div.icon_left.aimvoice, \
    div.icon_left.googlevoice, \
    div.icon_left.msnvoice, \
    div.icon_left.weblink, \
    div.icon_left.premium, \
    div.icon_left.sms, \
    div.icon_left.secureweblink, \
    div.icon_left.home, \
    div.icon_left.cssnote, \
    div.icon_left.picgallery, \
    div.icon_left.movie, \
    div.icon_left.dvoucher, \
    div.icon_left.pdfdownload, \
    div.icon_left.payment";

  var telnamesNonRoundedIcons = "\
    div.icon_left.youtube, \
    div.icon_left.picasaweb, \
    div.icon_left.wordpress, \
    div.icon_left.blogspot, \
    div.icon_left.c2c, \
    div.icon_left.flickr, \
    div.icon_left.googleplus, \
    div.icon_left.xing, \
    div.icon_left.yellowbook, \
    div.icon_left.yellowsearch, \
    div.icon_left.pinterest, \
    div.icon_left.ebay, \
    div.icon_left.amazon, \
    div.icon_left.tripadvisor, \
    div.icon_left.scoot, \
    div.icon_left.facebook, \
    div.icon_left.linkedin, \
    div.icon_left.twitter, \
    div.icon_left.yelp, \
    div.icon_left.citysearch, \
    div.icon_left.opentable, \
    div.icon_left.chow, \
    div.icon_left.merchantcircle, \
    div.icon_left.partnerup, \
    div.icon_left.bbb, \
    div.icon_left.skypevoice, \
    div.icon_left.yahoo, \
    div.icon_left.yahoovoice, \
    div.icon_left.viadeo, \
    div.icon_left.skypeim, \
    div.icon_left.jajah, \
    div.icon_left.com118118, \
    div.icon_left.fr118218, \
    div.icon_left.douban, \
    div.icon_left.fetion, \
    div.icon_left.kaixin001, \
    div.icon_left.renren, \
    div.icon_left.sina, \
    div.icon_left.t_sina, \
    div.icon_left.taobao, \
    div.icon_left.tencent, \
    div.icon_left.wangwang";
    
    $(telnamesCustomColorIcons).corner ();
    $(telnamesNonRoundedIcons).uncorner ();
}

/**
 * Stats: log the event (page view, click, or call).
 *
 * A callback function can optionally be specified to be executed after the
 * logging AJAX request has completed. Note that due to the asynchronism, the
 * callback function is not linked to the initial user interaction.
 * I.e., a window.open () call will be subject to the browsers' popup blocker.
 *
 * Because the Stats logging relies on the *request* parameters only (and
 * does *not* depend on a successful completion of the AJAX call), a timeout is
 * used to limit response times in case that a callback is used.
 *
 * @param event     event type indicator or service name (which is then mapped
 *                  to an event type indicator): "0" = page view,
 *                                               "1" = web click,
 *                                               "2" = email click,
 *                                               "3" = call
 * @param target    the target (or referrer in case of page views)
 * @param callback  optional callback function to be triggered after logging
 */

function logStats (event, target, callback)
{
  if (!loggingUrl.length > 0 || !event.length > 0 || isLteIE (7))
  {
    // execute callback even if logging is deactivated (Fix for SO-2430)
    if (typeof callback == 'function')
    {
      callback.call ();
    }
    return;
  }
  
  // map service name to event type if required
  if (isNaN (event))
  {
    if ("URL" == event || "FTP" == event) eventType = "1"
    else if ("Email" == event) eventType = "2"
    else if ("Phone" == event || "Voice" == event || "Im" == event ||
             "ImVoice" == event || "Click2Call" == event) eventType = "3"
  } else {
    eventType = event;
  }

  telStats['e'] = eventType;
  telStats['t'] = target;

  $.ajax({
    cache: false,
    crossDomain: true,
    url: telStatsUrl,
    data: telStats,
    timeout: 500,
    error: function () {if (typeof callback == 'function') callback.call ();},
    success: function () {if (typeof callback == 'function') callback.call ();}
  });
}


/**
 * helper function to determine Internet Explorer version
 */

function isLteIE (refVersion)
{
  return $.browser.msie && (parseInt ($.browser.version, 10) < refVersion + 1);
}


/**
 * function called when the document finishes loading
 */ 

$(function ()
{
  // <#-- LAYOUT SWITCH -->
  // Telnames: initialize image gallery
  if (layoutCssId >= 100) {
    roundedCornersIE ();
  }
});

