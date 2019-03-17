import mongoose from 'mongoose';
import paginate from '../../utils/mongodb/paginate';
import reIndex from '../../utils/mongodb/reindex';
import { autoIncrement } from 'mongoose-plugin-autoinc';

const bannerSchema = mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    title: { type: String, index: 'text' },
    titleColor: { type: String },
    content: { type: String },
    contentColor: { type: String },
    cta: { type: String },
    ctaLink: { type: String },
    ctaColor: { type: String },
    bannerUrl: { type: String },
    isActive: { type: Boolean, default: false },
    isDel: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

bannerSchema.plugin(autoIncrement, {
  model: 'banner',
  field: 'id',
  startAt: 1
});

bannerSchema.plugin(paginate);

bannerSchema.plugin(reIndex, { mongoose });

export default mongoose.model('banner', bannerSchema);
