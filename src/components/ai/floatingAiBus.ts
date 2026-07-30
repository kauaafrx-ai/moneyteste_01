/**
 * Tiny pub/sub bus so any screen can open the floating AI chat.
 * - `userText` becomes the visible user message.
 * - `systemContext` is appended silently so the model has extra context
 *   without cluttering the chat with a huge prompt.
 */
type Payload = { userText?: string; systemContext?: string };
type Listener = (payload: Payload) => void;

const listeners = new Set<Listener>();

export function openAiChat(payload: Payload = {}) {
  listeners.forEach((l) => l(payload));
}

export function subscribeAiChat(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
