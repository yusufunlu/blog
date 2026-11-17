import React, { useEffect, useRef, useState } from 'react';
import './ChatWidget.css';

// Set GATSBY_CHAT_API_URL in your environment (e.g. .env.production) to point at
// the deployed Cloudflare Worker. Falls back to the placeholder below if unset.
const CHAT_API_URL =
  (typeof process !== 'undefined' &&
    process.env &&
    process.env.GATSBY_CHAT_API_URL) ||
  'https://yusuf-blog-chat.yusufunlu.workers.dev/chat';

const WELCOME_CONTENT =
  'Hi! I\'m an AI assistant that can answer questions about Yusuf\'s experience, skills, and blog posts. Ask me anything — for example: "How strong is Yusuf in Java?" or "Does he have experience with AWS?"';

const WELCOME_MESSAGE = { role: 'assistant', content: WELCOME_CONTENT };

// sessionStorage keys — scoped so they can't collide with anything else.
const STORAGE_PREFIX = 'yusuf-blog-chat:';
const KEY_MESSAGES = STORAGE_PREFIX + 'messages';
const KEY_REMAINING = STORAGE_PREFIX + 'remaining';
const KEY_OPEN = STORAGE_PREFIX + 'open';

// sessionStorage can throw in private/incognito mode, cross-origin iframes, or
// when it's disabled. Keep every access guarded so the widget still works.
function safeGet(key) {
  try {
    if (typeof window === 'undefined') return null;
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key, value) {
  try {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

function ChatWidget() {
  // Initial state is deterministic so server-rendered HTML matches the first
  // client paint (no hydration warning). A useEffect below pulls any saved
  // state out of sessionStorage right after mount.
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Restore from sessionStorage once, after hydration.
  useEffect(() => {
    const rawMessages = safeGet(KEY_MESSAGES);
    if (rawMessages) {
      try {
        const parsed = JSON.parse(rawMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch {
        /* ignore corrupt payload */
      }
    }
    const rawRemaining = safeGet(KEY_REMAINING);
    if (rawRemaining) {
      try {
        const parsed = JSON.parse(rawRemaining);
        if (parsed && typeof parsed.you === 'number') {
          setRemaining(parsed);
        }
      } catch {
        /* ignore */
      }
    }
    if (safeGet(KEY_OPEN) === '1') {
      setOpen(true);
    }
    setHydrated(true);
  }, []);

  // Persist state changes — but not until after the initial restore pass, so
  // we never clobber the stored session with the default welcome state.
  useEffect(() => {
    if (!hydrated) return;
    safeSet(KEY_MESSAGES, JSON.stringify(messages));
  }, [messages, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (remaining) safeSet(KEY_REMAINING, JSON.stringify(remaining));
  }, [remaining, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    safeSet(KEY_OPEN, open ? '1' : '0');
  }, [open, hydrated]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending, open]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  async function send() {
    const question = input.trim();
    if (!question || sending) return;
    setError(null);
    setInput('');
    const nextMessages = [...messages, { role: 'user', content: question }];
    setMessages(nextMessages);
    setSending(true);

    // Everything except the welcome greeting goes to the backend as history.
    // Match by content, not reference — a restored welcome message is a new
    // object after being round-tripped through sessionStorage.
    const history = nextMessages
      .filter(m => !(m.role === 'assistant' && m.content === WELCOME_CONTENT))
      .slice(0, -1);

    try {
      const res = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, history }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.answer || '(empty reply)' },
      ]);
      if (data.remaining && typeof data.remaining.you === 'number') {
        setRemaining(data.remaining);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setSending(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="chat-widget-root">
      {open ? (
        <div
          className="chat-widget-panel"
          role="dialog"
          aria-label="Chat with Yusuf's AI assistant"
        >
          <div className="chat-widget-header">
            <span className="chat-widget-header-title">Ask about Yusuf</span>
            <button
              className="chat-widget-header-close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>
          <div className="chat-widget-messages" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`chat-widget-message ${m.role}`}>
                {m.content}
              </div>
            ))}
            {sending && <div className="chat-widget-typing">typing…</div>}
            {error && <div className="chat-widget-message error">{error}</div>}
            {remaining && remaining.you <= 3 && remaining.you >= 0 && (
              <div className="chat-widget-typing">
                {remaining.you === 0
                  ? 'That was your last message for today.'
                  : `${remaining.you} message${
                      remaining.you === 1 ? '' : 's'
                    } left today.`}
              </div>
            )}
          </div>
          <div className="chat-widget-input-row">
            <textarea
              ref={inputRef}
              className="chat-widget-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask about experience, skills, projects…"
              rows={1}
              disabled={sending}
            />
            <button
              className="chat-widget-send"
              onClick={send}
              disabled={sending || !input.trim()}
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          className="chat-widget-bubble"
          onClick={() => setOpen(true)}
          aria-label="Open chat"
          title="Ask about Yusuf"
        >
          💬
        </button>
      )}
    </div>
  );
}

export default ChatWidget;
