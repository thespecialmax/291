!(function(e){function t(e){return window.location.pathname+"/"+e}function n(){if(e(".node-type-mobile-subscription-category").length||e(".node-type-prepaid-card-subscription-catego").length||e(".node-type-internet-subscription-category").length||e(".node-type-tango-complet-subscription-categ").length||e(".node-type-tango-tv-subscription-category").length){if(null!==e("h2.intro").last().data("step-configurator-tagging")){var n=e("h2.intro").last().data("step-configurator-tagging");"undefined"!=typeof n&&"function"==typeof vkga_send_tag&&vkga_send_tag(t(n))}e(".finalize-order-configurator-tagging").length&&e(".finalize-order-configurator-tagging").on("mousedown",(function(){"function"==typeof vkga_send_tag&&vkga_send_tag(t("votre-selection"))}))}}e(document).ready(n),Drupal.behaviors.analitycs={attach:function(t,a){var o="send-by-mail-form",i="newsletter-register-form",g="configurator-form";if(t instanceof e)switch(t.attr("id")){case o:e("#"+o).find(".error").length||"function"!=typeof vkga_send_tag_event||vkga_send_tag_event("Order","Send by email","Basket");break;case i:e("#"+i).find(".error").length||"function"!=typeof vkga_send_tag_event||vkga_send_tag_event("Newsletter","Registration");break;case g:n()}if(e(".faq-question").length&&e(".faq-question").on("click","a",(function(){"function"==typeof vkga_send_tag&&vkga_send_tag(e(this).attr("href"))})),"undefined"!=typeof Drupal.settings.compare_mobile_tagging){var c=Drupal.settings.compare_mobile_tagging.mobiles,r=Drupal.settings.compare_mobile_tagging.nb_mobiles;""!==c.trim()&&"function"==typeof vkga_send_tag_event&&vkga_send_tag_event("Compare",r.toString(),c.toString())}if(e("input[name=device-details-tabs-toggle]").on("change",(function(){var t=e(this).data("page-view"),n=window.location.pathname+"/"+t;"function"==typeof vkga_send_tag&&vkga_send_tag(n)})),e(".page-identifier-qelp").length&&e(window).on("hashchange",(function(){var e=window.location.pathname+window.location.hash;"function"==typeof vkga_send_tag&&vkga_send_tag(e)})),e("#qelpClient").on("click",".qelp-feedback-submit-button",(function(){var t=e(this).prev().find("input:checked").val();"function"==typeof vkga_send_tag_event&&vkga_send_tag_event("Configure","Survey",t)})),e(".contact-page").length){var s=Drupal.settings.tango_context,f="";switch(s){case"part":f="Particulier";break;case"pro":f="Professionnel"}e(".contact-page").find(".status").length&&"function"==typeof vkga_send_tag_event&&vkga_send_tag_event("Contact","Formulaire","Contact Espace "+f)}e(".sharer-item").on("click",(function(){var t=e(this).find("svg").attr("title"),n=window.location.pathname;"function"==typeof vkga_send_tag_social&&vkga_send_tag_social(t,"share",n)})),e(".contact").length&&e(".contact").on("click","a.lazy-loaded",(function(){var t=/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/i,n=new RegExp(t),a=e(this).attr("href");if(a.match(n)){var o=e(this).prop("host");"function"==typeof vkga_send_tag_event&&vkga_send_tag_event("External_link",o)}}))}},e(document).ready((function(){if("undefined"!=typeof Drupal.settings.tango_tagging&&"function"==typeof ga){var t=Drupal.settings.tango_tagging.commerce,n=t.transaction.id;ga("require","ecommerce"),ga("ecommerce:addTransaction",{id:n,revenue:t.transaction.revenue}),e.each(t.items,(function(t,a){e.each(a,(function(t,a){"undefined"!=typeof a.sku&&"undefined"!=typeof a.name&&ga("ecommerce:addItem",{id:n,sku:a.sku,name:a.name,category:a.category,price:a.price,quantity:1}),"object"==typeof a&&a instanceof Array&&e.each(a,(function(e,t){"undefined"!=typeof t.sku&&"undefined"!=typeof t.name&&ga("ecommerce:addItem",{id:n,sku:t.sku,name:t.name,category:t.category,price:t.price,quantity:1})}))}))})),ga("ecommerce:send")}e.cookie("Drupal.visitor.tango_soho_facebook")&&("undefined"!=typeof fbq&&fbq("track",e.cookie("Drupal.visitor.tango_soho_facebook")),e.cookie("Drupal.visitor.tango_soho_facebook",null,{path:"/"}))}))})(jQuery);;
!(function(t,e,o,n){var c=(o(t),o(e)),i=null,l={init:function(){i=o(".webform-component----country select"),$cityFormItem=o(".webform-component----city"),i.length&&(l.toggleCity(),o(".webform-component----country").delegate("select","change",(function(){l.toggleCity()})))},toggleCity:function(){$cityFormItem.toggleClass("show","LU"==i.val())}};c.ready(l.init)})(window,document,jQuery,Drupal);;
