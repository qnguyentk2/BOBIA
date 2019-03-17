import { bannerCtr } from '../../mongodb/controllers';
import { pipeResolvers } from 'graphql-resolvers';
import { checkAuthen, checkAuthor } from './auth';
const resolverFunction = {
  Query: {
    getAllBanners: async (parents, args) => bannerCtr.getAllBanners(args)
  },
  Mutation: {
    createBanner: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parents, args, { req }) => bannerCtr.createBanner(args.banner, req)
    ),
    updateBanner: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parents, args, { req }) => bannerCtr.updateBanner(args.banner, req)
    ),
    deleteBanner: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parents, args) => bannerCtr.deleteBanner(args.bannerId)
    ),
    updateBannerActive: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parents, args) => {
        return bannerCtr.updateBannerActive(args);
      }
    )
  }
};

export default resolverFunction;
