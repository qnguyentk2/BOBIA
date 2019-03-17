import mongoose from 'mongoose';
import paginate from '../../utils/mongodb/paginate';
import reIndex from '../../utils/mongodb/reindex';
import { autoIncrement } from 'mongoose-plugin-autoinc';
import Enum from './enum';

const commentSchema = mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    parentId: { type: Number, default: 0 },
    content: { type: String, required: true, index: 'text' },
    subjectId: { type: Number, required: true },
    type: {
      type: String,
      enum: ['BOOK', 'CHAPTER', 'BLOG'],
      required: true
    },
    user: { type: Number, required: true },
    partnership: {
      type: String,
      enum: Enum.EnumPartnership.DEFAULT,
      default: Enum.EnumPartnership.PUBLIC
    },
    likeCount: { type: Number, default: 0 },
    isDel: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

commentSchema.plugin(autoIncrement, {
  model: 'comment',
  field: 'id',
  startAt: 1
});

commentSchema.virtual('book', {
  ref: 'book',
  localField: 'subjectId',
  foreignField: 'id',
  justOne: false
});

commentSchema.virtual('chapter', {
  ref: 'chapter',
  localField: 'subjectId',
  foreignField: 'id',
  justOne: false
});

commentSchema.plugin(paginate);

commentSchema.plugin(reIndex, { mongoose });

export default mongoose.model('comment', commentSchema);
