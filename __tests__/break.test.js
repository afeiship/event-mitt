var EventMitt = require('../index');
test('* listners', () => {
  var Person = class {};
  Object.assign(Person.prototype, EventMitt);
  var p1 = new Person();
  p1.on('ev1', () => {
    console.log('ev1 1 fired');
  });
  p1.on('ev1', () => {
    console.log('ev1 2 fired');
    return false;
  });
  p1.on('ev1', () => {
    console.log('ev1 3 will not fired');
  });

  p1.emit('ev1');
});
