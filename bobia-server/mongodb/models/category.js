import mongoose from 'mongoose';
import URLSlugs from 'mongoose-url-slugs';
import paginate from '../../utils/mongodb/paginate';
import reIndex from '../../utils/mongodb/reindex';
import { autoIncrement } from 'mongoose-plugin-autoinc';

const categorySchema = mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, index: 'text' },
    slug: { type: String },
    description: { type: String },
    displayOrder: { type: Number, index: true },
    isDel: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

categorySchema.plugin(autoIncrement, {
  model: 'category',
  field: 'id',
  startAt: 1
});

categorySchema.plugin(paginate);

categorySchema.plugin(
  URLSlugs('name', { field: 'slug', update: true, alwaysRecreate: true })
);

categorySchema.plugin(reIndex, { mongoose });

export default mongoose.model('category', categorySchema);
