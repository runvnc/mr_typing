import { BaseEl } from '/chat/static/js/base.js';
import { html, css } from '/chat/static/js/lit-core.min.js';
import { unsafeHTML } from '/chat/static/js/lit-html/directives/unsafe-html.js';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


class TypingIndicator extends BaseEl {
  static properties = {
    agentName: { type: String, attribute: 'agent-name' },
    text: { type: String, attribute: 'text' }
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    
    .typing-indicator {
      display: flex;
      align-items: center;
      font-size: 0.9rem;
      /* italics */
      font-style: italic;
      color: var(--text-color-secondary, #888);
      margin: 0.5rem 0;
    }
    
    .typing-dots {
      display: inline-flex;
      margin-left: 0.5rem;
    }
    
    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: var(--text-color-secondary, #888);
      margin: 0 2px;
      animation: typing-dot 1.4s infinite ease-in-out;
    }
    
    .dot:nth-child(1) {
      animation-delay: 0s;
    }
    
    .dot:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    .dot:nth-child(3) {
      animation-delay: 0.4s;
    }
    
    @keyframes typing-dot {
      0%, 60%, 100% {
        transform: translateY(0);
        opacity: 0.6;
      }
      30% {
        transform: translateY(-4px);
        opacity: 1;
      }
    }
    
    .message-text {
      margin-top: 0.5rem;
      white-space: pre-wrap;
    }
  `;

  constructor() {
    super();
    this.agentName = 'Assistant';
    this.text = '';
  }

  _render() {
    return html`
      <div class="typing-indicator">
        <span>${this.agentName} is typing</span>
        <div class="typing-dots">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
      ${this.text ? html`<div class="message-text">${this.text}</div>` : ''}
    `;
  }
}

customElements.define('typing-indicator', TypingIndicator);

let isTyping = false;
let startTypingPromise = null;

// Register the command handler for say
window.registerCommandHandler('say', async (data) => {
  console.log('Handling say command with typing indicator:', data);
  let min_wait = Math.random() * 4000;
  let wait_time = Math.round(Math.random() * 25000);
   
  switch(data.event) {
    case 'partial':
     if (!isTyping) {
        isTyping = true;
        // print with blue bckground yellow text
        console.log('%c waiting before showing typing indicator', 'background: blue; color: yellow')
        startTypingPromise = delay(wait_time);
        await startTypingPromise
        startTypingPromise = null;
        console.log('%c showing typing indicator', 'background: blue; color: yellow"')
        return `<typing-indicator agent-name="${data.persona || 'Assistant'}"></typing-indicator>`;
      } else {
        await startTypingPromise;
        startTypingPromise = null;
        return null;
      }
    
    case 'running':
      isTyping = false
      if (startTypingPromise) {
        await startTypingPromise;
      }
      await delay(wait_time);
      return data.args.text
    
    case 'result':
      isTyping = false;
      // Don't do anything in the final stage
      // The running stage already showed the text
      return null;
  }
});
