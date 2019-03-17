import Auth from './auth';
import Book from './book';
import Chapter from './chapter';
import Post from './post';
import View from './view';
import Like from './like';
import Comment from './comment';
import Favorite from './favorite';
import Follow from './follow';
import Tag from './tag';
import User from './user';
import Upload from './upload';
import Category from './category';
import Search from './search';
import Notification from './notification';
import Topic from './topic';
import Blog from './blog';

const query = {
  ...Auth.query,
  ...Book.query,
  ...Chapter.query,
  ...Post.query,
  ...View.query,
  ...Like.query,
  ...Comment.query,
  ...Favorite.query,
  ...Follow.query,
  ...Tag.query,
  ...User.query,
  ...Upload.query,
  ...Category.query,
  ...Search.query,
  ...Notification.query,
  ...Topic.query,
  ...Blog.query
};

const mutation = {
  ...Auth.mutation,
  ...Book.mutation,
  ...Chapter.mutation,
  ...Post.mutation,
  ...View.mutation,
  ...Like.mutation,
  ...Comment.mutation,
  ...Favorite.mutation,
  ...Follow.mutation,
  ...Tag.mutation,
  ...User.mutation,
  ...Upload.mutation,
  ...Category.mutation,
  ...Search.mutation,
  ...Notification.mutation,
  ...Topic.mutation,
  ...Blog.mutation
};

const subscription = {
  ...Notification.subscription
};

export default {
  query,
  mutation,
  subscription
};
