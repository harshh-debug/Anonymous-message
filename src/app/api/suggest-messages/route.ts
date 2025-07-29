import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    // Generate content with streaming using the correct API
    const response = await ai.models.generateContentStream({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
    });

    // Create a readable stream for the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const chunkText = chunk.text;
            if (chunkText) {
              // Encode the text chunk as Uint8Array
              const encodedChunk = new TextEncoder().encode(chunkText);
              controller.enqueue(encodedChunk);
            }
          }
          controller.close();
        } catch (streamError: unknown) {
          console.error('Stream error:', streamError);
          controller.error(streamError);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: unknown) {
    console.error('An unexpected error occurred:', error);
    
    // Handle different types of errors
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}