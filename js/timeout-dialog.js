(function (window, document) {
  var TimeoutDialog = {
    options: {
      timeout: 300000, // 5 minutes
      countdown: 60000, // 1 minute
      logoutButton: '#logoutButton',
      keepAliveUrl: '/keep-alive',
      logoutUrl: '/logout'
    },

    dialogElement: null,
    countdownElement: null,
    timeoutId: null,
    countdownId: null,

    initialize: function (options) {
      // Merge user options with default options
      Object.assign(this.options, options);

      // Create the dialog element
      this.dialogElement = document.createElement('div');
      this.dialogElement.id = 'timeout-dialog';
      this.dialogElement.innerHTML = 'Your session will expire in <span id="timeout-countdown"></span> seconds.<br/><button id="timeout-keep-alive">Stay Connected</button> or <button id="timeout-logout">Logout</button>';
      this.dialogElement.style.display = 'none';
      document.body.appendChild(this.dialogElement);

      // Assign the countdown element
      this.countdownElement = document.getElementById('timeout-countdown');

      // Add event listeners to buttons
      var keepAliveButton = document.getElementById('timeout-keep-alive');
      keepAliveButton.addEventListener('click', this.keepAlive.bind(this));

      var logoutButton = document.getElementById('timeout-logout');
      logoutButton.addEventListener('click', this.logout.bind(this));

      // Start the timeout
      this.startTimeout();
    },

    startTimeout: function () {
      // Clear existing timeout and countdown
      clearTimeout(this.timeoutId);
      clearInterval(this.countdownId);

      // Set the timeout
      this.timeoutId = setTimeout(this.showDialog.bind(this), this.options.timeout);

      // Start the countdown
      this.countdownId = setInterval(this.updateCountdown.bind(this), 1000);
    },

    resetTimeout: function () {
      this.startTimeout();
      this.hideDialog();
    },

    updateCountdown: function () {
      var seconds = Math.ceil((this.timeoutId - Date.now()) / 1000);
      this.countdownElement.textContent = seconds;
    },

    showDialog: function () {
      this.dialogElement.style.display = 'block';
    },

    hideDialog: function () {
      this.dialogElement.style.display = 'none';
    },

    keepAlive: function () {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', this.options.keepAliveUrl, true);
      xhr.send();
      this.resetTimeout();
    },

    logout: function () {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', this.options.logoutUrl, true);
      xhr.send();
      this.hideDialog();
    }
  };

  // Expose TimeoutDialog to the global scope
  window.TimeoutDialog = TimeoutDialog;
})(window, document);
