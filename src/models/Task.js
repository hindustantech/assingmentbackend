import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const taskSchema = new Schema({
  title: { 
    type: String, 
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: { 
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: { 
    type: String, 
    enum: {
      values: ['todo', 'in-progress', 'done'],
      message: 'Status must be either todo, in-progress, or done'
    }, 
    default: 'todo' 
  },
  dueDate: { 
    type: Date,
    // validate: {
    //   validator: function(date) {
    //     return !date || date > new Date();
    //   },
    //   message: 'Due date must be in the future'
    // }
  },
  project: { 
    type: Schema.Types.ObjectId, 
    ref: 'Project', 
    required: [true, 'Project reference is required'],
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  
});



export default model('Task', taskSchema);