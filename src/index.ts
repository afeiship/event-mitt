export interface EventMittOptions {
  immediate?: boolean;
  once?: boolean;
}

export interface EventMittHandler {
  __immediate__?: boolean;
  __once__?: boolean;

  (...args: any[]): void;
}

const defaults = {
  immediate: false,
  once: false,
};

const cleanStarListeners = function (inName, inMap) {
  const starIndex = inName.indexOf('*');
  const isStart = starIndex === 0;
  const isEnd = starIndex === inName.length - 1;
  const isFull = inName === '*';
  const endsName = inName.slice(0, -1);
  const startsName = inName.slice(1);
  if (starIndex === -1) return;
  for (let key in inMap) {
    const cleanCondition =
      isFull || (isStart && key.endsWith(startsName)) || (isEnd && key.startsWith(endsName));
    if (cleanCondition) {
      inMap[key].length = 0;
    }
  }
};

const EventMitt = {
  _events: {},
  on: function (inName: string, inHandler: EventMittHandler, inOptions?: EventMittOptions) {
    const self = this;
    const map = (this._events = this._events || {});
    const options = Object.assign({}, defaults, inOptions || {});
    const isImmediate = inHandler.__immediate__ || options.immediate;
    const listeners = (map[inName] = map[inName] || []);
    listeners.push(inHandler);

    // if is immediate, trigger it
    if (isImmediate) inHandler.call(this);
    if (options.once) inHandler.__once__ = true;

    return {
      destroy: function () {
        self.off(inName, inHandler);
      },
    };
  },
  off: function (inName: string, inHandler?: EventMittHandler) {
    const map = (this._events = this._events || {});
    // process star events
    cleanStarListeners(inName, map);

    if (!(inName in map)) return;
    const listeners = map[inName];
    const _listeners = listeners.slice(0);
    if (inHandler) {
      for (let i = 0; i < _listeners.length; i++) {
        if (_listeners[i] === inHandler) {
          listeners.splice(i, 1);
        }
      }
    } else {
      listeners.length = 0;
    }
  },
  emit: function (inName: string, inData: any) {
    const map = (this._events = this._events || {});
    const self = this;
    const dispatch = function (inType: string) {
      const listeners = (map[inType] || []).slice();
      const args = inType === '*' ? [inName, inData] : [inData];
      for (let i = 0; i < listeners.length; i++) {
        const handler = listeners[i];
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
  one: function (inName: string, inHandler: EventMittHandler) {
    const self = this;
    const map = (this._events = this._events || {});
    const evtMap = map[inName];
    if (!evtMap || !evtMap.length) {
      return this.on(inName, inHandler);
    }
    return {
      destroy: function () {
        self.off(inName, inHandler);
      },
    };
  },
  once: function (inName: string, inHandler: EventMittHandler) {
    inHandler.__once__ = true;
    return this.on(inName, inHandler);
  },
  upon: function (inName: string, inHandler: EventMittHandler) {
    this.off(inName);
    return this.on(inName, inHandler);
  },
  on2immediate: function (inName: string, inHandler: EventMittHandler) {
    inHandler.__immediate__ = true;
    return this.on(inName, inHandler);
  },
};

export default EventMitt;
