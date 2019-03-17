const UrlHelper = {
  getUrlUserDetail: ({ slugUser }) =>
    `${process.env.PUBLIC_URL}/nguoi-dung/${slugUser}`,
  getUrlUserUpdate: ({ slugUser }) =>
    `${process.env.PUBLIC_URL}/nguoi-dung/${slugUser}/cap-nhat`,
  getUrlBookCreate: () => `${process.env.PUBLIC_URL}/createBook`,
  getUrlBookDetail: ({ slugBook }) =>
    `${process.env.PUBLIC_URL}/sach/${slugBook}`,
  getUrlBookUpdate: ({ slugBook }) =>
    `${process.env.PUBLIC_URL}/sach/${slugBook}/cap-nhat`,
  getUrlChapterCreate: ({ slugBook }) =>
    `${process.env.PUBLIC_URL}/sach/${slugBook}/createChapter`,
  getUrlChapterDetail: ({ slugBook, slugChapter }) =>
    `${process.env.PUBLIC_URL}/sach/${slugBook}/${slugChapter}`,
  getUrlChapterUpdate: ({ slugBook, slugChapter }) =>
    `${process.env.PUBLIC_URL}/sach/${slugBook}/${slugChapter}/cap-nhat`,
  getUrlBlogCreate: () => `${process.env.PUBLIC_URL}/createBlog`,
  getUrlBlogDetail: ({ slugBlog }) =>
    `${process.env.PUBLIC_URL}/blog/${slugBlog}`,
  getUrlBlogUpdate: ({ slugBlog }) =>
    `${process.env.PUBLIC_URL}/blog/${slugBlog}/cap-nhat`,
  getUrlBookListCategory: ({ categorySlug }) => {
    return `${process.env.PUBLIC_URL}/the-loai/${categorySlug}`;
  },
  getUrlBlogListTopic: ({ topicSlug }) => {
    return `${process.env.PUBLIC_URL}/chu-de/${topicSlug}`;
  },
  getUrlBookTag: ({ tagName }) => `${process.env.PUBLIC_URL}/tag/${tagName}`,
  getBookListByType: ({ type }) => {
    let url = '';
    switch (type) {
      case 'mostViewBooks': {
        url = `${process.env.PUBLIC_URL}/truyen-xem-nhieu-nhat`;
        break;
      }
      case 'latestUpdatedBooks': {
        url = `${process.env.PUBLIC_URL}/truyen-moi-cap-nhat`;
        break;
      }
      case 'latestBooks': {
        url = `${process.env.PUBLIC_URL}/truyen-moi`;
        break;
      }
      default: {
        url = '';
      }
    }
    return url;
  }
};

export { UrlHelper };
