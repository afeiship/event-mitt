# event-mitt
> A mini and light event emitter

[![version][version-image]][version-url]
[![license][license-image]][license-url]
[![size][size-image]][size-url]
[![download][download-image]][download-url]

## apis
| name | params         | description                          |
| ---- | -------------- | ------------------------------------ |
| on   | name/*,handler | register an event                    |
| off  | name,handler   | unregister an event                  |
| emit | name,obj       | fire an event                        |
| one  | name,obj       | fire an event,only can register once |
| once | name,obj       | fire an event,only can execute once  |

## installation
```shell
npm install -S @feizheng/event-mitt
```

## usage
```js
import EventMitt from '@feizheng/event-mitt';
const Person = class { };
Object.assign(Person.prototype, EventMitt);
const p1 = new Person();
const sum = 0;
const total = 0;

// attach events:
var res = p1.on('ev1', () => {
  console.log('ev1', sum);
  sum = sum + 1;
});

p1.on('ev2', () => {
  console.log('ev2', sum);
  sum = sum + 3;
});

p1.on('ev3', () => {
  console.log('ev3', sum);
  sum = sum + 5;
});

p1.on('*', (name) => {
  console.log('just a log', name);
  total++;
});

// emit events:
p1.emit('ev1');
p1.emit('ev2');
p1.emit('ev3');

// destory:
res.destroy();
```

## resources
+ https://github.com/developit/mitt
+ https://github.com/jeromeetienne/microevent.js/blob/master/microevent.js
+ https://github.com/Wikiki/bulma-accordion/blob/master/src/js/events.js


## license
Code released under [the MIT license](https://github.com/afeiship/event-mitt/blob/master/LICENSE.txt).

[version-image]: https://img.shields.io/npm/v/@feizheng/event-mitt
[version-url]: https://npmjs.org/package/@feizheng/event-mitt

[license-image]: https://img.shields.io/npm/l/@feizheng/event-mitt
[license-url]: https://github.com/afeiship/event-mitt/blob/master/LICENSE.txt

[size-image]: https://img.shields.io/bundlephobia/minzip/@feizheng/event-mitt
[size-url]: https://github.com/afeiship/event-mitt/blob/master/dist/event-mitt.min.js

[download-image]: https://img.shields.io/npm/dm/@feizheng/event-mitt
[download-url]: https://www.npmjs.com/package/@feizheng/event-mitt
