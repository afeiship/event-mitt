import EventMitt from '../src';
import { EventMittNamespace } from '../global';

describe('Sample Test', () => {
  test('01/interactive - list add/up/down events', () => {
    const list: any[] = [1, 2, 3, 4, 5];
    const eventBus = Object.assign({}, EventMitt);

    //  ===== list 1 part =====
    eventBus.on('list1@add', (item) => {
      list.push(item);
    });
    eventBus.on('list1@up', (item) => {
      const index = list.indexOf(item);
      if (index > 0) {
        list[index] = list[index - 1];
        list[index - 1] = item;
      }
    });
    eventBus.on('list1@down', (item) => {
      const index = list.indexOf(item);
      if (index < list.length - 1) {
        list[index] = list[index + 1];
        list[index + 1] = item;
      }
    });

    //  ===== list 2 part =====
    eventBus.on('list2@add', (item) => {
      list.push(item);
    });
    eventBus.on('list2@up', (item) => {
      const index = list.indexOf(item);
      if (index > 0) {
        list[index] = list[index - 1];
        list[index - 1] = item;
      }
    });
    eventBus.on('list2@down', (item) => {
      const index = list.indexOf(item);
      if (index < list.length - 1) {
        list[index] = list[index + 1];
        list[index + 1] = item;
      }
    });

    eventBus.emit('list1@add', 'list1-item1');
    eventBus.emit('list2@add', 'list2-item1');

    //  test add
    expect(list).toEqual([1, 2, 3, 4, 5, 'list1-item1', 'list2-item1']);

    //  test up
    eventBus.emit('list1@up', 'list1-item1');
    expect(list).toEqual([1, 2, 3, 4, 'list1-item1', 5, 'list2-item1']);
    eventBus.emit('list2@up', 'list2-item1');
    expect(list).toEqual([1, 2, 3, 4, 'list1-item1', 'list2-item1', 5]);

    // destroy all add event
    eventBus.off('list*@add');
    eventBus.emit('list1@add', 'list1-invalid-item');
    expect(list).toEqual([1, 2, 3, 4, 'list1-item1', 'list2-item1', 5]);
    eventBus.emit('list2@add', 'list2-invalid-item');
    expect(list).toEqual([1, 2, 3, 4, 'list1-item1', 'list2-item1', 5]);
  });
});
