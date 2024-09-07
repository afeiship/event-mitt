import EventMitt from '../src';
import { EventMittNamespace } from '../global';

describe('api.immediate', () => {
  test('on2immediate', () => {
    const Person = class {};
    Object.assign(Person.prototype, EventMitt);
    const p1 = new Person() as EventMittNamespace.EventMitt;
    let counter = 0;
    p1.on2immediate('ev1', () => {
      counter++;
    });

    p1.emit('ev1');

    expect(counter).toBe(2);
  });

  test('on with immdiate opts', () => {
    const Person = class {};
    Object.assign(Person.prototype, EventMitt);
    const p1 = new Person() as EventMittNamespace.EventMitt;
    let counter = 0;
    p1.on(
      'ev1',
      () => {
        counter++;
      },
      { immediate: true }
    );

    p1.emit('ev1');

    expect(counter).toBe(2);
  });
});
