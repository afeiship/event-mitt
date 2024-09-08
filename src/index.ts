import wildcardMatch from '@jswork/wildcard-match';

export namespace EventMittNamespace {
  export interface EventOptions {
    immediate?: boolean;
    once?: boolean;
  }

  export interface EventHandler {
    (this: EventMitt, ...args: any[]): void;
  }

  export interface EventListener {
    destroy: () => void;
  }

  export interface EventMap {
    [eventName: string]: EventHandler[] | undefined;
  }

  export interface EventMitt {
    _events?: EventMap;

    on: (inName: string, inHandler: EventHandler, inOptions?: EventOptions) => EventListener;
    off: (inName: string, inHandler?: EventHandler) => void;
    emit: (inName: string, inData?: any) => void;
    one: (inName: string, inHandler: EventHandler) => EventListener;
    once: (inName: string, inHandler: EventHandler) => EventListener;
    upon: (inName: string, inHandler: EventHandler) => EventListener;
    on2immediate: (inName: string, inHandler: EventHandler) => EventListener;
  }
}

export interface EventMittHandler {
  __immediate__?: boolean;
  __once__?: boolean;

  (...args: any[]): void;
}

const defaults: EventMittNamespace.EventOptions = {
  immediate: false,
  once: false,
};

const getListeners = function (inName: string, inMap: any) {
  let target: any[] = inMap[inName] || [];
  let result: any[] = [];
  if (inName.indexOf('*') === -1) return target;
  for (let key in inMap) {
    if (key === inName) continue;
    const listeners = inMap[key] || [];
    if (wildcardMatch(key, inName)) {
      result = result.concat(listeners);
    }
  }
  return result.concat(target);
};

const EventMitt = {
  _events: {},
  on: function (
    inName: string,
    inHandler: EventMittHandler,
    inOptions?: EventMittNamespace.EventOptions
  ) {
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
    const listeners = getListeners(inName, map);
    const _listeners = listeners.slice(0);

    if (inHandler) {
      for (let i = 0; i < _listeners.length; i++) {
        if (_listeners[i] === inHandler) {
          listeners.splice(i, 1);
        }
      }
    } else {
      for (let i = 0; i < _listeners.length; i++) {
        for (let item in map) {
          if (wildcardMatch(item, inName)) {
            this.off(item, _listeners[i]);
          }
        }
      }
    }
  },
  emit: function (inName: string, inData?: any) {
    const map = (this._events = this._events || {});
    const self = this;
    const dispatch = function (inType: string) {
      const listeners = getListeners(inType, map);
      const args = inType.includes('*') ? [inName, inData] : [inData];
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

    if (inName !== '*') dispatch(inName);
    dispatch('*');
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
