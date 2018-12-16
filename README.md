# event-mitt
> A mini and light event emitter

## apis:
| name | args                            | description         |
|------|---------------------------------|---------------------|
| on   | name/*,handler                  | register an event   |
| off  | name,handler                    | unregister an event |
| emit | name,data( recommend an object) | fire an event       |

## resouces:
+ https://github.com/developit/mitt
+ https://github.com/jeromeetienne/microevent.js/blob/master/microevent.js

## install:
```shell
npm install -S afeiship/event-mitt --registry=https://registry.npm.taobao.org
```

## usage:
```js
import EventMitt from 'event-mitt';
var Person = class { };
Object.assign(Person.prototype, EventMitt);
var p1 = new Person();
var sum = 0;
var total = 0;
var res1 = p1.on('ev1', () => {
  console.log('ev1', sum);
  sum = sum + 1;
});
var res2 = p1.on('ev2', () => {
  console.log('ev2', sum);
  sum = sum + 3;
});
var res3 = p1.on('ev3', () => {
  console.log('ev3', sum);
  sum = sum + 5;
});

var resTotal = p1.on('*', (name) => {
  console.log('just a log', name);
  total++;
});

p1.emit('ev1');
p1.emit('ev2');
p1.emit('ev3');
```
