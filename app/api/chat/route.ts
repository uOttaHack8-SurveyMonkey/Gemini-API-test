// app/api/chat/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    // 1. Lấy dữ liệu từ client gửi lên
    const { message } = await req.json();

    // 2. Khởi tạo Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Thiếu API Key" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Sử dụng model gemini-1.5-flash cho nhanh và rẻ, hoặc gemini-1.5-pro để thông minh hơn
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 3. Gửi tin nhắn đến Gemini
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    // 4. Trả kết quả về cho client
    return NextResponse.json({ text });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi khi gọi Gemini" }, { status: 500 });
  }
}
