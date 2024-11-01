import mongoose from "mongoose";
import crypto, { createHmac, randomBytes } from "crypto"; // Built-in package for password hashing
import authService from "../services/authService.js";

// User Schema
const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        secret: {
            type: String,
        },

        profileImageURL: {
            type: String,
            default: "/images/defaultUserAvatar.png",
        },

        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER",
        },
    },
    { timestamps: true }
);

// Here, .pre() is a middleware function that executes before the document is saved to the MongoDB database.
// And we are going to use this `.pre()` middleware to hash user password.
userSchema.pre("save", function (next) {
    // here, `this` is pointing to the current user.
    const user = this;
    if (!user.isModified("password")) {
        return;
    }

    const secret = randomBytes(16).toString(); // generating random string of length 16
    const hashedPassword = createHmac("sha256", secret)
        .update(this.password)
        .digest("hex");

    this.secret = secret;
    this.password = hashedPassword;
    next(); // Call next to proceed with saving the document
});

// We can also attach a static function to the `schema`, which allows us to directly call the `static` function using the model.

// Here, `matchPassword` is a function name.
userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) {
        throw new Error("User not found!!")
    }

    const secret = user.secret;
    const validHashedPassword = user.password;

    const hashedPassword = createHmac("sha256", secret)
        .update(password)
        .digest("hex");

    if (hashedPassword !== validHashedPassword) {
        throw new Error("Invalid Password!!")
    }

    const token = authService.generateToken(user);
    return token;
});

// User Model
const UserModel = mongoose.model("User", userSchema);

// Export User Model.
export default UserModel;
