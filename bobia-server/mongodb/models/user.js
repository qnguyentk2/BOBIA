import mongoose from 'mongoose';
import URLSlugs from 'mongoose-url-slugs';
import paginate from '../../utils/mongodb/paginate';
import reIndex from '../../utils/mongodb/reindex';
import { autoIncrement } from 'mongoose-plugin-autoinc';

const userSchema = mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    email: {
      type: String,
      sparse: true,
      unique: true
    },
    username: {
      type: String,
      required: function() {
        return !this.facebookId && !this.googleId;
      },
      sparse: true,
      unique: true
    },
    password: { type: String },
    nickname: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    displayName: { type: String, index: 'text' },
    address: { type: String },
    identifyNumber: { type: String },
    phoneNumber: { type: String },
    gender: { type: String },
    slug: { type: String },
    birthDate: { type: Date },
    biography: { type: String },
    favoriteQuote: { type: String },
    title: { type: String },
    achievement: { type: String },
    blocked: { type: Boolean },
    followerCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    roleId: { type: Number },
    facebookId: { type: String, sparse: true, unique: true },
    googleId: { type: String, sparse: true, unique: true },
    profileUrl: { type: String },
    tempSlug: { type: String },
    isDel: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

userSchema.plugin(autoIncrement, {
  model: 'user',
  field: 'id',
  startAt: 1
});

userSchema.plugin(URLSlugs('tempSlug', { field: 'slug' }));

userSchema.plugin(paginate);

userSchema.plugin(reIndex, { mongoose });

const userModel = mongoose.model('user', userSchema);

export default userModel;
