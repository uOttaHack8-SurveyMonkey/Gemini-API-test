// app/page.tsx
"use client"; // Bắt buộc vì chúng ta dùng useState

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input) return;
    setLoading(true);
    setResponse(""); // Xóa kết quả cũ

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      
      if (data.text) {
        setResponse(data.text);
      } else {
        setResponse("Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch (error) {
      console.error(error);
      setResponse("Lỗi kết nối.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <div className="z-10 w-full max-w-2xl items-center justify-between font-mono text-sm lg:flex-col bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Demo Next.js + Gemini API
        </h1>

        {/* Khu vực hiển thị kết quả */}
        <div className="min-h-[200px] bg-gray-50 p-4 rounded-md border border-gray-200 mb-4 whitespace-pre-wrap">
          {loading ? (
            <span className="animate-pulse text-gray-500">Đang suy nghĩ...</span>
          ) : (
            response || <span className="text-gray-400">Kết quả sẽ hiện ở đây...</span>
          )}
        </div>

        {/* Khu vực nhập liệu */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Hỏi Gemini cái gì đó..."
            className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition"
          >
            {loading ? "..." : "Gửi"}
          </button>
        </div>
      </div>
    </main>
  );
}