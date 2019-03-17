const BookListHelper = {
  getDirAndOrderByType: ({ typeBookList }) => {
    let dir, orderBy;
    switch (typeBookList) {
      case 'mostViewBooks': {
        dir = 'desc';
        orderBy = 'viewCount';
        break;
      }
      case 'latestBooks': {
        dir = 'desc';
        orderBy = 'createdAt';
        break;
      }
      case 'latestUpdatedBooks': {
        dir = 'desc';
        orderBy = 'updatedAt';
        break;
      }
      default: {
        dir = 'asc';
        orderBy = 'displayOrder';
      }
    }
    return { dir, orderBy };
  },
  getTitleByType: ({ typeBookList }) => {
    let title = '';
    switch (typeBookList) {
      case 'mostViewBooks': {
        title = 'Truyện xem nhiều nhất';
        break;
      }
      case 'latestBooks': {
        title = 'Truyện mới nhất';
        break;
      }
      case 'latestUpdatedBooks': {
        title = 'Truyện mới cập nhật';
        break;
      }
      default: {
        title = '';
      }
    }
    return title;
  }
};

export { BookListHelper };
