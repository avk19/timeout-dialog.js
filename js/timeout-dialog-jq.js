(function ($) {
  var timeoutDialog = {
    init: function (options) {
      var defaults = {
        timeout: 300, // seconds
        countdown: 60, // seconds
        logoutButton: '#logoutButton',
        keepAliveUrl: '/keep-alive',
        logoutUrl: '/logout',
        dialogWidth: 350,
        dialogHeight: 220,
        countdownMessage: 'Your session will expire in {0} seconds.',
        timeoutMessage: 'Your session has expired. Do you want to log out?',
        keepAliveInterval: null,
        timeoutDialog: null,
      };

      var settings = $.extend({}, defaults, options);

      // Create the timeout dialog
      var dialogContent =
        '<div id="timeout-dialog" style="display:none;" title="Session Timeout">' +
        '<p id="timeout-message"></p>' +
        '</div>';
      $('body').append(dialogContent);
      settings.timeoutDialog = $('#timeout-dialog');

      // Start the countdown timer
      var countdown = settings.countdown;
      function startCountdown() {
        $('#timeout-message').html(settings.countdownMessage.replace('{0}', countdown));
        countdown--;
        if (countdown >= 0) {
          setTimeout(startCountdown, 1000);
        }
      }

      // Show the timeout dialog
      function showTimeoutDialog() {
        settings.timeoutDialog.dialog({
          resizable: false,
          width: settings.dialogWidth,
          height: settings.dialogHeight,
          modal: true,
          buttons: {
            'Stay Logged In': function () {
              resetTimeout();
              $(this).dialog('close');
            },
            'Log Out': function () {
              logout();
            },
          },
          closeOnEscape: false,
        });
      }

      // Reset the timeout
      function resetTimeout() {
        clearTimeout(settings.keepAliveInterval);
        startTimeout();
      }

      // Logout the user
      function logout() {
        window.location.href = settings.logoutUrl;
      }

      // Start the timeout
      function startTimeout() {
        settings.keepAliveInterval = setTimeout(function () {
          showTimeoutDialog();
        }, settings.timeout * 1000);
        startCountdown();
      }

      // Bind events
      $(document).on('mousemove keydown scroll', function () {
        resetTimeout();
      });

      $(settings.logoutButton).on('click', function () {
        logout();
      });

      // Start the initial timeout
      startTimeout();
    },
  };

  $.timeoutDialog = function (options) {
    timeoutDialog.init(options);
  };
})(jQuery);
