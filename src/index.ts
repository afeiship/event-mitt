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

const getMatchedNames = function (inName: string, inMap: any) {
  const matchedTypes: string[] = [];

  if (inMap[inName]) matchedTypes.push(inName);

  Object.keys(inMap).forEach((eventType: string) => {
    if (wildcardMatch(eventType, inName)) {
      matchedTypes.push(eventType);
    }
  });

  return matchedTypes.filter((value, index, self) => self.indexOf(value) === index);
};

const getMatchedListeners = function (inName: string, inMap: any) {
  const allHandlers: EventMittNamespace.EventHandler[] = [];
  const commonStarHandler = inMap['*'];

  if (inMap[inName]) {
    allHandlers.push(...inMap[inName]);
  } else {
    Object.keys(inMap).forEach((eventType) => {
      if (wildcardMatch(eventType, inName)) {
        allHandlers.push(...inMap[eventType]);
      }
    });
  }

  if (commonStarHandler) allHandlers.push(...commonStarHandler);
  return allHandlers;
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
    const listeners = (map[inName] = map[inName] || []);
    listeners.push({ type: inName, handler: inHandler, options });

    // if is immediate, trigger it
    if (options.immediate) inHandler.call(this);

    return {
      destroy: function () {
        self.off(inName, inHandler);
      },
    };
  },
  off: function (inName: string, inHandler?: EventMittHandler) {
    const map = (this._events = this._events || {});
    const matchedTypes = getMatchedNames(inName, map);
    matchedTypes.forEach((eventType) => {
      if (this._events[eventType]) {
        // 检查是否存在
        this._events[eventType] = this._events[eventType].filter((eventObj) => {
          if (!inHandler) return false;
          return eventObj.handler !== inHandler;
        });
        if (this._events[eventType].length === 0) {
          delete this._events[eventType];
        }
      }
    });
  },
  emit: function (inName: string, inData?: any) {
    const map = (this._events = this._events || {});
    const matchedHandlers = getMatchedListeners(inName, map);
    for (let i = 0; i < matchedHandlers.length; i++) {
      const eventObj = matchedHandlers[i] as any;
      const args = eventObj.type.includes('*') ? [inName, inData] : [inData];
      if (eventObj.handler.apply(this, args) === false) {
        break;
      }
      if (eventObj.options.once) {
        this.off(inName, eventObj.handler);
      }
    }
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
    return this.on(inName, inHandler, { once: true });
  },
  upon: function (inName: string, inHandler: EventMittHandler) {
    this.off(inName);
    return this.on(inName, inHandler);
  },
  on2immediate: function (inName: string, inHandler: EventMittHandler) {
    return this.on(inName, inHandler, { immediate: true });
  },
};

export const mitt = (): EventMittNamespace.EventMitt => Object.assign({}, EventMitt);

export default EventMitt;
