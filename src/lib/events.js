export function dispatchToEventBus(name, data = {}) {
    const event = new CustomEvent('message', {
        bubbles: true,
        detail: {
            name,
            data
        }
    });

    console.log(`💡 EVENT DISPATCHED: ${name}`);
    window.dispatchEvent(event);
}
