import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/app/CommentThread.ejs'), 'utf-8');

export function buildCommentThreadData(): ShowcaseItem[] {
  return [
    {
      id: 'comment-thread',
      title: 'CommentThread',
      category: 'App',
      abbr: 'CT',
      since: '2026-05',
      description: 'Generic threaded comments with replies, like counts, delete-own actions, and a composer. Domain-agnostic — pass comments + handlers.',
      filePath: 'modules/app/CommentThread.ejs',
      sourceCode,
      variants: [
        {
          title: 'With replies',
          layout: 'stack',
          previewHtml: `<section class="space-y-4 w-full max-w-2xl mx-auto p-4" aria-label="Comments">
  <form class="flex flex-col gap-2">
    <textarea placeholder="Write a comment…" rows="3" class="block w-full rounded-md border border-border bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-disabled resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"></textarea>
    <div class="flex items-center justify-end">
      <button type="button" class="inline-flex items-center justify-center gap-2 rounded-md font-medium bg-primary text-primary-fg hover:bg-primary-hover px-4 py-2 text-sm">
        <i class="fa-solid fa-paper-plane" style="font-size: 0.875rem;" aria-hidden="true"></i>
        Post Comment
      </button>
    </div>
  </form>
  <ul class="space-y-4">
    <li class="flex gap-3">
      <span class="h-8 w-8 rounded-full bg-primary-subtle text-primary font-semibold text-xs flex items-center justify-center shrink-0 border border-primary-subtle">AB</span>
      <div class="flex-1 min-w-0">
        <div class="rounded-lg bg-surface-overlay px-3 py-2">
          <div class="flex items-center justify-between gap-2">
            <span class="text-sm font-semibold text-text-primary truncate">Alice Brooks</span>
            <time class="text-xs text-text-disabled shrink-0">30m</time>
          </div>
          <p class="mt-1 text-sm text-text-primary whitespace-pre-wrap break-words">I think this feature would be great for the landing page.</p>
        </div>
        <div class="mt-1 flex items-center gap-3 px-1 text-xs text-text-secondary">
          <button type="button" class="inline-flex items-center gap-1 text-primary"><i class="fa-solid fa-heart" style="font-size: 0.75rem;" aria-hidden="true"></i><span>4</span></button>
          <button type="button" class="inline-flex items-center gap-1 hover:text-primary"><i class="fa-solid fa-reply" style="font-size: 0.75rem;" aria-hidden="true"></i>Reply</button>
        </div>
        <ul class="mt-3 space-y-3 border-l border-border pl-4">
          <li class="flex gap-3">
            <span class="h-8 w-8 rounded-full bg-primary-subtle text-primary font-semibold text-xs flex items-center justify-center shrink-0 border border-primary-subtle">Y</span>
            <div class="flex-1 min-w-0">
              <div class="rounded-lg bg-surface-overlay px-3 py-2">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-sm font-semibold text-text-primary truncate">You</span>
                  <time class="text-xs text-text-disabled shrink-0">12m</time>
                </div>
                <p class="mt-1 text-sm text-text-primary whitespace-pre-wrap break-words">Agreed. I can open a PR.</p>
              </div>
              <div class="mt-1 flex items-center gap-3 px-1 text-xs text-text-secondary">
                <button type="button" class="inline-flex items-center gap-1 hover:text-primary"><i class="fa-solid fa-heart" style="font-size: 0.75rem;" aria-hidden="true"></i><span>1</span></button>
                <button type="button" class="inline-flex items-center gap-1 hover:text-primary"><i class="fa-solid fa-reply" style="font-size: 0.75rem;" aria-hidden="true"></i>Reply</button>
                <form class="ml-auto"><button type="button" class="inline-flex items-center gap-1 hover:text-error"><i class="fa-solid fa-trash" style="font-size: 0.75rem;" aria-hidden="true"></i>Delete</button></form>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </li>
    <li class="flex gap-3">
      <span class="h-8 w-8 rounded-full bg-primary-subtle text-primary font-semibold text-xs flex items-center justify-center shrink-0 border border-primary-subtle">MR</span>
      <div class="flex-1 min-w-0">
        <div class="rounded-lg bg-surface-overlay px-3 py-2">
          <div class="flex items-center justify-between gap-2">
            <span class="text-sm font-semibold text-text-primary truncate">Marcus Reed</span>
            <time class="text-xs text-text-disabled shrink-0">2h</time>
          </div>
          <p class="mt-1 text-sm text-text-primary whitespace-pre-wrap break-words">The mobile breakpoint should be reviewed as well.</p>
        </div>
        <div class="mt-1 flex items-center gap-3 px-1 text-xs text-text-secondary">
          <button type="button" class="inline-flex items-center gap-1 hover:text-primary"><i class="fa-solid fa-heart" style="font-size: 0.75rem;" aria-hidden="true"></i><span>0</span></button>
          <button type="button" class="inline-flex items-center gap-1 hover:text-primary"><i class="fa-solid fa-reply" style="font-size: 0.75rem;" aria-hidden="true"></i>Reply</button>
        </div>
      </div>
    </li>
  </ul>
</section>`,
          code: `<%- include('modules/app/CommentThread', {
  comments: comments,
  currentUserId: 'me',
  replyAction: '/comments/reply',
  deleteAction: '/comments/delete'
}) %>`,
        },
        {
          title: 'Empty state',
          layout: 'stack',
          previewHtml: `<section class="space-y-4 w-full max-w-2xl mx-auto p-4" aria-label="Comments">
  <form class="flex flex-col gap-2">
    <textarea placeholder="Write a comment…" rows="3" class="block w-full rounded-md border border-border bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-disabled resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"></textarea>
    <div class="flex items-center justify-end">
      <button type="button" class="inline-flex items-center justify-center gap-2 rounded-md font-medium bg-primary text-primary-fg hover:bg-primary-hover px-4 py-2 text-sm">
        <i class="fa-solid fa-paper-plane" style="font-size: 0.875rem;" aria-hidden="true"></i>
        Post Comment
      </button>
    </div>
  </form>
  <p class="rounded-md border border-dashed border-border bg-surface-base px-4 py-6 text-center text-sm text-text-secondary">No comments yet. Be the first to comment.</p>
</section>`,
          code: `<%- include('modules/app/CommentThread', {
  comments: [],
  currentUserId: 'me'
}) %>`,
        },
      ],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['aria-label="Comments"', 'aria-pressed (like)', 'aria-expanded (reply)'],
      },
    },
  ];
}
