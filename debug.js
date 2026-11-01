// Debug rendszer - részletes logging és hibajelentés
const DEBUG = {
  enabled: true,
  level: 'all', // 'error', 'warn', 'info', 'all'
  logs: [],
  maxLogs: 100,
  performance: {},
  errors: [],
  state: {},

  // Log levels
  log: function(level, category, message, data = null) {
    if (!this.enabled) return;

    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level, category, message, data };

    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${category}]`;
    switch (level) {
      case 'error':
        console.error(prefix, message, data || '');
        this.errors.push(logEntry);
        break;
      case 'warn':
        console.warn(prefix, message, data || '');
        break;
      case 'info':
        console.info(prefix, message, data || '');
        break;
      default:
        console.log(prefix, message, data || '');
    }

    // Update debug panel if exists
    this.updatePanel();
  },

  error: function(category, message, data = null) {
    this.log('error', category, message, data);
  },

  warn: function(category, message, data = null) {
    this.log('warn', category, message, data);
  },

  info: function(category, message, data = null) {
    this.log('info', category, message, data);
  },

  // Performance tracking
  startTimer: function(name) {
    this.performance[name] = performance.now();
    this.info('perf', `Timer started: ${name}`);
  },

  endTimer: function(name) {
    if (this.performance[name]) {
      const duration = performance.now() - this.performance[name];
      this.info('perf', `Timer ended: ${name} - ${duration.toFixed(2)}ms`);
      delete this.performance[name];
      return duration;
    }
    this.warn('perf', `Timer not found: ${name}`);
    return null;
  },

  // State tracking
  trackState: function(key, value) {
    this.state[key] = value;
    this.info('state', `State updated: ${key}`, value);
  },

  getState: function(key) {
    return this.state[key];
  },

  // Network request logging
  logRequest: function(url, method, data = null) {
    this.info('network', `${method} ${url}`, data);
  },

  logResponse: function(url, status, duration) {
    this.info('network', `${url} - ${status} (${duration.toFixed(2)}ms)`);
  },

  logError: function(url, error) {
    this.error('network', `Request failed: ${url}`, error);
  },

  // Get logs
  getLogs: function(level = null) {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return this.logs;
  },

  getErrors: function() {
    return this.errors;
  },

  clearLogs: function() {
    this.logs = [];
    this.errors = [];
    this.info('debug', 'Logs cleared');
  },

  // Export logs
  exportLogs: function() {
    const data = {
      timestamp: new Date().toISOString(),
      logs: this.logs,
      errors: this.errors,
      state: this.state,
      performance: this.performance,
      userAgent: navigator.userAgent,
      url: location.href
    };
    return JSON.stringify(data, null, 2);
  },

  // Debug panel
  showPanel: function() {
    let panel = document.getElementById('debugPanel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'debugPanel';
      panel.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        width: 400px;
        max-height: 80vh;
        background: rgba(0, 0, 0, 0.9);
        color: #fff;
        padding: 16px;
        border-radius: 12px;
        font-family: monospace;
        font-size: 12px;
        overflow-y: auto;
        z-index: 9999;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      `;
      document.body.appendChild(panel);
    }
    this.updatePanel();
    panel.style.display = 'block';
  },

  hidePanel: function() {
    const panel = document.getElementById('debugPanel');
    if (panel) {
      panel.style.display = 'none';
    }
  },

  updatePanel: function() {
    const panel = document.getElementById('debugPanel');
    if (!panel || panel.style.display === 'none') return;

    const recentLogs = this.logs.slice(-20).reverse();
    const errorCount = this.errors.length;

    panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <strong>🐛 Debug Panel</strong>
        <div>
          <button onclick="DEBUG.clearLogs()" style="background: #666; color: #fff; padding: 4px 8px; border: none; border-radius: 4px; cursor: pointer; margin-right: 4px;">Clear</button>
          <button onclick="DEBUG.hidePanel()" style="background: #e74c3c; color: #fff; padding: 4px 8px; border: none; border-radius: 4px; cursor: pointer;">Close</button>
        </div>
      </div>
      <div style="margin-bottom: 8px;">
        <span style="color: ${errorCount > 0 ? '#e74c3c' : '#4ade80'}">Errors: ${errorCount}</span> |
        <span>Logs: ${this.logs.length}</span> |
        <button onclick="DEBUG.exportToClipboard()" style="background: #3b82f6; color: #fff; padding: 2px 6px; border: none; border-radius: 4px; cursor: pointer; font-size: 10px;">Export</button>
      </div>
      <div style="margin-bottom: 8px;">
        <strong>Recent Logs:</strong>
      </div>
      <div style="max-height: 60vh; overflow-y: auto;">
        ${recentLogs.map(log => `
          <div style="margin-bottom: 4px; padding: 4px; border-radius: 4px; background: ${
            log.level === 'error' ? 'rgba(231, 76, 60, 0.3)' :
            log.level === 'warn' ? 'rgba(243, 156, 18, 0.3)' :
            log.level === 'info' ? 'rgba(52, 152, 219, 0.3)' :
            'rgba(46, 204, 113, 0.3)'
          }">
            <span style="color: ${log.level === 'error' ? '#e74c3c' : log.level === 'warn' ? '#f39c12' : '#fff'}">[${log.level.toUpperCase()}]</span>
            <span style="color: #aaa">${log.timestamp.split('T')[1].split('.')[0]}</span>
            <span style="color: #fff">[${log.category}]</span>
            <span style="color: #ddd">${log.message}</span>
            ${log.data ? `<pre style="margin: 4px 0 0 0; padding: 4px; background: rgba(0,0,0,0.3); border-radius: 4px; overflow-x: auto;">${JSON.stringify(log.data, null, 2)}</pre>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  },

  exportToClipboard: function() {
    const logs = this.exportLogs();
    navigator.clipboard.writeText(logs).then(() => {
      this.info('debug', 'Logs exported to clipboard');
      alert('Debug logs copied to clipboard!');
    }).catch(err => {
      this.error('debug', 'Failed to export logs', err);
    });
  },

  // Initialize
  init: function() {
    this.info('debug', 'Debug system initialized');
    this.info('debug', 'User Agent', navigator.userAgent);
    this.info('debug', 'URL', location.href);

    // Global error handler
    window.addEventListener('error', (event) => {
      this.error('global', `Uncaught error: ${event.message}`, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    // Unhandled promise rejection
    window.addEventListener('unhandledrejection', (event) => {
      this.error('promise', `Unhandled promise rejection: ${event.reason}`, {
        reason: event.reason,
        stack: event.reason?.stack
      });
    });

    // Keyboard shortcut to show debug panel (Ctrl+Shift+D)
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        this.showPanel();
      }
    });
  }
};

// Auto-initialize
DEBUG.init();

// Export to window
window.DEBUG = DEBUG;
