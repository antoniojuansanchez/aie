import AIE from './AIE'
import AIEElement from './AIEElement'

export interface AIEEvent {
  name: string;
  element: AIEElement;
}

export default class AIEEventProcessor {
  private enviroment: AIE
  private queue: Array<AIEEvent>
  private interaction: number
  private events: any

  public constructor(enviroment: AIE) {
    this.enviroment = enviroment
    this.queue = []
    this.events = {
      change: () => {},
    }
    this.interaction = 0
    console.info('[AIE] Event processor initialized');
    this.inspect()
  }

  public notify (event: AIEEvent) {
    this.queue.push(event)
  }

  public registerEvent (event: string, func: any) {
    this.events[event] = func
  }

  private inspect () {
    const event: AIEEvent = this.queue.shift()
    if (event) {
      console.info('[AIE] Procesing <'+event.name+'> over [' + event.element.getName() + ']')
      if (event.element.hasParent()) {
        const elParent: AIEElement = event.element.getParent()
        const increment = event.element.updatePrestance()
        elParent.updateChildrenPrestance(-increment, [ event.element ])
        elParent.onTrigger(event.name)
        event.name && this.events.change(event.name, event.element)
      }
    }
    setTimeout(this.inspect.bind(this), 0)
  }

}