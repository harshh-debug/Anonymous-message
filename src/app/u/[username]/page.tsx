'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner"
import * as z from 'zod';
import { ApiRespone } from '@/types/ApiRespone';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

function useGeminiCompletion(apiUrl: string, initialCompletion: string = '') {
  const [completion, setCompletion] = useState(initialCompletion);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const complete = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    setCompletion('');
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      let accumulatedText = '';
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        accumulatedText += chunk;
        setCompletion(accumulatedText);
      }
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      console.error('Error in completion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    complete,
    completion,
    isLoading,
    error,
  };
}

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useGeminiCompletion('/api/suggest-messages', initialMessageString);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiRespone>('/api/send-message', {
        ...data,
        username,
      });

      toast.success(response.data.message);
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiRespone>;
      toast.error('Failed to send message', {
         description: axiosError.response?.data.message ?? 'Please try again later',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      await complete('');
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-gray-900/50 rounded-lg border border-gray-800 max-w-4xl backdrop-blur-sm">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">
        Send Anonymous Message
      </h1>
      
      <div className="mb-6 text-center text-gray-400">
        Sending to: <span className="text-white font-medium">@{username}</span>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Your Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none bg-gray-800 border-gray-700 text-gray-200 focus:border-gray-500 focus:ring-gray-500/30 min-h-[120px] hover:border-gray-600"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled className="w-full max-w-xs bg-gray-800">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={isLoading || !messageContent}
                className="w-full max-w-xs bg-white text-black hover:bg-gray-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                Send Anonymously
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2 text-center">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
            disabled={isSuggestLoading}
          >
            {isSuggestLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Suggest Messages
          </Button>
          <p className="text-gray-500 text-sm">Click on any message below to select it</p>
        </div>
        
        <Card className="bg-gray-900/40 border border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-300">Suggested Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-3">
            {error ? (
              <p className="text-red-400">{error.message}</p>
            ) : (
              parseStringMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2 text-left justify-start bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-white text-gray-300"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      
      <Separator className="my-6 bg-gray-800" />
      
      <div className="text-center">
        <div className="mb-4 text-gray-400">Get Your Own Message Board</div>
        <Link href={'/sign-up'}>
          <Button className="bg-white text-black hover:bg-gray-200">
            Create Your Account
          </Button>
        </Link>
      </div>
    </div>
  );
}