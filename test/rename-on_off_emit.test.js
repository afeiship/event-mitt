var EventMitt = require('../index');
var nxKeyMap = require('next-key-map');

test('* listners', () => {
  var Person = class {};
  Object.assign(
    Person.prototype,
    nxKeyMap(
      EventMitt,
      {
        on: '$on',
        emit: '$emit'
      },
      false
    )
  );
  var p1 = new Person();

  expect(typeof p1.on).toBe('undefined');
  expect(typeof p1.$on).toBe('function');
});
