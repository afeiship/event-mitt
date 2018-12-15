var global = global || this || window || Function('return this')();
var SLICE = Array.prototype.slice;
var EventEmitter = {
  on: function(inName, inHandler) {
    var self = this;
    var map = (this._events = this._events || {});
    var listeners = (map[inName] = map[inName] || []);
    listeners.push(inHandler);
    return {
      destroy: function() {
        self.off(inName, inHandler);
      }
    };
  },
  off: function(inName, inHandler) {
    var map = (this._events = this._events || {});
    if (inName in map === false) return;

    var listeners = map[inName];
    var _listeners = listeners.slice(0);
    if (inHandler) {
      for (var i = 0; i < _listeners.length; i++) {
        if (_listeners[i] === inHandler) {
          listeners.splice(i, 1);
        }
      }
    } else {
      listeners.length = 0;
    }
  },
  emit: function(inName /* , args... */) {
    var map = (this._events = this._events || {});
    if (inName in map === false) return;

    var listeners = map[inName];
    var args = SLICE.call(arguments, 1);
    if (listeners && listeners.length > 0) {
      for (var i = 0; i < listeners.length; i++) {
        if (listeners[i].apply(null, args) === false) {
          break;
        }
      }
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = EventEmitter;
} else {
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return EventEmitter;
    });
  } else {
    global.EventEmitter = EventEmitter;
  }
}
