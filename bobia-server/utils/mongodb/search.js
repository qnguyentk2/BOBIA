function partialSearch(filters, options) {
  if (!filters || Object.getOwnPropertyNames(filters).length === 0) {
    return {};
  }

  let searchArray = [];
  for (let key in filters) {
    const searchKey =
      typeof filters[key] === 'string'
        ? new RegExp(filters[key], 'i')
        : filters[key];
    searchArray.push({ [key]: searchKey });
  }

  if (options && options.type && options.type === 'AND') {
    return {
      $and: searchArray
    };
  }

  return {
    $or: searchArray
  };
}

export default partialSearch;
