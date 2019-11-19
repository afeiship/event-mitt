# event-mitt
> A mini and light event emitter

## apis:
| name | args                            | description                          |
|------|---------------------------------|--------------------------------------|
| on   | name/*,handler                  | register an event                    |
| off  | name,handler                    | unregister an event                  |
| emit | name,data( recommend an object) | fire an event                        |
| one  | name,data( recommend an object) | fire an event,only can register once |
| once | name,data( recommend an object) | fire an event,only can execute once  |

## resources
+ https://github.com/developit/mitt
+ https://github.com/jeromeetienne/microevent.js/blob/master/microevent.js
+ https://github.com/Wikiki/bulma-accordion/blob/master/src/js/events.js

## resources
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
p1.on('ev1', () => {
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
```
