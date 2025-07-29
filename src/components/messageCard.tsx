'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X, Clock } from "lucide-react"
import { Message } from "@/models/User"
import axios, { AxiosError } from "axios"
import { ApiRespone } from "@/types/ApiRespone"
import { toast } from "sonner"
import dayjs from "dayjs"

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiRespone>(
        `/api/delete-message/${message._id}`
      );
      toast.success(response.data.message);
      onMessageDelete(String(message._id));
    } catch (error) {
      const axiosError = error as AxiosError<ApiRespone>;
      toast.error('Failed to delete message', {
        description: axiosError.response?.data.message ?? 'Please try again later',
      });
    } 
  };

  return (
    <Card className="bg-gray-900/40 border border-gray-800 hover:border-gray-700 transition-colors group backdrop-blur-sm">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start gap-3">
          <CardTitle className="text-gray-200 font-medium text-base line-clamp-3 group-hover:text-white transition-colors">
            {message.content}
          </CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-800 p-2 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-gray-900 border border-gray-800 backdrop-blur-sm">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">
                  Delete this message?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  This action cannot be undone. The message will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteConfirm}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  Delete Message
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
          <Clock className="w-3 h-3" />
          {dayjs(message.createdAt).format('MMM D, YYYY · h:mm A')}
        </div>
      </CardHeader>
      <CardContent className="p-0"></CardContent>
    </Card>
  )
}

export default MessageCard