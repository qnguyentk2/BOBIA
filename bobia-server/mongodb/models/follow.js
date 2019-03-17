import mongoose from 'mongoose';
import paginate from '../../utils/mongodb/paginate';
import reIndex from '../../utils/mongodb/reindex';
import { autoIncrement } from 'mongoose-plugin-autoinc';

const followSchema = mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    followingUser: { type: Number, required: true },
    user: { type: Number, required: true }
  },
  {
    timestamps: true
  }
);

followSchema.plugin(autoIncrement, {
  model: 'follow',
  field: 'id',
  startAt: 1
});

followSchema.plugin(paginate);

followSchema.plugin(reIndex, { mongoose });

export default mongoose.model('follow', followSchema);
