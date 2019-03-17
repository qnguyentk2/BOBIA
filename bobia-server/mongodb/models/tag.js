import mongoose from 'mongoose';
import paginate from '../../utils/mongodb/paginate';
import reIndex from '../../utils/mongodb/reindex';
import { autoIncrement } from 'mongoose-plugin-autoinc';

const tagSchema = mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, index: 'text' },
    isDel: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

tagSchema.plugin(autoIncrement, {
  model: 'tag',
  field: 'id',
  startAt: 1
});

tagSchema.plugin(paginate);

tagSchema.plugin(reIndex, { mongoose });

export default mongoose.model('tag', tagSchema);
