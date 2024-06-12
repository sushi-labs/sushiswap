export const page = (data, pagination) => {
    if (!pagination ||
        pagination.pageIndex === undefined ||
        pagination.pageSize === undefined)
        return data;
    const start = pagination.pageIndex * pagination.pageSize;
    const end = (pagination.pageIndex + 1) * pagination.pageSize;
    return data.slice(start, end);
};
//# sourceMappingURL=page.js.map