import mongoose from 'mongoose';
import paginate from '../../utils/mongodb/paginate';
import reIndex from '../../utils/mongodb/reindex';
import { autoIncrement } from 'mongoose-plugin-autoinc';

const viewSchema = mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    subjectId: { type: Number, required: true },
    type: { type: String, enum: ['BOOK', 'CHAPTER', 'BLOG'], required: true },
    user: { type: Number },
    viewCount: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

viewSchema.plugin(autoIncrement, {
  model: 'view',
  field: 'id',
  startAt: 1
});

viewSchema.plugin(paginate);

viewSchema.plugin(reIndex, { mongoose });

export default mongoose.model('view', viewSchema);
