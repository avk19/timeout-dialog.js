(function () {
    var sessionTimeout = function (options) {
        var defaults = {
            message: 'Your session is about to expire.',
            keepAliveUrl: '/keep-alive',
            keepAliveAjaxRequestType: 'POST',
            redirUrl: '/timed-out',
            logoutUrl: '/log-out',
            warnAfter: 900000, // 15 minutes
            redirAfter: 1200000, // 20 minutes
            appendTime: true // appends time stamp to keep alive url to prevent caching
        };

        // Extend user-set options over defaults
        var o = Object.assign({}, defaults, options),
            dialogTimer,
            redirTimer;

        // Create timeout warning dialog
        var dialogElement = document.createElement('div');
        dialogElement.id = 'sessionTimeout-dialog';
        dialogElement.title = 'Session Timeout';
        dialogElement.textContent = o.message;
        document.body.appendChild(dialogElement);

        var dialogOptions = {
            autoOpen: false,
            width: 400,
            modal: true,
            closeOnEscape: false,
            open: function () { document.querySelector('.ui-dialog-titlebar-close').style.display = 'none'; },
            buttons: {
                // Button one - takes user to logout URL
                'Log Out Now': function () {
                    window.location = o.logoutUrl;
                },
                // Button two - closes dialog and makes call to keep-alive URL
                'Stay Connected': function () {
                    dialog.close();

                    var url = o.appendTime ? updateQueryStringParameter(o.keepAliveUrl, '_', new Date().getTime()) : o.keepAliveUrl;
                    var request = new XMLHttpRequest();
                    request.open(o.keepAliveAjaxRequestType, url);
                    request.send();

                    // Stop redirect timer and restart warning timer
                    controlRedirTimer('stop');
                    controlDialogTimer('start');
                }
            }
        };

        var dialog = new Dialog(dialogElement, dialogOptions);

        function controlDialogTimer(action) {
            switch (action) {
                case 'start':
                    // After warning period, show dialog and start redirect timer
                    dialogTimer = setTimeout(function () {
                        dialog.open();
                        controlRedirTimer('start');
                    }, o.warnAfter);
                    break;

                case 'stop':
                    clearTimeout(dialogTimer);
                    break;
            }
        }

        function controlRedirTimer(action) {
            switch (action) {
                case 'start':
                    // Dialog has been shown, if no action taken during redir period, redirect
                    redirTimer = setTimeout(function () {
                        window.location = o.redirUrl;
                    }, o.redirAfter - o.warnAfter);
                    break;

                case 'stop':
                    clearTimeout(redirTimer);
                    break;
            }
        }

        // Courtesy of http://stackoverflow.com/questions/5999118/add-or-update-query-string-parameter
        // Includes fix for angular ui-router as per comment by j_walker_dev
        function updateQueryStringParameter(uri, key, value) {
            var re = new RegExp('([?|&])' + key + '=.*?(&|#|$)', 'i');

            if (uri.match(re)) {
                return uri.replace(re, '$1' + key + '=' + value + '$2');
            } else {
                var hash = '';

                if (uri.indexOf('#') !== -1) {
                    hash = uri.replace(/.*#/, '#');
                    uri = uri.replace(/#.*/, '');
                }

                var separator = uri.indexOf('?') !== -1 ? '&' : '?';
                return uri + separator + key + '=' + value + hash;
            }
        }

        function Dialog(element, options) {
            var self = this;

            self.element = element;
            self.options = options;

            self.open = function () {
                self.element.style.display = 'block';
                self.options.open();
            };

            self.close = function () {
                self.element.style.display = 'none';
            };

            self.element.addEventListener('click', function (event) {
                if (event.target.classList.contains('ui-dialog-titlebar-close')) {
                    event.stopPropagation();
                    event.preventDefault();
                }
            });

            self.element.addEventListener('click', function (event) {
                if (event.target.classList.contains('ui-dialog-button')) {
                    var buttonIndex = Array.from(self.element.querySelectorAll('.ui-dialog-button')).indexOf(event.target);
                    var buttonKey = Object.keys(self.options.buttons)[buttonIndex];
                    var buttonAction = self.options.buttons[buttonKey];
                    buttonAction();
                }
            });
        }

        function handleAjaxComplete() {
            if (!dialog.isOpen) {
                controlRedirTimer('stop');
                controlDialogTimer('stop');
                controlDialogTimer('start');
            }
        }

        document.addEventListener('ajaxComplete', handleAjaxComplete);

        // Begin warning period
        controlDialogTimer('start');
    };

    // Call $.sessionTimeout() after document ready
    document.addEventListener('DOMContentLoaded', function () {
        sessionTimeout();
    });
})();
