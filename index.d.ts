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
    emit: (inName: string, inData: any) => void;
    one: (inName: string, inHandler: EventHandler) => EventListener;
    once: (inName: string, inHandler: EventHandler) => EventListener;
    upon: (inName: string, inHandler: EventHandler) => EventListener;
    on2immediate: (inName: string, inHandler: EventHandler) => EventListener;
  }
}
