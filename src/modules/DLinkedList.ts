/**
 * @file DLinkedList
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project immutable-dll
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {Node} from './Node'

/**
 *  Function signature expected by .find, .findNode, .filter
 *
 *  ```
 *  let f: filterPredicate<number> = (value: number) => return true
 *  ```
 *
 */
export type filterPredicate<T> = (T) => boolean

/**
 * Function signature expected by .map, .mapRight
 *
 *  ```
 *  let f: mapIteratee<number, string> = (value: number) => `I have this value: ${value}`
 *  ```
 */
export type mapIteratee<T, V> = (T) => V

/**
 * Function signature expected by .each, .eachRight
 *
 *  ```
 *  let f: eachIteratee<number> = (value: number) => `I have this value: ${value}`
 *  ```
 */
export type eachIteratee<T> = (T) => void


/**
 * Function signature expected by .asyncMap, .asyncMapRight
 *
 *  ```
 *  let f: asyncMapIteratee<number, number> = (value: number) => Promise.resolve(value * value)
 *  ```
 */
export type asyncMapIteratee<T, V> = (T) => Promise<V> | V


/**
 *  Function signature expected by .reduce, .reduceRight
 *
 *  ```
 *  let f: reduceIteratee<number, number> = (value, acc) => {
 *    acc += value
 *    return acc
 *  }
 *  ```
 */
export type reduceIteratee<T, V> = (T, V) => V


/**
 *  Function signature expected by .reduce, .reduceRight
 *
 *  ```
 *  let f: reduceIteratee<number, number> = (value, acc) => {
 *    acc += value
 *    return acc
 *  }
 *  ```
 */
export type asyncReduceIteratee<T, V> = (T, V) => Promise<V>

export class DLinkedList<T> {

  /**
   * Accepts an array and returns a DLinkedList instance.
   * @param arr
   */
  public static fromArray<S>(arr: S[]): DLinkedList<S> {
    let dll = new DLinkedList<S>()
    dll.fromArray(arr)
    return dll
  }

  head_node: Node<T> = null
  tail_node: Node<T> = null
  length: number = 0

  /**
   * Returns the value stored in the first position of the list.
   * If value is a plain object, the return value will be a deep clone of stored object.
   *
   *  ```
   *  const dll = DLinkedList.fromArray([1,2,3,4,5])
   *  dll.head() // 1
   *  ```
   */
  head(): T | null {
    return !!this.head_node ? this.head_node.getData() : null
  }

  /**
   * Returns the head node directly.
   */
  headNode(): Node<T> {
    return !!this.head_node ? this.head_node : null
  }

  /**
   *  Returns the value stored in the last position of the list.
   *  If value is a plain object, the return value will be a deep clone of stored object.
   *
   *  ```
   *  const dll = DLinkedList.fromArray([1,2,3,4,5])
   *  dll.tail() // 5
   *  ```
   */
  tail(): T | null {
    return !!this.tail_node ? this.tail_node.getData() : null
  }

  /**
   * Returns the tail node directly.
   */
  tailNode(): Node<T> {
    return !!this.tail_node ? this.tail_node : null
  }

  /**
   * Creates a new DLinkedList from an array of values.
   *
   *  ```
   *  const dll = new DLinkedList<number>()
   *  dll.fromArray([1,2,3,4,5])
   *  ```
   *
   * @param arr - Any Array of values matching type T
   */
  fromArray(arr: T[]): DLinkedList<T> {
    arr.forEach((value) => {
      this.append(value)
    })
    return this
  }

  /**
   * Adds the supplied data to the front of the list.
   *
   * ```
   *  const dll = DLinkedList.fromArray([2,3,4,5])
   *  dll.prepend(1) // [1,2,3,4,5]
   *  ```
   *
   * @param data - any value matching T
   */
  prepend(data: T): DLinkedList<T> {
    if (this.head_node === null) {
      this.head_node = new Node(data, null, null)
      this.tail_node = this.head_node
    } else {
      const n = new Node(data, null, this.head_node);
      this.head_node.setPrev(n);
      this.head_node = n;
    }
    this.length += 1;
    return this
  }

  /**
   * Adds the supplied data to the end of the list.
   *
   * ```
   *  const dll = DLinkedList.fromArray([1,2,3,4])
   *  dll.append(5) // [1,2,3,4,5]
   *  ```
   *
   * @param data - any value matching T
   */
  append(data: T): DLinkedList<T> {
    if (this.head_node === null) {
      this.head_node = new Node(data)
      this.tail_node = this.head_node
    } else {
      const n = new Node(data, this.tail_node, null)
      this.tail_node.setNext(n)
      this.tail_node = n
    }
    this.length += 1
    return this
  }

  /**
   * Inserts data after the first value predicate function returns truthy for.
   *
   * ```
   *  const dll = DLinkedList.fromArray([1,2,4,5])
   *  dll.insertAfter(v => v === 2, 3) // [1,2,3,4,5]
   *
   * ```
   *
   * @param predicate
   * @param data
   */
  insertAfter(predicate: filterPredicate<T>, data: T): DLinkedList<T> {
    let node = this.findNode(predicate)
    if (!node) {
      throw new Error('Unable to find a node matching predicate.')
    }
    return this.insertAfterNode(node, data)

  }

  /**
   * Inserts data after the provided node.
   * @param node
   * @param data
   */
  insertAfterNode(node: Node<T>, data: T): DLinkedList<T> {
    if (node) {
      if (node.getNext() === null) {
        return this.append(data)
      }

      const n = new Node(data, node, node.getNext())
      node.getNext().setPrev(n)
      node.setNext(n)
      this.length += 1
      return this
    }

    throw new Error('Not able to insert data.')

  }


  /**
   * Inserts data before the first value predicate function returns truthy for.
   *
   * ```
   *  const dll = DLinkedList.fromArray([1,2,4,5])
   *  dll.insertAfter(v => v === 4, 3) // [1,2,3,4,5]
   *
   * ```
   *
   * @param predicate
   * @param data
   */
  insertBefore(predicate: filterPredicate<T>, data: T): DLinkedList<T> {

    let node = this.findNode(predicate)
    if (!node) {
      throw new Error('Unable to find a node matching predicate.')
    }
    return this.insertBeforeNode(node, data)


  }

  /**
   * Inserts data before the node provided node
   * @param node
   * @param data
   */
  insertBeforeNode(node: Node<T>, data: T): DLinkedList<T> {

    if (node) {
      if (node.getPrev() === null) {
        return this.prepend(data)
      }

      const n = new Node(data, node.getPrev(), node)
      node.getPrev().setNext(n)
      node.setPrev(n)
      this.length += 1
      return this
    }

    throw new Error('Unable to insert data.')

  }

  /**
   * Removes the first value that predicate function returns truthy for
   *
   * ```
   *  const dll = DLinkedList.fromArray([1,1,2,3,4,5])
   *  dll.remove(v => v === 1) // [1,2,3,4,5]
   *
   * ```
   *
   * @param predicate
   */
  remove(predicate: filterPredicate<T>): DLinkedList<T> {
    let node = this.findNode(predicate)

    return this.removeNode(node)
    // if(node){
    //   if(node.getPrev() === null){
    //     return this.removeHead()
    //   }
    //   node.getPrev().setNext(node.getNext())
    //   node.getNext().setPrev(node.getPrev())
    //   this.length -= 1;
    // }
    // return this
  }

  removeNode(node: Node<T>): DLinkedList<T> {
    if (node) {
      if (node.getPrev() === null) {
        return this.removeHead()
      }
      node.getPrev().setNext(node.getNext())
      node.getNext().setPrev(node.getPrev())
      this.length -= 1;
    }
    return this
  }

  /**
   * Removes the first value in the list. The next value will become the current head.
   *
   * ```
   * const dll = DLinkedList.fromArray([1,2,3,4,5])
   * dll.removeHead() // [2,3,4,5]
   *
   * ```
   *
   */
  removeHead(): DLinkedList<T> {
    if (this.head_node !== null) {
      if (this.head_node.getNext() === null) {
        this.head_node = null;
        this.tail_node = null;
      } else {
        this.head_node = this.head_node.getNext();
        this.head_node.setPrev(null);
      }
      this.length -= 1;
    }
    return this
  }

  /**
   * Removes the last value in the list. The previous value will become the current head.
   *
   * ```
   * const dll = DLinkedList.fromArray([1,2,3,4,5])
   * dll.removeTail() // [1,2,3,4]
   *
   * ```
   *
   */
  removeTail(): DLinkedList<T> {
    if (this.tail_node !== null) {
      if (this.tail_node.getPrev() === null) {
        this.head_node = null;
        this.tail_node = null;
      } else {
        this.tail_node = this.tail_node.getPrev();
        this.tail_node.setNext(null);
      }
      this.length -= 1;
    }
    return this
  }

  /**
   * Clears the list of all values.
   *
   * ```
   * const dll = DLinkedList.fromArray([1,2,3,4,5])
   * dll.clear() // []
   *
   * ```
   */
  clear(): DLinkedList<T> {
    this.head_node = null
    this.tail_node = null
    this.length = 0
    return this
  }

  /**
   * Creates an array from the values in list.
   * If values are plain objects they will be deeply cloned.
   *
   *
   * ```
   * const objs = [{a: 1}, {a: 2}]
   * const dll = DLinkedList.fromArray(objs)
   *
   * let cloned = dll.toArray() // [{a: 1}, {a: 2}]
   * cloned[0].a = 100
   * cloned[0].b = 200
   * cloned // [{a: 100}, {a: 200}]
   * objs // [{a: 1}, {a: 2}]
   * dll.toArray() // [{a: 1}, {a: 2}]
   *
   * ```
   */
  toArray(): T[] {
    let current = this.head_node;
    let results = []

    while (current !== null) {
      results.push(current.getData())
      current = current.getNext();
    }

    return results
  }

  /**
   * Returns the first {@link Node} predicate function returns truthy for.
   *
   * ```
   * const dll = DLinkedList.fromArray([1,2,3,4,5])
   * let node = dll.findNode(v => v === 1) // Node{data: 1, nextNode: Node{}, prevNode: null}
   *
   * ```
   *
   * @param predicate
   */
  findNode(predicate: filterPredicate<T>): Node<T> {
    let current = this.head_node;
    while (current !== null) {
      let data = current.getData()
      if (predicate(data)) {
        return current
      }
      current = current.getNext();
    }
    return null;
  }

  /**
   * Returns the first value predicate function returns truthy for.
   *
   * ```
   * const dll = DLinkedList.fromArray([1,2,3,4,5])
   * let node = dll.find(v => v === 1) // 1
   *
   * ```
   *
   * @param predicate
   */
  find(predicate: filterPredicate<T>): T | null {
    let node = this.findNode(predicate)
    return node ? node.getData() : null
  }

  /**
   * Returns a new DLinkedList from the values returned by iteratee function.
   * If the list values are plain objects, deep clones will be supplied to iteratee.
   *
   * ```
   * const dll = DLinkedList.fromArray([1,2,3,4,5])
   * let doubled = dll.map(v => v * 2) // [2,4,6,8,10]
   *
   * ```
   *
   * @param iteratee
   */
  map<V>(iteratee?: mapIteratee<T, V>): DLinkedList<V> {
    let current = this.head_node;
    let results = []

    let mapFn = iteratee ? iteratee : ident => ident

    while (current !== null) { //!== null fails
      results.push(mapFn(current.getData()))
      current = current.getNext();
    }

    return DLinkedList.fromArray(results)
  }

  /**
   * Returns a new DLinkedList from the values returned by iteratee function, in reverse order.
   * If the list values are plain objects, deep clones will be supplied to iteratee.
   *
   * ```
   * const dll = DLinkedList.fromArray([1,2,3,4,5])
   * let doubled = dll.mapRight(v => v * 2) // [10,8,6,4,2]
   *
   * ```
   *
   * @param iteratee
   */
  mapRight<V>(iteratee?: mapIteratee<T, V>): DLinkedList<V> {
    let current = this.tail_node
    let results = []

    let mapFn = iteratee ? iteratee : ident => ident

    while (current !== null) {
      results.push(mapFn(current.getData()))
      current = current.getPrev()
    }

    return DLinkedList.fromArray(results)
  }

  /**
   * Asynchronously returns a new DLinkedList from the values resolved by iteratee function.
   *
   * Iteratees are dispatched all at once, so use caution with large lists.
   * If the list values are plain objects, deep clones will be supplied to iteratee.
   *
   * let dll = DLinkedList.fromArray<number>([1,2,3,4,5])
   * let results = await dll.asyncMap((n) => {
   *    return new Promise((resolve) => {
   *      setTimeout(() => {
   *        resolve(n*n)
   *      }, 5000)
   *    })
   *  })
   * // results === [1, 4, 9, 16, 25] 5 seconds later, not 25.
   *
   * @param iteratee
   */
  async asyncMap<V>(iteratee: asyncMapIteratee<T, V>): Promise<DLinkedList<V>> {
    let current = this.head_node
    let results = []
    while (current !== null) {
      results.push(Promise.resolve(iteratee(current.getData())))
      current = current.getNext()
    }

    let unwrapped = await Promise.all(results)
    return DLinkedList.fromArray(unwrapped)

  }

  /**
   * Asynchronously returns a new DLinkedList from the values resolved by iteratee function, in reverse order.
   *
   * Iteratees are dispatched all at once, so use caution with large lists.
   * If the list values are plain objects, deep clones will be supplied to iteratee.
   *
   * let dll = DLinkedList.fromArray<number>([1,2,3,4,5])
   * let results = await dll.asyncMapRight((n) => {
   *    return new Promise((resolve) => {
   *      setTimeout(() => {
   *        resolve(n*n)
   *      }, 5000)
   *    })
   *  })
   * // results === [1, 4, 9, 16, 25] 5 seconds later, not 25
   *
   * @param iteratee
   */
  async asyncMapRight<V>(iteratee: asyncMapIteratee<T, V>): Promise<DLinkedList<V>> {
    let current = this.tail_node
    let results = []
    while (current !== null) {
      results.push(Promise.resolve(iteratee(current.getData())))
      current = current.getPrev()
    }

    let unwrapped = await Promise.all(results)
    return DLinkedList.fromArray(unwrapped)
  }

  /**
   *
   * Runs iteratee with the cloned value found in each node, in order.
   *
   * ```
   * const dll = DLinkedList.fromArray([1,2,3,4,5])
   * dll.each(v => console.log(v * 2)) // 2,4,6,8,10
   *
   * ```
   *
   * @param iteratee
   */
  each(iteratee: eachIteratee<T>): DLinkedList<T> {
    let current = this.head_node;

    while (current !== null) { //!== null fails
      iteratee(current.getData())
      current = current.getNext();
    }

    return this
  }

  /**
   *
   * Runs iteratee with the cloned value found in each node, in reverse order.
   *
   * ```
   * const dll = DLinkedList.fromArray([1,2,3,4,5])
   * dll.eachRight(v => console.log(v * 2)) // 10,8,6,4,2
   *
   * ```
   *
   * @param iteratee
   */
  eachRight(iteratee: eachIteratee<T>): DLinkedList<T> {
    let current = this.tail_node

    while (current !== null) {
      iteratee(current.getData())
      current = current.getPrev()
    }

    return this
  }

  /**
   * Returns all values predicate function returns truthy for.
   * Plain objects will be deeply cloned.
   *
   * ```
   * const dll = DLinkedList.fromArray([1,2,3,4,5,6,7,8,9])
   * let doubled = dll.filter(v => v >= 4) // [4,5,6,7,8,9]
   *
   * ```
   *
   * @param predicate
   */

  filter(predicate: filterPredicate<T>): DLinkedList<T> {
    let current = this.head_node
    let results = []
    while (current !== null) {
      let data = current.getData()
      if (predicate(data)) {
        results.push(data)
      }
      current = current.getNext()
    }
    return DLinkedList.fromArray(results)
  }

  /**
   * Reduces list values to a single value.
   *
   * ```
   * let dll = DLinkedList.fromArray([1,2,3,4,5])
   * let results = dll.reduce((v, acc) => {
   *   acc += v
   *   return acc
   * }, 0)
   *
   * // results === 15
   *
   * ```
   *
   * @param iteratee
   * @param accumulator
   */
  reduce<V>(iteratee: reduceIteratee<T, V>, accumulator: any) {
    let acc = accumulator
    let current = this.head_node;
    while (current !== null) {
      let data = current.getData()
      acc = iteratee(data, acc)
      current = current.getNext();
    }

    return acc
  }

  /**
   * Reduces list values to a single value, in reverse order.
   *
   * ```
   * let dll = DLinkedList.fromArray([1,2,3,4,5])
   * let results = dll.reduceRight((v, acc) => {
   *    acc -= v
   *    return acc
   * }, 15)
   *
   * // results === 0
   * ```
   * @param iteratee
   * @param accumulator
   */
  reduceRight<V>(iteratee: reduceIteratee<T, V>, accumulator: any) {
    let acc = accumulator
    let current = this.tail_node;
    while (current !== null) {
      let data = current.getData()
      acc = iteratee(data, acc)
      current = current.getPrev();
    }

    return acc
  }


  /**
   * Asynchronously reduces list values to a single value.
   *
   * ```
   * let dll = DLinkedList.fromArray<number>([1,2,3,4,5])
   * let results = await dll.asyncReduce((n) => {
   *    return new Promise((resolve) => {
   *      acc += n
   *      setTimeout(() => {
   *        resolve(acc)
   *      }, 5000)
   *    })
   *  }, 0)
   * // results === 15 - 25 seconds later, not 5
   * ```
   *
   * @param iteratee
   * @param accumulator
   */
  async asyncReduce<V>(iteratee: asyncReduceIteratee<T, V>, accumulator: any): Promise<V> {
    let acc = accumulator
    let stepper = async (node: Node<T>) => {
      if(node === null) {return acc}
      acc = await Promise.resolve(iteratee(node.getData(), acc))

      return stepper(node.getNext())
    }

    return stepper(this.head_node)
  }

  /**
   * Asynchronously reduces list values to a single value, in reverse order.
   *
   * ```
   * let dll = DLinkedList.fromArray<number>([1,2,3,4,5])
   * let results = await dll.asyncReduceRight((n) => {
   *    return new Promise((resolve) => {
   *      acc -= n
   *      setTimeout(() => {
   *        resolve(acc)
   *      }, 5000)
   *    })
   *  }, 15)
   * // results === 0 - 25 seconds later, not 5
   *
   * ```
   *
   * @param iteratee
   * @param accumulator
   */
  async asyncReduceRight<V>(iteratee: asyncReduceIteratee<T, V>, accumulator: any): Promise<V> {
    let acc = accumulator
    let stepper = async (node: Node<T>) => {

      if(node === null) {return acc}
      acc = await Promise.resolve(iteratee(node.getData(), acc))

      return stepper(node.getPrev())
    }

    return stepper(this.tail_node)
  }
}