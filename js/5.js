(function() {
    var warningTimeout, timeout;
    var options = {
      redirUrl: 'logout.html',
      keepAliveUrl: null,
      keepAliveInterval: 60000,
      warnAfter: 900000,
      countdownBar: true,
      countdownMessage: 'Your session will expire in {timer} seconds.',
      logoutMessage: 'Your session has expired.',
      logoutCallback: function() {}
    };
  
    function startTimer() {
      clearTimeout(warningTimeout);
      clearTimeout(timeout);
  
      warningTimeout = setTimeout(warn, options.warnAfter);
      timeout = setTimeout(logout, options.warnAfter + options.countdownBar);
    }
  
    function resetTimer() {
      clearTimeout(warningTimeout);
      clearTimeout(timeout);
      startTimer();
    }
  
    function warn() {
      if (options.countdownBar) {
        var timer = Math.floor((options.warnAfter - options.countdownBar) / 1000);
        // Display countdown message or perform any other actions
        console.log(options.countdownMessage.replace('{timer}', timer));
      }
    }
  
    function logout() {
      // Redirect to the logout URL or perform any other actions
      console.log(options.logoutMessage);
      options.logoutCallback();
      window.location.href = options.redirUrl;
    }
  
    function keepAlive() {
      if (options.keepAliveUrl) {
        // Perform an AJAX request to the keep-alive URL or perform any other actions
        console.log('Keep alive request');
      }
    }
  
    function init(userOptions) {
      Object.assign(options, userOptions);
  
      document.addEventListener('mousemove', resetTimer);
      document.addEventListener('keydown', resetTimer);
      document.addEventListener('click', resetTimer);
      document.addEventListener('scroll', resetTimer);
  
      if (options.keepAliveUrl) {
        setInterval(keepAlive, options.keepAliveInterval);
      }
  
      startTimer();
    }
  
    window.sessionTimeout = {
      init: init
    };
  })();
  