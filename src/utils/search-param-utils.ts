export const validatePaginationParams = (search: any) => {
  return {
    page_no:
      typeof search.page_no === "string"
        ? parseInt(search.page_no)
        : search.page_no || 1,
    page_size:
      typeof search.page_size === "string"
        ? parseInt(search.page_size)
        : search.page_size || 10,
  };
};
