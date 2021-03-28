var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/*jshint esversion: 6 */

window.vk_cookie_manager = window.vk_cookie_manager || [];
window.vk_cookie_manager.default_config = {
    interface: {

        banner: {
            title: 'Le respect de votre vie privée est notre priorité',
            description: 'Nos partenaires et nous-mêmes utilisons différentes technologies, telles que les cookies, pour personnaliser les contenus et les publicités, proposer des fonctionnalités sur les réseaux sociaux et analyser le trafic. Merci de cliquer sur le bouton ci-dessous pour donner votre accord. Vous pouvez changer d’avis et modifier vos choix à tout moment.\n',
            cta: 'Personnaliser',
            enable_all: 'Accepter tout'
        },
        modal: {
            title: 'Centre de confidentialité',
            description: 'Vous pouvez configurer vos réglages et choisir comment vous souhaitez que vos données personnelles soient utilisée en fonction des objectifs ci-dessous. Vous pouvez configurer les réglages de manière indépendante pour chaque partenaire. Vous trouverez une description de chacun des objectifs sur la façon dont nos partenaires et nous-mêmes utilisons vos données personnelles.',
            close: 'Fermer',
            enable_all: 'Autoriser tous les services',
            disable_all: 'Refuser tous les services',
            toggle_group: 'Activer/désactiver ce groupe de services'
        }
    },

    groups: {
        api: {
            title: 'API',
            description: 'Les APIs permettent de charger des scripts : géolocalisation, moteurs de recherche, traductions, ...',
            disabled: false,
            services: {
                pixel_fb: {
                    disabled: false,
                    machine_name: 'pixel_fb',
                    title: 'Facebook Pixel',
                    description: 'Embed facebook pixels',
                    link: 'https://facebook.com',
                    group: 'api',
                    pattern: '/fbevents\.js'
                }
            }
        },
        analytics: {
            title: 'Analytics',
            description: 'Les APIs permettent de charger des scripts : géolocalisation, moteurs de recherche, traductions, ...',
            disabled: false,
            services: {
                ga: {
                    machine_name: 'ga',
                    default_allowed: true,
                    disabled: false,
                    title: 'Google Analytics',
                    description: 'Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus.',
                    link: 'https://google.com',
                    group: 'analytics',
                    pattern: '/www\.google-analytics\.com/'
                },
                gtm: {
                    machine_name: 'gtm',
                    disabled: false,
                    title: 'Google TAG Manager',
                    description: 'Description du service GTM',
                    link: 'https://google.com',
                    group: 'analytics',
                    pattern: '/www\.googletagmanager\.com/'
                }
            }
        }
    },

    templates: {
        banner: function banner(_banner) {
            "use strict";

            var html = '\n            <div class="vk_cookie_manager">\n                <div class="vk_cookie_manager__banner">\n                    <div class="banner__wrapper">\n                        <div class="banner__content">\n                            <div class="content__title">' + _banner.title + '</div>\n                            <div class="content__description">' + _banner.description + '</div>\n                        </div>\n                        <div class="banner__actions">\n                            <div class="actions__enable_all"><button data-vk-cookie-manager-enable-all type="button">' + _banner.enable_all + '</button></div>\n                            <div class="actions__open_modal"><button data-vk-cookie-manager-open-modal type="button">' + _banner.cta + '</button></div>\n                        </div>\n                    </div>\n                </div>\n            </div>';

            return html;
        },

        modal: function modal(_modal, groups) {
            "use strict";

            var html = '\n            <div class="vk_cookie_manager">\n                <div class="vk_cookie_manager__modal">\n                    <div class="modal__wrapper">\n        \n                        <div class="modal__close">\n                            <button type="button" data-vk-cookie-manager-close-modal>' + _modal.close + '</button>\n                        </div>\n                            \n                        <div class="modal__header">\n                            <div class="header__content">\n                                <div class="header__title">' + _modal.title + '</div>\n                                <div class="header__description">' + _modal.description + '</div>\n                            </div>\n                            <div class="header__actions">\n                                <button type="button" data-vk-cookie-manager-enable-all>' + _modal.enable_all + '</button>\n                                <button type="button" data-vk-cookie-manager-disable-all>' + _modal.disable_all + '</button>\n                            </div>\n                        </div>\n        \n                        <div class="modal__content">\n                            ' + Object.entries(groups).map(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    i = _ref2[0],
                    group = _ref2[1];

                return '\n                                <div class="content__group">\n                                    <div class="group__header">\n                                        <div class="header__text">\n                                            <div class="header__title">' + group.title + '</div>\n                                            <div class="header__description">' + group.description + '</div>\n                                        </div>\n                                        <div class="header__actions">\n                                            <button type="button" data-vk-cookie-manager-toggle-group data-group="' + i + '"">' + _modal.toggle_group + '</button>\n                                        </div>\n                                    </div>\n                                    <div class="group__content">\n                                        ' + Object.entries(group.services).map(function (_ref3) {
                    var _ref4 = _slicedToArray(_ref3, 2),
                        j = _ref4[0],
                        service = _ref4[1];

                    return '\n                                            <div class="group__service">\n                                                <div class="service__config">\n                                                    <input class="service__input" type="checkbox" name="service__input--' + service.machine_name + '" id="service__input--' + service.machine_name + '" data-service="' + service.machine_name + '"  data-group="' + service.group + '">\n                                                    <label for="service__input--' + service.machine_name + '" class="service__label">\n                                                        <span class="service__title">' + service.title + '</span>\n                                                        <span class="service__switch"></span>\n                                                    </label>\n                                                    <div class="service__description">' + service.description + '</div>\n                                                </div>\n                                                <div class="service__link"><a  target="_blank" href="' + service.link + '">' + service.link + '</a></div>\n                                            </div>\n                                        ';
                }).join('') + '\n                                    </div>\n                                </div>\n                            ';
            }).join('') + '\n                        </div>\n        \n        \n                        <div class="modal__footer">\n                            <div class="modal__close">\n                                <button type="button" data-vk-cookie-manager-close-modal>' + _modal.close + '</button>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            ';

            return html;
        }
    }
};

// export default default_config;