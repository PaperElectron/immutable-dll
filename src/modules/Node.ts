/**
 * @file Node
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project immutable-dll
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import isPlainObject from 'lodash.isplainobject'
import cloneDeep from 'lodash.clonedeep'

/**
 * Deeply clones plain objects and arrays
 * @param obj
 */
const clonePlain = (obj: any) => {
  return (isPlainObject(obj) || Array.isArray(obj)) ? cloneDeep(obj) : obj
}

export class Node<T> {
  readonly data: T
  next: Node<T>
  prev: Node<T>

  /**
   *
   * @param data
   * @param prev
   * @param next
   */
  constructor(data, prev?: Node<T>, next?: Node<T>) {
    this.data = clonePlain(data)
    this.prev = prev || null
    this.next = next || null
  }

  getData(): T {
    return clonePlain(this.data)
  }

  setNext(node: Node<T> | null): void {
    this.next = node
  }

  getNext(): Node<T> {
    return this.next
  }

  setPrev(node: Node<T> | null): void {
    this.prev = node
  }

  getPrev(): Node<T> {
    return this.prev
  }
}