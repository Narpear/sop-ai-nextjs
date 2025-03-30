import mongoose, { models, Schema } from "mongoose";

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
});

const collegeSchema = new mongoose.Schema({
    collegeName: { type: String },
    application_status: { type: Object},
    questions: [questionSchema], // Array of question objects
});

const userSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    details: {
        fullName: { type: String },
        location: { type: String },
        education: { type: String },
        achievements: { type: String },
        subjects: { type: String },
        futureGoals: { type: String },
        impact: { type: String },
        projects: { type: String },
        workExperience: { type: String },
        hobbies: { type: String },
        leadership: { type: String },
        competitions: { type: String },
        challenges: { type: String },
        values: { type: String },
        uniqueTraits: { type: String },
        family: { type: String },
        familyInfluence: { type: String },
        inspiration: { type: String },
        traditions: { type: String },
        colleges: { type: String },
        goodFit: { type: String },
        additional: { type: String },
    },
    colleges: [collegeSchema],
}, { timestamps: true });

// Log when a user is saved
userSchema.pre('save', function(next) {
    console.log("User Model: Saving user:", this);
    next();
});

const User = models.User || mongoose.model("User", userSchema);
export default User;