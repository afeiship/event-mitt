interface EventMittOnOptions {
  once?: boolean;
  immidiate?: boolean;
}

interface EventMitt {
  on(name: string, handler: Function, options?: EventMittOnOptions): void;
  off(name: string, handler: Function): void;
  emit(name: string, payload: any): void;
  one(name: string, handler: Function): void;
  once(name: string, handler: Function): void;
  upon(name: string, handler: Function): void;
  on2immidiate(name: string, handler: Function): void;
}
