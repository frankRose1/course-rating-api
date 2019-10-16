import { HTTP400Error } from '../utils/httpErrors';

/**
 * If the client provides a "pageNum" and "pageSize" to
 * endpoints that allow pagination this will make sure the
 * provided values are actually numbers before doing anything
 * in the controller.
 */
export default (req, res, next) => {
    const pageSize = req.query.pageSize;
    const pageNum = req.query.pageNum;

    if (pageSize) {
        const parsedPageSize = parseInt(pageSize);
        if (isNaN(parsedPageSize)) {
            throw new HTTP400Error('If providing a page size please ensure the value is a number.')
        } else {
            req.query.pageSize = parsedPageSize;
        }
    }

    if (pageNum) {
        const parsedPageNum = parseInt(pageNum);
        if (isNaN(parsedPageNum)) {
            throw new HTTP400Error('If providing a page number please ensure the value is a number.')
        } else {
            req.query.pageNum = parsedPageNum;
        }
    }

    next();
}