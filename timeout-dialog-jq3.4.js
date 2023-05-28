(function ($) {
  $.timeoutDialog = function (options) {
    var settings = $.extend(
      {
        timeout: 300000, // 5 minutes
        countdown: 60000, // 1 minute
        logoutUrl: '/logout', // logout URL
        keepAliveUrl: null, // keep-alive URL
        dialogTitle: 'Your session is about to expire!',
        dialogText:
          'You will be logged out in <span id="timeout-countdown"></span> seconds.',
        dialogTimeRemainingText: 'Time remaining',
        logoutButton: 'Logout',
        keepAliveButton: 'Stay Connected',
        logoutButtonClass: null, // additional CSS class for the logout button
        keepAliveButtonClass: null, // additional CSS class for the keep-alive button
        keepAliveButtonTextStyle: { fontWeight: 'bold' }, // additional CSS styles for the keep-alive button text
        onTimeout: null, // callback function to be executed on timeout
        countdownCallback: null, // callback function to be executed on each countdown tick
      },
      options
    );

    var timer, countdownTimer;
    var timeout = settings.timeout;
    var countdown = settings.countdown;
    var logoutUrl = settings.logoutUrl;
    var keepAliveUrl = settings.keepAliveUrl;

    function startTimers() {
      clearTimeout(timer);
      clearTimeout(countdownTimer);

      timer = setTimeout(function () {
        if (settings.onTimeout && typeof settings.onTimeout === 'function') {
          settings.onTimeout.call();
        } else {
          location.href = logoutUrl;
        }
      }, timeout);

      countdownTimer = setTimeout(function () {
        if (settings.countdownCallback && typeof settings.countdownCallback === 'function') {
          settings.countdownCallback.call();
        }

        var remainingSeconds = Math.floor(countdown / 1000);
        $('#timeout-countdown').text(remainingSeconds);

        countdown -= 1000;
        startTimers();
      }, countdown);
    }

    function resetTimers() {
      clearTimeout(timer);
      clearTimeout(countdownTimer);
      countdown = settings.countdown;
      startTimers();
    }

    function initDialog() {
      var dialogHtml =
        '<div id="timeout-dialog" style="display:none;" title="' +
        settings.dialogTitle +
        '">' +
        '<p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>' +
        settings.dialogText +
        '</p></div>';

      $('body').append(dialogHtml);

      $('#timeout-dialog').dialog({
        autoOpen: false,
        width: 400,
        modal: true,
        closeOnEscape: false,
        draggable: false,
        resizable: false,
        open: function () {
          $('.ui-dialog-titlebar-close').hide();
          startTimers();
        },
        buttons: [
          {
            text: settings.logoutButton,
            class: settings.logoutButtonClass,
            click: function () {
              if (settings.onTimeout && typeof settings.onTimeout === 'function') {
                settings.onTimeout.call();
              } else {
                location.href = logoutUrl;
              }
            },
          },
          {
            text: settings.keepAliveButton,
            class: settings.keepAliveButtonClass,
            click: function () {
              resetTimers();
              $(this).dialog('close');
            },
            style: settings.keepAliveButtonTextStyle,
          },
        ],
      });
    }

    function showDialog() {
      if ($('#timeout-dialog').length === 0) {
        initDialog();
