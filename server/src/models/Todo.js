import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tiêu đề không được để trống'],
      trim: true,
      maxlength: [200, 'Tiêu đề tối đa 200 ký tự'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Mô tả tối đa 1000 ký tự'],
      default: '',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Mức ưu tiên phải là: low, medium, high',
      },
      default: 'medium',
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Indexes for common queries
todoSchema.index({ completed: 1, createdAt: -1 });
todoSchema.index({ priority: 1 });
todoSchema.index({ title: 'text' });
todoSchema.index({ dueDate: 1 });

export default mongoose.model('Todo', todoSchema);
