'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from 'usehooks-ts'
import { toast, Toaster } from "sonner"
import { signUpSchema } from '@/schemas/signUpSchema';
import axios, {AxiosError} from "axios";
import { ApiRespone } from "@/types/ApiRespone";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

const Page = () => {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 500);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username){
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          const response= await axios.get(`/api/check-username-unique?username=${username}`); 
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiRespone>;
          setUsernameMessage(
            axiosError.response?.data.message ?? 'An error occurred while checking username uniqueness.'
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);
  
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiRespone>('/api/sign-up', data);
      toast.success("Success", {
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      console.error("Error during sign up:", error);
      const axiosError = error as AxiosError<ApiRespone>;
      let errorMessage = axiosError.response?.data.message || 'An error occurred during sign up.';
      toast.error("Sign Up failed", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
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
            Join True Feedback
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Sign up to start your anonymous adventure
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        className="bg-gray-800 border-gray-700 text-gray-200 focus:border-gray-500 focus:ring-gray-500/30 hover:border-gray-600"
                        placeholder="Username"
                        onChange={(e) => {
                          field.onChange(e);
                          debounced(e.target.value);
                        }}
                      />
                      {isCheckingUsername && (
                        <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-gray-400" />
                      )}
                    </div>
                  </FormControl>
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === 'Username is available'
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Email</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-gray-800 border-gray-700 text-gray-200 focus:border-gray-500 focus:ring-gray-500/30 hover:border-gray-600"
                      placeholder="Email" 
                    />
                  </FormControl>
                  <p className="text-gray-500 text-sm mt-1">
                    We will send you a verification code
                  </p>
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
                      placeholder="Password" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-white text-black hover:bg-gray-200 transition-all py-2.5 px-4 rounded-md font-medium shadow-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              disabled={isSubmitting || isCheckingUsername}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Already a member?{' '}
            <Link 
              href="/sign-in" 
              className="text-white hover:text-gray-300 underline underline-offset-4 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;