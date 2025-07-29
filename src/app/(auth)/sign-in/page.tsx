'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link";
import { toast, Toaster } from "sonner"
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";

const Page = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    
    if(result?.error) {
      toast.error("Login failed", {
        description: result.error,
      });
    }
    
    if(result?.url){
      router.replace('/dashboard');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black px-4 sm:px-6 relative overflow-hidden">
      {/* Background lighting effects */}
      <div className="absolute -top-20 left-1/4 w-80 h-80 bg-gray-800 rounded-full filter blur-[100px] opacity-5"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-800 rounded-full filter blur-[120px] opacity-5"></div>
      
      {/* <Toaster richColors position="top-right" theme="dark" /> */}
      
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 shadow-xl relative z-10">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Sign in to continue your anonymous journey
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Email/Username</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-gray-800 border-gray-700 text-gray-200 focus:border-gray-500 focus:ring-gray-500/30 hover:border-gray-600"
                      placeholder="email/username" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      {...field} 
                      className="bg-gray-800 border-gray-700 text-gray-200 focus:border-gray-500 focus:ring-gray-500/30 hover:border-gray-600"
                      placeholder="password" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-white text-black hover:bg-gray-200 transition-all py-2.5 px-4 rounded-md font-medium shadow-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Not a member yet?{' '}
            <Link 
              href="/sign-up" 
              className="text-white hover:text-gray-300 underline underline-offset-4 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;