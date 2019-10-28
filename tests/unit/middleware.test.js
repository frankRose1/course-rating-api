import isValidMongoID from '../../src/middleware/isValidMongoID';
import checkPagination from '../../src/middleware/checkPagination';
import admin from '../../src/middleware/admin';
import { HTTP400Error, HTTP403Error } from '../../src/utils/httpErrors';

const mockIsValidMongoID = () => {
  const req = {
    params: { id: 'notAvalidID' }
  };
  const res = {};
  const next = jest.fn();
  isValidMongoID(req, res, next);
};

const mockCheckPagination = (pageSize = 1, pageNum = 1) => {
  const req = {
    query: { pageNum, pageSize }
  };
  const res = {};
  const next = jest.fn();
  checkPagination(req, res, next);
};

describe('middleware', () => {
  describe('isValidMongoID', () => {
    it('should throw a HTTP400Error is an invalid ID is provded in params', () => {
      expect(mockIsValidMongoID).toThrowError(HTTP400Error);
    });
  });

  describe('admin', () => {
    it('should throw a HTTP403Error if req.user.role is not "ADMIN"', () => {
      const req = {
        user: { role: 'MEMBER' }
      };
      const res = {};
      const next = jest.fn();
      expect(() => admin(req, res, next)).toThrowError(HTTP403Error);
    });
  });

  describe('checkPagination', () => {
    it('should throw a HTTP400Error if client sends invalid pageSize in the querystring', () => {
      expect(() => mockCheckPagination('I should be a number!')).toThrow(
        HTTP400Error
      );
      expect(() => mockCheckPagination('I should be a number!')).toThrow(
        /^If providing a page size please ensure the value is a number\.$/
      );
    });

    it('should throw a HTTP400Error if client sends invalid pageNum in the querystring', () => {
      expect(() => mockCheckPagination(1, 'wrongSize')).toThrow(HTTP400Error);
      expect(() => mockCheckPagination(1, 'wrongSize')).toThrow(
        /^If providing a page number please ensure the value is a number\.$/
      );
    });
  });
});
