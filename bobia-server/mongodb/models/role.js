import mongoose from 'mongoose';
import paginate from '../../utils/mongodb/paginate';
import reIndex from '../../utils/mongodb/reindex';
import { autoIncrement } from 'mongoose-plugin-autoinc';

const roleSchema = mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, index: 'text' },
    description: { type: String },
    isDel: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

roleSchema.plugin(autoIncrement, {
  model: 'role',
  field: 'id',
  startAt: 1
});

roleSchema.plugin(paginate);

roleSchema.plugin(reIndex, { mongoose });

export default mongoose.model('role', roleSchema);
