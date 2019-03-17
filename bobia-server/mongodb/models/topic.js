import mongoose from 'mongoose';
import URLSlugs from 'mongoose-url-slugs';
import paginate from '../../utils/mongodb/paginate';
import reIndex from '../../utils/mongodb/reindex';
import { autoIncrement } from 'mongoose-plugin-autoinc';

const topicSchema = mongoose.Schema(
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

topicSchema.plugin(autoIncrement, {
  model: 'topic',
  field: 'id',
  startAt: 1
});

topicSchema.plugin(paginate);

topicSchema.plugin(
  URLSlugs('name', { field: 'slug', update: true, alwaysRecreate: true })
);

topicSchema.plugin(reIndex, { mongoose });

export default mongoose.model('topic', topicSchema);
