import mongoose from "mongoose";

import isEmail from "validator/lib/isEmail.js"

const userSchema = new mongoose.Schema ({
    name: { type: String,
           required: true,
          },
    email: {    type: String,
                required: true,
                unique: true,
                lowercase: true,
                validate: {
                    validator: isEmail,
                    message: "Invalid email format",
                },
        },
    password: { type:String, 
                required: true,
                minlength: 6,
        },
},
{timestamps: true,
 versionKey: false,   
}
);
export const User = mongoose.model("User", userSchema);