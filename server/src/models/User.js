import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['cse', 'non-cse'],
    default: 'cse'
  },
  stream: {
    type: String,
    enum: ['mechanical', 'civil', 'electrical', 'electronics', 'other'],
    default: null
  },
  education: {
    degree: String,
    year: Number,
    institution: String
  },
  resume: {
    uploaded: { type: Boolean, default: false },
    url: String,
    parsed: {
      skills: [String],
      experience: String,
      education: [String],
      summary: String,
      projects: [String],
      certifications: [String]
    }
  },
  preferences: {
    targetCompanies: [String],
    desiredRole: String,
    experience: String
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('User', userSchema);