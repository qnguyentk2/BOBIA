import mongoose from 'mongoose';
import paginate from '../../utils/mongodb/paginate';
import reIndex from '../../utils/mongodb/reindex';
import { autoIncrement } from 'mongoose-plugin-autoinc';

const notificationSchema = mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    type: {
      type: String,
      enum: ['USER', 'BOOK', 'CHAPTER', 'BLOG'],
      required: true
    },
    action: {
      type: String,
      enum: ['CREATE', 'UPDATE', 'DELETE'],
      required: true
    },
    sender: { type: Number, required: true },
    receiver: { type: Number, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    seen: { type: Boolean, required: true, default: false },
    isDel: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

notificationSchema.plugin(autoIncrement, {
  model: 'notification',
  field: 'id',
  startAt: 1
});

notificationSchema.virtual('user', {
  ref: 'user',
  localField: 'receiver',
  foreignField: 'id',
  justOne: false
});

notificationSchema.plugin(paginate);

notificationSchema.plugin(reIndex, { mongoose });

export default mongoose.model('notification', notificationSchema);
