import * as ErrorHandler from '../../src/utils/ErrorHandler';
import {
  HTTP400Error,
  HTTP404Error
} from '../../src/utils/httpErrors';

describe('ErrorHandler', () => {

  describe('ErrorHandler.notFoundError', () => {
    it('should throw an HTTP404Error', () => {
      expect(ErrorHandler.notFoundError).toThrowError(HTTP404Error);
      expect(ErrorHandler.notFoundError).toThrowError(/^Route not found\.$/);
    });
  });

});