import mongoose from 'mongoose';
import URLSlugs from 'mongoose-url-slugs';
import paginate from '../../utils/mongodb/paginate';
import reIndex from '../../utils/mongodb/reindex';
import { autoIncrement } from 'mongoose-plugin-autoinc';
import Enum from './enum';

const bookSchema = mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true, index: 'text' },
    type: { type: String, enum: Enum.EnumBookTypes.DEFAULT, required: true },
    status: {
      type: String,
      enum: Enum.EnumBookStatus.DEFAULT,
      required: true
    },
    summary: { type: String },
    categories: { type: [Number] },
    tags: { type: [Number] },
    rating: {
      type: String,
      enum: Enum.EnumRatings.DEFAULT,
      required: true
    },
    coverPage: { type: String },
    wordCount: { type: Number, default: 0 },
    chapterCount: { type: Number, default: 0 },
    favoriteCount: { type: Number, default: 0 },
    subcribeCount: { type: Number, default: 0 },
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

bookSchema.plugin(autoIncrement, {
  model: 'book',
  field: 'id',
  startAt: 1
});

bookSchema.plugin(URLSlugs('title', { field: 'slug' }));

bookSchema.plugin(paginate);

bookSchema.plugin(reIndex, { mongoose });

bookSchema.virtual('user', {
  ref: 'user', // The model to use
  localField: 'createdUser', // Find people where `localField`
  foreignField: 'id', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false
  // options: { sort: { name: -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
});

bookSchema.virtual('tag', {
  ref: 'tag',
  localField: 'tags',
  foreignField: 'id',
  justOne: false
});

bookSchema.virtual('category', {
  ref: 'category',
  localField: 'categories',
  foreignField: 'id',
  justOne: false
});

const BookModel = mongoose.model('book', bookSchema);

export default BookModel;
