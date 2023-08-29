var EventMitt = require('../dist/index');
test('@ listners', () => {
  var Person = class {};
  Object.assign(Person.prototype, EventMitt);
  var p1 = new Person();
  var counter = 0;
  var ncounter = 0;
  p1.on('@ev1', () => {
    counter++;
  });

  p1.on('normalevnet', () => {
    ncounter++;
  });

  p1.emit('ev1');
  p1.emit('normalevnet');

  expect(counter).toBe(2);
  expect(ncounter).toBe(1);
});
