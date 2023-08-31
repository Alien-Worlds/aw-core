import {
  DataSourceError,
  OperationErrorType,
  DuplicateErrorAdditionalData,
} from '../errors';

describe('DataSourceError', () => {
  describe('createDuplicateError', () => {
    it('should create a DataSourceError instance for duplicate data error with default additional data', () => {
      const originalError = new Error('Duplicate error');
      const dataSourceError = DataSourceError.createDuplicateError(originalError);

      expect(dataSourceError).toBeInstanceOf(DataSourceError);
      expect(dataSourceError.error).toBe(originalError);
      expect(dataSourceError.message).toBe(originalError.message);
      expect(dataSourceError.type).toBe(OperationErrorType.Duplicate);
      expect(dataSourceError.isDuplicateError).toBe(true);
      expect(dataSourceError.isInvalidDataError).toBe(false);
      expect(dataSourceError.additionalData).toEqual({ duplicatedIds: [] });
    });

    it('should create a DataSourceError instance for duplicate data error with provided additional data', () => {
      const originalError = new Error('Duplicate error');
      const additionalData: DuplicateErrorAdditionalData = {
        duplicatedIds: ['1', '2', '3'],
      };
      const dataSourceError = DataSourceError.createDuplicateError(originalError, {
        duplicatedIds: additionalData.duplicatedIds,
      });

      expect(dataSourceError.additionalData).toEqual(additionalData);
    });

    it('should create a DataSourceError instance for duplicate data error with a custom error message', () => {
      const originalError = new Error('Duplicate error');
      const customMessage = 'Custom error message';
      const dataSourceError = DataSourceError.createDuplicateError(originalError, {
        message: customMessage,
      });

      expect(dataSourceError.message).toBe(customMessage);
    });
  });

  describe('createInvalidDataError', () => {
    it('should create a DataSourceError instance for invalid data error', () => {
      const originalError = new Error('Invalid data error');
      const dataSourceError = DataSourceError.createInvalidDataError(originalError);

      expect(dataSourceError).toBeInstanceOf(DataSourceError);
      expect(dataSourceError.error).toBe(originalError);
      expect(dataSourceError.message).toBe(originalError.message);
      expect(dataSourceError.type).toBe(OperationErrorType.InvalidData);
      expect(dataSourceError.isDuplicateError).toBe(false);
      expect(dataSourceError.isInvalidDataError).toBe(true);
      expect(dataSourceError.additionalData).toBeUndefined();
    });

    it('should create a DataSourceError instance for invalid data error with provided additional data', () => {
      const originalError = new Error('Invalid data error');
      const additionalData = { foo: 'bar' };
      const dataSourceError = DataSourceError.createInvalidDataError(originalError, {
        data: additionalData,
      });

      expect(dataSourceError.additionalData).toEqual(additionalData);
    });

    it('should create a DataSourceError instance for invalid data error with a custom error message', () => {
      const originalError = new Error('Invalid data error');
      const customMessage = 'Custom error message';
      const dataSourceError = DataSourceError.createInvalidDataError(originalError, {
        message: customMessage,
      });

      expect(dataSourceError.message).toBe(customMessage);
    });
  });

  describe('createError', () => {
    it('should create a DataSourceError instance for other types of errors', () => {
      const originalError = new Error('Other error');
      const dataSourceError = DataSourceError.createError(originalError);

      expect(dataSourceError).toBeInstanceOf(DataSourceError);
      expect(dataSourceError.error).toBe(originalError);
      expect(dataSourceError.message).toBe(originalError.message);
      expect(dataSourceError.type).toBe(OperationErrorType.Other);
      expect(dataSourceError.isDuplicateError).toBe(false);
      expect(dataSourceError.isInvalidDataError).toBe(false);
      expect(dataSourceError.additionalData).toBeUndefined();
    });

    it('should create a DataSourceError instance for other types of errors with provided additional data', () => {
      const originalError = new Error('Other error');
      const additionalData = { baz: 'qux' };
      const dataSourceError = DataSourceError.createError(originalError, {
        data: additionalData,
      });

      expect(dataSourceError.additionalData).toEqual(additionalData);
    });

    it('should create a DataSourceError instance for other types of errors with a custom error message', () => {
      const originalError = new Error('Other error');
      const customMessage = 'Custom error message';
      const dataSourceError = DataSourceError.createError(originalError, {
        message: customMessage,
      });

      expect(dataSourceError.message).toBe(customMessage);
    });
  });
});
