/**
 * For jQuery versions less than 3.4.0, this replaces the jQuery.extend
 * function with the one from jQuery 3.4.0, slightly modified (documented
 * below) to be compatible with older jQuery versions and browsers.
 *
 * This provides the Object.prototype pollution vulnerability fix to Drupal
 * installations running older jQuery versions, including the versions shipped
 * with Drupal core and https://www.drupal.org/project/jquery_update.
 *
 * @see https://github.com/jquery/jquery/pull/4333
 */

(function (jQuery) {

// Do not override jQuery.extend() if the jQuery version is already >=3.4.0.
var versionParts = jQuery.fn.jquery.split('.');
var majorVersion = parseInt(versionParts[0]);
var minorVersion = parseInt(versionParts[1]);
var patchVersion = parseInt(versionParts[2]);
var isPreReleaseVersion = (patchVersion.toString() !== versionParts[2]);
if (
  (majorVersion > 3) ||
  (majorVersion === 3 && minorVersion > 4) ||
  (majorVersion === 3 && minorVersion === 4 && patchVersion > 0) ||
  (majorVersion === 3 && minorVersion === 4 && patchVersion === 0 && !isPreReleaseVersion)
) {
  return;
}

/**
 * This is almost verbatim copied from jQuery 3.4.0.
 *
 * Only two minor changes have been made:
 * - The call to isFunction() is changed to jQuery.isFunction().
 * - The two calls to Array.isArray() is changed to jQuery.isArray().
 *
 * The above two changes ensure compatibility with all older jQuery versions
 * (1.4.4 - 3.3.1) and older browser versions (e.g., IE8).
 */
jQuery.extend = jQuery.fn.extend = function() {
  var options, name, src, copy, copyIsArray, clone,
    target = arguments[ 0 ] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  // Handle a deep copy situation
  if ( typeof target === "boolean" ) {
    deep = target;

    // Skip the boolean and the target
    target = arguments[ i ] || {};
    i++;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
    target = {};
  }

  // Extend jQuery itself if only one argument is passed
  if ( i === length ) {
    target = this;
    i--;
  }

  for ( ; i < length; i++ ) {

    // Only deal with non-null/undefined values
    if ( ( options = arguments[ i ] ) != null ) {

      // Extend the base object
      for ( name in options ) {
        copy = options[ name ];

        // Prevent Object.prototype pollution
        // Prevent never-ending loop
        if ( name === "__proto__" || target === copy ) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
          ( copyIsArray = jQuery.isArray( copy ) ) ) ) {
          src = target[ name ];

          // Ensure proper type for the source value
          if ( copyIsArray && !jQuery.isArray( src ) ) {
            clone = [];
          } else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
            clone = {};
          } else {
            clone = src;
          }
          copyIsArray = false;

          // Never move original objects, clone them
          target[ name ] = jQuery.extend( deep, clone, copy );

          // Don't bring in undefined values
        } else if ( copy !== undefined ) {
          target[ name ] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};

})(jQuery);
;
/**
 * For jQuery versions less than 3.5.0, this replaces the jQuery.htmlPrefilter()
 * function with one that fixes these security vulnerabilities while also
 * retaining the pre-3.5.0 behavior where it's safe to do so.
 * - https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2020-11022
 * - https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2020-11023
 *
 * Additionally, for jQuery versions that do not have a jQuery.htmlPrefilter()
 * function (1.x prior to 1.12 and 2.x prior to 2.2), this adds it, and
 * extends the functions that need to call it to do so.
 *
 * Drupal core's jQuery version is 1.4.4, but jQuery Update can provide a
 * different version, so this covers all versions between 1.4.4 and 3.4.1.
 * The GitHub links in the code comments below link to jQuery 1.5 code, because
 * 1.4.4 isn't on GitHub, but the referenced code didn't change from 1.4.4 to
 * 1.5.
 */

(function (jQuery) {

  // Parts of this backport differ by jQuery version.
  var versionParts = jQuery.fn.jquery.split('.');
  var majorVersion = parseInt(versionParts[0]);
  var minorVersion = parseInt(versionParts[1]);

  // No backport is needed if we're already on jQuery 3.5 or higher.
  if ( (majorVersion > 3) || (majorVersion === 3 && minorVersion >= 5) ) {
    return;
  }

  // Prior to jQuery 3.5, jQuery converted XHTML-style self-closing tags to
  // their XML equivalent: e.g., "<div />" to "<div></div>". This is
  // problematic for several reasons, including that it's vulnerable to XSS
  // attacks. However, since this was jQuery's behavior for many years, many
  // Drupal modules and jQuery plugins may be relying on it. Therefore, we
  // preserve that behavior, but for a limited set of tags only, that we believe
  // to not be vulnerable. This is the set of HTML tags that satisfy all of the
  // following conditions:
  // - In DOMPurify's list of HTML tags. If an HTML tag isn't safe enough to
  //   appear in that list, then we don't want to mess with it here either.
  //   @see https://github.com/cure53/DOMPurify/blob/2.0.11/dist/purify.js#L128
  // - A normal element (not a void, template, text, or foreign element).
  //   @see https://html.spec.whatwg.org/multipage/syntax.html#elements-2
  // - An element that is still defined by the current HTML specification
  //   (not a deprecated element), because we do not want to rely on how
  //   browsers parse deprecated elements.
  //   @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element
  // - Not 'html', 'head', or 'body', because this pseudo-XHTML expansion is
  //   designed for fragments, not entire documents.
  // - Not 'colgroup', because due to an idiosyncrasy of jQuery's original
  //   regular expression, it didn't match on colgroup, and we don't want to
  //   introduce a behavior change for that.
  var selfClosingTagsToReplace = [
    'a', 'abbr', 'address', 'article', 'aside', 'audio', 'b', 'bdi', 'bdo',
    'blockquote', 'button', 'canvas', 'caption', 'cite', 'code', 'data',
    'datalist', 'dd', 'del', 'details', 'dfn', 'div', 'dl', 'dt', 'em',
    'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3',
    'h4', 'h5', 'h6', 'header', 'hgroup', 'i', 'ins', 'kbd', 'label', 'legend',
    'li', 'main', 'map', 'mark', 'menu', 'meter', 'nav', 'ol', 'optgroup',
    'option', 'output', 'p', 'picture', 'pre', 'progress', 'q', 'rp', 'rt',
    'ruby', 's', 'samp', 'section', 'select', 'small', 'source', 'span',
    'strong', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'tfoot', 'th',
    'thead', 'time', 'tr', 'u', 'ul', 'var', 'video'
  ];

  // Define regular expressions for <TAG/> and <TAG ATTRIBUTES/>. Doing this as
  // two expressions makes it easier to target <a/> without also targeting
  // every tag that starts with "a".
  var xhtmlRegExpGroup = '(' + selfClosingTagsToReplace.join('|') + ')';
  var whitespace = '[\\x20\\t\\r\\n\\f]';
  var rxhtmlTagWithoutSpaceOrAttributes = new RegExp('<' + xhtmlRegExpGroup + '\\/>', 'gi');
  var rxhtmlTagWithSpaceAndMaybeAttributes = new RegExp('<' + xhtmlRegExpGroup + '(' + whitespace + '[^>]*)\\/>', 'gi');

  // jQuery 3.5 also fixed a vulnerability for when </select> appears within
  // an <option> or <optgroup>, but it did that in local code that we can't
  // backport directly. Instead, we filter such cases out. To do so, we need to
  // determine when jQuery would otherwise invoke the vulnerable code, which it
  // uses this regular expression to determine. The regular expression changed
  // for version 3.0.0 and changed again for 3.4.0.
  // @see https://github.com/jquery/jquery/blob/1.5/jquery.js#L4958
  // @see https://github.com/jquery/jquery/blob/3.0.0/dist/jquery.js#L4584
  // @see https://github.com/jquery/jquery/blob/3.4.0/dist/jquery.js#L4712
  var rtagName;
  if (majorVersion < 3) {
    rtagName = /<([\w:]+)/;
  }
  else if (minorVersion < 4) {
    rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i;
  }
  else {
    rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i;
  }

  // The regular expression that jQuery uses to determine which self-closing
  // tags to expand to open and close tags. This is vulnerable, because it
  // matches all tag names except the few excluded ones. We only use this
  // expression for determining vulnerability. The expression changed for
  // version 3, but we only need to check for vulnerability in versions 1 and 2,
  // so we use the expression from those versions.
  // @see https://github.com/jquery/jquery/blob/1.5/jquery.js#L4957
  var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi;

  jQuery.extend({
    htmlPrefilter: function (html) {
      // This is how jQuery determines the first tag in the HTML.
      // @see https://github.com/jquery/jquery/blob/1.5/jquery.js#L5521
      var tag = ( rtagName.exec( html ) || [ "", "" ] )[ 1 ].toLowerCase();

      // It is not valid HTML for <option> or <optgroup> to have <select> as
      // either a descendant or sibling, and attempts to inject one can cause
      // XSS on jQuery versions before 3.5. Since this is invalid HTML and a
      // possible XSS attack, reject the entire string.
      // @see https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2020-11023
      if ((tag === 'option' || tag === 'optgroup') && html.match(/<\/?select/i)) {
        html = '';
      }

      // Retain jQuery's prior to 3.5 conversion of pseudo-XHTML, but for only
      // the tags in the `selfClosingTagsToReplace` list defined above.
      // @see https://github.com/jquery/jquery/blob/1.5/jquery.js#L5518
      // @see https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2020-11022
      html = html.replace(rxhtmlTagWithoutSpaceOrAttributes, "<$1></$1>");
      html = html.replace(rxhtmlTagWithSpaceAndMaybeAttributes, "<$1$2></$1>");

      // Prior to jQuery 1.12 and 2.2, this function gets called (via code later
      // in this file) in addition to, rather than instead of, the unsafe
      // expansion of self-closing tags (including ones not in the list above).
      // We can't prevent that unsafe expansion from running, so instead we
      // check to make sure that it doesn't affect the DOM returned by the
      // browser's parsing logic. If it does affect it, then it's vulnerable to
      // XSS, so we reject the entire string.
      if ( (majorVersion === 1 && minorVersion < 12) || (majorVersion === 2 && minorVersion < 2) ) {
        var htmlRisky = html.replace(rxhtmlTag, "<$1></$2>");
        if (htmlRisky !== html) {
          // Even though htmlRisky and html are different strings, they might
          // represent the same HTML structure once parsed, in which case,
          // htmlRisky is actually safe. We can ask the browser to parse both
          // to find out, but the browser can't parse table fragments (e.g., a
          // root-level "<td>"), so we need to wrap them. We just need this
          // technique to work on all supported browsers; we don't need to
          // copy from the specific jQuery version we're using.
          // @see https://github.com/jquery/jquery/blob/3.5.1/dist/jquery.js#L4939
          var wrapMap = {
            thead: [ 1, "<table>", "</table>" ],
            col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
            tr: [ 2, "<table><tbody>", "</tbody></table>" ],
            td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
          };
          wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
          wrapMap.th = wrapMap.td;

          // Function to wrap HTML into something that a browser can parse.
          // @see https://github.com/jquery/jquery/blob/3.5.1/dist/jquery.js#L5032
          var getWrappedHtml = function (html) {
            var wrap = wrapMap[tag];
            if (wrap) {
              html = wrap[1] + html + wrap[2];
            }
            return html;
          };

          // Function to return canonical HTML after parsing it. This parses
          // only; it doesn't execute scripts.
          // @see https://github.com/jquery/jquery-migrate/blob/3.3.0/src/jquery/manipulation.js#L5
          var getParsedHtml = function (html) {
            var doc = window.document.implementation.createHTMLDocument( "" );
            doc.body.innerHTML = html;
            return doc.body ? doc.body.innerHTML : '';
          };

          // If the browser couldn't parse either one successfully, or if
          // htmlRisky parses differently than html, then html is vulnerable,
          // so reject it.
          var htmlParsed = getParsedHtml(getWrappedHtml(html));
          var htmlRiskyParsed = getParsedHtml(getWrappedHtml(htmlRisky));
          if (htmlRiskyParsed === '' || htmlParsed === '' || (htmlRiskyParsed !== htmlParsed)) {
            html = '';
          }
        }
      }

      return html;
    }
  });

  // Prior to jQuery 1.12 and 2.2, jQuery.clean(), jQuery.buildFragment(), and
  // jQuery.fn.html() did not call jQuery.htmlPrefilter(), so we add that.
  if ( (majorVersion === 1 && minorVersion < 12) || (majorVersion === 2 && minorVersion < 2) ) {
    // Filter the HTML coming into jQuery.fn.html().
    var fnOriginalHtml = jQuery.fn.html;
    jQuery.fn.extend({
      // @see https://github.com/jquery/jquery/blob/1.5/jquery.js#L5147
      html: function (value) {
        if (typeof value === "string") {
          value = jQuery.htmlPrefilter(value);
        }
        // .html() can be called as a setter (with an argument) or as a getter
        // (without an argument), so invoke fnOriginalHtml() the same way that
        // we were invoked.
        return fnOriginalHtml.apply(this, arguments.length ? [value] : []);
      }
    });

    // The regular expression that jQuery uses to determine if a string is HTML.
    // Used by both clean() and buildFragment().
    // @see https://github.com/jquery/jquery/blob/1.5/jquery.js#L4960
    var rhtml = /<|&#?\w+;/;

    // Filter HTML coming into:
    // - jQuery.clean() for versions prior to 1.9.
    // - jQuery.buildFragment() for 1.9 and above.
    //
    // The looping constructs in the two functions might be essentially
    // identical, but they're each expressed here in the way that most closely
    // matches their original expression in jQuery, so that we filter all of
    // the items and only the items that jQuery will treat as HTML strings.
    if (majorVersion === 1 && minorVersion < 9) {
      var originalClean = jQuery.clean;
      jQuery.extend({
        // @see https://github.com/jquery/jquery/blob/1.5/jquery.js#L5493
        'clean': function (elems, context, fragment, scripts) {
          for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
            if ( typeof elem === "string" && rhtml.test( elem ) ) {
              elems[i] = elem = jQuery.htmlPrefilter(elem);
            }
          }
          return originalClean.call(this, elems, context, fragment, scripts);
        }
      });
    }
    else {
      var originalBuildFragment = jQuery.buildFragment;
      jQuery.extend({
        // @see https://github.com/jquery/jquery/blob/1.9.0/jquery.js#L6419
        'buildFragment': function (elems, context, scripts, selection) {
          var l = elems.length;
          for ( var i = 0; i < l; i++ ) {
            var elem = elems[i];
            if (elem || elem === 0) {
              if ( jQuery.type( elem ) !== "object" && rhtml.test( elem ) ) {
                elems[i] = elem = jQuery.htmlPrefilter(elem);
              }
            }
          }
          return originalBuildFragment.call(this, elems, context, scripts, selection);
        }
      });
    }
  }

})(jQuery);
;

/**
 * jQuery Once Plugin v1.2
 * http://plugins.jquery.com/project/once
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

(function ($) {
  var cache = {}, uuid = 0;

  /**
   * Filters elements by whether they have not yet been processed.
   *
   * @param id
   *   (Optional) If this is a string, then it will be used as the CSS class
   *   name that is applied to the elements for determining whether it has
   *   already been processed. The elements will get a class in the form of
   *   "id-processed".
   *
   *   If the id parameter is a function, it will be passed off to the fn
   *   parameter and the id will become a unique identifier, represented as a
   *   number.
   *
   *   When the id is neither a string or a function, it becomes a unique
   *   identifier, depicted as a number. The element's class will then be
   *   represented in the form of "jquery-once-#-processed".
   *
   *   Take note that the id must be valid for usage as an element's class name.
   * @param fn
   *   (Optional) If given, this function will be called for each element that
   *   has not yet been processed. The function's return value follows the same
   *   logic as $.each(). Returning true will continue to the next matched
   *   element in the set, while returning false will entirely break the
   *   iteration.
   */
  $.fn.once = function (id, fn) {
    if (typeof id != 'string') {
      // Generate a numeric ID if the id passed can't be used as a CSS class.
      if (!(id in cache)) {
        cache[id] = ++uuid;
      }
      // When the fn parameter is not passed, we interpret it from the id.
      if (!fn) {
        fn = id;
      }
      id = 'jquery-once-' + cache[id];
    }
    // Remove elements from the set that have already been processed.
    var name = id + '-processed';
    var elements = this.not('.' + name).addClass(name);

    return $.isFunction(fn) ? elements.each(fn) : elements;
  };

  /**
   * Filters elements that have been processed once already.
   *
   * @param id
   *   A required string representing the name of the class which should be used
   *   when filtering the elements. This only filters elements that have already
   *   been processed by the once function. The id should be the same id that
   *   was originally passed to the once() function.
   * @param fn
   *   (Optional) If given, this function will be called for each element that
   *   has not yet been processed. The function's return value follows the same
   *   logic as $.each(). Returning true will continue to the next matched
   *   element in the set, while returning false will entirely break the
   *   iteration.
   */
  $.fn.removeOnce = function (id, fn) {
    var name = id + '-processed';
    var elements = this.filter('.' + name).removeClass(name);

    return $.isFunction(fn) ? elements.each(fn) : elements;
  };
})(jQuery);
;
