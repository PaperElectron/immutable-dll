/**
 * @file DLL
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project immutable-dll
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {DLinkedList} from '../src'

describe('Double Linked List', () => {

  test('.append - Adds to the end of the list.', () => {
    let dll = new DLinkedList<number>()
    dll.append(1)
    dll.append(2)
    dll.append(3)
    dll.append(4)
    dll.append(5)

    let arr = dll.toArray()
    expect(dll.length).toEqual(5)
    expect(arr).toEqual([1, 2, 3, 4, 5])
  })


  test('.prepend - Adds to the beginning of the list', () => {
    let dll = new DLinkedList<number>()
    dll.prepend(1)
    dll.prepend(2)
    dll.prepend(3)
    dll.prepend(4)
    dll.prepend(5)

    let arr = dll.toArray()
    expect(dll.length).toEqual(5)
    expect(arr).toEqual([5, 4, 3, 2, 1])
  })

  test('.fromArray - Creates a linked list from an array of values', () => {
    let a = [1,2,3,4,5,6,7,8,9]
    let dll_static = DLinkedList.fromArray(a)
    expect(dll_static.toArray()).toEqual(a)

    let dll_inst = new DLinkedList()
    dll_inst.fromArray(a)
    expect(dll_inst.toArray()).toEqual(a)

  })

  test('.insertAfter - Inserting after a found value', () => {
    let dll = DLinkedList.fromArray([1,2,4,5])
    dll
      .insertAfter((v) => v === 2, 3)
      .insertAfter((v) =>  v === 5, 6)

    expect(dll.toArray()).toEqual([1,2,3,4,5,6])

    expect(() => {
      dll.insertAfter(v => v === 7, 8)
    }).toThrow()
  })

  test('.insertAfterNode - Inserting after a provided node', () => {
    let dll = DLinkedList.fromArray([1,2,4,5])
    let insertAfter2 = dll.findNode(v => v === 2)
    dll.insertAfterNode(insertAfter2, 3)

    expect(dll.toArray()).toEqual([1,2,3,4,5])

    expect(() => {
      dll.insertAfterNode(null, 8)
    }).toThrow()
  })

  test('.insertBefore - Inserting before a found value', () => {
    let dll = DLinkedList.fromArray([1,2,4,6])
    dll
      .insertBefore((v) => v === 4, 3)
      .insertBefore((v) =>  v === 6, 5)

    expect(() => {
      dll.insertBefore(v => v === 7, 8)
    }).toThrow()

    let singleEntryDll = new DLinkedList()
    singleEntryDll.append(1)
    singleEntryDll.insertBefore(v => v === 1, 0)

    expect(singleEntryDll.toArray()).toEqual([0,1])
  })

  test('.insertBeforeNode - Inserting before a provided node', () => {
    let dll = DLinkedList.fromArray([1,2,4,5])
    let insertBefore4 = dll.findNode(v => v === 4)
    dll.insertBeforeNode(insertBefore4, 3)

    expect(dll.toArray()).toEqual([1,2,3,4,5])

    expect(() => {
      dll.insertBeforeNode(null, 8)
    }).toThrow()

    let singleEntryDll = new DLinkedList()
    singleEntryDll.append(1)
    let insertBeforehead = dll.findNode(v => v === 1)
    singleEntryDll.insertBeforeNode(insertBeforehead, 0)

    expect(singleEntryDll.toArray()).toEqual([0,1])
  })

  test('.head - Getting head value', () => {
    let dll = DLinkedList.fromArray([1,2,3,4,5])

    expect(dll.head()).toEqual(1)
  })

  test('.tail - Getting tail value', () => {
    let dll = DLinkedList.fromArray([1,2,3,4,5])
    expect(dll.tail()).toEqual(5)
  })

  test('.headNode - Getting head Node', () => {
    let blankDll = DLinkedList.fromArray([])
    expect(blankDll.headNode()).toBeNull()
    let dll = DLinkedList.fromArray([1,2,3,4,5])

    expect(dll.headNode().getData()).toEqual(1)
  })

  test('.tailNode - Getting tail Node', () => {
    let blankDll = DLinkedList.fromArray([])
    expect(blankDll.tailNode()).toBeNull()

    let dll = DLinkedList.fromArray([1,2,3,4,5])
    expect(dll.tailNode().getData()).toEqual(5)
  })

  test('.remove - Removes first value predicate returns truthy for.', () => {
    let dll = DLinkedList.fromArray([1,2,3,4,5,6,7,8,9])
    dll.remove(v => v === 5)
    expect(dll.toArray()).toEqual([1,2,3,4,6,7,8,9])

    let dll_single = DLinkedList.fromArray([1])
    dll_single.remove(v => v === 1)
    expect(dll_single.toArray()).toEqual([])

    let dll_none = DLinkedList.fromArray([])
    dll_single.remove(v => v === 1)
    expect(dll_single.toArray()).toEqual([])
  })

  test('.removeNode - Removes Provided node.', () => {
    let dll = DLinkedList.fromArray([1,2,3,4,5,6,7,8,9])
    let remove5 = dll.findNode(v => v === 5)
    let remove7 = dll.findNode(v => v === 7)
    dll.removeNode(remove5)
    expect(dll.toArray()).toEqual([1,2,3,4,6,7,8,9])
    dll.removeNode(remove7)
    expect(dll.toArray()).toEqual([1,2,3,4,6,8,9])
  })

  test('.removeHead - Removing head entries from the list', () => {
    let dll = DLinkedList.fromArray([1,2,3,4,5])
    dll.removeHead()
    expect(dll.toArray()).toEqual([2, 3, 4, 5])
  })

  test('.removeTail - Removing tail entries from the list', () => {
    let dll = DLinkedList.fromArray([1,2,3,4,5])
    dll.removeTail()
    expect(dll.toArray()).toEqual([1,2,3,4])
  })

  test('Removing head and tail From single member DLL', () => {
    let dll = new DLinkedList<number>()
    dll.append(1)
    dll.removeHead()
    expect(dll.toArray()).toEqual([])

    dll.append(1)
    dll.removeTail()

    expect(dll.toArray()).toEqual([])
  })

  test('Removing head and tail From 0 member DLL', () => {
    let dll = new DLinkedList<number>()
    dll.removeHead()
    expect(dll.toArray()).toEqual([])

    dll.removeTail()

    expect(dll.toArray()).toEqual([])
  })

  test('Null values from empty list', () => {
    let dll = new DLinkedList()
    expect(dll.head()).toEqual(null)
    expect(dll.tail()).toEqual(null)
    expect(dll.toArray()).toEqual([])
  })

  test('Returned values are immutable.', () => {
    let o = {a: {b: {c: 10}}}
    let dll_o = new DLinkedList()
    dll_o.append(o)
    let oo: any = dll_o.head()
    oo.a.b.c = 20
    expect(o.a.b.c).toEqual(10)

    let n = 1
    let dll_n = new DLinkedList()
    dll_n.append(n)
    let nn = dll_n.head()
    nn = 10
    n = 100
    expect(nn).toEqual(10)
    expect(n).toEqual(100)
    expect(dll_n.head()).toEqual(1)

    let s = 'hello'
    let dll_s = new DLinkedList()
    dll_s.append(s)
    let ss = dll_s.head()
    ss = 'world'
    s = 'hello world'
    expect(ss).toEqual('world')
    expect(s).toEqual('hello world')
    expect(dll_s.head()).toEqual('hello')

    let f = n => n + n
    let dll_f = new DLinkedList<(n: number) => number>()
    dll_f.append(f)
    let ff = dll_f.head()
    ff = n => n * n * n
    f = n => n
    expect(ff(10)).toEqual(1000)
    expect(f(10)).toEqual(10)
    expect(dll_f.head()(10)).toEqual(20)

  })

  test('.toArray - accumulates its values into an array', () => {
    let dll = DLinkedList.fromArray([1,2,3,4,5])
    let results = dll.toArray()
    expect(results).toEqual([1,2,3,4,5])
  })

  test('.map - maps iteratee return values into a new List', () => {
    let dll = DLinkedList.fromArray([1,2,3,4,5])

    let identity = dll.map()
    let squared = dll.map<number>((data) => {
      return data * data
    })

    dll.clear()
    expect(dll.toArray()).toEqual([])
    expect(identity.toArray()).toEqual([1, 2, 3, 4, 5])
    expect(squared.toArray()).toEqual([1, 4, 9, 16, 25])
  })

  test('.mapReverse - Same as above, but backwards', () => {
    let dll = DLinkedList.fromArray([1,2,3,4,5])

    let identity = dll.mapReverse()
    let squared = dll.mapReverse<number>((data) => {
      return data * data
    })

    dll.clear()
    expect(dll.toArray()).toEqual([])
    expect(identity.toArray()).toEqual([5, 4, 3, 2, 1])
    expect(squared.toArray()).toEqual([25, 16, 9, 4, 1])
  })

  test('.each - calls iteratee with current node value.', () => {
    let dll = DLinkedList.fromArray([1,2,3,4,5])

    let sideEffects = []

    dll.each((data) => {
      sideEffects.push(data * data)
    })
    expect(sideEffects).toEqual([1, 4, 9, 16, 25])
  })

  test('.eachReverse - Same as above, but backwards', () => {
    let dll = DLinkedList.fromArray([1,2,3,4,5])
    let sideEffects = []
    dll.eachReverse((data) => {
      sideEffects.push(data * data)
    })

    expect(sideEffects).toEqual([25, 16, 9, 4, 1])
  })

  test('.find - Returns the first entry predicate returns truthy for.', () => {
    let dll = new DLinkedList()
    dll
      .append({a: 1, b: 6})
      .append({a: 2, b: 7})
      .append({a: 3, b: 8})
      .append({a: 4, b: 9})
      .append({a: 5, b: 10})

    let result = dll.find((v) => {
      return (v.a === 3 && v.b === 8)
    })

    let none = dll.find((v) => {
      return (v.a === 30 && v.b === 80)
    })

    expect(result).toEqual(expect.objectContaining({a: 3, b: 8}))
    expect(none).toBeNull()
  })

  test('.filter - Returns all values predicate returns truthy for.', () => {
    let dll = DLinkedList.fromArray([1,2,3,4,5])
    let results = dll.filter(v => v >= 3)
    expect(results.toArray()).toEqual([3,4,5])

    let dll_none = DLinkedList.fromArray([])
    let none = dll_none.filter(i =>!!i)
    expect(none.toArray()).toEqual([])
  })

  test('.reduce - Reduces list values to a single element', () => {
    let dll = DLinkedList.fromArray([1,2,3,4,5])
    let results = dll.reduce((v, acc) => {
      acc += v
      return acc
    }, 0)

    console.log(results)


  })
});