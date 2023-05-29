(function (window, document) {
    var sessionTimeout = {};
  
    sessionTimeout.initialize = function (options) {
      options = options || {};
      var warningDuration = options.warningDuration || 300000; // Default: 5 minutes
      var sessionTimeoutDuration = options.sessionTimeoutDuration || 600000; // Default: 10 minutes
      var logoutUrl = options.logoutUrl || '/logout'; // Default: '/logout'
  
      var timeout;
      var warningTimer;
      var modalContainer;
      var resetTimerEvents = ['click', 'keypress', 'mousemove', 'touchmove', 'touchend', 'scroll'];
  
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
        if (!modalContainer) {
          createModal();
        }
        modalContainer.style.display = 'block';
      }
  
      function createModal() {
        modalContainer = document.createElement('div');
        modalContainer.className = 'session-timeout-modal';
        modalContainer.innerHTML = `
          <div class="session-timeout-modal-content">
            <h2>Session Timeout Warning</h2>
            <p>Your session will expire soon. Do you want to continue?</p>
            <div class="session-timeout-modal-actions">
              <button class="session-timeout-btn-continue">Continue</button>
              <button class="session-timeout-btn-logout">Logout</button>
            </div>
          </div>
        `;
        document.body.appendChild(modalContainer);
  
        var continueBtn = modalContainer.querySelector('.session-timeout-btn-continue');
        var logoutBtn = modalContainer.querySelector('.session-timeout-btn-logout');
  
        continueBtn.addEventListener('click', function () {
          modalContainer.style.display = 'none';
          resetSessionTimeout();
        });
  
        logoutBtn.addEventListener('click', logout);
      }
  
      function resetTimerOnEvents() {
        resetTimerEvents.forEach(function (event) {
          document.addEventListener(event, resetSessionTimeout, false);
        });
      }
  
      resetTimerOnEvents();
      startSessionTimeout();
      startWarningTimer();
    };
  
    window.sessionTimeout = sessionTimeout;
  })(window, document);
  