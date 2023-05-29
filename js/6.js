(function (window, document) {
    var sessionTimeout = {};
  
    sessionTimeout.initialize = function (options) {
      options = options || {};
      var warningDuration = options.warningDuration || 300000; // Default: 5 minutes
      var sessionTimeoutDuration = options.sessionTimeoutDuration || 600000; // Default: 10 minutes
      var logoutUrl = options.logoutUrl || '/logout'; // Default: '/logout'
      
      var timeout;
      var warningTimer;
    
      function startSessionTimeout() {
        timeout = setTimeout(logout, sessionTimeoutDuration);
      }
    
      function resetSessionTimeout() {
        clearTimeout(timeout);
        clearTimeout(warningTimer);
        startSessionTimeout();
        startWarningTimer();
      }
    
      function startWarningTimer() {
        warningTimer = setTimeout(showWarningDialog, sessionTimeoutDuration - warningDuration);
      }
    
      function logout() {
        window.location.href = logoutUrl;
      }
    
      function showWarningDialog() {
        // Show your warning dialog here
      }
    
      function resetTimerOnEvent(eventType) {
        ['click', 'keypress', 'mousemove', 'touchmove', 'touchend', 'scroll'].forEach(function (event) {
          document.addEventListener(event, resetSessionTimeout, false);
        });
      }
    
      resetTimerOnEvent();
      startSessionTimeout();
      startWarningTimer();
    };
  
    window.sessionTimeout = sessionTimeout;
  })(window, document);
  