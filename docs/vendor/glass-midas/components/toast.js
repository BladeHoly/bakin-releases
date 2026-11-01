import { define, GlassElement } from './base.js';
/**
 * `<gm-toast duration="4000">Saved</gm-toast>`: a short message on frosted glass that goes away on
 * its own, waiting while the pointer or focus is on it. Usually made with `toast()`.
 * Dismissing it fires `gm-dismiss`.
 */
export class GmToast extends GlassElement {
    static glassDefaults = { radius: 22, bezel: 14, thickness: 26 };
    #timer;
    #left = 0;
    #since = 0;
    #pause = () => {
        clearTimeout(this.#timer);
        this.#left -= Date.now() - this.#since;
    };
    #resume = () => this.#start(this.#left);
    setup() {
        if (!this.hasAttribute('material'))
            this.setAttribute('material', 'frost');
        this.setAttribute('role', 'status');
        for (const type of ['pointerenter', 'focusin'])
            this.addEventListener(type, this.#pause);
        for (const type of ['pointerleave', 'focusout'])
            this.addEventListener(type, this.#resume);
        this.#start(Number(this.getAttribute('duration') ?? 4000));
    }
    teardown() {
        clearTimeout(this.#timer);
    }
    #start(ms) {
        clearTimeout(this.#timer);
        this.#left = ms;
        this.#since = Date.now();
        if (ms > 0)
            this.#timer = setTimeout(() => this.dismiss(), ms);
    }
    /** Fades it out and removes it. */
    dismiss() {
        if (this.hasAttribute('leaving'))
            return;
        this.setAttribute('leaving', '');
        this.dispatchEvent(new CustomEvent('gm-dismiss', { bubbles: true }));
        setTimeout(() => this.remove(), 200);
    }
}
/**
 * Shows a toast at the bottom of the page, above the others (three at most), and returns it.
 * The region they stack in is announced politely to screen readers.
 */
export function toast(message, options = {}) {
    let region = document.querySelector('.gm-toasts');
    if (!region) {
        region = document.createElement('div');
        region.className = 'gm-toasts';
        region.setAttribute('aria-live', 'polite');
        document.body.append(region);
    }
    const el = document.createElement('gm-toast');
    el.setAttribute('duration', String(options.duration ?? 4000));
    const text = document.createElement('span');
    text.textContent = message;
    el.append(text);
    const action = options.action;
    if (action) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'gm-chip';
        button.textContent = action.label;
        button.addEventListener('click', () => {
            action.onClick();
            el.dismiss();
        });
        el.append(button);
    }
    region.append(el);
    const shown = region.querySelectorAll('gm-toast:not([leaving])');
    if (shown.length > 3)
        shown[0].dismiss();
    return el;
}
define('gm-toast', GmToast);
//# sourceMappingURL=toast.js.map