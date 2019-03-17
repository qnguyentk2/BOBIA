import mongoose from 'mongoose';
import paginate from '../../utils/mongodb/paginate';
import reIndex from '../../utils/mongodb/reindex';
import { autoIncrement } from 'mongoose-plugin-autoinc';

const apiSchema = mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, index: 'text', required: true },
    description: { type: String },
    isDel: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

apiSchema.plugin(autoIncrement, {
  model: 'api',
  field: 'id',
  startAt: 1
});

apiSchema.plugin(paginate);

apiSchema.plugin(reIndex, { mongoose });

export default mongoose.model('api', apiSchema);
