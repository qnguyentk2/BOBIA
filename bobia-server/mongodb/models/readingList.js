import mongoose from 'mongoose';
import paginate from '../../utils/mongodb/paginate';
import reIndex from '../../utils/mongodb/reindex';
import { autoIncrement } from 'mongoose-plugin-autoinc';

const readingListSchema = mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    type: { type: String, required: true, index: 'text' },
    userId: { type: Number, required: true },
    bookId: { type: Number, required: true },
    chapterId: { type: Number },
    progress: { type: Number },
    isDel: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

readingListSchema.plugin(autoIncrement, {
  model: 'readingList',
  field: 'id',
  startAt: 1
});

readingListSchema.plugin(paginate);

readingListSchema.plugin(reIndex, { mongoose });

export default mongoose.model('readingList', readingListSchema);
