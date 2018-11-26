/**
 * open the given link, either in the same window or a new one, depending on the
 * type of the URL and the value of the target attribute of the link
 */

function openLink (link)
{
  var href = link.attr ("href");
  var target = link.attr ("target");

  if (href)
  {
    if (!target || target == "" || href.indexOf ("mailto:") != -1) {
      // insert tiny delay to allow Stats logging to trigger before page switch
      setTimeout(function () {
        window.location.href = href;
      }, 100);
    }
    else
      window.open (href, target);
  }
}


/**
 * log ui events for Telnic Stats and Google Analytics
 */

function logUiEvent (elem)
{
  var css = elem.attr ('class').split (" ");
  var name = "";
  var value = "";

  for (var i = 0; i < css.length; i++)
  {
    var s = css[i];

    if (s.indexOf ('ga_name_') >= 0)
    {
      s = s.replace ('ga_name_', '');
      name = s;
    }
    else if (s.indexOf ('ga_value_') >= 0)
    {
      s = s.replace ('ga_value_', '');
      value = s;
    }
  }

  if (name.length > 0 && value.length > 0)
  {
    if (loggingGA.length > 0)
      _gaq.push(['_trackEvent', name, encodeURI (value)]);
  }
  else
  {
    // NTN clicks are not subject to GA logging, but to Telnic Stats logging
    var href = elem.attr ("href");
    
    if (href && href.indexOf (".tel") != -1)
    {
      name = "1"; // event type 'click'
      value = href.substring (href.lastIndexOf ("/") + 1);
    }
  }

  logStats (name, value);
  return (this);
}


/**
 *  Function to add a toggle function to certain control elements to allow the
 *  user to show and hide more information on the respective item (e.g.,
 *  Google Maps location information, a movie player component or a picture
 *  gallery, etc.).
 *
 *  Note: use initHideShowPanel for initially visible elements, and
 *  initShowHidePanel for initially hidden panels.
 */

function initShowHideToggles ()
{
  var clickableAreaSelector;  // button or area the user can click to show/hide
  var targetPanelSelector;    // the DOM element that is shown or hidden
  var infoTextSelector;       // the DOM element containing the info text
  var hideTextKey;            // key for the hide info text in localizedStrings
  var showTextKey;            // key for the show info text in localizedStrings

  // payments (CR378) - initialize up to 5 pamyent items
  for (i=1; i<=5; i++)
  {
    clickableAreaSelector = ".show-payment.toggle_id" + i;
    targetPanelSelector = "div.payment-panel.toggle_id" + i;
    infoTextSelector = "a.toggle-switch_payment-panel.toggle_id" + i;
    hideTextKey = "text.payment.hide";
    showTextKey = "text.payment.view";

    initHideShowPanel (clickableAreaSelector, targetPanelSelector,
      infoTextSelector, hideTextKey, showTextKey);

    // payments tac (CR378 terms and conditions sub area)
    clickableAreaSelector = ".show-paymentterms.toggle_id" + i;
    targetPanelSelector = "div.paymentterms-panel.toggle_id" + i;
    infoTextSelector = "a.toggle-switch_paymentterms-panel.toggle_id" + i;
    hideTextKey = "text.paymentterms.hide";
    showTextKey = "text.paymentterms.view";

    initShowHidePanel (clickableAreaSelector, targetPanelSelector,
    infoTextSelector, hideTextKey, showTextKey);
  }

  // offers (CR289)
  clickableAreaSelector = ".show-offer";
  targetPanelSelector = "#offer-panel";
  infoTextSelector = "a.toggle-switch_offer-panel";
  hideTextKey = "text.offer.hide";
  showTextKey = "text.offer.view";

  initHideShowPanel (clickableAreaSelector, targetPanelSelector,
    infoTextSelector, hideTextKey, showTextKey);

  // offers tac (CR289 terms and conditions sub area)
  clickableAreaSelector = ".show-offerterms";
  targetPanelSelector = "#offerterms-panel";
  infoTextSelector = "a.toggle-switch_offerterms-panel";
  hideTextKey = "text.offerterms.hide";
  showTextKey = "text.offerterms.view";

  initShowHidePanel (clickableAreaSelector, targetPanelSelector,
  infoTextSelector, hideTextKey, showTextKey);

  // movie (CR291)
  clickableAreaSelector = ".show-movie";
  targetPanelSelector = "#movie-panel";
  infoTextSelector = "a.toggle-switch_movie-panel";
  hideTextKey = "text.movie.hide";
  showTextKey = "text.movie.view";

  initHideShowPanel (clickableAreaSelector, targetPanelSelector,
  infoTextSelector, hideTextKey, showTextKey);

  // picgallery (CR292)
  clickableAreaSelector = ".show-picgallery";
  targetPanelSelector = "#picgallery-panel";
  infoTextSelector = "a.toggle-switch_picgallery-panel";
  hideTextKey = "text.picgallery.hide";
  showTextKey = "text.picgallery.view";

  initHideShowPanel (clickableAreaSelector, targetPanelSelector,
  infoTextSelector, hideTextKey, showTextKey);

  // Google Maps
  $('.show-map').toggle (
  function () {
    var id = $(this).attr ("id").split ("_");
    $('#map_' + id[0]).show ('fast');
    if ($('#map_inner_' + id[0]).is (':visible') && $('#iframe_' + id[0]).length == 0)
      $("<iframe scrolling='no' frameborder='0' id='iframe_" + id[0]
        + "' class='databox-map'>").src (
        id[1]).appendTo ('#map_inner_' + id[0]);
    $("a.map-toggle_" + id[0]).text (getText ("text.map.hide"));
  }, function () {
    var id = $(this).attr ("id").split ("_");
    $('#map_' + id[0]).hide ('fast');
    $("a.map-toggle_" + id[0]).text (getText ("text.map.view"));
  });

  // general id-based toggles
  $('.show-more').toggle (
  function () {
    var id = $(this).attr ("id").split ("_");
    $('#toggle-target_' + id[0]).show ('fast');
    $("a.toggle-switch_" + id[0]).text (getText ("text.hide"));
  }, function () {
    var id = $(this).attr ("id").split ("_");
    $('#toggle-target_' + id[0]).hide ('fast');
    $("a.toggle-switch_" + id[0]).text (getText ("text.view"));
  });
}


/**
 * initialize content collapse functionality (for TelNames layout, see TEL305)
 */

function initContentCollapse ()
{
	$("#header").click (function () {
		var currentClass = $(this).attr ("class");
		switch (currentClass)
		{
			case "open" :
				$("#content").hide ();
        $("#action-share").hide ();
        $("#content-right div.vads-ctr").hide ();
        $("#hdlns-ctr").hide ();
				$(this).addClass ("closed").removeClass ("open"); 
				break;
			case "closed" :
				$("#content").show ();
        $("#action-share").show ();
        $("#content-right div.vads-ctr").show ();
        $("#hdlns-ctr").show ();
				$(this).addClass ("open").removeClass ("closed");
				break;
		}
	});
}


/**
 * specific initialization required for the TEL393 TelNames layout (CSS ID 101)
 */

function initLayout101 ()
{
  initLayoutTelNames ();

  // move domain's short description to header and reorder header elements
  $("#photo").appendTo ($("#overlay"));
  $("#contact").appendTo ($("#overlay"));
}


/**
 * specific initialization required for the TelNames layout (CSS ID 100)
 */

function initLayoutTelNames ()
{
  initContentCollapse ();
  initGallerySwiper ();

  // special file record presentation for TelNames
  var filerecLabelSel = "div.pdfdownload + dl dt";
  var filerecLinkSel = "div.pdfdownload + dl dd a div";

  // replace default labels (e.g. "Web" or "Secure Web") with "PDF"
  $(filerecLabelSel).each (function () {
    var currentLabel = $.trim ($(this).html ());

    if (currentLabel === (getText ("defaultlabel.web")) ||
      currentLabel === (getText ("defaultlabel.web-ssl")))
      {
        $(this).text (getText ("defaultlabel.pdf"));
      }
    });

  // exchange file URL with internationalized "View" message
  $(filerecLinkSel).text (getText ("text.view"));

  initPassbook ();

  // PayPal stuff
  // set target for PayPal buttons to open a new window
  $("form.paypal-button").attr ("target", "new");

  // update payment/donation amount if user changes the value
  $("#payment-panel1 input.amount").change (function() {
    $("#payment-panel1 form.paypal-button input[name=amount]").val(
    $("#payment-panel1 input.amount[name=amount]").val());
  });
  $("#payment-panel2 input.amount").change (function() {
    $("#payment-panel2 form.paypal-button input[name=amount]").val(
    $("#payment-panel2 input.amount[name=amount]").val());
  });
  $("#payment-panel3 input.amount").change (function() {
    $("#payment-panel3 form.paypal-button input[name=amount]").val(
    $("#payment-panel3 input.amount[name=amount]").val());
  });
  $("#payment-panel4 input.amount").change (function() {
    $("#payment-panel4 form.paypal-button input[name=amount]").val(
    $("#payment-panel4 input.amount[name=amount]").val());
  });
  $("#payment-panel5 input.amount").change (function() {
    $("#payment-panel5 form.paypal-button input[name=amount]").val(
    $("#payment-panel5 input.amount[name=amount]").val());
  });

  var isIE7 = ($.browser.msie && (parseInt ($.browser.version, 10) === 7));

  if (isIE7)
  {
    $("div.payment-panel div.wrapper input.amount + div.button").attr (
      "style", "margin-top: -29px;");
  }
}


/**
 * specific initialization required for layout 6 (CSS ID 78)
 */

function initLayout6 ()
{
  // reduce action box margin if no search box is present (SO-2320)
  if ($("#search").length == 0)
    $("div#action-ctr").attr ("style", "margin-top: 20px;");
  
  // corrections required in case that breadcrumbs are displayed
  if ($("#breadcrumbs").length > 0)
  {
    $("div#header-right").attr ("style", "top: 181px;");
    $("div#poweredby-text").attr ("style", "top: -248px;");
    $("div.poweredby-dottel").attr ("style", "top: -249px;");
  }
  
  // Fix for SO-2357: insert space between top image ad and first data item
  $("div.left-box:eq(0)").attr  ("style", "margin-top: 7px;");
}


/**
 * specific initialization required for layout 7 (CSS ID 79)
 */

function initLayout7 ()
{
  // animated back to top link (fix for SO-2328)
  $("div.back-to-top a[href='#']").click (function () {
    $("html, body").animate ({scrollTop: 0}, "slow");
  return false;
  });
  
  // reduce action box margin if no search box is present (SO-2320)
  if ($("#search").length == 0)
    $("div#action-ctr").attr ("style", "margin-top: 10px;");

  // position DDS according to logo width
  var logoSelDesktop = "#photo img";
  var textSelDesktop = "#header-left div.info";

  // logo needs to be fully loaded before we continue
  if ((typeof $(logoSelDesktop)[0] != 'undefined' &&
    $(logoSelDesktop)[0].complete != true))
  {
    $(logoSelDesktop).load (function () {initLayout7 ();});
    return;
  }

  var logoWidth = parseInt ($(logoSelDesktop).width (), 10);
  var shiftDistance = 0; // default value if no logo is present

  if (logoWidth > 0)
    shiftDistance = logoWidth + 33;

  $(textSelDesktop).attr ("style", "margin-left:" + shiftDistance + "px");
  
  // right column corrections required in case that breadcrumbs are displayed
  if ($("#breadcrumbs").length > 0)
    $("div#header-right").attr ("style", "top: 126px;");
}


/**
 * specific initialization required for layout 8 (CSS ID 80)
 */

function initLayout8 ()
{
  var isLteIE7 = ($.browser.msie && (parseInt ($.browser.version, 10) < 8));
  var isIE8 = ($.browser.msie && (parseInt ($.browser.version, 10) === 8));
  
  var headerHeight = Math.max ($("#header-right").height (),
    $("#header-left").height ());
  
  // corrections in case that error messages and/or breadcrumbs are displayed
  var breadcrumbsHeight = 0;
  var errorHeight = 0;

  if ($("#breadcrumbs").length > 0)
    breadcrumbsHeight = $("#breadcrumbs").height ();

  if ($("#error").height () > 0) 
    errorHeight = $("#error").height () + 17;
  
  // fix to compensate for IE7's height miscalculation
  if (isLteIE7 && ($.trim ($("#error").html ()).length == 0))
    errorHeight = 0;
  
	var overallHeaderHeight = headerHeight + 10;
	var logoVertOffset = overallHeaderHeight + 25;
  
  logoVertOffset += (errorHeight + breadcrumbsHeight);
  
	$("#header").attr ("style", "height:" + overallHeaderHeight + "px;");
	$("#titlebar").attr ("style", "height:" + overallHeaderHeight + "px;");
	$("#photo").attr ("style", "top:" + logoVertOffset + "px;");

  var logoSelDesktop = "#photo img";
  var textSelDesktop = "div#contact";
  
  // logo needs to be fully loaded before we continue
  if ((typeof $(logoSelDesktop)[0] != 'undefined') &&
    $(logoSelDesktop)[0].complete != true)
  {
    if (!isIE8 && !isLteIE7)
      // IE does not handle the load event reliably, e.g. for cached images
      $(logoSelDesktop).load (function () {initLayout8 ();});
  }
  
  // text header horizontal positioning and box size
  var logoWidth = 0;
  var logoHeight = 0;
  var textHeaderHeight = 0;
  
  if ($(logoSelDesktop).length > 0) {
    logoWidth = parseInt ($(logoSelDesktop).width (), 10);
    logoHeight = parseInt ($(logoSelDesktop).height (), 10);
  }
  
  if ($(textSelDesktop).length > 0)
    textHeaderHeight = parseInt ($(textSelDesktop).height (), 10);

  var textHeaderHorizOffset = 10; // default offest if no logo is present

  // text header horizontal positioning
  if (logoWidth > 0)
    textHeaderHorizOffset = logoWidth + 25;
  
  // text header width
  textHeaderWidth = 743 - textHeaderHorizOffset;
  
  // header box size
  textHeaderHeight = Math.max (textHeaderHeight, logoHeight);
  
  $(textSelDesktop).attr ("style", "padding-left:" + textHeaderHorizOffset +
    "px; width:" + textHeaderWidth +
    "px; min-height: " + textHeaderHeight + "px;");

  // ensure width gets also applied to child elements (SO-2318, SO-2321)
  $("div#contact h3").attr ("style", "width:" + textHeaderWidth + "px;");
    
  // right column top alignment
  var rightColVertOffset = 10;  // default offset if no text header is present
  
  if (textHeaderHeight > 0)
    rightColVertOffset = textHeaderHeight + 88;

  $("div#action-ctr").attr ("style", "margin-top:" +
    (errorHeight + rightColVertOffset) + "px;");
  
  // fix for logo load event not being triggered in every case on webkit
  if ($.browser.webkit == true)
    $(window).load (function () {initLayout8 ();});
}


/**
 * specific initialization for those templates that require it
 */

function initLayouts ()
{
  // <#-- LAYOUT SWITCH -->
  switch (layoutCssId) {
    case 78:
    case 81:
      initLayout6 (); // layout 6, 9 (CSS IDs 78, 81)
      break;
    case 79:
    case 82:
      initLayout7 (); // layout 7, 10 (CSS IDs 79, 82)
      break;
    case 80:
    case 83:
    case 84:
    case 85:
      initLayout8 (); // layout 8, 11, 12, 13 (CSS IDs 80, 83, 84, 85)
      break;
    case 100:
      initLayoutTelNames (); // TelNames layout (CSS ID 100)
      break;
    case 101:
      initLayout101 (); // TelNames layout (CSS ID 101) (TEL393)
      break;
    default:
      break;
  }    
}


/**
 * initialize the JavaScript-bound events
 */

function init ()
{
  initTelPages (adjustVisitedST);
  initTelFriends ();
  add_word_break ();
  initShowHideToggles ();
    
  // activate links (fix for SO-2322)
  $("a.delayed_activation").removeClass ("delayed_link");
  
  initLayouts ();

  if (tunneledLogin)
    ui_open_login ();

  $('div.close').click (function () {
		$('#form').fadeOut ('slow',
			function () {$('#filter').fadeOut ('fast');
		})
	});

	$('.login-button').click (function () {
		$('div.loginerror').fadeIn ('fast');
	});

  // bind click events to the container element instead of the anchor only
  var wrapperSelector = "div.databox";

  $(wrapperSelector).each (function() {
    // find first <a> tag, add ga_bound tag and prevent default event action
    $(this).find ("a:first").
      data ("ga_bound", true).
      click (function (evt) {evt.preventDefault ();});
      
    $(this).click (function (evt) {
      // note parent selector (wrapperSelector) to address event propagation
      var link = $(evt.target).closest (wrapperSelector).find ("a:first");
      logUiEvent (link).openLink (link);
    })
    .mouseenter (function () {
      $(this).addClass ("over");
    })
    .mouseleave (function () {
      $(this).removeClass ("over");
    });
  });
  
  if (!(telPagesUrl === ""))
    window.open(telPagesUrl, "_blank");

  if (searchRedirect)
  {
    ui_sendTelPagesRequest ();
  }
}


/**
 * Function called when the DOM is loaded. (Note: use $(window).load to trigger
 * when everything else (e.g., images) has loaded as well.)
 */ 

$(document).ready (function (){
  init ();
  logStats ("0", document.referrer);
});
