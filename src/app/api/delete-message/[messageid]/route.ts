import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbconnect from "@/lib/dbconnect";
import UserModel from "@/models/User";
import { User } from "next-auth";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ messageid: string }> }
) {
    const { messageid } = await params;
    const messageId = messageid;
    await dbconnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 });
    }

    try {
        const updatedResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        );

        if (updatedResult.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Message not found or already deleted"
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            message: "Message deleted successfully"
        }, { status: 200 });
    } catch (error) {
        console.error("Error deleting message route:", error);
        return Response.json({
            success: false,
            message: "Failed to delete message"
        }, { status: 500 });
    }
}