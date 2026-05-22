import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/domain/common/chat/ChatBox.ejs'), 'utf-8');

// ─── Helpers ──────────────────────────────────────────────────────────────────

type Msg = { role: 'user' | 'agent'; text: string; timestamp?: string };

function bubble(msg: Msg): string {
  const isUser = msg.role === 'user';
  const rowClass = 'flex gap-2 items-end ' + (isUser ? 'flex-row-reverse' : 'flex-row');
  const avatarClass =
    'flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-xs ' +
    (isUser ? 'bg-primary text-primary-fg' : 'bg-surface-overlay text-text-secondary');
  const colClass = 'max-w-[75%] flex flex-col gap-0.5 ' + (isUser ? 'items-end' : 'items-start');
  const bubbleClass =
    'px-3 py-2 rounded-2xl text-sm leading-snug ' +
    (isUser
      ? 'bg-primary text-primary-fg rounded-br-sm'
      : 'bg-surface-raised border border-border text-text-primary rounded-bl-sm');
  return `<div class="${rowClass}">
    <div class="${avatarClass}" aria-hidden="true">
      <i class="fa-solid ${isUser ? 'fa-user' : 'fa-robot'} w-3 h-3"></i>
    </div>
    <div class="${colClass}">
      <div class="${bubbleClass}">${msg.text}</div>
      ${msg.timestamp ? `<span class="text-[10px] text-text-disabled px-1">${msg.timestamp}</span>` : ''}
    </div>
  </div>`;
}

function chatPanel(opts: {
  title?: string;
  subtitle?: string;
  messages: Msg[];
  showEmpty?: boolean;
}): string {
  const title = opts.title || 'Support Chat';
  const subtitle = opts.subtitle || 'We typically reply in a few minutes';
  return `<div class="w-80 sm:w-96 rounded-2xl shadow-2xl border border-border overflow-hidden bg-surface-base flex flex-col h-[480px]">
    <div class="flex items-center gap-3 px-4 py-3 bg-primary text-primary-fg flex-shrink-0">
      <div class="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
        <i class="fa-solid fa-robot w-4 h-4" aria-hidden="true"></i>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold leading-tight truncate">${title}</p>
        <p class="text-xs text-primary-fg/70 truncate">${subtitle}</p>
      </div>
      <button type="button" aria-label="Minimise chat" class="flex items-center justify-center w-7 h-7 rounded-full hover:bg-white/20">
        <i class="fa-solid fa-minus w-3 h-3" aria-hidden="true"></i>
      </button>
      <button type="button" aria-label="Close chat" class="flex items-center justify-center w-7 h-7 rounded-full hover:bg-white/20">
        <i class="fa-solid fa-xmark w-3 h-3" aria-hidden="true"></i>
      </button>
    </div>
    <div class="flex-1 flex flex-col min-h-0">
      <div class="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 scroll-smooth">
        ${opts.showEmpty ? `<div class="flex flex-col items-center justify-center h-full gap-2 text-text-secondary">
          <i class="fa-solid fa-comment-dots w-8 h-8 opacity-30" aria-hidden="true"></i>
          <p class="text-sm">Start the conversation</p>
        </div>` : opts.messages.map(bubble).join('')}
      </div>
      <form class="flex-shrink-0 border-t border-border bg-surface-base px-3 py-2 flex gap-2 items-end" onsubmit="return false;">
        <textarea rows="1" placeholder="Type a message…" aria-label="Chat message input" style="height: 38px;"
          class="flex-1 resize-none rounded-xl border border-border bg-surface-raised px-3 py-2 text-sm text-text-primary placeholder:text-text-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus max-h-28 overflow-y-auto leading-snug"></textarea>
        <button type="submit" aria-label="Send message" disabled
          class="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-primary-fg disabled:opacity-50 disabled:cursor-not-allowed">
          <i class="fa-solid fa-paper-plane w-3.5 h-3.5" aria-hidden="true"></i>
        </button>
      </form>
    </div>
  </div>`;
}

function chatFab(open: boolean): string {
  return `<button type="button" aria-label="${open ? 'Close chat' : 'Open chat'}" aria-expanded="${open ? 'true' : 'false'}"
    class="relative flex items-center justify-center w-14 h-14 rounded-full shadow-xl bg-primary text-primary-fg hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2">
    <i class="fa-solid ${open ? 'fa-xmark' : 'fa-comment-dots'} w-6 h-6" aria-hidden="true"></i>
  </button>`;
}

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildDomainCommonChatBoxData(): ShowcaseItem[] {
  return [
    {
      id: 'chat-box',
      title: 'ChatBox',
      category: 'Domain',
      abbr: 'CB2',
      status: 'beta',
      description: 'Floating chat widget that anchors to the bottom-right of the screen. Includes a FAB toggle, collapsible panel, scrollable message list with typing indicator, and an auto-growing textarea input.',
      filePath: 'modules/domain/common/chat/ChatBox.ejs',
      sourceCode,
      variants: [
        {
          title: 'With initial messages',
          previewHtml: `<div class="w-full p-6 flex flex-col items-end gap-3 bg-surface-overlay rounded-xl">
  ${chatPanel({
    messages: [
      { role: 'agent', text: 'Hi there! How can I help you today?', timestamp: '10:02' },
      { role: 'user',  text: 'I have a question about my order.', timestamp: '10:03' },
    ],
  })}
  ${chatFab(true)}
</div>`,
          code: `<%- include('modules/domain/common/chat/ChatBox', {
  open: true,
  title: 'Support Chat',
  subtitle: 'We typically reply in a few minutes',
  messages: [
    { id: 'm1', role: 'agent', text: 'Hi there! How can I help you today?' },
    { id: 'm2', role: 'user',  text: 'I have a question about my order.' }
  ]
}) %>`,
          layout: 'stack',
        },
        {
          title: 'Empty / initial state',
          previewHtml: `<div class="w-full p-6 flex flex-col items-end gap-3 bg-surface-overlay rounded-xl">
  ${chatPanel({ title: 'Sales Chat', subtitle: 'Ask us anything', messages: [], showEmpty: true })}
  ${chatFab(true)}
</div>`,
          code: `<%- include('modules/domain/common/chat/ChatBox', {
  open: true,
  title: 'Sales Chat',
  subtitle: 'Ask us anything',
  messages: []
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
