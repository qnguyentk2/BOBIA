import path from 'path';
import { makeExecutableSchema } from 'graphql-tools';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import directiveResolvers from '../directives';

const typesArray = fileLoader(path.join(__dirname, '../types'), {
  recursive: true
});
const resolversArray = fileLoader(path.join(__dirname, '../resolvers'));
const allTypes = mergeTypes(typesArray);
const allResolvers = mergeResolvers(resolversArray);
const schema = makeExecutableSchema({
  typeDefs: allTypes,
  resolvers: allResolvers,
  directiveResolvers
});

export default schema;
