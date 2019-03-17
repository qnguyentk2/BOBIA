import mongoose from 'mongoose';
import URLSlugs from 'mongoose-url-slugs';
import paginate from '../../utils/mongodb/paginate';
import reIndex from '../../utils/mongodb/reindex';
import { autoIncrement } from 'mongoose-plugin-autoinc';
import Enum from './enum';

const chapterSchema = mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    displayOrder: { type: Number, default: 0, index: true },
    title: { type: String, required: true, index: 'text' },
    content: { type: String, index: 'text' },
    bookId: { type: Number, required: true },
    state: {
      type: String,
      enum: Enum.EnumApproveStates.DEFAULT,
      required: true
    },
    approvedBy: { type: Number },
    publishedDate: { type: Date },
    rating: {
      type: String,
      enum: Enum.EnumRatings.DEFAULT,
      required: true
    },
    foreword: { type: Boolean },
    wordCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    isDel: { type: Boolean, default: false },
    createdUser: { type: Number, required: true },
    lastModifiedUser: { type: Number },
    partnership: {
      type: String,
      enum: Enum.EnumPartnership.DEFAULT,
      default: Enum.EnumPartnership.PUBLIC
    },
    refusedReason: { type: String }
  },
  {
    timestamps: true
  }
);

chapterSchema.plugin(autoIncrement, {
  model: 'chapter',
  field: 'id',
  startAt: 1
});

chapterSchema.virtual('user', {
  ref: 'user',
  localField: 'createdUser',
  foreignField: 'id',
  justOne: false
});

chapterSchema.virtual('book', {
  ref: 'book',
  localField: 'bookId',
  foreignField: 'id',
  justOne: false
});

chapterSchema.plugin(URLSlugs('title', { field: 'slug' }));

chapterSchema.plugin(paginate);

chapterSchema.plugin(reIndex, { mongoose });

export default mongoose.model('chapter', chapterSchema);
