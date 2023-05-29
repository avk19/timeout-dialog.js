(function($) {
  $.timeoutDialog = function(options) {
    var settings = $.extend(
      {
        timeout: 1200000, // 20 minutes
        countdown: 60, // countdown in seconds
        logoutButton: '#logoutButton',
        dialogTitle: 'Session Timeout',
        dialogText:
          'Your session is about to expire.',
        dialogTimeRemaining: 'Time remaining',
        keepAliveButton: 'Stay Logged In',
        logoutButtonValue: 'Log Out',
        logoutRedirectUrl: '/logout',
        countdownMessage: 'Redirecting in {0} seconds...',
      },
      options
    );

    var TimeoutDialog = {
      init: function() {
        this.setupDialogTimer();
        this.setupDialog();
        this.setupDialogButtons();
        this.startCountdown();
      },

      setupDialogTimer: function() {
        var self = this;
        this.dialogTimer = setTimeout(function() {
          self.showDialog();
        }, settings.timeout);
      },

      resetDialogTimer: function() {
        clearTimeout(this.dialogTimer);
        this.setupDialogTimer();
      },

      showDialog: function() {
        var self = this;
        this.$dialog.dialog({
          modal: true,
          resizable: false,
          closeOnEscape: false,
          draggable: false,
          dialogClass: 'timeout-dialog',
          title: settings.dialogTitle,
          open: function() {
            $('.ui-dialog-titlebar-close').hide();
            $(this).html(
              '<p>' +
                settings.dialogText +
                '</p><p>' +
                settings.dialogTimeRemaining +
                ': <span id="timeout-countdown"></span></p>'
            );
          },
          buttons: [
            {
              text: settings.keepAliveButton,
              click: function() {
                self.keepAlive();
              },
              class: 'timeout-dialog-keep-alive',
            },
            {
              text: settings.logoutButtonValue,
              click: function() {
                self.logout();
              },
              class: 'timeout-dialog-logout',
            },
          ],
        });
      },

      setupDialog: function() {
        this.$dialog = $('<div id="timeout-dialog"></div>').appendTo(
          'body'
        );
      },

      setupDialogButtons: function() {
        var self = this;
        $(settings.logoutButton).on('click', function() {
          self.logout();
        });
        $('.timeout-dialog-keep-alive').button({
          autoFocus: true,
        });
        $('.timeout-dialog-logout').button();
      },

      startCountdown: function() {
        var self = this;
        var countdown = settings.countdown;
        this.countdownTimer = setInterval(function() {
          $('#timeout-countdown').text(countdown);
          countdown--;
          if (countdown < 0) {
            clearInterval(self.countdownTimer);
            self.logout();
          }
        }, 1000);
      },

      keepAlive: function() {
        this.resetDialogTimer();
        this.$dialog.dialog('close');
      },

      logout: function() {
        window.location.href = settings.logoutRedirectUrl;
      },
    };

    TimeoutDialog.init();
  };
})(jQuery);
