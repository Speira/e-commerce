import { mockDatabase, resetAllMocks } from '../../../test-utils/src';

const DATABASE_MODULE_PATH = '../src/database';

jest.mock('../src/database', () => mockDatabase);

describe('Database Utilities', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe('getItem', () => {
    it('should call getItem with correct parameters', async () => {
      const { getItem } = require(DATABASE_MODULE_PATH);

      const result = await getItem('test-table', 'test-id');

      expect(mockDatabase.getItem).toHaveBeenCalledWith(
        'test-table',
        'test-id',
      );
      expect(result).toEqual({ id: 'test-id', name: 'Test Item' });
    });
  });

  describe('putItem', () => {
    it('should call putItem with correct parameters', async () => {
      const { putItem } = require(DATABASE_MODULE_PATH);

      const item = { id: 'test-id', name: 'Test Item' };
      const result = await putItem('test-table', item);

      expect(mockDatabase.putItem).toHaveBeenCalledWith('test-table', item);
      expect(result).toEqual({ success: true });
    });
  });

  describe('queryItems', () => {
    it('should call queryItems with correct parameters', async () => {
      const { queryItems } = require(DATABASE_MODULE_PATH);

      const result = await queryItems('test-table', 'category', 'electronics');

      expect(mockDatabase.queryItems).toHaveBeenCalledWith(
        'test-table',
        'category',
        'electronics',
      );
      expect(result).toEqual([{ id: 'test-id', name: 'Test Item' }]);
    });
  });

  describe('scanItems', () => {
    it('should call scanItems with correct parameters', async () => {
      const { scanItems } = require(DATABASE_MODULE_PATH);

      const result = await scanItems('test-table');

      expect(mockDatabase.scanItems).toHaveBeenCalledWith('test-table');
      expect(result).toEqual([{ id: 'test-id', name: 'Test Item' }]);
    });
  });

  describe('updateItem', () => {
    it('should call updateItem with correct parameters', async () => {
      const { updateItem } = require(DATABASE_MODULE_PATH);

      const result = await updateItem('test-table', 'test-id', {
        name: 'Updated Name',
      });

      expect(mockDatabase.updateItem).toHaveBeenCalledWith(
        'test-table',
        'test-id',
        { name: 'Updated Name' },
      );
      expect(result).toEqual({ success: true });
    });
  });

  describe('deleteItem', () => {
    it('should call deleteItem with correct parameters', async () => {
      const { deleteItem } = require(DATABASE_MODULE_PATH);

      const result = await deleteItem('test-table', 'test-id');

      expect(mockDatabase.deleteItem).toHaveBeenCalledWith(
        'test-table',
        'test-id',
      );
      expect(result).toEqual({ success: true });
    });
  });

  describe('generateId', () => {
    it('should generate a unique ID', () => {
      const { generateId } = require(DATABASE_MODULE_PATH);

      const id = generateId();

      expect(mockDatabase.generateId).toHaveBeenCalled();
      expect(id).toBe('generated-id-123');
    });
  });

  describe('addTTL', () => {
    it('should add TTL to an item', () => {
      const { addTTL } = require(DATABASE_MODULE_PATH);

      const item = { id: 'test-id', name: 'Test Item' };
      const result = addTTL(item, 3600);

      expect(mockDatabase.addTTL).toHaveBeenCalledWith(item, 3600);
      expect(result).toHaveProperty('ttl');
    });
  });
});
