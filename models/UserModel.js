const { default: mongoose } = require("mongoose");
const Counter = require("./CounterModel");

const UserSchema = new mongoose.Schema({
  _id: {
    type: Number,
  },
  fullName: {
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

  activeAccessToken: {
    type: String,
    required: false,
  },
  refreshToken: {
    type: String,
    required: false,
  },
  facebook: {
    pageId: {
      type: String,
      required: false,
    },
    token: {
      type: String,
      required: false,
    },
  },
  instagram: {
    userId: {
      type: String,
      required: false,
    },
    token: {
      type: String,
      required: false,
    },
  },
  linkedin: {
    userId: {
      type: String,
      required: false,
    },
    token: {
      type: String,
      required: false,
    },
  },
  twitter: {
    type: String,
    required: false,
  },
});

UserSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { model: "users" }, // Match the model name
        { $inc: { count: 1 } }, // Increment counter
        { new: true, upsert: true } // Create if not exists
      );
      // Format the counter with zero-padding
      this._id = counter.count; // Always 5 digits
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const User = mongoose.model("user", UserSchema);
module.exports = User;
