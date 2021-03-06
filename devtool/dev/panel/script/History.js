import EventDispatcher from './EventDispatcher'
import MemoryBlock from './MemoryBlock'
import Crypto from 'crypto'

export const DEFAULT_MAX_LEVELS = 1000


function getMD5State(element) {
  return Crypto.createHash('md5').update(
      JSON.stringify(
          getBasicStructure(element)
      )
  ).digest("hex")
}

function getBasicStructure(element = []) {
  return element.map(({name, children}) => (
      {
          name,
          children: getBasicStructure(children),
      })
  )
}

class History extends EventDispatcher {
    constructor () {
      super()
      this.maxLevels = null
      this.history = []
      this.disabled = false
      this.md5 = ''
      this.name = ''
      this.events = {
        change: () => {},
      }
    }

    changeMaxLevels (maxLevels) {
      this.maxLevels = parseInt(maxLevels)
    }

    disable (disabled = true) {
      this.disabled = disabled
    }
  
    add ({event, state, element}) {
      if (!this.disabled) {
        if (this.maxLevels && this.maxLevels !== 0) {
          if (this.history.length >= this.maxLevels) {
            this.history.splice(0, this.history.length + 1 - this.maxLevels)
          }
        }
        this.history.push ({
          time: new Date(),
          event,
          element,
          state,
        })
        this.md5 = getMD5State(state)
        this.name = state[0].name
        this.events.change(this)
      }
    }

    getMD5 () {
      return this.md5
    }

    getName () {
      return this.name
    }
  
    clean () {
      this.history = []
      this.history.length = 0
      this.events.change(this)
    }
  
    getConsumedMemory () {
      return MemoryBlock.calculate(this.history)
    }
  
    getList () {
      return this.history
    }
  
    toItem (index) {
      const i = parseInt(index)
      const item = this.history[i]
      this.moveHeader(i)
      this.events.change(this)
      return item
    }
  
    getItem (index) {
      return this.history[parseInt(index)]
    }

    moveHeader (index) {
      this.history.length = index+1
    }
  
    getMoment(time) {
      return this.history.find((item) => item.time === time)
    }

    getLength() {
      return this.history.length
    }

    getLastest() {
      return this.history[this.history.length - 1]
    }
  }

  export default History