import { assertEquals } from 'https://deno.land/std@0.117.0/testing/asserts.ts'
import EventEmitter from './mod.ts'

Deno.test('register & emit', (): Promise<void> => {
  return new Promise((res, rej) => {
    const event = new EventEmitter()
    event.on('test', () => {
      res()
    })
    event.emit('test')
  })
})

Deno.test('register & emit with data', (): Promise<void> => {
  return new Promise((res, rej) => {
    const event = new EventEmitter()
    event.on('test', (data: string) => {
      assertEquals(data, 'data')
      res()
    })
    event.emit('test', 'data')
  })
})

Deno.test('remove listener', (): Promise<void> => {
  return new Promise((res, rej) => {
    const event = new EventEmitter()
    const listener = () => {
      rej()
    }
    event.on('test', listener)
    event.removeListener('test', listener)
    event.emit('test')
    res()
  })
})

Deno.test('event names', () => {
  const event = new EventEmitter()
  event.on('test', () => {})
  event.on('test', () => {})
  event.once('test', () => {})
  assertEquals(event.eventNames(), ['test'])
})
