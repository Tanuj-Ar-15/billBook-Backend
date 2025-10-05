const mongoose = require( "mongoose" )



const connectMongo = async  ()=> {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongo DB Connection successfull!");
        
    } catch (error) {
        console.log("Error in mongo connection" , error);
        
    }
}

connectMongo()