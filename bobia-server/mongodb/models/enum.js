const enumType = {
  EnumBookTypes: {
    DEFAULT: ['ONE_SHOT', 'LONG_STORY'],
    ONE_SHOT: 'ONE_SHOT',
    LONG_STORY: 'LONG_STORY'
  },

  EnumRatings: {
    DEFAULT: ['PG', 'G', 'M', 'R'],
    PG: 'PG',
    G: 'G',
    M: 'M',
    R: 'R'
  },

  EnumApproveStates: {
    DEFAULT: ['DRAFT', 'PENDING', 'PUBLISHED', 'REFUSED'],
    DRAFT: 'DRAFT',
    PENDING: 'PENDING',
    PUBLISHED: 'PUBLISHED',
    REFUSED: 'REFUSED'
  },

  EnumBookStatus: {
    DEFAULT: ['ONGOING', 'DROPPED', 'COMPLETED'],
    ONGOING: 'ONGOING',
    DROPPED: 'DROPPED',
    COMPLETED: 'COMPLETED'
  },

  EnumPartnership: {
    DEFAULT: ['PUBLIC', 'PRIVATE'],
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE'
  }
};
export default enumType;
