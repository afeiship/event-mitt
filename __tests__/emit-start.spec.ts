import EventMitt, { EventMittNamespace } from '../src';

describe('emit-start.emit()', () => {
  test('* listners', () => {
    const Person = class {};
    Object.assign(Person.prototype, EventMitt);
    const p1 = new Person() as EventMittNamespace.EventMitt;
    let sum = 0;
    let total = 0;
    const res1 = p1.on('ev1', () => {
      console.log('ev1', sum);
      sum = sum + 1;
    });
    const res2 = p1.on('ev2', () => {
      console.log('ev2', sum);
      sum = sum + 3;
    });
    const res3 = p1.on('ev3', () => {
      console.log('ev3', sum);
      sum = sum + 5;
    });

    const resTotal = p1.on('*', (name) => {
      console.log('just a log', name);
      total++;
    });

    p1.emit('ev1');
    p1.emit('ev2');
    p1.emit('ev3');
    p1.emit('*');

    expect(sum).toBe(9);
    expect(total).toBe(1);
  });

  test.only('not register but can subscribe by *', () => {
    const Person = class {};
    Object.assign(Person.prototype, EventMitt);
    const p1 = new Person() as EventMittNamespace.EventMitt;
    let total = 0;

    p1.on('*', (name) => {
      // console.log('just a log', name);
      total++;
    });

    p1.emit('test-event', { data: '111' });

    expect(total).toBe(1);
  });

  test('partial star subscribe', () => {
    const Person = class {};
    Object.assign(Person.prototype, EventMitt);
    const p1 = new Person() as EventMittNamespace.EventMitt;
    const list: number[] = [];
    p1.on('list:add1', () => {
      list.push(1);
    });
    p1.on('list:add2', () => {
      list.push(2);
    });

    // add 3 elements
    p1.emit('list:*');
    expect(list.length).toBe(2);
    expect(list).toEqual([1, 2]);
  });

  test('emit with data', () => {
    const Person = class {};
    Object.assign(Person.prototype, EventMitt);
    const p1 = new Person() as EventMittNamespace.EventMitt;
    let sum = 0;
    let total = 0;
    const res1 = p1.on('ev1', (data) => {
      // console.log('ev1', sum, data);
      sum = sum + data;
    });
    const res2 = p1.on('ev2', (data) => {
      // console.log('ev2', sum, data);
      sum = sum + data;
    });
    const res3 = p1.on('ev3', (data) => {
      // console.log('ev3', sum, data);
      sum = sum + data;
    });

    const resTotal = p1.on('*', (name, data) => {
      // console.log('just a log', name, data);
      total++;
    });

    p1.emit('ev1', 1);
    p1.emit('ev2', 3);
    p1.emit('ev3', 5);
    p1.emit('*', { data: '111' });

    expect(sum).toBe(19);
    expect(total).toBe(4);
  });
});
