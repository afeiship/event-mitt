var EventMitt = require('../dist/index');

test('on2immediate', () => {
  var Person = class {};
  Object.assign(Person.prototype, EventMitt);
  var p1 = new Person();
  var counter = 0;
  p1.on2immediate('ev1', () => {
    counter++;
  });

  p1.emit('ev1');

  expect(counter).toBe(2);
});
