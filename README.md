# WebStorage Manager

A tiny library for handling WebStorage

[![Version](https://img.shields.io/npm/v/@jdej/webstoragemanager.svg?style=flat&logo=appveyor)](https://www.npmjs.com/package/@jdej/webstoragemanager)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/JdeJ/WebStorageManager/blob/master/LICENSE)
[![Build Status](https://travis-ci.com/@jdej/webstoragemanager.svg?token=9QUEx9r7MWqF44f9VDer&branch=master)](https://travis-ci.com/@jdej/webstoragemanager)
[![minzipped size](https://badgen.net/bundlephobia/minzip/@jdej/webstoragemanager)](https://badgen.net/bundlephobia/minzip/@jdej/webstoragemanager)
[![Downloads](https://img.shields.io/npm/dm/@jdej/webstoragemanager.svg?style=flat&logo=appveyor)](https://www.npmjs.com/package/@jdej/webstoragemanager)

## 🛠 Installation

```
$ npm install @jdej/webstoragemanager
$ yarn add @jdej/webstoragemanager
```

## ⚙️ API

|                                 Types                                 |                                       Description                                       |
| :-------------------------------------------------------------------: | :-------------------------------------------------------------------------------------: |
|                        type WebStorage<string>                        | Web storage to use. Available values: 'sessionStorage', 'localStorage', 'windowStorage' |
| type NavigatorSpace { localStorage: number; sessionStorage: number; } |                   Returns available space for each web storage option                   |
|                   type EventListenerCb = () => void                   |                          Returns the number of key/value pairs                          |

| Properties |              Description               |
| :--------: | :------------------------------------: |
|   length   | Returns the number of key/value pairs. |

|       Methods       |                                                                                        Description                                                                                        |                                    Syntax                                     |
| :-----------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------: |
|     getInstance     |                                                                         Returns a new WebStorageManager instance                                                                          |   WebStorageManager.getInstance(webStorage: WebStorage): WebStorageManager    |
|  checkAvailability  |                                                                              Check web storage availability                                                                               |       WebStorageManager.checkAvailability(webStorage: WebStorage): void       |
|  getNavigatorSpace  |                                                             Returns an object of NavigatorSpace type with total storage space                                                             |             WebStorageManager.getNavigatorSpace(): NavigatorSpace             |
|    getStoreSpace    |                                                                     Returns total space of provided web storage type                                                                      |                 getStoreSpace(webStorage: WebStorage): number                 |
|     getContent      |                                                                     Returns all items of a provided web storage type                                                                      | WebStorageManager.getContent(webStorage: WebStorage): Record<string, unknown> |
|       setItem       | Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously. Optionally can set value unavailable after provided milliseconds |      setItem<T = string>(key: string, value: T, expires?: number): void       |
|       getItem       |                                             Returns the current value associated with the given key, or null if the given key does not exist.                                             |                      getItem<T = string>(key: string): T                      |
|         key         |                                         Returns the name of the nth key, or null if n is greater than or equal to the number of key/value pairs.                                          |                          key(index: number): string                           |
|     removeItem      |                                               Removes the key/value pair with the given key, if a key/value pair with the given key exists.                                               |                   removeItem<T = string>(key: string): void                   |
|        clear        |                                                                      Removes all key/value pairs, if there are any.                                                                       |                                 clear(): void                                 |
|       hasItem       |                                                                             Returns if a key exist on storage                                                                             |                         hasItem(key: string): boolean                         |
|       getKeys       |                                                                            Returns the keys stored on storage                                                                             |                              getKeys(): string[]                              |
|    getUsedSpace     |                                                                                Returns storage used space                                                                                 |                            getUsedSpace(): number                             |
|   getKeyUsedSpace   |                                                                              Returns specific key used space                                                                              |                     getKeyUsedSpace(key: string): number                      |
|      toString       |                                                                      Returns all the store content on string format                                                                       |                              toString(): string                               |
| addStoreChangeEvent |                                                                          Adds event listener to storage changes                                                                           |                addStoreChangeEvent(cb: EventListenerCb): void                 |

## 👩‍💻 Usage

```js

const storage = WebStorageManager.getInstance('localStorage');
const projects: Record<string, string>[] = [
  {`Anjana's Fury`, 'Vanilla Javascript'},
  {'Ekilikua', 'Node, Express, MongoDB'},
  {'UOP - Unpopular Opinion', 'React, Node, Express, MongoDB'},
  {'WebStorageManager', 'Typescript'},
  {'useSocket React Hook', 'React, Typescript'}
];

// Store data
storage.setItem('JdeJ_Projects', projects)

// Retrieve data
const myData = storage.getItem('JdeJ_Projects')

// Store data with expiration
storage.setItem('user', 'super_secret_info', 10000)

// Clean storage
storage.clear()
```

## 🤝 Contributing

The best contribution is to use it and write feedback about it to this email: jorgedjuana@gmail.com or [create an issue on github](https://github.com/JdeJ/WebStorageManager/blob/master/CONTRIBUTING).
But if you really like my work you can [buy me a lollipop](https://www.buymeacoffee.com/JdeJ).

## 📝 License

**WebStorageManager** is open source software licensed as MIT ©[JdeJ](https://github.com/JdeJ).
