import EventMitt, { EventMittNamespace } from '../src';

describe('api.basic', () => {
  test('01/basic on/off/fire for object', () => {
    let sum = 0;
    const EventObj = Object.assign({}, EventMitt);
    const eventRes = EventObj.on('ev1', (inData) => {
      sum = sum + inData;
    });

    EventObj.emit('ev1', 3);
    expect(sum).toBe(3);

    sum = 0;
    eventRes.destroy();
    EventObj.emit('ev1', 5);
    expect(sum).toBe(0);
  });

  test('02/basic on/off/fire for es5 class', () => {
    const Person = function () {};
    Object.assign(Person.prototype, EventMitt);
    const p1 = new Person();
    let sum = 0;
    const eventRes = p1.on('ev1', (inData) => {
      sum = sum + inData;
    });

    p1.emit('ev1', 3);
    expect(sum).toBe(3);

    sum = 0;
    eventRes.destroy();
    p1.emit('ev1', 5);
    expect(sum).toBe(0);
  });

  test('basic on/off/fire for es6 class', () => {
    class Person {}

    Object.assign(Person.prototype, EventMitt);
    const p1 = new Person() as EventMittNamespace.EventMitt;
    let n = 0;

    const eventRes = p1.on('ev1', (inData) => {
      n = n + inData;
    });

    p1.emit('ev1', 3);
    expect(n).toBe(3);

    n = 0;
    eventRes.destroy();
    p1.emit('ev1', 5);
    expect(n).toBe(0);
  });
});
