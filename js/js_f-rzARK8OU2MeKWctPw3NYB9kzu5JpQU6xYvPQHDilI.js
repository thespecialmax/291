(function ($) {

    Drupal.behaviors.vk_pixel_facebook = {
        attach: function (context, settings) {
            var $context = $(context);

            $context.on('click', '[data-fbq]', function(e){
                var fbq_data = $(this).attr('data-fbq').split('*');

                // Just check if data are not empty
                if( fbq_data.length > 0 ) {

                    $.each(fbq_data, function(index, value){

                        if(value != ''){
                            fbq('track', value);
                        }

                    });
                }
            });
        }
    };

})(window.jQuery);;
