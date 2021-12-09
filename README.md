# EasyEmit - A Tri Platform Event Emitter

EasyEmit is an event emitter for Deno, Node.js, and the web.

## Installation

You can install EasyEmit for Node.js, Deno, or directly into a web page via a `script` tag.

### Node.js

```bash
# npm
npm install easyemit
# yarn
yarn add easyemit
```

### Deno

```js
import EventEmitter from 'https://deno.land/x/easyemit@0.1.0/index.min.js'
```

### Include Via CDN

```html
<script src="https://unpkg.com/easyemit@0.1.0/index.min.js" />
```

## Usage

```js
let emitter = new EventEmitter()

emitter.on('hello', (data) => {
  console.log(`Hello ${data ?? 'world'}`)
})

emitter.emit('hello')
emitter.emit('hello', 'emitter')
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
