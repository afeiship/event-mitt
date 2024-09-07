import EventMitt from '../src';
import { EventMittNamespace } from '../global';

describe('api.break', () => {
  test('01/basic on/off/fire for object', () => {
    class Person {}

    Object.assign(Person.prototype, EventMitt);
    const p1 = new Person() as EventMittNamespace.EventMitt;
    let total = 0;
    p1.on('ev1', () => {
      total++;
      console.log('ev1 1 fired');
    });
    p1.on('ev1', () => {
      total++;
      console.log('ev1 2 fired');
      return false;
    });
    p1.on('ev1', () => {
      total++;
      console.log('ev1 3 will not fired');
    });

    p1.emit('ev1');
    expect(total).toBe(2);
  });
});
