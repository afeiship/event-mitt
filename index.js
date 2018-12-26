var global = global || this || window || Function('return this')();
var EventMitt = {
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
  emit: function(inName, inData) {
    var map = (this._events = this._events || {});
    var dispatch = function(inType) {
      var listeners = (map[inType] || []).slice();
      var args = inType === '*' ? [inName, inData] : [inData];
      for (var i = 0; i < listeners.length; i++) {
        var handler = listeners[i];
        if (handler.apply(null, args) === false) {
          break;
        }

        if (handler.__once__) {
          this.off(inName, handler);
        }
      }
    };
    inName !== '*' && dispatch(inName), dispatch('*');
  },
  one: function(inName, inHandler) {
    var map = (this._events = this._events || {});
    if (!map[inName]) {
      return this.on(inName, inHandler);
    }
  },
  once: function(inName, inHandler) {
    inHandler.__once__ = true;
    return this.on(inName, inHandler);
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = EventMitt;
} else {
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return EventMitt;
    });
  } else {
    global.EventMitt = EventMitt;
  }
}
