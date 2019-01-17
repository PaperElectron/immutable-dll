# Immutable-dll

### A Doubly linked list featuring functional methods, immutable data and a fluent interface.



### Install

```shell
yarn add immutable-dll
npm install -s immutable-dll
```
### Usage

#### Typescript

```typescript
import {DLinkedList} from 'immutable-dll'

const dll = DLinkedList.fromArray<number>([1,2,3])
const double = dll.map<number>(v => v * 2)
const triple = double.map<number>(v => v * 3)
const values = triple.map<string>(v => `value: ${v}`)

dll.toArray() // [1,2,3]
values.toArray() // [ 'value: 6', 'value: 12', 'value: 18' ]
```

#### Javascript

```javascript
const {DLinkedList} = require('immutable-dll')

const dll = DLinkedList.fromArray([1,2,3])
const double = dll.map(v => v * 2)
const triple = double.map(v => v * 3)
const values = triple.map(v => `value: ${v}`)

dll.toArray() // [1,2,3]
values.toArray() // [ 'value: 6', 'value: 12', 'value: 18' ]
```
 
 ### Immutable Values
 
Plain objects as determined by [lodash.isplainobject](https://www.npmjs.com/package/lodash.isplainobject)) and arrays
are deeply cloned when they are added to the list, and again deeply cloned when they are extracted, both directly and
when provided to an iterator function.
 
Every method that returns a list value will return a deeply cloned object provided it is a plain object or array.

Javascript Primitive types are unique and passed by value. Functions are returned directly with no modification.

```typescript
import {DLinkedList} from 'immutable-dll'

const arr = [{a: 1, b: 2}, {a: 3, b: 4}, {a: 5, b: 6}]

const dll = DLinkedList.fromArray(arr) 
const double = dll.map<{a: number, b: number}>(v => ({a: v.a * 2, b: v.b * 2}))

arr[0].a = 100
arr[0].b = 200
arr[1] = {a: 0, b: 0}

arr // [ { a: 100, b: 200 }, { a: 0, b: 0 }, { a: 5, b: 6 } ]
dll.toArray() // [{a: 1, b: 2}, {a: 3, b: 4}, {a: 5, b: 6}]
double.toArray() // [ { a: 2, b: 4 }, { a: 6, b: 8 }, { a: 10, b: 12 } ]

```
 
[Full documentation can be found here!](https://paperelectron.github.io/immutable-dll/index.html)