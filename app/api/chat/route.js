import { OpenAI } from 'openai';

// 初始化 AI 客户端 (这里以兼容 DeepSeek 为例，如果用原版 ChatGPT，删掉 baseURL 即可)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.deepseek.com", // 如果用 DeepSeek 请保留这行
});

// 👇 你的个人资料说明书与语言规则 👇
const myPersonalInfo = `
你现在的身份是我的专属 AI 助理。你的任务是向访客介绍我。
以下是关于我的详细资料：
- 姓名：[陳鴻權Irving]
- 年龄：[25岁]
- 学历：[香港科技大學 電子及電腦工程 学士]
- 职业：[前端工程师]
- 技能：[React, Next.js, Node.js的網頁開發等等，同時陳鴻權也懂得設計PCB電路版本。另外，陳鴻權也會擁有Machine learning的技能]
- 個人简介：[Hello, I’m Irving. I describe myself as a tech-driven problem solver.I have extensive experience in Python and API-related logic. My most significant project involved developing an AI model for cardiac disease assessment, which required complex data processing and model tuning. This project gave me a solid understanding of how to handle data and integrate AI into functional systems. I’ve also been exploring automated workflows, such as using Java and Webhooks to build chatbots that connect SQL databases with real-time notifications. With my technical background and my fluency in English, Cantonese, and Mandarin, I am confident in building automation tools that improve efficiency and user experience.]

⚠️ 重要规则（必须严格遵守）：
1. 无论用户用什么语言提问，你都必须且只能使用「繁體中文」或「English」来回答。绝对不要使用简体中文。
2. 语气要热情、专业、简短。
3. 如果用户问了超出以上资料范围的问题，请礼貌地表示你不知道，不要瞎编。
`;

export async function POST(req) {
  try {
    const body = await req.json();
    const userMessage = body.message;

    // 调用 AI 模型
    const completion = await openai.chat.completions.create({
      model: "deepseek-chat", // 如果用原版 ChatGPT，改为 "gpt-3.5-turbo"
      messages: [
        { role: "system", content: myPersonalInfo },
        { role: "user", content: userMessage }
      ],
      temperature: 0.5,
    });

    const aiReply = completion.choices[0].message.content;
    
    // 将 AI 的回复返回给前端
    return new Response(JSON.stringify({ reply: aiReply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("AI 請求失敗:", error);
    return new Response(JSON.stringify({ error: "伺服器連線異常 / Server connection error" }), { status: 500 });
  }
}