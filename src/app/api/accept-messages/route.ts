import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbconnect from "@/lib/dbconnect";
import UserModel from "@/models/User";
import {User} from "next-auth"


export async function POST(request: Request) {
    await dbconnect();

    const session = await getServerSession(authOptions)
    const user:User = session?.user as User
    if(!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 }
        );
    }
    const userId= user._id;

    const {acceptMessages} = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessages: acceptMessages},
            { new: true }
        )

        if(!updatedUser) {
            return Response.json({
                success: false,
                message: "failed to update user status to accept messages"
            }, { status: 404 });
        }
        return Response.json({
            success: true,
            message: "Message accepting status updated successfully",
            updatedUser
        }, { status: 200 });
        
    } catch (error) {
        console.log("failed to update user status to accept messages", error);
        return Response.json({
            success: false,
            message: "failed to update user status to accept messages"
        }, { status: 500 });
        
    }
}

export async function GET(request: Request) {
    await dbconnect();

    const session = await getServerSession(authOptions)
    if(!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 }
        );
    }
    const user:User = session?.user as User
    const userId= user._id;
    
    try {
        const foundUser=await UserModel.findById(userId)
        if(!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }
        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessages
        }, { status: 200 });
        
    } catch (error) {
        console.log("Error in fetching user status to accept messages", error);
        return Response.json({
            success: false,
            message: "Error in fetching user status to accept messages"
        }, { status: 500 });
    
}
    
}

// In the GET method of accept-messages route
// export async function GET(request: Request) {
//     await dbconnect();

//     const session = await getServerSession(authOptions)
//     if(!session || !session.user) {
//         return Response.json({
//             success: false,
//             message: "Not authenticated"
//         }, { status: 401 }
//         );
//     }
//     const user: User = session?.user as User
    
//     // 🔍 ADD THESE DEBUG LOGS
//     console.log("🔍 [Accept-Messages] Raw user.id:", user.id);
//     console.log("🔍 [Accept-Messages] Type:", typeof user.id);
    
//     const userId = user.id;
    
//     try {
//         const foundUser = await UserModel.findById(userId)
//         console.log("🔍 [Accept-Messages] Found user:", foundUser ? "Yes" : "No");
        
//         if(!foundUser) {
//             return Response.json({
//                 success: false,
//                 message: "User not found"
//             }, { status: 404 });
//         }
//         return Response.json({
//             success: true,
//             isAcceptingMessages: foundUser.isAcceptingMessages
//         }, { status: 200 });
        
//     } catch (error) {
//         console.log("Error in fetching user status to accept messages", error);
//         return Response.json({
//             success: false,
//             message: "Error in fetching user status to accept messages"
//         }, { status: 500 });
//     }
// }