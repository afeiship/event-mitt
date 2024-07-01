var defaults = {
  immediate: false,
  once: false
};

var cleanStarListeners = function (inName, inMap) {
  var starIndex = inName.indexOf('*');
  var isStart = starIndex === 0;
  var isEnd = starIndex === inName.length - 1;
  var isFull = inName === '*';
  if (starIndex === -1) return;
  for (var key in inMap) {
    var cleanCondition =
      isFull ||
      (isStart && key.endsWith(inName.slice(1))) ||
      (isEnd && key.startsWith(inName.slice(0, -1)));
    if (cleanCondition) {
      inMap[key].length = 0;
    }
  }
};

var EventMitt = {
  on: function (inName, inHandler, inOptions) {
    var self = this;
    var map = (this._events = this._events || {});
    var options = Object.assign({}, defaults, inOptions || {});
    var isImmediate = inHandler.__immediate__ || options.immediate;
    var listeners = (map[inName] = map[inName] || []);
    listeners.push(inHandler);

    // if is immidiate, trigger it
    if (isImmediate) inHandler.call(this);
    if (options.once) inHandler.__once__ = true;

    return {
      destroy: function () {
        self.off(inName, inHandler);
      }
    };
  },
  off: function (inName, inHandler) {
    var map = (this._events = this._events || {});
    // process star events
    cleanStarListeners(inName, map);

    if (!(inName in map)) return;
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
  emit: function (inName, inData) {
    var map = (this._events = this._events || {});
    var self = this;
    var dispatch = function (inType) {
      var listeners = (map[inType] || []).slice();
      var args = inType === '*' ? [inName, inData] : [inData];
      for (var i = 0; i < listeners.length; i++) {
        var handler = listeners[i];
        if (handler.apply(null, args) === false) {
          break;
        }

        if (handler.__once__) {
          self.off(inName, handler);
        }
      }
    };
    inName !== '*' && dispatch(inName), dispatch('*');
  },
  one: function (inName, inHandler) {
    var self = this;
    var map = (this._events = this._events || {});
    var evtMap = map[inName];
    if (!evtMap || !evtMap.length) {
      return this.on(inName, inHandler);
    }
    return {
      destroy: function () {
        self.off(inName, inHandler);
      }
    };
  },
  once: function (inName, inHandler) {
    inHandler.__once__ = true;
    return this.on(inName, inHandler);
  },
  upon: function (inName, inHandler) {
    this.off(inName);
    return this.on(inName, inHandler);
  },
  on2immediate: function (inName, inHandler) {
    inHandler.__immediate__ = true;
    return this.on(inName, inHandler);
  }
};
