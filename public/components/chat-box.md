# ChatBox

- **id:** `chat-box`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/chat/ChatBox.ejs`
- **status:** beta
- **since:** 2026-05

Sayfanın sağ alt köşesine sabitlenen yüzen destek sohbet bileşeni. FAB toggle, header, mesaj balonları, otomatik yükselen textarea ve okunmamış mesaj rozeti içerir.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--error`
- `--primary`
- `--primary-active`
- `--primary-fg`
- `--primary-hover`
- `--secondary`
- `--surface-base`
- `--surface-overlay`
- `--surface-raised`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### With initial messages

```ejs
<%- include('modules/domain/common/chat/ChatBox', {
  open: true,
  title: 'Support Chat',
  subtitle: 'We typically reply in a few minutes',
  messages: [
    { id: 'm1', role: 'agent', text: 'Hi there! How can I help you today?' },
    { id: 'm2', role: 'user',  text: 'I have a question about my order.' }
  ]
}) %>
```

### Empty / initial state

```ejs
<%- include('modules/domain/common/chat/ChatBox', {
  open: true,
  title: 'Sales Chat',
  subtitle: 'Ask us anything',
  messages: []
}) %>
```

## Full EJS source

```ejs
<%
  var _title       = locals.title       || 'Support Chat';
  var _subtitle    = locals.subtitle    || 'We typically reply in a few minutes';
  var _placeholder = locals.placeholder || 'Type a message…';
  var _messages    = locals.messages    || [];
  var _open        = locals.open !== undefined ? !!locals.open : false;
  var _minimised   = !!locals.minimised;
  var _id          = locals.id          || ('chatbox-' + Math.random().toString(36).slice(2, 9));
  var _className   = locals.className   || '';

  var panelHeightClass = _minimised ? 'h-14' : 'h-[480px]';
%>
<div id="<%= _id %>"
     class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3<%= _className ? ' ' + _className : '' %>"
     role="region"
     aria-label="Chat support"
     data-chatbox>

  <!-- Chat panel -->
  <div id="<%= _id %>-panel"
       class="w-80 sm:w-96 rounded-2xl shadow-2xl border border-border overflow-hidden bg-surface-base flex flex-col transition-all duration-200 <%= panelHeightClass %><%= _open ? '' : ' hidden' %>"
       aria-live="polite"
       data-chatbox-panel>

    <!-- Header -->
    <div class="flex items-center gap-3 px-4 py-3 bg-primary text-primary-fg flex-shrink-0">
      <div class="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
        <i class="fa-solid fa-robot w-4 h-4" aria-hidden="true"></i>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold leading-tight truncate"><%= _title %></p>
        <p class="text-xs text-primary-fg/70 truncate<%= _minimised ? ' hidden' : '' %>"
           data-chatbox-subtitle><%= _subtitle %></p>
      </div>
      <button type="button"
              aria-label="Minimise chat"
              data-chatbox-minimise
              class="flex items-center justify-center w-7 h-7 rounded-full hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
        <i class="fa-solid fa-minus w-3 h-3" aria-hidden="true"></i>
      </button>
      <button type="button"
              aria-label="Close chat"
              data-chatbox-close
              class="flex items-center justify-center w-7 h-7 rounded-full hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
        <i class="fa-solid fa-xmark w-3 h-3" aria-hidden="true"></i>
      </button>
    </div>

    <div class="flex-1 flex flex-col min-h-0<%= _minimised ? ' hidden' : '' %>"
         data-chatbox-body>

      <!-- Messages -->
      <div id="<%= _id %>-list"
           class="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 scroll-smooth"
           data-chatbox-list>
        <% if (_messages.length === 0) { %>
        <div class="flex flex-col items-center justify-center h-full gap-2 text-text-secondary"
             data-chatbox-empty>
          <i class="fa-solid fa-comment-dots w-8 h-8 opacity-30" aria-hidden="true"></i>
          <p class="text-sm">Start the conversation</p>
        </div>
        <% } %>
        <% _messages.forEach(function(msg) {
          var isUser = msg.role === 'user';
          var rowClass = 'flex gap-2 items-end ' + (isUser ? 'flex-row-reverse' : 'flex-row');
          var avatarClass = 'flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-xs ' +
                            (isUser ? 'bg-primary text-primary-fg' : 'bg-surface-overlay text-text-secondary');
          var colClass = 'max-w-[75%] flex flex-col gap-0.5 ' + (isUser ? 'items-end' : 'items-start');
          var bubbleClass = 'px-3 py-2 rounded-2xl text-sm leading-snug ' +
                            (isUser
                              ? 'bg-primary text-primary-fg rounded-br-sm'
                              : 'bg-surface-raised border border-border text-text-primary rounded-bl-sm');
        %>
        <div class="<%= rowClass %>">
          <div class="<%= avatarClass %>" aria-hidden="true">
            <i class="fa-solid <%= isUser ? 'fa-user' : 'fa-robot' %> w-3 h-3"></i>
          </div>
          <div class="<%= colClass %>">
            <div class="<%= bubbleClass %>"><%= msg.text %></div>
            <% if (msg.timestamp) { %>
            <span class="text-[10px] text-text-disabled px-1"><%= msg.timestamp %></span>
            <% } %>
          </div>
        </div>
        <% }); %>
      </div>

      <!-- Input -->
      <form class="flex-shrink-0 border-t border-border bg-surface-base px-3 py-2 flex gap-2 items-end"
            data-chatbox-form
            onsubmit="return false;">
        <textarea data-chatbox-input
                  rows="1"
                  placeholder="<%= _placeholder %>"
                  aria-label="Chat message input"
                  style="height: 38px;"
                  class="flex-1 resize-none rounded-xl border border-border bg-surface-raised px-3 py-2 text-sm text-text-primary placeholder:text-text-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed max-h-28 overflow-y-auto leading-snug"></textarea>
        <button type="submit"
                aria-label="Send message"
                data-chatbox-send
                disabled
                class="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-primary-fg hover:bg-primary-hover active:bg-primary-active transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed">
          <i class="fa-solid fa-paper-plane w-3.5 h-3.5" aria-hidden="true"></i>
        </button>
      </form>
    </div>
  </div>

  <!-- FAB toggle -->
  <button type="button"
          aria-label="<%= _open ? 'Close chat' : 'Open chat' %>"
          aria-expanded="<%= _open ? 'true' : 'false' %>"
          data-chatbox-toggle
          class="relative flex items-center justify-center w-14 h-14 rounded-full shadow-xl bg-primary text-primary-fg hover:bg-primary-hover active:bg-primary-active transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2">
    <i class="fa-solid <%= _open ? 'fa-xmark' : 'fa-comment-dots' %> w-6 h-6"
       aria-hidden="true"
       data-chatbox-fab-icon></i>
    <span class="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-error text-white text-[10px] font-bold hidden"
          data-chatbox-unread>0</span>
  </button>
</div>

<script>
(function () {
  var root = document.getElementById('<%= _id %>');
  if (!root || root.dataset.chatboxInit === '1') return;
  root.dataset.chatboxInit = '1';

  var panel    = root.querySelector('[data-chatbox-panel]');
  var body     = root.querySelector('[data-chatbox-body]');
  var subtitle = root.querySelector('[data-chatbox-subtitle]');
  var listEl   = root.querySelector('[data-chatbox-list]');
  var emptyEl  = root.querySelector('[data-chatbox-empty]');
  var formEl   = root.querySelector('[data-chatbox-form]');
  var inputEl  = root.querySelector('[data-chatbox-input]');
  var sendBtn  = root.querySelector('[data-chatbox-send]');
  var toggle   = root.querySelector('[data-chatbox-toggle]');
  var fabIcon  = root.querySelector('[data-chatbox-fab-icon]');
  var unreadEl = root.querySelector('[data-chatbox-unread]');
  var minBtn   = root.querySelector('[data-chatbox-minimise]');
  var closeBtn = root.querySelector('[data-chatbox-close]');

  var open      = <%= _open ? 'true' : 'false' %>;
  var minimised = <%= _minimised ? 'true' : 'false' %>;
  var loading   = false;
  var unread    = 0;

  function fmtTime(d) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function scrollToBottom() {
    if (listEl) listEl.scrollTop = listEl.scrollHeight;
  }

  function applyOpen() {
    panel.classList.toggle('hidden', !open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close chat' : 'Open chat');
    if (fabIcon) {
      fabIcon.classList.toggle('fa-xmark', open);
      fabIcon.classList.toggle('fa-comment-dots', !open);
    }
    if (open) {
      unread = 0;
      updateUnread();
      setTimeout(function () { if (inputEl) inputEl.focus(); }, 120);
      scrollToBottom();
    }
  }

  function applyMinimised() {
    panel.classList.toggle('h-14', minimised);
    panel.classList.toggle('h-[480px]', !minimised);
    if (body) body.classList.toggle('hidden', minimised);
    if (subtitle) subtitle.classList.toggle('hidden', minimised);
    minBtn.setAttribute('aria-label', minimised ? 'Expand chat' : 'Minimise chat');
  }

  function updateUnread() {
    if (!unreadEl) return;
    if (!open && unread > 0) {
      unreadEl.textContent = unread > 9 ? '9+' : String(unread);
      unreadEl.classList.remove('hidden');
    } else {
      unreadEl.classList.add('hidden');
    }
  }

  function updateSendDisabled() {
    if (!sendBtn || !inputEl) return;
    sendBtn.disabled = loading || !inputEl.value.trim();
  }

  function appendMessage(role, text, ts) {
    if (emptyEl && emptyEl.parentNode) emptyEl.parentNode.removeChild(emptyEl);
    emptyEl = null;
    var isUser = role === 'user';
    var row = document.createElement('div');
    row.className = 'flex gap-2 items-end ' + (isUser ? 'flex-row-reverse' : 'flex-row');

    var avatar = document.createElement('div');
    avatar.className = 'flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-xs ' +
                       (isUser ? 'bg-primary text-primary-fg' : 'bg-surface-overlay text-text-secondary');
    avatar.setAttribute('aria-hidden', 'true');
    var ai = document.createElement('i');
    ai.className = 'fa-solid ' + (isUser ? 'fa-user' : 'fa-robot') + ' w-3 h-3';
    avatar.appendChild(ai);

    var col = document.createElement('div');
    col.className = 'max-w-[75%] flex flex-col gap-0.5 ' + (isUser ? 'items-end' : 'items-start');
    var bubble = document.createElement('div');
    bubble.className = 'px-3 py-2 rounded-2xl text-sm leading-snug ' +
                       (isUser
                         ? 'bg-primary text-primary-fg rounded-br-sm'
                         : 'bg-surface-raised border border-border text-text-primary rounded-bl-sm');
    bubble.textContent = text;
    col.appendChild(bubble);
    if (ts) {
      var t = document.createElement('span');
      t.className = 'text-[10px] text-text-disabled px-1';
      t.textContent = ts;
      col.appendChild(t);
    }

    row.appendChild(avatar);
    row.appendChild(col);
    listEl.appendChild(row);
    scrollToBottom();
  }

  function appendTyping() {
    var row = document.createElement('div');
    row.className = 'flex gap-2 items-end';
    row.dataset.typing = '1';
    row.innerHTML =
      '<div class="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-surface-overlay text-text-secondary">' +
        '<i class="fa-solid fa-robot w-3 h-3" aria-hidden="true"></i>' +
      '</div>' +
      '<div class="bg-surface-raised border border-border rounded-2xl rounded-bl-sm px-3 py-2">' +
        '<span class="flex gap-1 items-center">' +
          '<span class="w-1.5 h-1.5 rounded-full bg-text-disabled animate-bounce" style="animation-delay:0ms"></span>' +
          '<span class="w-1.5 h-1.5 rounded-full bg-text-disabled animate-bounce" style="animation-delay:150ms"></span>' +
          '<span class="w-1.5 h-1.5 rounded-full bg-text-disabled animate-bounce" style="animation-delay:300ms"></span>' +
        '</span>' +
      '</div>';
    listEl.appendChild(row);
    scrollToBottom();
    return row;
  }

  function send() {
    var text = (inputEl.value || '').trim();
    if (!text || loading) return;
    inputEl.value = '';
    inputEl.style.height = '38px';
    updateSendDisabled();

    appendMessage('user', text, fmtTime(new Date()));
    loading = true;
    updateSendDisabled();
    inputEl.disabled = true;
    var typing = appendTyping();

    setTimeout(function () {
      if (typing && typing.parentNode) typing.parentNode.removeChild(typing);
      appendMessage('agent', 'Thanks for your message! We’ll get back to you shortly.', fmtTime(new Date()));
      loading = false;
      inputEl.disabled = false;
      updateSendDisabled();
      if (!open) { unread++; updateUnread(); }
    }, 900);
  }

  toggle.addEventListener('click', function () {
    open = !open;
    if (minimised) minimised = false;
    applyMinimised();
    applyOpen();
  });
  minBtn.addEventListener('click', function () {
    minimised = !minimised;
    applyMinimised();
  });
  closeBtn.addEventListener('click', function () {
    open = false;
    applyOpen();
  });
  formEl.addEventListener('submit', function (e) {
    e.preventDefault();
    send();
  });
  inputEl.addEventListener('input', function () {
    inputEl.style.height = '38px';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 112) + 'px';
    updateSendDisabled();
  });
  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });

  applyMinimised();
  applyOpen();
  scrollToBottom();
})();
</script>

```
