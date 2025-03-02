import { BaseEl } from '/chat/static/js/base.js';
import { html, css } from '/chat/static/js/lit-core.min.js';
import { unsafeHTML } from '/chat/static/js/lit-html/directives/unsafe-html.js';

class TypingIndicator extends BaseEl {
  static properties = {
    agentName: { type: String, attribute: 'agent-name' },
    isTyping: { type: Boolean, attribute: 'is-typing' },
    finalText: { type: String, attribute: 'final-text' },
    showFinal: { type: Boolean, attribute: 'show-final' }
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
    
    .final-text {
      display: none;
    }
    
    :host([show-final]) .typing-indicator {
      display: none;
    }
    
    :host([show-final]) .final-text {
      display: block;
    }
  `;

  constructor() {
    super();
    this.agentName = 'Assistant';
    this.isTyping = true;
    this.finalText = '';
    this.showFinal = false;
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
      <div class="final-text">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('typing-indicator', TypingIndicator);

// Register the command handler for say
window.registerCommandHandler('say', (data) => {
  console.log('Handling say command with typing indicator:', data);
  
  switch(data.event) {
    case 'partial':
      // For partial updates, just show the typing indicator
      return html`<typing-indicator agent-name="${data.persona || 'Assistant'}"></typing-indicator>`;
    
    case 'running':
      // Still typing
      return html`<typing-indicator agent-name="${data.persona || 'Assistant'}"></typing-indicator>`;
    
    case 'result':
      // When we get the final result, show the complete message
      // Handle different data structures safely
      let text = '';
      
      // Try to extract text from various possible locations
      if (data.params?.text) {
        text = data.params.text;
      } else if (data.params?.markdown) {
        text = data.params.markdown;
      } else if (typeof data.params === 'string') {
        text = data.params;
      } else if (data.args) {
        text = typeof data.args === 'string' ? data.args : JSON.stringify(data.args);
      }
      
      // Parse the text as markdown if possible
      let parsedText = '';
      try {
        parsedText = window.markdownRenderer.parse(text);
      } catch (e) {
        console.error('Error parsing markdown:', e);
        parsedText = `<pre>${text}</pre>`;
      }
      
      return html`<typing-indicator agent-name="${data.persona || 'Assistant'}" show-final>
        ${unsafeHTML(parsedText)}
      </typing-indicator>`;
  }
});
