import AIEMonitor from './AIEMonitor'
import AIE from './AIE'
import AIEElement from './AIEElement';

export default class AIEHTMLMonitor extends AIEMonitor {
    static eventSendName: string = 'aie-update'
    static eventRestoreName: string = 'aie-restore'
    static eventConnectName: string = 'aie-connect'
    static eventApplyName: string = 'aie-mutate'
    static enableLog: boolean = true

    static restorePregnancies (event: any) : void  {
        const pregnancies = JSON.parse(event.detail)
        AIEHTMLMonitor.log('[AIE] AIEHTMLMonitor restore pregnancies');

        pregnancies.map((group: any) => {
            const aie: AIE = AIEMonitor.environments.find((env:AIE) => env.getName() === group.name)
            if (aie) {
                aie.setState(group)
            }
        })
    }
    static mutateElements (event: any) : void  {
        const pregnancies = JSON.parse(event.detail)
        AIEHTMLMonitor.log('[AIE] AIEHTMLMonitor mutate elements');

        pregnancies 
            ? pregnancies.map((group: any) => {
                const aie: AIE = AIEMonitor.environments.find((env:AIE) => env.getName() === group.name)
                if (aie) {
                    aie.setState(group)
                    aie.mutate()
                }})
            : AIEMonitor.environments.forEach((env:AIE) => env.mutate())

        AIEHTMLMonitor.sendPregnancies('Reconnect', 'Document', 'All')
    }

    static sendPregnancies (eventName: string = '', elementName: string = '', environmentName: string = '', serverUrl: string = null, userName = null) : void {
        AIEHTMLMonitor.log('[AIE] AIEHTMLMonitor send pregnancies for <' + eventName + '>');
        const state = AIEMonitor.getState()
        if (state && state.length) {
            const detailObj = {
                event: eventName,
                aie: environmentName,
                element: elementName,
                state,
                userName,
            }
            const detail = JSON.stringify(detailObj)
            const event = new CustomEvent(AIEHTMLMonitor.eventSendName, { detail });
            (<any>window).dispatchEvent(event)
            if (serverUrl && userName) {
                AIEHTMLMonitor.sendPost(serverUrl, detail)
            }
        }
    }

    static sendPost(serverUrl: string, body: string) {
        const headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        const data = {
            method: 'POST',
            headers,
            body,
        };

        fetch(serverUrl, data)
            .then(function() {
                AIEHTMLMonitor.log('[AIE] AIEHTMLMonitor send pregnancies to <' + serverUrl + '>');
            })
    }

    static log(text: string): void {
        AIEHTMLMonitor.enableLog && console.log(text)
    }

    static error(text: string): void {
        AIEHTMLMonitor.enableLog && console.error(text)
    }

    static exposeEnviroments (serverUrl: string = null, userName: string = null): void {
        // Wait for events
        const w = (<any>window)
        w.addEventListener(AIEHTMLMonitor.eventConnectName, () => { AIEHTMLMonitor.sendPregnancies('Reconnect', 'Document', 'All') })
        w.addEventListener(AIEHTMLMonitor.eventRestoreName, AIEHTMLMonitor.restorePregnancies)
        w.addEventListener(AIEHTMLMonitor.eventApplyName, AIEHTMLMonitor.mutateElements)
        
        // Dispatch events
        AIEMonitor.environments.map((env: AIE) => {
            env.registerEvent('change', (myEvent: string, element: AIEElement, config: Object) => {
                AIEHTMLMonitor.sendPregnancies(myEvent, element.getName(), env.getName(), serverUrl, userName)
            })
        })
    }
}
