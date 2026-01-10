import { EventEmitter } from 'events-ex'

export function createEvent() {
  return new EventEmitter()
}
