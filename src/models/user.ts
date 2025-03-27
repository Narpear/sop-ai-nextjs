import mongoose, { models, Schema } from "mongoose";

const userSchema = new Schema({
    fname: {
        type: String, 
        required: true,
    }, 
    lname: {
        type: String, 
        required: true,
    }, 
    email: {
        type: String, 
        required: true,
    }, 
    password: {
        type: String, 
        required: true,
    },
}, {timestamps: true}
);

const User = models.User || mongoose.model("User", userSchema);
export default User;