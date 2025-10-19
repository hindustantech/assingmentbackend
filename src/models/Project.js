import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const projectSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['active', 'completed'], 
    default: 'active' 
  },
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
}, {
  timestamps: true // Recommended addition for created/updated dates
});

export default model('Project', projectSchema);