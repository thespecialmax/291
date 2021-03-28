var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? t(exports) : "function" == typeof define && define.amd ? define(["exports"], t) : t(e.yett = {});
}(this, function (e) {
  "use strict";
  var t = window.YETT_BLACKLIST,
      r = !1,
      n = [],
      c = function c(e, n) {
    return !r && (!n || "javascript/blocked" !== n) && t.some(function (t) {
      return t.test(e);
    });
  },
      o = new MutationObserver(function (e) {
    e.forEach(function (e) {
      e.addedNodes.forEach(function (e) {
        if (1 === e.nodeType && "SCRIPT" === e.tagName) {
          var t = e.src || "",
              r = e.type;if (c(t, r)) {
            n.push(e.cloneNode()), e.type = "javascript/blocked";e.addEventListener("beforescriptexecute", function t(r) {
              "javascript/blocked" === e.getAttribute("type") && r.preventDefault(), e.removeEventListener("beforescriptexecute", t);
            }), e.parentElement.removeChild(e);
          }
        }
      });
    });
  });o.observe(document.documentElement, { childList: !0, subtree: !0 });var i = { src: Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, "src"), type: Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, "type") },
      u = document.createElement;document.createElement = function () {
    for (var e = arguments.length, t = Array(e), r = 0; r < e; r++) {
      t[r] = arguments[r];
    }if ("script" !== t[0].toLowerCase()) return u.bind(document).apply(void 0, t);var n = u.bind(document).apply(void 0, t);return Object.defineProperties(n, { src: { get: function get() {
          return i.src.get.call(this);
        }, set: function set(e) {
          return c(e, n.type) && (n.type = "javascript/blocked"), i.src.set.call(this, e);
        } }, type: { set: function set(e) {
          return i.type.set.call(this, c(n.src, n.type) ? "javascript/blocked" : e);
        } } }), n.setAttribute = function (e, t) {
      "type" === e || "src" === e ? n[e] = t : HTMLScriptElement.prototype.setAttribute.call(n, e, t);
    }, n;
  };var p = function p(e) {
    var n = e.getAttribute("src");return r || t.every(function (e) {
      return !e.test(n);
    });
  };e.unblock = function () {
    for (var e = arguments.length, c = Array(e), i = 0; i < e; i++) {
      c[i] = arguments[i];
    }if (!r) {
      o.disconnect(), !c || c.length < 1 ? r = !0 : t = t.filter(function (e) {
        return c.every(function (t) {
          return !e.test(t);
        });
      });for (var u = document.querySelectorAll('script[type="javascript/blocked"]'), a = 0; a < u.length; a++) {
        var s = u[a];p(s) && (s.type = "application/javascript", n.push(s), s.parentElement.removeChild(s));
      }n = n.reduce(function (e, t) {
        if (p(t)) {
          var r = document.createElement("script");return r.setAttribute("src", t.src), r.setAttribute("type", "application/javascript"), document.head.appendChild(r), e;
        }return [].concat(function (e) {
          if (Array.isArray(e)) {
            for (var t = 0, r = Array(e.length); t < e.length; t++) {
              r[t] = e[t];
            }return r;
          }return Array.from(e);
        }(e), [t]);
      }, []);
    }
  }, Object.defineProperty(e, "__esModule", { value: !0 });
});