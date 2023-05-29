function SessionTimeout(options) {
  var defaults = {
    message: 'Your session is about to expire.',
    countdown: 60,
    logoutUrl: '/logout',
    keepAliveUrl: '/keep-alive',
    keepAliveInterval: 300,
    redirectUrl: '',
    onStart: function() {},
    onWarn: function() {},
    onTimeout: function() {},
    onReset: function() {},
    onDestroy: function() {}
  };

  this.settings = Object.assign({}, defaults, options);
  this.timer = null;
  this.lastActivityTime = new Date();
  this.init();
}

SessionTimeout.prototype = {
  init: function() {
    this.bindEvents();
    this.start();
    this.settings.onStart.call(this);
  },

  bindEvents: function() {
    var self = this;
    window.addEventListener('mousemove', function() { self.activityDetected(); });
    window.addEventListener('keypress', function() { self.activityDetected(); });
  },

  activityDetected: function() {
    this.lastActivityTime = new Date();
  },

  start: function() {
    this.clearTimer();
    this.setTimer();
  },

  clearTimer: function() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  },

  setTimer: function() {
    var self = this;
    var remainingTime = this.calculateRemainingTime();
    if (remainingTime > 0) {
      this.timer = setTimeout(function() { self.warn(); }, remainingTime);
    } else {
      this.timeout();
    }
  },

  calculateRemainingTime: function() {
    var currentTime = new Date();
    var elapsedTime = currentTime - this.lastActivityTime;
    var remainingTime = (this.settings.countdown * 1000) - elapsedTime;
    return remainingTime;
  },

  warn: function() {
    this.settings.onWarn.call(this);
    var self = this;
    setTimeout(function() { self.timeout(); }, this.settings.countdown * 1000);
  },

  timeout: function() {
    this.settings.onTimeout.call(this);
    if (this.settings.redirectUrl) {
      window.location.href = this.settings.redirectUrl;
    } else if (this.settings.logoutUrl) {
      window.location.href = this.settings.logoutUrl;
    }
  },

  reset: function() {
    this.settings.onReset.call(this);
    this.start();
  },

  destroy: function() {
    this.clearTimer();
    this.settings.onDestroy.call(this);
  }
};
