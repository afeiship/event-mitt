var EventMitt = require('../dist/index');
test('* listners', () => {
  var Person = class {};
  Object.assign(Person.prototype, EventMitt);
  var p1 = new Person();
  var sum = 0;
  var total = 0;
  var res1 = p1.on('ev1', () => {
    // console.log('ev1', sum);
    sum = sum + 1;
  });
  var res2 = p1.on('ev2', () => {
    // console.log('ev2', sum);
    sum = sum + 3;
  });
  var res3 = p1.on('ev3', () => {
    // console.log('ev3', sum);
    sum = sum + 5;
  });

  var resTotal = p1.on('*', (name) => {
    console.log('just a log', name);
    total++;
  });

  p1.emit('ev1');
  p1.emit('ev2');
  p1.emit('ev3');
  p1.emit('*');

  expect(sum).toBe(9);
  expect(total).toBe(4);
});

test('not register but can subscribe by *', () => {
  var Person = class {};
  Object.assign(Person.prototype, EventMitt);
  var p1 = new Person();
  var total = 0;

  p1.on('*', (name) => {
    console.log('just a log', name);
    total++;
  });

  p1.emit('test-event', { data: '111' });

  expect(total).toBe(1);
});
