import { DataSourceError, OperationErrorType } from '../errors';

describe('DataSourceError', () => {
  describe('createDuplicateError', () => {
    it('should create a DataSourceError instance with type "duplicate"', () => {
      const originalError = new Error('Duplicate error');
      const dataSourceError = DataSourceError.createDuplicateError(originalError);

      expect(dataSourceError).toBeInstanceOf(DataSourceError);
      expect(dataSourceError.error).toBe(originalError);
      expect(dataSourceError.message).toBe(originalError.message);
      expect(dataSourceError.type).toBe(OperationErrorType.Duplicate);
      expect(dataSourceError.isDuplicateError).toBe(true);
      expect(dataSourceError.isInvalidDataError).toBe(false);
    });

    it('should create a DataSourceError instance with a custom error message', () => {
      const originalError = new Error('Duplicate error');
      const customMessage = 'Custom error message';
      const dataSourceError = DataSourceError.createDuplicateError(
        originalError,
        customMessage
      );

      expect(dataSourceError.message).toBe(customMessage);
    });
  });

  describe('createInvalidDataError', () => {
    it('should create a DataSourceError instance with type "invalid_data"', () => {
      const originalError = new Error('Invalid data error');
      const dataSourceError = DataSourceError.createInvalidDataError(originalError);

      expect(dataSourceError).toBeInstanceOf(DataSourceError);
      expect(dataSourceError.error).toBe(originalError);
      expect(dataSourceError.message).toBe(originalError.message);
      expect(dataSourceError.type).toBe(OperationErrorType.InvalidData);
      expect(dataSourceError.isDuplicateError).toBe(false);
      expect(dataSourceError.isInvalidDataError).toBe(true);
    });

    it('should create a DataSourceError instance with a custom error message', () => {
      const originalError = new Error('Invalid data error');
      const customMessage = 'Custom error message';
      const dataSourceError = DataSourceError.createInvalidDataError(
        originalError,
        customMessage
      );

      expect(dataSourceError.message).toBe(customMessage);
    });
  });

  describe('createError', () => {
    it('should create a DataSourceError instance with type "other"', () => {
      const originalError = new Error('Other error');
      const dataSourceError = DataSourceError.createError(originalError);

      expect(dataSourceError).toBeInstanceOf(DataSourceError);
      expect(dataSourceError.error).toBe(originalError);
      expect(dataSourceError.message).toBe(originalError.message);
      expect(dataSourceError.type).toBe(OperationErrorType.Other);
      expect(dataSourceError.isDuplicateError).toBe(false);
      expect(dataSourceError.isInvalidDataError).toBe(false);
    });

    it('should create a DataSourceError instance with a custom error message', () => {
      const originalError = new Error('Other error');
      const customMessage = 'Custom error message';
      const dataSourceError = DataSourceError.createError(originalError, customMessage);

      expect(dataSourceError.message).toBe(customMessage);
    });
  });
});
