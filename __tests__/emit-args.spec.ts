import EventMitt, { EventMittNamespace } from '../src';

describe('api.emitArgs', () => {
  test('01/normal emit', () => {
    const eventBus = Object.assign({}, EventMitt);
    let args: any = [];
    eventBus.on('test', (a) => {
      args = a;
    });
    eventBus.emit('test', [1, 2, 3]);
    expect(args).toEqual([1, 2, 3]);
  });

  test('02/emit with *', () => {
    const eventBus = Object.assign({}, EventMitt);
    let args: any = null;
    eventBus.on('any', (name, a) => {
      console.log('name:', name, 'args:', a);
      args = {
        name: name,
        args: a,
      };
    });
    eventBus.emit('*', [1, 2, 3]);
    expect(args).toEqual({
      name: '*',
      args: [1, 2, 3],
    });
  });

  test.only('03/ on * , emit with other namespace', ()=>{
    const eventBus = Object.assign({}, EventMitt);
    let args: any = null;
    eventBus.on('*', (name, a) => {
      args = {
        name: name,
        args: a,
      };
    });
    eventBus.emit('test', [1, 2, 3]);

    expect(args).toEqual({
      name: 'test',
      args: [1, 2, 3],
    })

    eventBus.emit('test2', ['abc']);
    expect(args).toEqual({
      name: 'test2',
      args: ['abc'],
    })
  })
});
