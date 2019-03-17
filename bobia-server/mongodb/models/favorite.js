import mongoose from 'mongoose';
import paginate from '../../utils/mongodb/paginate';
import reIndex from '../../utils/mongodb/reindex';
import { autoIncrement } from 'mongoose-plugin-autoinc';

const favoriteSchema = mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    subjectId: { type: Number, required: true },
    type: {
      type: String,
      enum: ['BOOK'],
      required: true
    },
    user: { type: Number, required: true },
    isSubcribe: { type: Boolean, default: true, required: true }
  },
  {
    timestamps: true
  }
);

favoriteSchema.plugin(autoIncrement, {
  model: 'favorite',
  field: 'id',
  startAt: 1
});

favoriteSchema.plugin(paginate);

favoriteSchema.plugin(reIndex, { mongoose });

export default mongoose.model('favorite', favoriteSchema);
