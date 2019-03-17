import gql from 'graphql-tag';
import Api from './api';
import Auth from './auth';
import Book from './book';
import Chapter from './chapter';
import Post from './post';
import Role from './role';
import Tag from './tag';
import User from './user';
import Upload from './upload';
import Category from './category';
import Banner from './banner';

const query = {
  ...Api.query,
  ...Auth.query,
  ...Book.query,
  ...Chapter.query,
  ...Post.query,
  ...Role.query,
  ...Tag.query,
  ...User.query,
  ...Upload.query,
  ...Category.query,
  ...Banner.query,
  allAuthors: gql`
    query allAuthors {
      allAuthors {
        id
        name
        bibliography
        avatar {
          handle
        }
      }
    }
  `
};

const mutation = {
  ...Api.mutation,
  ...Auth.mutation,
  ...Book.mutation,
  ...Chapter.mutation,
  ...Post.mutation,
  ...Role.mutation,
  ...Tag.mutation,
  ...User.mutation,
  ...Upload.mutation,
  ...Category.mutation,
  ...Banner.mutation
};

export default {
  query,
  mutation
};
