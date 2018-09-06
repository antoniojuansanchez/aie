import AIEMonitor from './AIEMonitor'
import AIE from './AIE'
import AIEElement from './AIEElement';

export default class AIEHTMLMonitor extends AIEMonitor {
    static interval: any
    static eventSendName: string = 'aie-update'
    static eventRestoreName: string = 'aie-restore'
    static eventConnectName: string = 'aie-connect'

    static restorePrestances (event: any) : void  {
        const prestances = JSON.parse(event.detail)
        console.info('[AIE] AIEHTMLMonitor restore prestances', prestances);

        prestances.map((group: any) => {
            const aie: AIE = AIEMonitor.environments.find((env:AIE) => env.getName() === group.name)
            if (aie) {
                aie.setScores(group)
            }
        })
    }

    static sendPrestances (eventName: string = '', elementName: string = '', environmentName: string = '') : void {
        console.info('[AIE] AIEHTMLMonitor send prestances for <', eventName, '>');
        if (AIEMonitor.getPrestances().length) {
            const detail = {
                event: eventName,
                aie: environmentName,
                element: elementName,
                prestances: AIEMonitor.getPrestances()
            }
            if (detail.prestances) {
                const event = new CustomEvent(AIEHTMLMonitor.eventSendName, { 'detail': JSON.stringify(detail) });
                (<any>window).dispatchEvent(event);
            }
        }
    }

    static exposeEnviroments (): void {
        // Wait for events
        const w = (<any>window)
        w.addEventListener(AIEHTMLMonitor.eventConnectName, () => { AIEHTMLMonitor.sendPrestances('Reconnect', 'Document', 'All') })
        w.addEventListener(AIEHTMLMonitor.eventRestoreName, AIEHTMLMonitor.restorePrestances)
        
        // Dispatch events
        AIEMonitor.environments.map((env: AIE) => {
            env.registerEvent('change', (myEvent: string, element: AIEElement) => {
                AIEHTMLMonitor.sendPrestances(myEvent, element.getName(), env.getName())
            })
        })
    }
}
