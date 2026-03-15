"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import type { DirectMessage } from "@/lib/api/types";
import { sendMessage } from "./actions";

type Props = {
  partnerUserId: string;
  myUserId: string;
  initialMessages: DirectMessage[];
};

export function MessageThread({ partnerUserId, myUserId, initialMessages }: Props) {
  const [messages, setMessages] = useState<DirectMessage[]>(initialMessages);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 初回・メッセージ追加時に最下部へスクロール
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const content = inputRef.current?.value.trim();
    if (!content) return;

    startTransition(async () => {
      const msg = await sendMessage(partnerUserId, content).catch(() => null);
      if (msg) {
        setMessages((prev) => [...prev, msg]);
        if (inputRef.current) inputRef.current.value = "";
      }
    });
  }

  return (
    <div className="flex flex-col" style={{ height: "calc(100dvh - 56px)" }}>
      {/* メッセージ一覧 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {messages.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">
            メッセージを送ってみましょう
          </p>
        )}
        {messages.map((msg) => {
          const isMine = msg.senderId === myUserId;
          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                  isMine
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* 入力フォーム */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t bg-white px-4 py-3"
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="メッセージを入力..."
          className="flex-1 rounded-full border bg-gray-50 px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-400"
          disabled={isPending}
        />
        <button
          type="submit"
          disabled={isPending}
          className="text-sm font-semibold text-blue-500 disabled:opacity-40"
        >
          送信
        </button>
      </form>
    </div>
  );
}
