import mongoose from 'mongoose';
import URLSlugs from 'mongoose-url-slugs';
import paginate from '../../utils/mongodb/paginate';
import reIndex from '../../utils/mongodb/reindex';
import { autoIncrement } from 'mongoose-plugin-autoinc';
import Enum from './enum';

const blogSchema = mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true, index: 'text' },
    content: { type: String },
    topics: { type: [Number] },
    tags: { type: [Number] },
    coverPage: { type: String },
    wordCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    slug: { type: String },
    createdUser: { type: Number, required: true },
    lastModifiedUser: { type: Number },
    partnership: {
      type: String,
      enum: Enum.EnumPartnership.DEFAULT,
      default: Enum.EnumPartnership.PUBLIC
    },
    isDel: { type: Boolean, default: false }
  },
  { timestamps: true, toObject: { virtuals: true } }
);

blogSchema.plugin(autoIncrement, {
  model: 'blog',
  field: 'id',
  startAt: 1
});

blogSchema.plugin(URLSlugs('title', { field: 'slug' }));

blogSchema.plugin(paginate);

blogSchema.plugin(reIndex, { mongoose });

blogSchema.virtual('user', {
  ref: 'user',
  localField: 'createdUser',
  foreignField: 'id',
  justOne: false
});

blogSchema.virtual('tag', {
  ref: 'tag',
  localField: 'tags',
  foreignField: 'id',
  justOne: false
});

blogSchema.virtual('topic', {
  ref: 'topic',
  localField: 'topics',
  foreignField: 'id',
  justOne: false
});

const BlogModel = mongoose.model('blog', blogSchema);

export default BlogModel;
