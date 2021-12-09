/**
 * The signature of an interface implementing events.
 */
export type ListenerSignature<L> = {
  [E in keyof L]: (...args: any[]) => any
}

/**
 * The default listener.
 * It takes a string as the name of the event, and a function taking an array of arguments as the callback.
 */
export type DefaultListener = {
  [k: string]: (...args: any[]) => any
}

/**
 * A simple event emitter.
 */
export default class EventEmitter<Events extends ListenerSignature<Events> = DefaultListener> {
  private onListeners: { [E in keyof Events]?: Events[E][] } = {}
  private onceListeners: { [E in keyof Events]?: Events[E][] } = {}

  static defaultMaxListeners = 10
  private maxListeners = EventEmitter.defaultMaxListeners

  /**
   * Alias for `on`.
   */
  addListener = this.on
  /**
   * Alias for `off`.
   */
  removeListener = this.off

  /**
   * Emit an event.
   * @param event The event to emit.
   * @param args The arguments to pass to the listeners.
   * @returns boolean indicating whether any listeners were called.
   */
  emit<E extends keyof Events>(event: E, ...args: any[]) {
    if (!this.onListeners[event] || this.onListeners[event]?.length === 0) return false
    this.onListeners[event]?.forEach(listener => listener(...args))

    if (!this.onceListeners[event] || this.onceListeners[event]?.length === 0) return true
    this.onceListeners[event]?.forEach(listener => {
      listener(...args)
      this.off(event, listener)
    })

    return true
  }

  /**
   * Returns an array of listeners for the event.
   * @returns A list of all event names that have listeners attached.
   */
  eventNames() {
    return (Object.keys(this.onListeners) as (keyof Events)[]).filter(k => this.onListeners[k] !== undefined).concat((Object.keys(this.onceListeners) as (keyof Events)[]).filter(k => this.onceListeners[k] !== undefined)).filter((v, i, a) => a.indexOf(v) === i)
  }

  /**
   * Returns the number of listeners for the event.
   * @param event The event to count.
   * @returns The number of listeners for the event.
   */
  listenerCount(event: keyof Events) {
    return (this.onListeners[event]?.length ?? 0) + (this.onceListeners[event]?.length ?? 0)
  }

  /**
   * Returns all listeners for the event.
   * @param event The event to get listeners for.
   * @returns An array of listeners for the event.
   */
  listeners<E extends keyof Events>(event: E) {
    return (this.onListeners[event] ?? [] as Events[E][]).concat(this.onceListeners[event] ?? [] as Events[E][])
  }

  /**
   * Adds a one-time listener for the event.
   * @param event The event to listen for.
   * @param listener The listener to call.
   * @returns The emitter.
   */
  once<E extends keyof Events>(event: E, listener: Events[E]) {
    if (!this.onceListeners[event]) this.onceListeners[event] = []
    this.onceListeners[event]?.push(listener)
    if (this.onceListeners[event]!.length > this.maxListeners)
      throw new Error(`Possible EventEmitter memory leak detected. ${this.onceListeners[event]?.length} test listeners added to [EventEmitter]. Use emitter.setMaxListeners() to increase limit`)
    return this
  }

  /**
   * Adds a listener for the event.
   * @param event The event to listen for.
   * @param listener The listener to call.
   * @returns The emitter.
   */
  on<E extends keyof Events>(event: E, listener: Events[E]) {
    if (!this.onListeners[event]) this.onListeners[event] = []
    this.onListeners[event]?.push(listener)
    if (this.onListeners[event]!.length > this.maxListeners)
      throw new Error(`Possible EventEmitter memory leak detected. ${this.onListeners[event]?.length} test listeners added to [EventEmitter]. Use emitter.setMaxListeners() to increase limit`)
    return this
  }

  /**
   * Removes a listener for the event.
   * @param event The event to remove the listener from.
   * @param listener The listener to remove.
   * @returns The emitter.
   */
  off<E extends keyof Events>(event: E, listener: Events[E]) {
    if (this.onceListeners[event]) {
      const index = this.onceListeners[event]!.indexOf(listener)
      if (index === -1) return this
      this.onceListeners[event]?.splice(index, 1)
    }

    if (this.onListeners[event]) {
      const index = this.onListeners[event]!.indexOf(listener)
      if (index === -1) return this
      this.onListeners[event]?.splice(index, 1)
    }

    return this
  }

  /**
   * Adds a listener to the beginning of the listeners array for the event.
   * @param event The event to prepend the listener to.
   * @param listener The listener to prepend.
   * @returns The emitter.
   */
  prependListener<E extends keyof Events>(event: E, listener: Events[E]) {
    if (!this.onListeners[event]) this.onListeners[event] = []
    this.onListeners[event]?.unshift(listener)
    if (this.onListeners[event]!.length > this.maxListeners)
      throw new Error(`Possible EventEmitter memory leak detected. ${this.onListeners[event]?.length} test listeners added to [EventEmitter]. Use emitter.setMaxListeners() to increase limit`)
    return this
  }

  /**
   * Adds a one-time listener to the beginning of the listeners array for the event.
   * @param event The event to prepend the listener to.
   * @param listener The listener to prepend.
   * @returns The emitter.
   */
  prependOnceListener<E extends keyof Events>(event: E, listener: Events[E]) {
    if (!this.onceListeners[event]) this.onceListeners[event] = []
    this.onceListeners[event]?.unshift(listener)
    if (this.onceListeners[event]!.length > this.maxListeners)
      throw new Error(`Possible EventEmitter memory leak detected. ${this.onceListeners[event]?.length} test listeners added to [EventEmitter]. Use emitter.setMaxListeners() to increase limit`)
    return this
  }

  /**
   * Removes all listeners, or those of the specified events.
   * @param events The events to remove all listeners from.
   * @returns The emitter.
   */
  removeAllListeners<E extends keyof Events>(...events: E[]) {
    if (!events) {
      this.onListeners = {}
      this.onceListeners = {}
    } else {
      for (const event of events) {
        this.onListeners[event] = undefined
        this.onceListeners[event] = undefined
      }
    }
    return this
  }

  /**
   * Sets the maximum number of listeners.
   * @param max The maximum number of listeners.
   * @returns The emitter.
   */
  setMaxListeners(n: number) {
    this.maxListeners = n
    return this
  }

  /**
   * Get the max number of listeners.
   * @returns The max number of listeners.
   */
  getMaxListeners() {
    return this.maxListeners
  }
}
