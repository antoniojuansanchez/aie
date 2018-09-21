let port
let activeMaks = false

/**
 * Lazily setup port for communication with the background script
 * and send initialization message.
 */
function setupPortIfNeeded() {
    if (!port) {
      port = chrome.runtime.connect(null, { name: 'content' });
      port.postMessage({ action: 'init' })
      port.onDisconnect.addListener(function () {
        port = null
      });
    }
  }
  
  /**
   * Send mouse coordinates to DevTools panel script.
   */
  function sendPrestances(event) {
    setupPortIfNeeded()
    port.postMessage({
      action: 'aie-update',
      detail: event.detail,
      target: 'panel',
    });
  }
  
  // Unique ID for the className.
const MOUSE_VISITED_CLASSNAME = 'aie_mouse_highlight';
const MOUSE_VISITED_ID = 'aie-selector-element';

function mark (marked, element) {
  if (!activeMaks) {
    return
  }
  if (!element) {
    return
  }

  let marker = document.querySelector(`#${MOUSE_VISITED_ID}`)
  if (!marker) {
    marker = document.createElement('div')
    marker.classList.add(MOUSE_VISITED_CLASSNAME)
    marker.setAttribute('id', MOUSE_VISITED_ID)
    document.body.appendChild(marker)
  }

  if (marked) {
      marker.style.left = `${element.offsetLeft}px`
      marker.style.top = `${element.offsetTop}px`
      marker.style.width = `${element.offsetWidth}px`
      marker.style.height = `${element.offsetHeight}px`
      marker.classList.add('show')
  } else {
      marker.classList.remove('show')
  }
}

function sendMark (marked, element) {
  if (!activeMaks) {
    return
  }
  if (element.hasAttribute('aie-name')) {
    mark(marked, element)
    port.postMessage({
      action: marked ? 'aie-mark' : 'aie-unmark',
      name: element.getAttribute('aie-name'),
      target: 'panel',
    });
  }
}

chrome.runtime.onMessage.addListener(function({ target, action, name, prestances }) {
  if (target !== 'content') {
    return
  }
  switch(action) {
    case 'aie-mark':
      mark (true, document.querySelector(`[aie-name="${name}"]`))
      break
    case 'aie-unmark':
      mark (false, document.querySelector(`[aie-name="${name}"]`))
      break
    case 'aie-active-mark':
      console.info('[AIEE Extension] Marker active')
      activeMaks = true
      break
    case 'aie-unactive-mark':
      console.info('[AIEE Extension] Marker unactive')
      activeMaks = false
      break
    case 'aie-connect':
      window.dispatchEvent(new CustomEvent('aie-connect'));
      break
    case 'aie-apply':
      console.info('[AIEE Extension] Apply changes for AIE')
      window.dispatchEvent(new CustomEvent('aie-apply', { 'detail': JSON.stringify(prestances) }))
      break
    case 'aie-restore':
      console.info('[AIEE Extension] Restore changes for AIE')
      window.dispatchEvent(new CustomEvent('aie-restore', { 'detail': JSON.stringify(prestances) }))
      break
  }
})  


document.addEventListener('mouseover', function (e) {
  setupPortIfNeeded();
  sendMark(true, e.srcElement)
}, false)

document.addEventListener('mouseout', function (e) {
  setupPortIfNeeded();
  sendMark(false, e.srcElement)
}, false)

console.info('[AIEE Extension] Loaded')
  
window.addEventListener('aie-update', event => sendPrestances(event))