var EventMitt = require('../dist/index');

// bun test __tests__/off-clean-star.test.js

describe('off clean star', () => {
  test('clean normal listners', () => {
    var Person = class {};
    Object.assign(Person.prototype, EventMitt);
    var p1 = new Person();
    var sum = 0;
    var total = 0;
    var res1 = p1.on('ev1', () => {
      // console.log('ev1', sum);
      sum = sum + 1;
    });

    p1.emit('ev1');
    expect(sum).toBe(1);

    var res2 = p1.on('ev2', () => {
      // console.log('ev2', sum);
      sum = sum + 3;
    });
    p1.emit('ev2');
    expect(sum).toBe(4);

    var res3 = p1.on('ev3', () => {
      // console.log('ev3', sum);
      sum = sum + 5;
    });
    p1.emit('ev3');
    expect(sum).toBe(9);

    // clean ev1
    res1.destroy();
    p1.emit('ev1');
    expect(sum).toBe(9);

    // clean ev*
    p1.off('ev*');
    p1.emit('ev1');
    p1.emit('ev2');
    p1.emit('ev3');
    expect(sum).toBe(9);
  });
});
