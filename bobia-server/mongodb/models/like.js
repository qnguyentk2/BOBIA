import mongoose from 'mongoose';
import paginate from '../../utils/mongodb/paginate';
import reIndex from '../../utils/mongodb/reindex';
import { autoIncrement } from 'mongoose-plugin-autoinc';

const likeSchema = mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    subjectId: { type: Number, required: true },
    type: {
      type: String,
      enum: ['BOOK', 'CHAPTER', 'COMMENT', 'BLOG'],
      required: true
    },
    user: { type: Number, required: true }
  },
  {
    timestamps: true
  }
);

likeSchema.plugin(autoIncrement, {
  model: 'like',
  field: 'id',
  startAt: 1
});

likeSchema.plugin(paginate);

likeSchema.plugin(reIndex, { mongoose });

export default mongoose.model('like', likeSchema);
