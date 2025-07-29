'use client';
import { useParams, useRouter } from 'next/navigation'
import { toast, Toaster } from "sonner"
import React from 'react'
import { useForm } from 'react-hook-form'
import { verifySchema } from '@/schemas/verifySchema'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { ApiRespone } from '@/types/ApiRespone';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{username: string}>()    
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: "" 
        }
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            });

            toast.success("Success", {
                description: response.data.message,
            })

            router.replace('/sign-in')
        } catch (error) {
            console.error("Error verifying account:", error);
            const axiosError = error as AxiosError<ApiRespone>;            
            let errorMessage = axiosError.response?.data.message ?? 'An error occurred while verifying the account.';
            toast.error("Verification failed", {
                description: errorMessage,
            })
        } finally {
            setIsSubmitting(false)
        }
    } 
    
    return (
        <div className="flex justify-center items-center min-h-screen bg-black px-4 sm:px-6 relative overflow-hidden">
            {/* Background lighting effects */}
            <div className="absolute -top-20 left-1/4 w-80 h-80 bg-gray-800 rounded-full filter blur-[100px] opacity-5"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-800 rounded-full filter blur-[120px] opacity-5"></div>
            
            {/* <Toaster richColors position="top-right" theme="dark" /> */}
            
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 shadow-xl relative z-10">
                <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-2">
                        Verify Your Account
                    </h1>
                    <p className="text-sm sm:text-base text-gray-400">
                        Enter the verification code sent to your email
                    </p>
                </div>
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Verification Code</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field} 
                                            className="bg-gray-800 border-gray-700 text-gray-200 focus:border-gray-500 focus:ring-gray-500/30 hover:border-gray-600"
                                            placeholder="Enter 6-digit code" 
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />
                        
                        <Button 
                            type="submit" 
                            className="w-full bg-white text-black hover:bg-gray-200 transition-all py-2.5 px-4 rounded-md font-medium shadow-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Verifying...
                                </>
                            ) : (
                                "Verify Account"
                            )}
                        </Button>
                    </form>
                </Form>
                
                <div className="text-center">
                    <p className="text-sm text-gray-500">
                        Didn't receive a code?{' '}
                        <button 
                            className="text-white hover:text-gray-300 underline underline-offset-4 transition-colors"
                            onClick={() => toast.info("Feature coming soon")}
                        >
                            Resend code
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default VerifyAccount