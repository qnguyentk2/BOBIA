export const DATE_TIME_FORMAT = {
  DEFAULT_FORMAT: 'DD/MM/YYYY',
  DEFAULT_FORMAT_WITH_TIME: 'DD/MM/YYYY H:mm'
};

export const PARTNERSHIP = {
  DEFAULT: ['PUBLIC', 'PRIVATE'],
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE'
};

export const RATING = {
  DEFAULT: ['PG', 'G', 'M', 'R'],
  PG: 'PG',
  G: 'G',
  M: 'M',
  R: 'R'
};

export const RATING_OPTIONS = [
  { label: 'G: Mọi độ tuổi', value: 'G' },
  { label: 'PG: 13 tuổi trở lên', value: 'PG' },
  { label: 'M: 16 tuổi trở lên', value: 'M' },
  { label: 'R: 18 tuổi trở lên', value: 'R' }
];

export const BOOK_TYPE = {
  DEFAULT: ['ONE_SHOT', 'LONG_STORY'],
  ONE_SHOT: 'ONE_SHOT',
  LONG_STORY: 'LONG_STORY'
};

export const BOOK_CATEGORIES = {
  'truyen-ngan': 'Truyện Ngắn',
  'truyen-dai': 'Truyện Dài',
  'lang-man': 'Lãng Mạn',
  'khoa-hoc': 'Khoa Học',
  'girl-love': 'Girl Love',
  tho: 'Thơ',
  'nam-nu': 'Nam Nữ',
  fanfiction: 'Fanfiction',
  'boy-love': 'Boy Love',
  'xuyen-khong': 'Xuyên Không',
  'phieu-luu': 'Phiêu Lưu',
  'kinh-di': 'Kinh Dị',
  nonfiction: 'Nonfiction',
  'hai-huoc': 'Hài Hước',
  'vien-tuong': 'Viễn Tưởng',
  'tien-hiep': 'Tiên Hiệp',
  'do-thi': 'Đô Thị',
  'kiem-hiep': 'Kiếm Hiệp',
  'hoc-duong': 'Học Đường',
  'xa-hoi-den': 'Xã Hội Đen',
  'lich-su': 'Lịch Sử'
};

export const BOOK_STATUS = {
  DEFAULT: ['ONGOING', 'DROPPED', 'COMPLETED'],
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED',
  DROPPED: 'DROPPED'
};

export const BOOK_STATUS_OPTION = [
  { label: 'Đang viết', value: 'ONGOING' },
  { label: 'Đã hoàn thành', value: 'COMPLETED' },
  { label: 'Đã ngừng', value: 'DROPPED' }
];

export const APPROVE_STATES = {
  DEFAULT: ['DRAFT', 'PENDING', 'PUBLISHED', 'REFUSED'],
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  PUBLISHED: 'PUBLISHED',
  REFUSED: 'REFUSED'
};

export const TYPE_OF_BOOK_BLOCK = {
  LATEST_BOOKS: {
    title: 'Truyện Mới',
    orderBy: 'createdAt'
  },
  LATEST_UPDATED_BOOKS: {
    title: 'Truyện Mới Cập Nhật',
    orderBy: 'updatedAt'
  },
  MOST_VIEW_BOOKS: { title: 'Xem Nhiều Nhất', orderBy: 'viewCount' }
};

export const MENU_ITEM = [
  {
    key: 'DANH_MUC_TAC_PHAM',
    value: 'Danh Mục Tác Phẩm'
  }
];

export const FOOTER_ITEM = [
  {
    key: 'TRANG_CHU',
    value: 'Trang Chủ'
  },
  {
    key: 'BANG_XEP_HANG',
    value: 'Bảng Xếp Hạng'
  },
  {
    key: 'TIN_TUC',
    value: 'Tin Tức'
  },
  {
    key: 'CHINH_SACH',
    value: 'Chính Sách'
  },
  {
    key: 'VE_CHUNG_TOI',
    value: 'Về Chúng Tôi'
  },
  {
    key: 'BLOG',
    value: 'Blog'
  }
];

export const SORT_BY = {
  ASCENDING: 'asc',
  DESCENDING: 'desc'
};

export const BOOK_AGE_REQUIRE_LOGIN = ['M', 'R'];
