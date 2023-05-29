// Handle session timeout with counter in modal dialog
$(document).ready(function () {
    var dialogTimer, redirTimer;
    
    var options = {
        message: 'Your session is about to expire.',
        keepAliveUrl: '/keep-alive',
        keepAliveAjaxRequestType: 'POST',
        redirUrl: '/timed-out',
        logoutUrl: '/log-out',
        warnAfter: 900000, // 15 minutes
        redirAfter: 1200000, // 20 minutes
        appendTime: true // appends time stamp to keep alive url to prevent caching
    };

    var dialog = $('<div title="Session Timeout" id="sessionTimeout-dialog">' + options.message + '<p id="sessionTimeout-counter"></p></div>').dialog({
        autoOpen: false,
        width: 400,
        modal: true,
        closeOnEscape: false,
        open: function () {
            $(".ui-dialog-titlebar-close").hide();
            updateCounter();
            startCounter();
        },
        buttons: {
            "Log Out Now": function () {
                window.location = options.logoutUrl;
            },
            "Stay Connected": function () {
                $(this).dialog('close');

                $.ajax({
                    type: options.keepAliveAjaxRequestType,
                    url: options.appendTime ? updateQueryStringParameter(options.keepAliveUrl, "_", new Date().getTime()) : options.keepAliveUrl
                });

                controlRedirTimer('stop');
                controlDialogTimer('start');
            }
        }
    });

    function controlDialogTimer(action) {
        switch (action) {
            case 'start':
                dialogTimer = setTimeout(function () {
                    dialog.dialog('open');
                    controlRedirTimer('start');
                }, options.warnAfter);
                break;

            case 'stop':
                clearTimeout(dialogTimer);
                break;
        }
    }

    function controlRedirTimer(action) {
        switch (action) {
            case 'start':
                redirTimer = setTimeout(function () {
                    window.location = options.redirUrl;
                }, options.redirAfter - options.warnAfter);
                break;

            case 'stop':
                clearTimeout(redirTimer);
                break;
        }
    }

    function updateCounter() {
        var counterElement = dialog.find('#sessionTimeout-counter');
        var remainingTime = Math.ceil((options.redirAfter - options.warnAfter) / 1000);
        counterElement.text('Remaining Time: ' + remainingTime + ' seconds');
    }

    function startCounter() {
        counterInterval = setInterval(function () {
            updateCounter();
        }, 1000);
    }

    function stopCounter() {
        clearInterval(counterInterval);
    }

    $(document).ajaxComplete(function () {
        if (!dialog.dialog("isOpen")) {
            controlRedirTimer('stop');
            controlDialogTimer('stop');
            controlDialogTimer('start');
        }
    });

    controlDialogTimer('start');

    // Courtesy of http://stackoverflow.com/questions/5999118/add-or-update-query-string-parameter
    // Includes fix for angular ui-router as per comment by j_walker_dev
    function updateQueryStringParameter(uri, key, value) {
        var re = new RegExp("([?|&])" + key + "=.*?(&|#|$)", "i");

        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        } else {
            var hash = '';

            if (uri.indexOf('#') !== -1) {
                hash = uri.replace(/.*#/, '#');
                uri = uri.replace(/#.*/, '');
            }

            var separator = uri.indexOf('?') !== -1 ? "&" : "?";
            return uri + separator + key + "=" + value + hash;
        }
    }
});
