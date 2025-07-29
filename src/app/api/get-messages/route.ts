import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbconnect from "@/lib/dbconnect";
import UserModel from "@/models/User";
import {User} from "next-auth"
import mongoose, { mongo } from "mongoose";

export async function GET(request: Request) {
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
    const userId= new mongoose.Types.ObjectId(user._id);
    try {
        const user= await UserModel.aggregate([
            { $match: { _id: userId } }, // ✅ Fixed: Changed from 'id' to '_id'
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            { $group: {_id: "$_id", messages: { $push: "$messages" } } },
        ])

        if(!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "Invalid user or no messages found"
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            messages: user[0].messages
        }, { status: 200 });
        
    } catch (error) {
        console.error("Failed to fetch messages", error);
        return Response.json({
            success: false,
            message: "Failed to fetch messages"
        }, { status: 500 });
    }
}

// export async function GET(request: Request) {
//     await dbconnect();

//     const session = await getServerSession(authOptions)
//     const user: User = session?.user as User

//     if(!session || !session.user) {
//         return Response.json({
//             success: false,
//             message: "Not authenticated"
//         }, { status: 401 }
//         );
//     }
    
//     // 🔍 DEBUG LOGS - Add these
//     console.log("🔍 Raw user.id from session:", user.id);
//     console.log("🔍 Type of user.id:", typeof user.id);
    
//     const userId = new mongoose.Types.ObjectId(user.id);
//     console.log("🔍 Converted ObjectId:", userId);
    
//     try {
//         // 🔍 Let's also try to find the user directly first
//         const directFind = await UserModel.findById(userId);
//         console.log("🔍 Direct findById result:", directFind ? "Found" : "Not found");
        
//         // 🔍 Let's also check what users exist
//         const allUsers = await UserModel.find({}).select('_id username email');
//         console.log("🔍 All users in DB:", allUsers);

//         const user = await UserModel.aggregate([
//             { $match: { _id: userId } },
//             { $unwind: "$messages" },
//             { $sort: { "messages.createdAt": -1 } },
//             { $group: {_id: "$_id", messages: { $push: "$messages" } } },
//         ])

//         console.log("🔍 Aggregation result:", user);

//         if(!user || user.length === 0) {
//             return Response.json({
//                 success: false,
//                 message: "Invalid user or no messages found"
//             }, { status: 404 });
//         }

//         return Response.json({
//             success: true,
//             messages: user[0].messages
//         }, { status: 200 });
        
//     } catch (error) {
//         console.error("Failed to fetch messages", error);
//         return Response.json({
//             success: false,
//             message: "Failed to fetch messages"
//         }, { status: 500 });
//     }
// }