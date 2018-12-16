var EventMitt = require('../index');

test('basic on/off/fire for object', () => {
  var EventObj = Object.assign({}, EventMitt);
  var sum = 0;
  var eventRes = EventObj.on('ev1', (inData) => {
    sum = sum + inData;
  });

  EventObj.emit('ev1', 3);
  expect(sum).toBe(3);

  sum = 0;
  eventRes.destroy();
  EventObj.emit('ev1', 5);
  expect(sum).toBe(0);
});

test('basic on/off/fire for es5 class', () => {
  var Person = function() {};
  Object.assign(Person.prototype, EventMitt);
  var p1 = new Person();
  var sum = 0;
  var eventRes = p1.on('ev1', (inData) => {
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
  var Person = class {};
  Object.assign(Person.prototype, EventMitt);
  var p1 = new Person();
  var sum = 0;
  var eventRes = p1.on('ev1', (inData) => {
    sum = sum + inData;
  });

  p1.emit('ev1', 3);
  expect(sum).toBe(3);

  sum = 0;
  eventRes.destroy();
  p1.emit('ev1', 5);
  expect(sum).toBe(0);
});
