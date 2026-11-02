"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Loader2,
  CheckSquare,
  Square,
  FileQuestion,
  TrendingUp,
  ShieldCheck,
  Compass,
  AlertCircle,
  User,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AiChatViewProps {
  userPlanName?: string;
  dailyQuotaLeft?: number;
  initialPrompt?: string;
}

export function AiChatView({
  userPlanName = "Researcher",
  dailyQuotaLeft = 30,
  initialPrompt = "",
}: AiChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(initialPrompt);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [includeProjectSummary, setIncludeProjectSummary] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setErrorMsg("");
    setInput("");

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          includeProjectSummary,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Gagal menghubungi Bedah AI.");
      }

      if (!res.body) {
        throw new Error("Tidak ada stream respons dari server.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, assistantMsg]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantMsg.content += chunk;

        setMessages((prev) =>
          prev.map((m) => (m.id === assistantMsg.id ? { ...assistantMsg } : m))
        );
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat memproses jawaban.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Default Prompt Chips
  const promptChips = [
    {
      title: "Metode apa yang tepat untuk penelitian saya?",
      desc: "Diskusi uji statistik berdasarkan tipe variabel dan hipotesis.",
      icon: Compass,
    },
    {
      title: "Apa perbedaan korelasi dan regresi?",
      desc: "Pelajari perbedaan hubungan vs sebab-akibat dengan analogi.",
      icon: TrendingUp,
    },
    {
      title: "Bagaimana memeriksa asumsi analisis?",
      desc: "Prasyarat normalitas, heteroskedastisitas, dan multikolinearitas.",
      icon: ShieldCheck,
    },
    {
      title: "Bantu saya merumuskan hipotesis.",
      desc: "Susun H0 dan Ha yang terukur dan siap diuji secara statistik.",
      icon: FileQuestion,
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-4xl mx-auto bg-white rounded-3xl border border-[#e9edf3] shadow-[0_4px_25px_rgba(36,49,73,0.04)] overflow-hidden">
      {/* 1. Header Bar */}
      <div className="px-6 py-4 border-b border-[#f0f3f8] flex items-center justify-between shrink-0 bg-[#fafcff]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#edf5ff] text-[#3984f5] flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-[#243149]">Bedah AI</h2>
              <span className="text-[11px] font-bold text-[#3984f5] bg-[#edf5ff] border border-[#d6e6fe] px-2.5 py-0.5 rounded-full">
                Methodology Advisor
              </span>
            </div>
            <p className="text-[12px] text-[#738196]">
              Partner diskusi metodologi dan interpretasi hasil riset Anda.
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <div className="text-[11px] font-semibold text-[#57667c]">Paket {userPlanName}</div>
          <div className="text-[11px] text-[#16a34a] font-medium flex items-center gap-1 justify-end">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
            <span>Fair-Use Unlimited</span>
          </div>
        </div>
      </div>

      {/* 2. Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          /* Welcome Screen with 4 Prompt Chips */
          <div className="h-full flex flex-col justify-center items-center text-center max-w-xl mx-auto py-4">
            <div className="w-14 h-14 rounded-3xl bg-[#edf5ff] text-[#3984f5] flex items-center justify-center mb-4 shadow-sm">
              <Sparkles className="w-7 h-7" />
            </div>

            <span className="text-[10.5px] font-bold tracking-[0.18em] text-[#3984f5] uppercase mb-1">
              TEMAN BERPIKIR, BUKAN PENGGANTI PENELITI
            </span>
            <h3 className="text-2xl font-extrabold text-[#243149] mb-2">
              Setiap riset dimulai dari pertanyaan yang baik.
            </h3>
            <p className="text-[13.5px] text-[#57667c] leading-relaxed mb-8">
              Tanyakan apa pun seputar metodologi penelitian, pemilihan uji statistik, maupun interpretasi
              makna akademik dari data Anda.
            </p>

            {/* 4 Prompt Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
              {promptChips.map((chip) => {
                const Icon = chip.icon;
                return (
                  <button
                    key={chip.title}
                    type="button"
                    onClick={() => sendMessage(chip.title)}
                    className="p-4 rounded-2xl border border-[#e8edf5] bg-[#fafcff] hover:bg-[#f0f6ff] hover:border-[#3984f5] transition-all group flex items-start gap-3 text-left cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-white border border-[#e4ebf5] text-[#3984f5] flex items-center justify-center shrink-0 group-hover:bg-[#3984f5] group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-[#243149] leading-snug group-hover:text-[#3984f5] transition-colors">
                        {chip.title}
                      </h4>
                      <p className="text-[11px] text-[#738196] leading-tight mt-1">
                        {chip.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Chat History Stream */
          messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser
                      ? "bg-[#3984f5] text-white"
                      : "bg-[#edf5ff] text-[#3984f5] border border-[#d6e6fe]"
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-[13.5px] leading-relaxed shadow-sm whitespace-pre-wrap ${
                    isUser
                      ? "bg-[#3984f5] text-white font-medium rounded-tr-none"
                      : "bg-[#f8faff] text-[#243149] border border-[#e9edf3] rounded-tl-none font-normal"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#edf5ff] text-[#3984f5] border border-[#d6e6fe] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-[#f8faff] text-[#57667c] border border-[#e9edf3] rounded-2xl rounded-tl-none px-4 py-3 text-xs flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#3984f5]" />
              <span>Bedah AI sedang merumuskan saran metodologi...</span>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Input & Footer Area */}
      <div className="p-4 border-t border-[#f0f3f8] bg-[#fafcff] space-y-2.5">
        {/* Project Context Toggle */}
        <div className="flex items-center justify-between text-[11.5px] text-[#57667c] px-1">
          <button
            type="button"
            onClick={() => setIncludeProjectSummary(!includeProjectSummary)}
            className="flex items-center gap-2 hover:text-[#243149] cursor-pointer font-medium"
          >
            {includeProjectSummary ? (
              <CheckSquare className="w-4 h-4 text-[#3984f5]" />
            ) : (
              <Square className="w-4 h-4 text-[#94a3b8]" />
            )}
            <span>Sertakan ringkasan proyek aktif ke dalam konteks AI</span>
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Apa yang ingin Anda teliti hari ini?"
            disabled={isLoading}
            className="w-full pl-5 pr-14 py-3 text-[14px] text-[#243149] placeholder:text-[#94a3b8] rounded-2xl border border-[#dce5f2] bg-white focus:outline-none focus:ring-2 focus:ring-[#3984f5]/30 focus:border-[#3984f5] transition-all shadow-sm disabled:opacity-70"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-[#3984f5] hover:bg-[#2672df] disabled:bg-[#d8e2ee] text-white rounded-xl transition-all cursor-pointer shadow-sm"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>

        {/* Academic Warning Note */}
        <p className="text-[11px] text-[#92a0b3] text-center pt-1">
          AI dapat keliru. Verifikasi saran metodologi dan hasil bersama dosen pembimbing Anda.
        </p>
      </div>
    </div>
  );
}
