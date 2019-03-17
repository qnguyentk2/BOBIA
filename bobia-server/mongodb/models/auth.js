import mongoose from 'mongoose';
import reIndex from '../../utils/mongodb/reindex';
import { autoIncrement } from 'mongoose-plugin-autoinc';

const authSchema = mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    userId: { type: String, required: true },
    sessionId: { type: String },
    token: { type: String, required: true },
    type: { type: String },
    expiredDate: { type: Date, required: true, index: true },
    ipAddress: { type: String },
    device: { type: String }
  },
  {
    timestamps: true
  }
);

authSchema.plugin(autoIncrement, {
  model: 'auth',
  field: 'id',
  startAt: 1
});

authSchema.plugin(reIndex, { mongoose });

export default mongoose.model('auth', authSchema);
