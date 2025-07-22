import mongoose from "mongoose";

type connectionObject={
    isconnected?:number
}

const connection:connectionObject={}

async function dbconnect():Promise<void> {
    if(connection.isconnected){
        console.log("Already connected to database")
        return
    }

    try{
       const db= await mongoose.connect(process.env.MONGODB_URL || '',{})

       connection.isconnected=db.connections[0].readyState

       console.log("DB connected succesfully")
    }
    catch(err){
        console.log("Database connection failed",err)
        process.exit(1)
    }
}

export default dbconnect;