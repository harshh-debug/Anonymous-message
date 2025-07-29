'use client';

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Copy, Loader2, RefreshCcw } from "lucide-react";

import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiRespone } from "@/types/ApiRespone";
import { Message } from "@/models/User";
import { User } from "next-auth";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import MessageCard from "@/components/messageCard";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptedMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiRespone>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiRespone>;
      toast.error("Failed to fetch message settings", {
        description: axiosError.response?.data.message,
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiRespone>('/api/get-messages');
      setMessages(response.data.messages || []);
      if (refresh) {
        toast.success("Messages refreshed", {
          description: "Showing latest messages",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiRespone>;
      toast.error("Error fetching messages", {
        description: axiosError.response?.data.message || "Failed to fetch messages",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    fetchAcceptedMessage();
    fetchMessages();
  }, [session, fetchAcceptedMessage, fetchMessages]);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(m => m._id !== messageId));
  };

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiRespone>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiRespone>;
      toast.error("Update failed", {
        description: axiosError.response?.data.message || "Failed to update message settings",
      });
    }
  };

  if (!session?.user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-400">
        Please login to view dashboard
      </div>
    );
  }

  const user = session.user as User;
  if (!user.username) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-400">
        Error: Username not found in session
      </div>
    );
  }

  const profileUrl = `${window.location.origin}/u/${user.username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("URL copied to clipboard", {
      description: "Share this link to receive messages",
    });
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto w-full max-w-6xl space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-white">Message Dashboard</h1>

      {/* Unique Link Section */}
      <div className="p-4 sm:p-6 rounded-xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm space-y-3 sm:space-y-4">
        <h2 className="text-base sm:text-lg font-medium text-gray-300">Your Anonymous Message Link</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full">
          <input
            value={profileUrl}
            disabled
            className="w-full p-2 sm:p-3 rounded-md bg-gray-800 border border-gray-700 text-gray-200 text-xs sm:text-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
          />
          <Button
            onClick={copyToClipboard}
            className="w-full sm:w-auto h-10 sm:h-auto bg-white text-black hover:bg-gray-200 transition-all text-sm"
          >
            <Copy size={16} className="mr-1 sm:mr-2" />
            Copy
          </Button>
        </div>
      </div>

      {/* Accept Messages Switch */}
      <div className="p-4 sm:p-6 rounded-xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Switch
              {...register("acceptMessages")}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
              className="
                h-5 w-9 sm:h-6 sm:w-11
                data-[state=checked]:bg-gray-700 
                data-[state=unchecked]:bg-gray-700
                border border-gray-600
              "
            />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="text-sm sm:text-base text-gray-300">
                Accept Messages:
              </span>
              <span className={`text-sm sm:text-base font-medium ${acceptMessages ? "text-white" : "text-gray-400"}`}>
                {acceptMessages ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
          {isSwitchLoading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => fetchMessages(true)}
          className="h-9 sm:h-10 border-gray-700 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white text-sm"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <RefreshCcw size={16} />
              <span>Refresh</span>
            </div>
          )}
        </Button>
      </div>

      {/* Messages List */}
      <div>
        {messages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {messages.map((message) => (
              <MessageCard
                key={message._id}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-6 sm:py-12 rounded-xl bg-gray-900/30 border border-gray-800 backdrop-blur-sm">
            <p className="text-sm sm:text-base text-gray-400">No messages yet</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
              Share your profile link to receive messages
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;