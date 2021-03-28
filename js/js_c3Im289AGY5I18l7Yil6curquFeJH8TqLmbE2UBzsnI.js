Drupal.locale = { 'pluralFormula': function ($n) { return Number(($n!=1)); }, 'strings': {"":{"Search":"Result","The selected file %filename cannot be uploaded. Only files with the following extensions are allowed: %extensions.":"The following file %filename could not be uploaded. Only files with the following extensions %extensions are allowed.\r\n","__CURRENCY_SYMBOL":"\u20ac"},"complet":{"__UNAVAILABLE_OFFER":"Address not eligible"}} };;
(function ($) {

    Drupal.vk_ajax_call = function( settings ) {

        settings.event = 'onload';
        settings.keypress = false;
        settings.prevent = false;

        // init ajax instance
        Drupal.ajax[ settings.url ] = new Drupal.ajax(null, $(document.body), settings );

        if ( settings.type ) {
            Drupal.ajax[ settings.url ].options.type = settings.type;
        }
        if ( settings.dataType ) {
            Drupal.ajax[ settings.url ].options.dataType = settings.dataType;
        }

        // trigger the ajax call directly
        Drupal.ajax[ settings.url ].vk_ajax_call();
    };


    Drupal.ajax.prototype.vk_ajax_call = function() {
        var ajax = this;
        try {
            $.ajax(ajax.options);
        }
        catch (err) {
            return false;
        }
        return false;
    };


})(jQuery);;
(function ($) {

/**
 * A progressbar object. Initialized with the given id. Must be inserted into
 * the DOM afterwards through progressBar.element.
 *
 * method is the function which will perform the HTTP request to get the
 * progress bar state. Either "GET" or "POST".
 *
 * e.g. pb = new progressBar('myProgressBar');
 *      some_element.appendChild(pb.element);
 */
Drupal.progressBar = function (id, updateCallback, method, errorCallback) {
  var pb = this;
  this.id = id;
  this.method = method || 'GET';
  this.updateCallback = updateCallback;
  this.errorCallback = errorCallback;

  // The WAI-ARIA setting aria-live="polite" will announce changes after users
  // have completed their current activity and not interrupt the screen reader.
  this.element = $('<div class="progress" aria-live="polite"></div>').attr('id', id);
  this.element.html('<div class="bar"><div class="filled"></div></div>' +
                    '<div class="percentage"></div>' +
                    '<div class="message">&nbsp;</div>');
};

/**
 * Set the percentage and status message for the progressbar.
 */
Drupal.progressBar.prototype.setProgress = function (percentage, message) {
  if (percentage >= 0 && percentage <= 100) {
    $('div.filled', this.element).css('width', percentage + '%');
    $('div.percentage', this.element).html(percentage + '%');
  }
  $('div.message', this.element).html(message);
  if (this.updateCallback) {
    this.updateCallback(percentage, message, this);
  }
};

/**
 * Start monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.startMonitoring = function (uri, delay) {
  this.delay = delay;
  this.uri = uri;
  this.sendPing();
};

/**
 * Stop monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.stopMonitoring = function () {
  clearTimeout(this.timer);
  // This allows monitoring to be stopped from within the callback.
  this.uri = null;
};

/**
 * Request progress data from server.
 */
Drupal.progressBar.prototype.sendPing = function () {
  if (this.timer) {
    clearTimeout(this.timer);
  }
  if (this.uri) {
    var pb = this;
    // When doing a post request, you need non-null data. Otherwise a
    // HTTP 411 or HTTP 406 (with Apache mod_security) error may result.
    $.ajax({
      type: this.method,
      url: this.uri,
      data: '',
      dataType: 'json',
      success: function (progress) {
        // Display errors.
        if (progress.status == 0) {
          pb.displayError(progress.data);
          return;
        }
        // Update display.
        pb.setProgress(progress.percentage, progress.message);
        // Schedule next timer.
        pb.timer = setTimeout(function () { pb.sendPing(); }, pb.delay);
      },
      error: function (xmlhttp) {
        pb.displayError(Drupal.ajaxError(xmlhttp, pb.uri));
      }
    });
  }
};

/**
 * Display errors on the page.
 */
Drupal.progressBar.prototype.displayError = function (string) {
  var error = $('<div class="messages error"></div>').html(string);
  $(this.element).before(error).hide();

  if (this.errorCallback) {
    this.errorCallback(this);
  }
};

})(jQuery);
;
/**
 * @file
 *
 * Implement a modal form.
 *
 * @see modal.inc for documentation.
 *
 * This javascript relies on the CTools ajax responder.
 */

(function ($) {
  // Make sure our objects are defined.
  Drupal.CTools = Drupal.CTools || {};
  Drupal.CTools.Modal = Drupal.CTools.Modal || {};

  /**
   * Display the modal
   *
   * @todo -- document the settings.
   */
  Drupal.CTools.Modal.show = function(choice) {
    var opts = {};

    if (choice && typeof choice == 'string' && Drupal.settings[choice]) {
      // This notation guarantees we are actually copying it.
      $.extend(true, opts, Drupal.settings[choice]);
    }
    else if (choice) {
      $.extend(true, opts, choice);
    }

    var defaults = {
      modalTheme: 'CToolsModalDialog',
      throbberTheme: 'CToolsModalThrobber',
      animation: 'show',
      animationSpeed: 'fast',
      modalSize: {
        type: 'scale',
        width: .8,
        height: .8,
        addWidth: 0,
        addHeight: 0,
        // How much to remove from the inner content to make space for the
        // theming.
        contentRight: 25,
        contentBottom: 45
      },
      modalOptions: {
        opacity: .55,
        background: '#fff'
      },
      modalClass: 'default'
    };

    var settings = {};
    $.extend(true, settings, defaults, Drupal.settings.CToolsModal, opts);

    if (Drupal.CTools.Modal.currentSettings && Drupal.CTools.Modal.currentSettings != settings) {
      Drupal.CTools.Modal.modal.remove();
      Drupal.CTools.Modal.modal = null;
    }

    Drupal.CTools.Modal.currentSettings = settings;

    var resize = function(e) {
      // When creating the modal, it actually exists only in a theoretical
      // place that is not in the DOM. But once the modal exists, it is in the
      // DOM so the context must be set appropriately.
      var context = e ? document : Drupal.CTools.Modal.modal;

      if (Drupal.CTools.Modal.currentSettings.modalSize.type == 'scale') {
        var width = $(window).width() * Drupal.CTools.Modal.currentSettings.modalSize.width;
        var height = $(window).height() * Drupal.CTools.Modal.currentSettings.modalSize.height;
      }
      else {
        var width = Drupal.CTools.Modal.currentSettings.modalSize.width;
        var height = Drupal.CTools.Modal.currentSettings.modalSize.height;
      }

      // Use the additionol pixels for creating the width and height.
      $('div.ctools-modal-content', context).css({
        'width': width + Drupal.CTools.Modal.currentSettings.modalSize.addWidth + 'px',
        'height': height + Drupal.CTools.Modal.currentSettings.modalSize.addHeight + 'px'
      });
      $('div.ctools-modal-content .modal-content', context).css({
        'width': (width - Drupal.CTools.Modal.currentSettings.modalSize.contentRight) + 'px',
        'height': (height - Drupal.CTools.Modal.currentSettings.modalSize.contentBottom) + 'px'
      });
    }

    if (!Drupal.CTools.Modal.modal) {
      Drupal.CTools.Modal.modal = $(Drupal.theme(settings.modalTheme));
      if (settings.modalSize.type == 'scale') {
        $(window).bind('resize', resize);
      }
    }

    resize();

    $('span.modal-title', Drupal.CTools.Modal.modal).html(Drupal.CTools.Modal.currentSettings.loadingText);
    Drupal.CTools.Modal.modalContent(Drupal.CTools.Modal.modal, settings.modalOptions, settings.animation, settings.animationSpeed, settings.modalClass);
    $('#modalContent .modal-content').html(Drupal.theme(settings.throbberTheme)).addClass('ctools-modal-loading');

    // Position autocomplete results based on the scroll position of the modal.
    $('#modalContent .modal-content').delegate('input.form-autocomplete', 'keyup', function() {
      $('#autocomplete').css('top', $(this).position().top + $(this).outerHeight() + $(this).offsetParent().filter('#modal-content').scrollTop());
    });
  };

  /**
   * Hide the modal
   */
  Drupal.CTools.Modal.dismiss = function() {
    if (Drupal.CTools.Modal.modal) {
      Drupal.CTools.Modal.unmodalContent(Drupal.CTools.Modal.modal);
    }
  };

  /**
   * Provide the HTML to create the modal dialog.
   */
  Drupal.theme.prototype.CToolsModalDialog = function () {
    var html = ''
    html += '<div id="ctools-modal">'
    html += '  <div class="ctools-modal-content">' // panels-modal-content
    html += '    <div class="modal-header">';
    html += '      <a class="close" href="#">';
    html +=          Drupal.CTools.Modal.currentSettings.closeText + Drupal.CTools.Modal.currentSettings.closeImage;
    html += '      </a>';
    html += '      <span id="modal-title" class="modal-title">&nbsp;</span>';
    html += '    </div>';
    html += '    <div id="modal-content" class="modal-content">';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';

    return html;
  }

  /**
   * Provide the HTML to create the throbber.
   */
  Drupal.theme.prototype.CToolsModalThrobber = function () {
    var html = '';
    html += '<div id="modal-throbber">';
    html += '  <div class="modal-throbber-wrapper">';
    html +=      Drupal.CTools.Modal.currentSettings.throbber;
    html += '  </div>';
    html += '</div>';

    return html;
  };

  /**
   * Figure out what settings string to use to display a modal.
   */
  Drupal.CTools.Modal.getSettings = function (object) {
    var match = $(object).attr('class').match(/ctools-modal-(\S+)/);
    if (match) {
      return match[1];
    }
  }

  /**
   * Click function for modals that can be cached.
   */
  Drupal.CTools.Modal.clickAjaxCacheLink = function () {
    Drupal.CTools.Modal.show(Drupal.CTools.Modal.getSettings(this));
    return Drupal.CTools.AJAX.clickAJAXCacheLink.apply(this);
  };

  /**
   * Handler to prepare the modal for the response
   */
  Drupal.CTools.Modal.clickAjaxLink = function () {
    Drupal.CTools.Modal.show(Drupal.CTools.Modal.getSettings(this));
    return false;
  };

  /**
   * Submit responder to do an AJAX submit on all modal forms.
   */
  Drupal.CTools.Modal.submitAjaxForm = function(e) {
    var $form = $(this);
    var url = $form.attr('action');

    setTimeout(function() { Drupal.CTools.AJAX.ajaxSubmit($form, url); }, 1);
    return false;
  }

  /**
   * Bind links that will open modals to the appropriate function.
   */
  Drupal.behaviors.ZZCToolsModal = {
    attach: function(context) {
      // Bind links
      // Note that doing so in this order means that the two classes can be
      // used together safely.
      /*
       * @todo remimplement the warm caching feature
       $('a.ctools-use-modal-cache', context).once('ctools-use-modal', function() {
         $(this).click(Drupal.CTools.Modal.clickAjaxCacheLink);
         Drupal.CTools.AJAX.warmCache.apply(this);
       });
        */

      $('area.ctools-use-modal, a.ctools-use-modal', context).once('ctools-use-modal', function() {
        var $this = $(this);
        $this.click(Drupal.CTools.Modal.clickAjaxLink);
        // Create a drupal ajax object
        var element_settings = {};
        if ($this.attr('href')) {
          element_settings.url = $this.attr('href');
          element_settings.event = 'click';
          element_settings.progress = { type: 'throbber' };
        }
        var base = $this.attr('href');
        Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
      });

      // Bind buttons
      $('input.ctools-use-modal, button.ctools-use-modal', context).once('ctools-use-modal', function() {
        var $this = $(this);
        $this.click(Drupal.CTools.Modal.clickAjaxLink);
        var button = this;
        var element_settings = {};

        // AJAX submits specified in this manner automatically submit to the
        // normal form action.
        element_settings.url = Drupal.CTools.Modal.findURL(this);
        if (element_settings.url == '') {
          element_settings.url = $(this).closest('form').attr('action');
        }
        element_settings.event = 'click';
        element_settings.setClick = true;

        var base = $this.attr('id');
        Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);

        // Make sure changes to settings are reflected in the URL.
        $('.' + $(button).attr('id') + '-url').change(function() {
          Drupal.ajax[base].options.url = Drupal.CTools.Modal.findURL(button);
        });
      });

      // Bind our custom event to the form submit
      $('#modal-content form', context).once('ctools-use-modal', function() {
        var $this = $(this);
        var element_settings = {};

        element_settings.url = $this.attr('action');
        element_settings.event = 'submit';
        element_settings.progress = { 'type': 'throbber' }
        var base = $this.attr('id');

        Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
        Drupal.ajax[base].form = $this;

        $('input[type=submit], button', this).click(function(event) {
          Drupal.ajax[base].element = this;
          this.form.clk = this;
          // Stop autocomplete from submitting.
          if (Drupal.autocompleteSubmit && !Drupal.autocompleteSubmit()) {
            return false;
          }
          // An empty event means we were triggered via .click() and
          // in jquery 1.4 this won't trigger a submit.
          // We also have to check jQuery version to prevent
          // IE8 + jQuery 1.4.4 to break on other events
          // bound to the submit button.
          if (jQuery.fn.jquery.substr(0, 3) === '1.4' && typeof event.bubbles === "undefined") {
            $(this.form).trigger('submit');
            return false;
          }
        });
      });

      // Bind a click handler to allow elements with the 'ctools-close-modal'
      // class to close the modal.
      $('.ctools-close-modal', context).once('ctools-close-modal')
        .click(function() {
          Drupal.CTools.Modal.dismiss();
          return false;
        });
    }
  };

  // The following are implementations of AJAX responder commands.

  /**
   * AJAX responder command to place HTML within the modal.
   */
  Drupal.CTools.Modal.modal_display = function(ajax, response, status) {
    if ($('#modalContent').length == 0) {
      Drupal.CTools.Modal.show(Drupal.CTools.Modal.getSettings(ajax.element));
    }
    $('#modal-title').html(response.title);
    // Simulate an actual page load by scrolling to the top after adding the
    // content. This is helpful for allowing users to see error messages at the
    // top of a form, etc.
    $('#modal-content').html(response.output).scrollTop(0);
    $(document).trigger('CToolsAttachBehaviors', $('#modalContent'));

    // Attach behaviors within a modal dialog.
    var settings = response.settings || ajax.settings || Drupal.settings;
    Drupal.attachBehaviors($('#modalContent'), settings);

    if ($('#modal-content').hasClass('ctools-modal-loading')) {
      $('#modal-content').removeClass('ctools-modal-loading');
    }
    else {
      // If the modal was already shown, and we are simply replacing its
      // content, then focus on the first focusable element in the modal.
      // (When first showing the modal, focus will be placed on the close
      // button by the show() function called above.)
      $('#modal-content :focusable:first').focus();
    }
  }

  /**
   * AJAX responder command to dismiss the modal.
   */
  Drupal.CTools.Modal.modal_dismiss = function(command) {
    Drupal.CTools.Modal.dismiss();
    $('link.ctools-temporary-css').remove();
  }

  /**
   * Display loading
   */
  //Drupal.CTools.AJAX.commands.modal_loading = function(command) {
  Drupal.CTools.Modal.modal_loading = function(command) {
    Drupal.CTools.Modal.modal_display({
      output: Drupal.theme(Drupal.CTools.Modal.currentSettings.throbberTheme),
      title: Drupal.CTools.Modal.currentSettings.loadingText
    });
  }

  /**
   * Find a URL for an AJAX button.
   *
   * The URL for this gadget will be composed of the values of items by
   * taking the ID of this item and adding -url and looking for that
   * class. They need to be in the form in order since we will
   * concat them all together using '/'.
   */
  Drupal.CTools.Modal.findURL = function(item) {
    var url = '';
    var url_class = '.' + $(item).attr('id') + '-url';
    $(url_class).each(
      function() {
        var $this = $(this);
        if (url && $this.val()) {
          url += '/';
        }
        url += $this.val();
      });
    return url;
  };


  /**
   * modalContent
   * @param content string to display in the content box
   * @param css obj of css attributes
   * @param animation (fadeIn, slideDown, show)
   * @param speed (valid animation speeds slow, medium, fast or # in ms)
   * @param modalClass class added to div#modalContent
   */
  Drupal.CTools.Modal.modalContent = function(content, css, animation, speed, modalClass) {
    // If our animation isn't set, make it just show/pop
    if (!animation) {
      animation = 'show';
    }
    else {
      // If our animation isn't "fadeIn" or "slideDown" then it always is show
      if (animation != 'fadeIn' && animation != 'slideDown') {
        animation = 'show';
      }
    }

    if (!speed && 0 !== speed) {
      speed = 'fast';
    }

    // Build our base attributes and allow them to be overriden
    css = jQuery.extend({
      position: 'absolute',
      left: '0px',
      margin: '0px',
      background: '#000',
      opacity: '.55'
    }, css);

    // Add opacity handling for IE.
    css.filter = 'alpha(opacity=' + (100 * css.opacity) + ')';
    content.hide();

    // If we already have modalContent, remove it.
    if ($('#modalBackdrop').length) $('#modalBackdrop').remove();
    if ($('#modalContent').length) $('#modalContent').remove();

    // position code lifted from http://www.quirksmode.org/viewport/compatibility.html
    if (self.pageYOffset) { // all except Explorer
    var wt = self.pageYOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
      var wt = document.documentElement.scrollTop;
    } else if (document.body) { // all other Explorers
      var wt = document.body.scrollTop;
    }

    // Get our dimensions

    // Get the docHeight and (ugly hack) add 50 pixels to make sure we dont have a *visible* border below our div
    var docHeight = $(document).height() + 50;
    var docWidth = $(document).width();
    var winHeight = $(window).height();
    var winWidth = $(window).width();
    if( docHeight < winHeight ) docHeight = winHeight;

    // Create our divs
    $('body').append('<div id="modalBackdrop" class="backdrop-' + modalClass + '" style="z-index: 1000; display: none;"></div><div id="modalContent" class="modal-' + modalClass + '" style="z-index: 1001; position: absolute;">' + $(content).html() + '</div>');

    // Get a list of the tabbable elements in the modal content.
    var getTabbableElements = function () {
      var tabbableElements = $('#modalContent :tabbable'),
          radioButtons = tabbableElements.filter('input[type="radio"]');

      // The list of tabbable elements from jQuery is *almost* right. The
      // exception is with groups of radio buttons. The list from jQuery will
      // include all radio buttons, when in fact, only the selected radio button
      // is tabbable, and if no radio buttons in a group are selected, then only
      // the first is tabbable.
      if (radioButtons.length > 0) {
        // First, build up an index of which groups have an item selected or not.
        var anySelected = {};
        radioButtons.each(function () {
          var name = this.name;

          if (typeof anySelected[name] === 'undefined') {
            anySelected[name] = radioButtons.filter('input[name="' + name + '"]:checked').length !== 0;
          }
        });

        // Next filter out the radio buttons that aren't really tabbable.
        var found = {};
        tabbableElements = tabbableElements.filter(function () {
          var keep = true;

          if (this.type == 'radio') {
            if (anySelected[this.name]) {
              // Only keep the selected one.
              keep = this.checked;
            }
            else {
              // Only keep the first one.
              if (found[this.name]) {
                keep = false;
              }
              found[this.name] = true;
            }
          }

          return keep;
        });
      }

      return tabbableElements.get();
    };

    // Keyboard and focus event handler ensures only modal elements gain focus.
    modalEventHandler = function( event ) {
      target = null;
      if ( event ) { //Mozilla
        target = event.target;
      } else { //IE
        event = window.event;
        target = event.srcElement;
      }

      var parents = $(target).parents().get();
      for (var i = 0; i < parents.length; ++i) {
        var position = $(parents[i]).css('position');
        if (position == 'absolute' || position == 'fixed') {
          return true;
        }
      }

      if ($(target).is('#modalContent, body') || $(target).filter('*:visible').parents('#modalContent').length) {
        // Allow the event only if target is a visible child node
        // of #modalContent.
        return true;
      }
      else {
        getTabbableElements()[0].focus();
      }

      event.preventDefault();
    };
    $('body').bind( 'focus', modalEventHandler );
    $('body').bind( 'keypress', modalEventHandler );

    // Keypress handler Ensures you can only TAB to elements within the modal.
    // Based on the psuedo-code from WAI-ARIA 1.0 Authoring Practices section
    // 3.3.1 "Trapping Focus".
    modalTabTrapHandler = function (evt) {
      // We only care about the TAB key.
      if (evt.which != 9) {
        return true;
      }

      var tabbableElements = getTabbableElements(),
          firstTabbableElement = tabbableElements[0],
          lastTabbableElement = tabbableElements[tabbableElements.length - 1],
          singleTabbableElement = firstTabbableElement == lastTabbableElement,
          node = evt.target;

      // If this is the first element and the user wants to go backwards, then
      // jump to the last element.
      if (node == firstTabbableElement && evt.shiftKey) {
        if (!singleTabbableElement) {
          lastTabbableElement.focus();
        }
        return false;
      }
      // If this is the last element and the user wants to go forwards, then
      // jump to the first element.
      else if (node == lastTabbableElement && !evt.shiftKey) {
        if (!singleTabbableElement) {
          firstTabbableElement.focus();
        }
        return false;
      }
      // If this element isn't in the dialog at all, then jump to the first
      // or last element to get the user into the game.
      else if ($.inArray(node, tabbableElements) == -1) {
        // Make sure the node isn't in another modal (ie. WYSIWYG modal).
        var parents = $(node).parents().get();
        for (var i = 0; i < parents.length; ++i) {
          var position = $(parents[i]).css('position');
          if (position == 'absolute' || position == 'fixed') {
            return true;
          }
        }

        if (evt.shiftKey) {
          lastTabbableElement.focus();
        }
        else {
          firstTabbableElement.focus();
        }
      }
    };
    $('body').bind('keydown', modalTabTrapHandler);

    // Create our content div, get the dimensions, and hide it
    var modalContent = $('#modalContent').css('top','-1000px');
    var $modalHeader = modalContent.find('.modal-header');
    var mdcTop = wt + Math.max((winHeight / 2) - (modalContent.outerHeight() / 2), 0);
    var mdcLeft = ( winWidth / 2 ) - ( modalContent.outerWidth() / 2);
    $('#modalBackdrop').css(css).css('top', 0).css('height', docHeight + 'px').css('width', docWidth + 'px').show();
    modalContent.css({top: mdcTop + 'px', left: mdcLeft + 'px'}).hide()[animation](speed);

    // Bind a click for closing the modalContent
    modalContentClose = function(){close(); return false;};
    $('.close', $modalHeader).bind('click', modalContentClose);

    // Bind a keypress on escape for closing the modalContent
    modalEventEscapeCloseHandler = function(event) {
      if (event.keyCode == 27) {
        close();
        return false;
      }
    };

    $(document).bind('keydown', modalEventEscapeCloseHandler);

    // Per WAI-ARIA 1.0 Authoring Practices, initial focus should be on the
    // close button, but we should save the original focus to restore it after
    // the dialog is closed.
    var oldFocus = document.activeElement;
    $('.close', $modalHeader).focus();

    // Close the open modal content and backdrop
    function close() {
      // Unbind the events
      $(window).unbind('resize',  modalContentResize);
      $('body').unbind( 'focus', modalEventHandler);
      $('body').unbind( 'keypress', modalEventHandler );
      $('body').unbind( 'keydown', modalTabTrapHandler );
      $('.close', $modalHeader).unbind('click', modalContentClose);
      $(document).unbind('keydown', modalEventEscapeCloseHandler);
      $(document).trigger('CToolsDetachBehaviors', $('#modalContent'));

      // Closing animation.
      switch (animation) {
        case 'fadeIn':
          modalContent.fadeOut(speed, modalContentRemove);
          break;

        case 'slideDown':
          modalContent.slideUp(speed, modalContentRemove);
          break;

        case 'show':
          modalContent.hide(speed, modalContentRemove);
          break;
      }
    }

    // Remove the content.
    modalContentRemove = function () {
      $('#modalContent').remove();
      $('#modalBackdrop').remove();

      // Restore focus to where it was before opening the dialog.
      $(oldFocus).focus();
    };

    // Move and resize the modalBackdrop and modalContent on window resize.
    modalContentResize = function () {
      // Reset the backdrop height/width to get accurate document size.
      $('#modalBackdrop').css('height', '').css('width', '');

      // Position code lifted from:
      // http://www.quirksmode.org/viewport/compatibility.html
      if (self.pageYOffset) { // all except Explorer
        var wt = self.pageYOffset;
      } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
        var wt = document.documentElement.scrollTop;
      } else if (document.body) { // all other Explorers
        var wt = document.body.scrollTop;
      }

      // Get our heights
      var docHeight = $(document).height();
      var docWidth = $(document).width();
      var winHeight = $(window).height();
      var winWidth = $(window).width();
      if( docHeight < winHeight ) docHeight = winHeight;

      // Get where we should move content to
      var modalContent = $('#modalContent');
      var mdcTop = wt + Math.max((winHeight / 2) - (modalContent.outerHeight() / 2), 0);
      var mdcLeft = ( winWidth / 2 ) - ( modalContent.outerWidth() / 2);

      // Apply the changes
      $('#modalBackdrop').css('height', docHeight + 'px').css('width', docWidth + 'px').show();
      modalContent.css('top', mdcTop + 'px').css('left', mdcLeft + 'px').show();
    };
    $(window).bind('resize', modalContentResize);
  };

  /**
   * unmodalContent
   * @param content (The jQuery object to remove)
   * @param animation (fadeOut, slideUp, show)
   * @param speed (valid animation speeds slow, medium, fast or # in ms)
   */
  Drupal.CTools.Modal.unmodalContent = function(content, animation, speed)
  {
    // If our animation isn't set, make it just show/pop
    if (!animation) { var animation = 'show'; } else {
      // If our animation isn't "fade" then it always is show
      if (( animation != 'fadeOut' ) && ( animation != 'slideUp')) animation = 'show';
    }
    // Set a speed if we dont have one
    if ( !speed ) var speed = 'fast';

    // Unbind the events we bound
    $(window).unbind('resize', modalContentResize);
    $('body').unbind('focus', modalEventHandler);
    $('body').unbind('keypress', modalEventHandler);
    $('body').unbind( 'keydown', modalTabTrapHandler );
    var $modalContent = $('#modalContent');
    var $modalHeader = $modalContent.find('.modal-header');
    $('.close', $modalHeader).unbind('click', modalContentClose);
    $('body').unbind('keypress', modalEventEscapeCloseHandler);
    $(document).trigger('CToolsDetachBehaviors', $modalContent);

    // jQuery magic loop through the instances and run the animations or removal.
    content.each(function(){
      if ( animation == 'fade' ) {
        $('#modalContent').fadeOut(speed, function() {
          $('#modalBackdrop').fadeOut(speed, function() {
            $(this).remove();
          });
          $(this).remove();
        });
      } else {
        if ( animation == 'slide' ) {
          $('#modalContent').slideUp(speed,function() {
            $('#modalBackdrop').slideUp(speed, function() {
              $(this).remove();
            });
            $(this).remove();
          });
        } else {
          $('#modalContent').remove();
          $('#modalBackdrop').remove();
        }
      }
    });
  };

$(function() {
  Drupal.ajax.prototype.commands.modal_display = Drupal.CTools.Modal.modal_display;
  Drupal.ajax.prototype.commands.modal_dismiss = Drupal.CTools.Modal.modal_dismiss;
});

})(jQuery);
;
(function ($) {

    /* New functions */

    /**
     * Auto-link ajax modal link
     */
    Drupal.behaviors.initVkCtoolsModals = {
        attach: function (context, settings) {

            // init modal click event
            var settings = Drupal.settings.vk_ctools_modal;

            if (settings && settings.modal_paths) {
                $('a', context).each(function () {
                    var jthis = $(this),
                        href = jthis.attr('href');

                    if (href) {

                        href_splitted = href.split('?');
                        href = href_splitted[0];

                        if (!jthis.hasClass('ctools-use-modal')) {

                            for (var j in settings.modal_paths) {
                                if (j == href) {

                                    var modal_settings = settings.modal_paths[j],
                                        new_href = modal_settings.nojs,
                                        elt_settings = {
                                            url: new_href + ( href_splitted.length > 1 ? '?' + href_splitted[1] : '' ),
                                            event: 'click',
                                            progress: {type: 'throbber'}
                                        };

                                    if (typeof modal_settings.context != 'undefined') {
                                        elt_settings.progress.context = modal_settings.context;
                                    }

                                    jthis.addClass('ctools-use-modal ctools-use-modal-processed ctools-modal-themevk').click(Drupal.CTools.Modal.clickAjaxLink);

                                    Drupal.ajax[new_href] = new Drupal.ajax(new_href, this, elt_settings);

                                    break;
                                }
                            }

                        }
                    }
                });
            }
        }
    };


    /**
     * Display something directly (just a shortcut for "modal_display")
     */
    Drupal.CTools.Modal.direct_display = function (settings) {

        var default_settings = Drupal.settings.vk_ctools_modal.default_settings,
            settings = $.extend({}, default_settings, settings);

        Drupal.CTools.Modal.modal_display(
            {element: $('<a href="" class="ctools-modal-' + settings.choice + '"/>')}, settings
        );
    };


    /**
     * Display an single alert
     */
    Drupal.CTools.Modal.alert = function (output) {

        output = '' +
        '<div class="content">' +
        '<div class="alert-icon"></div>' +
        output +
        '<div class="wrap-btn">' +
        '<a href="" class="button close"><span>' + Drupal.t('Ok') + '</span></a>' +
        '</div>' +
        '</div>';

        Drupal.CTools.Modal.direct_display({
            context_id: 'alert',
            'output': output
        });

    };


    /**
     * Call an url directly (urls already managed by vk_ctools_modal module (forms, webform, etc.))
     */
    Drupal.CTools.Modal.direct_call = function (settings) {

        var default_settings = Drupal.settings.vk_ctools_modal.default_settings,
            settings = $.extend({}, default_settings, settings);

        var elt = '',
            new_href = '/' + Drupal.settings.pathPrefix + 'f/nojs/' + settings.url_to_call,
            elt_settings = {url: new_href, event: 'click', progress: {type: 'throbber'}};

        if (typeof settings.context != 'undefined') {
            elt_settings.progress.context = settings.context;
        }

        elt_settings.extra_ajax_params = settings.extra_ajax_params || {};

        if (typeof settings.element == 'undefined') {
            elt = $('<a href="" class="ctools-modal-' + settings.choice + '"/>')[0];
        } else {
            $(settings.element).addClass('ctools-modal-' + settings.choice);
            elt = settings.element;
        }

        Drupal.ajax[new_href] = new Drupal.ajax(new_href, elt, elt_settings);
        Drupal.ajax[new_href].eventResponse(elt);

    };


    /**
     * Replace ajax wrapper (to keep content around (multi-usage/content purpose))
     */
    Drupal.ajax.prototype.commands.vk_ctools_modal_replace_ajax_form_wrapper = function (ajax, response, status) {

        $('#vk-ctools-modal-ajax-form-wrapper').replaceWith(response.output);

        // trigger the default ctools modal event for repositionning (when only inner content has changed)
        $(window).trigger('resize-ctoolmodal');

        if (typeof response.attach_behaviors == 'undefined' || response.attach_behaviors) {
            Drupal.attachBehaviors( $('#vk-ctools-modal-ajax-form-wrapper') );
        }

    };


    /* Overrided functions (ajax.js & modal.js) */

    /**
     * override "Drupal.CTools.Modal.clickAjaxLink" from modal.js
     */
    Drupal.CTools.Modal.clickAjaxLink = function () {
        Drupal.CTools.Modal.getSettings(this);
        //Drupal.CTools.Modal.show(Drupal.CTools.Modal.getSettings(this));
        return false;
    };


    /*
     * override "Drupal.CTools.Modal.modal_display" from modal.js
     */
    Drupal.CTools.Modal.modal_display = function (ajax, response, status) {

        if ($('#modalContent').length == 0) {
            Drupal.CTools.Modal.show(Drupal.CTools.Modal.getSettings(ajax.element), response);
        } else {
            $('#modal-title').html(response.title);
            $('#modal-content').html(response.output);
        }

        // trigger the default ctools modal event for repositionning (when only inner content has changed)
        $(window).trigger('resize-ctoolmodal');

    }

    /*
     * override "Drupal.CTools.Modal.show" from modal.js
     */
    Drupal.CTools.Modal.show = function (choice, response) {
        var opts = {};

        if (choice && typeof choice == 'string' && Drupal.settings[choice]) {
            // This notation guarantees we are actually copying it.
            $.extend(true, opts, Drupal.settings[choice]);
        }
        else if (choice) {
            $.extend(true, opts, choice);
        }
        else {
            choice = 'default';
        }

        var defaults = {
            modalTheme: 'CToolsModalDialog',
            throbberTheme: 'CToolsModalThrobber',
            animation: 'show',
            animationSpeed: 'fast',
            modalCss: {
                backdrop: {
                    opacity: .55,
                    background: '#fff'
                },
                content: {}
            }
        };

        if (response.modalCss) {
            $.extend(true, defaults.modalCss, response.modalCss);
        }

        var settings = {};
        $.extend(true, settings, defaults, Drupal.settings.CToolsModal, opts);

        if (Drupal.CTools.Modal.currentSettings && Drupal.CTools.Modal.currentSettings != settings) {
            Drupal.CTools.Modal.modal.remove();
            Drupal.CTools.Modal.modal = null;
        }

        Drupal.CTools.Modal.currentSettings = settings;

        if (!Drupal.CTools.Modal.modal) {
            Drupal.CTools.Modal.modal = $(Drupal.theme(settings.modalTheme));
        }

        //$('span.modal-title', Drupal.CTools.Modal.modal).html(Drupal.CTools.Modal.currentSettings.loadingText);
        //Drupal.CTools.Modal.modalContent(Drupal.CTools.Modal.modal, settings.modalOptions, settings.animation, settings.animationSpeed, choice, response );
        //$('#modalContent .modal-content').html(Drupal.theme(settings.throbberTheme));
        Drupal.CTools.Modal.modalContent(Drupal.CTools.Modal.modal, response, settings.modalCss, settings.animation, settings.animationSpeed, choice);
    };


    /*
     * override "Drupal.CTools.Modal.modalContent" from modal.js
     * - add "choice" class (for various theme on same website)
     * - change settings for "no fixed height" presentation
     * - remove bug on bottom margin
     * - add animate on repositionning for gracefull transition
     */
    Drupal.CTools.Modal.modalContent = function (modalContent, response, modalCss, animation, speed, choice) {
        // If our animation isn't set, make it just show/pop
        if (!animation) {
            animation = 'show';
        }

        if (!speed) {
            speed = 'fast';
        }

        // Build our base attributes and allow them to be overriden
        var cssBackdrop = jQuery.extend({
            position: 'fixed',
            width: '100%',
            height: '100%',
            left: '0px',
            top: '0px',
            margin: '0px',
            background: '#000',
            opacity: '.55'
        }, modalCss.backdrop);

        // position context
        response.position_context = response.position_context || 'fixed';

        // if we already have a modalContent, remove it
        if ($('#modalBackdrop')) $('#modalBackdrop').remove();
        if ($('#modalContent')) $('#modalContent').remove();

        // Get our dimensions
        var docWidth = $(document).width();
        var winHeight = $(window).height();
        var winWidth = $(window).width();

        // Prepare classes
        var modal_class = new Array();
        modal_class.push('modal-' + choice);
        if (response.context_id) {
            modal_class.push('modal-' + response.context_id);
        }
        if (response.extra_class) {
            modal_class.push(response.extra_class.join(' '));
        }
        modal_class.push('is-' + response.position_context);

        // Create our divs
        var html = '';
        html += '<div id="modalBackdrop" class="' + modal_class.join(' ') + '" style="z-index: 1000; display: none;"></div>';
        html += '<div id="modalContent" class="' + modal_class.join(' ') + '" style="z-index: 1001; position:fixed; visibility:hidden;">' + $(modalContent).html() + '</div>';
        $('body').append(html);

        // Create our content div, get the dimensions
        var modalContent = $('#modalContent'),
            modalBackdrop = $('#modalBackdrop');

        // Append inner content
        if (response.output) {
            $('#modal-content').append(response.output);
        }
        if ( response.title ) {
            $('#modal-title').html(response.title);
        }

        // Attach events
        if (typeof response.attach_behaviors == 'undefined' || response.attach_behaviors) {
            Drupal.attachBehaviors( $('#modal-content') );
        }

        // Positioning
        var mdcTop = ( winHeight / 2 ) - (  modalContent.outerHeight() / 2),
            mdcLeft = ( winWidth / 2 ) - ( modalContent.outerWidth() / 2);

        if (response.position_context == 'absolute') {
            var pageScroll = parseInt($(document).scrollTop());
            mdcTop = pageScroll + mdcTop;
        }
        mdcTop = Math.max(0, mdcTop);

        // Show all
        $('html').addClass('vk-ctools-modal-opened');
        modalBackdrop.css(cssBackdrop).show();
        modalContent.css(modalCss.content).css({
            top: mdcTop + 'px',
            left: mdcLeft + 'px',
            visibility: 'visible',
            position: ( response.position_context || 'fixed' )
        }).hide()[animation](speed);

        // Bind a click for closing the modalContent if enabled
        modalContentClose = function () {
            close();
            return false;
        };

        // Bind a keypress on escape for closing the modalContent
        modalEventEscapeCloseHandler = function (event) {
            if (event.keyCode == 27) {
                close();
                return false;
            }
        };

        if (response.can_be_closed) {
            $('#modalContent .close').bind('click', modalContentClose);
            $(document).bind('keydown', modalEventEscapeCloseHandler);

            if (response.overlayer_close) {
                modalBackdrop.bind('click', modalContentClose);
            }

        } else {
            modalContent.find('.close').remove();
        }

        // Keyboard and focus event handler ensures focus stays on modal elements only
        modalEventHandler = function (event) {
            return true;
            /*
             target = null;
             if ( event ) { //Mozilla
             target = event.target;
             } else { //IE
             event = window.event;
             target = event.srcElement;
             }

             var parents = $(target).parents().get();
             for (var i = 0; i < parents.length; ++i) {
             var position = $(parents[i]).css('position');
             if (position == 'absolute' || position == 'fixed') {
             return true;
             }
             }
             if( $(target).filter('*:visible').parents('#modalContent').size()) {
             // allow the event only if target is a visible child node of #modalContent
             return true;
             }
             if ( $('#modalContent')) $('#modalContent').get(0).focus();
             return false;*/
        };
        $('body').bind('focus', modalEventHandler);
        $('body').bind('keypress', modalEventHandler);


        // Close the open modal content and backdrop
        function close() {
            // Unbind the events
            $(window).unbind('resize', modalContentResize);
            $('body').unbind('focus', modalEventHandler);
            $('body').unbind('keypress', modalEventHandler);
            $('#modalContent .close').unbind('click', modalContentClose);
            $('body').unbind('keypress', modalEventEscapeCloseHandler);
            $(document).trigger('CToolsDetachBehaviors', $('#modalContent'));

            // Set our animation parameters and use them
            if (animation == 'fadeIn') animation = 'fadeOut';
            if (animation == 'slideDown') animation = 'slideUp';
            if (animation == 'show') animation = 'hide';

            // Close the content
            modalContent.add(modalBackdrop)[animation](speed / 2, function () {
                // Remove the content
                $('html').removeClass('vk-ctools-modal-opened');
                modalContent.remove();
                modalBackdrop.remove();
            });

        };

        // Move and resize the modalBackdrop and modalContent on resize of the window
        modalContentResize = function () {

            // Get our heights
            var docWidth = $(document).width();
            var winHeight = $(window).height();
            var winWidth = $(window).width();

            // Get where we should move content to
            var modalContent = $('#modalContent'),
                mdcTop = Math.max(0, ( winHeight / 2 ) - (  modalContent.outerHeight() / 2)),
                mdcLeft = ( winWidth / 2 ) - ( modalContent.outerWidth() / 2);

            if (response.position_context == 'absolute') {
                var pageScroll = parseInt($(document).scrollTop());
                mdcTop = pageScroll + mdcTop;
            }

            // Apply the changes
            modalContent.css('left', mdcLeft + 'px');
            modalContent.css('top', mdcTop + 'px');

        };

        $(window).bind('resize resize-ctoolmodal', modalContentResize);

        $('#modalContent').focus();
    };


})(jQuery);
;
/*!--------------------------------------------------------------------
JAVASCRIPT "Outdated Browser"
Version:    1.1.2 - 2015
author:     Burocratik
website:    http://www.burocratik.com
* @preserve
-----------------------------------------------------------------------*/
var outdatedBrowser=function(t){function o(t){s.style.opacity=t/100,s.style.filter="alpha(opacity="+t+")"}function e(t){o(t),1==t&&(s.style.display="block"),100==t&&(u=!0)}function r(){var t=document.getElementById("btnCloseUpdateBrowser"),o=document.getElementById("btnUpdateBrowser");s.style.backgroundColor=bkgColor,s.style.color=txtColor,s.children[0].style.color=txtColor,s.children[1].style.color=txtColor,o.style.color=txtColor,o.style.borderColor&&(o.style.borderColor=txtColor),t.style.color=txtColor,t.onmousedown=function(){return s.style.display="none",!1},o.onmouseover=function(){this.style.color=bkgColor,this.style.backgroundColor=txtColor},o.onmouseout=function(){this.style.color=txtColor,this.style.backgroundColor=bkgColor}}function l(){var t=!1;if(window.XMLHttpRequest)t=new XMLHttpRequest;else if(window.ActiveXObject)try{t=new ActiveXObject("Msxml2.XMLHTTP")}catch(o){try{t=new ActiveXObject("Microsoft.XMLHTTP")}catch(o){t=!1}}return t}function a(t){var o=l();return o&&(o.onreadystatechange=function(){n(o)},o.open("GET",t,!0),o.send(null)),!1}function n(t){var o=document.getElementById("outdated");return 4==t.readyState&&(o.innerHTML=200==t.status||304==t.status?t.responseText:d,r()),!1}var s=document.getElementById("outdated");this.defaultOpts={bgColor:"#f25648",color:"#ffffff",lowerThan:"transform",languagePath:"../outdatedbrowser/lang/en.html"},t?("IE8"==t.lowerThan||"borderSpacing"==t.lowerThan?t.lowerThan="borderSpacing":"IE9"==t.lowerThan||"boxShadow"==t.lowerThan?t.lowerThan="boxShadow":"IE10"==t.lowerThan||"transform"==t.lowerThan||""==t.lowerThan||"undefined"==typeof t.lowerThan?t.lowerThan="transform":("IE11"==t.lowerThan||"borderImage"==t.lowerThan)&&(t.lowerThan="borderImage"),this.defaultOpts.bgColor=t.bgColor,this.defaultOpts.color=t.color,this.defaultOpts.lowerThan=t.lowerThan,this.defaultOpts.languagePath=t.languagePath,bkgColor=this.defaultOpts.bgColor,txtColor=this.defaultOpts.color,cssProp=this.defaultOpts.lowerThan,languagePath=this.defaultOpts.languagePath):(bkgColor=this.defaultOpts.bgColor,txtColor=this.defaultOpts.color,cssProp=this.defaultOpts.lowerThan,languagePath=this.defaultOpts.languagePath);var u=!0,i=function(){var t=document.createElement("div"),o="Khtml Ms O Moz Webkit".split(" "),e=o.length;return function(r){if(r in t.style)return!0;for(r=r.replace(/^[a-z]/,function(t){return t.toUpperCase()});e--;)if(o[e]+r in t.style)return!0;return!1}}();if(!i(""+cssProp)){if(u&&"1"!==s.style.opacity){u=!1;for(var c=1;100>=c;c++)setTimeout(function(t){return function(){e(t)}}(c),8*c)}" "===languagePath||0==languagePath.length?r():a(languagePath);var d='<h6>Your browser is out-of-date!</h6><p>Update your browser to view this website correctly. <a id="btnUpdateBrowser" href="http://outdatedbrowser.com/">Update my browser now </a></p><p class="last"><a href="#" id="btnCloseUpdateBrowser" title="Close">&times;</a></p>'}};;
(function ($) {

    Drupal.behaviors.vk_cookie_compliance = {
        attach: function (context, settings) {

            if(typeof Drupal.settings != 'undefined') {
                if(typeof Drupal.settings.vk_cookie_compliance != 'undefined') {
                    if(typeof Drupal.settings.vk_cookie_compliance.vk_cookie_compliance_display != 'undefined'
                        && Drupal.settings.vk_cookie_compliance.vk_cookie_compliance_display == true) {

                        //console.log($('.vk_cookie_compliance'));
                        if($('.vk_cookie_compliance').length == 1 && $.cookie('eu_cookie_compliance') == null){
                            $('.vk_cookie_compliance')
                                .removeClass('hidden')
                                .end()
                                .find('.close').click(function(){
                                    $.cookie('eu_cookie_compliance', 'accepted', { expires: 365, path: '/' });
                                    $('.vk_cookie_compliance').addClass('hidden');
                                });
                        }

                    }
                }
            }


        }
    };

})(jQuery);;
(function ($) {


    /**
     * override "Drupal.ajax.prototype.beforeSubmit" from misc/ajax.js
     */
    Drupal.ajax.prototype.beforeSubmit = function (form_values, element, options) {
        if ( this.form ) {
            this.form.addClass('form-ajax-processing');
        }
    };


    /**
     * override "Drupal.ajax.prototype.beforeSerialize" from misc/ajax.js
     */
    Drupal.ajax.prototype.beforeSerialize = function (element, options) {
        // Allow detaching behaviors to update field values before collecting them.
        // This is only needed when field values are added to the POST data, so only
        // when there is a form such that this.form.ajaxSubmit() is used instead of
        // $.ajax(). When there is no form and $.ajax() is used, beforeSerialize()
        // isn't called, but don't rely on that: explicitly check this.form.
        if (this.form) {
            var settings = this.settings || Drupal.settings;
            Drupal.detachBehaviors(this.form, settings, 'serialize');
        }

        // Prevent duplicate HTML ids in the returned markup.
        // @see drupal_html_id()
        options.data['ajax_html_ids[]'] = [];
        $('[id]').each(function () {
            options.data['ajax_html_ids[]'].push(this.id);
        });

        // Allow Drupal to return new JavaScript and CSS files to load without
        // returning the ones already loaded.
        // @see ajax_base_page_theme()
        // @see drupal_get_css()
        // @see drupal_get_js()
        options.data['ajax_page_state[theme]'] = Drupal.settings.ajaxPageState.theme;
        options.data['ajax_page_state[theme_token]'] = Drupal.settings.ajaxPageState.theme_token;
        for (var key in Drupal.settings.ajaxPageState.css) {
            options.data['ajax_page_state[css][' + key + ']'] = 1;
        }
        for (var key in Drupal.settings.ajaxPageState.js) {
            options.data['ajax_page_state[js][' + key + ']'] = 1;
        }

        // Add custom extra parameters (for direct call, etc.)
        if (this.extra_ajax_params) {
            options.data['extra_ajax_params'] = {};
            for (var key in this.extra_ajax_params) {
                options.data['extra_ajax_params'][key] = this.extra_ajax_params[key];
            }
        }

    };


    /**
     * override "Drupal.ajax.prototype.beforeSend" from misc/ajax.js
     * light addition : add the possibility of context for the throbber (for easiest css positionning on complex form with multiple ajax button)
     */
    Drupal.ajax.prototype.beforeSend = function (xmlhttprequest, options) {
        // For forms without file inputs, the jQuery Form plugin serializes the form
        // values, and then calls jQuery's $.ajax() function, which invokes this
        // handler. In this circumstance, options.extraData is never used. For forms
        // with file inputs, the jQuery Form plugin uses the browser's normal form
        // submission mechanism, but captures the response in a hidden IFRAME. In this
        // circumstance, it calls this handler first, and then appends hidden fields
        // to the form to submit the values in options.extraData. There is no simple
        // way to know which submission mechanism will be used, so we add to extraData
        // regardless, and allow it to be ignored in the former case.

        options.extraData = options.extraData || {};

        if (this.form) {

            // Let the server know when the IFRAME submission mechanism is used. The
            // server can use this information to wrap the JSON response in a TEXTAREA,
            // as per http://jquery.malsup.com/form/#file-upload.
            options.extraData.ajax_iframe_upload = '1';

            // The triggering element is about to be disabled (see below), but if it
            // contains a value (e.g., a checkbox, textfield, select, etc.), ensure that
            // value is included in the submission. As per above, submissions that use
            // $.ajax() are already serialized prior to the element being disabled, so
            // this is only needed for IFRAME submissions.
            var v = $.fieldValue(this.element);
            if (v !== null) {
                options.extraData[this.element.name] = Drupal.checkPlain(v);
            }
        }


        // Disable the element that received the change to prevent user interface
        // interaction while the Ajax request is in progress. ajax.ajaxing prevents
        // the element from triggering a new request, but does not prevent the user
        // from changing its value.
        $(this.element).addClass('progress-disabled').attr('disabled', true);

        // Insert progressbar or throbber.
        if (this.progress.type == 'bar') {
            var progressBar = new Drupal.progressBar('ajax-progress-' + this.element.id, eval(this.progress.update_callback), this.progress.method, eval(this.progress.error_callback));
            if (this.progress.message) {
                progressBar.setProgress(-1, this.progress.message);
            }
            if (this.progress.url) {
                progressBar.startMonitoring(this.progress.url, this.progress.interval || 1500);
            }
            this.progress.element = $(progressBar.element).addClass('ajax-progress ajax-progress-bar');
            this.progress.object = progressBar;
            $(this.element).after(this.progress.element);
        }
        else if (this.progress.type == 'throbber') {
            this.progress.element = $('<div class="ajax-progress ajax-progress-throbber' + ( typeof this.progress.context != 'undefined' ? ' ajax-progress-context-' + this.progress.context : '' ) + '"><div class="throbber">&nbsp;</div></div>');
            if (this.progress.message) {
                $('.throbber', this.progress.element).after('<div class="message">' + this.progress.message + '</div>');
            }
            $(this.element).after(this.progress.element);
        }
    };


    /**
     * override "Drupal.ajax.prototype.success" from misc/ajax.js
     * Handler for the form redirection completion.
     */
    Drupal.ajax.prototype.success = function (response, status) {

        // Remove the form progress class
        if ( this.form ) {
            this.form.removeClass('form-ajax-processing');
        }

        // Remove the progress element.
        if (this.progress.element) {
            $(this.progress.element).remove();
        }
        if (this.progress.object) {
            this.progress.object.stopMonitoring();
        }
        $(this.element).removeClass('progress-disabled').removeAttr('disabled');

        Drupal.freezeHeight();

        for (var i in response) {
            if (response.hasOwnProperty(i) && response[i]['command'] && this.commands[response[i]['command']]) {
                this.commands[response[i]['command']](this, response[i], status);
            }
        }

        // Reattach behaviors, if they were detached in beforeSerialize(). The
        // attachBehaviors() called on the new content from processing the response
        // commands is not sufficient, because behaviors from the entire form need
        // to be reattached.
        if (this.form) {
            var settings = this.settings || Drupal.settings;
            Drupal.attachBehaviors(this.form, settings);
        }

        Drupal.unfreezeHeight();

        // Remove any response-specific settings so they don't get used on the next
        // call by mistake.
        this.settings = null;
    };


})(jQuery);;
/**
 * @file
 * Initializes Outdated Browser library.
 */

(function ($) {
Drupal.behaviors.initOutdatedbrowser = {
  attach: function (context, settings) {
    outdatedBrowser({
      bgColor: settings.outdatedbrowser.bgColor,
      color: settings.outdatedbrowser.color,
      lowerThan: settings.outdatedbrowser.lowerThan,
      languagePath: settings.outdatedbrowser.languagePath
    });
  }
};
})(jQuery);
;
