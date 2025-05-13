
import { query, queryOne, execute } from '@/lib/mysql';
import { MediaItem } from '@/types/mediaItem';

// Get all media items
export const getMediaItems = async (folder?: string): Promise<MediaItem[]> => {
  let sql = 'SELECT * FROM media ORDER BY created_at DESC';
  let params: any[] = [];
  
  if (folder) {
    sql = 'SELECT * FROM media WHERE folder = ? ORDER BY created_at DESC';
    params = [folder];
  }
  
  return await query<MediaItem>(sql, params);
};

// Get media item by ID
export const getMediaItem = async (id: number): Promise<MediaItem | null> => {
  return await queryOne<MediaItem>('SELECT * FROM media WHERE id = ?', [id]);
};

// Create a new media item
export const createMediaItem = async (mediaItem: Omit<MediaItem, 'id' | 'created_at' | 'updated_at'>): Promise<MediaItem> => {
  const result = await execute(
    `INSERT INTO media (name, original_name, mime_type, size, path, url, folder)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      mediaItem.name,
      mediaItem.original_name,
      mediaItem.mime_type,
      mediaItem.size,
      mediaItem.path,
      mediaItem.url,
      mediaItem.folder
    ]
  );
  
  return getMediaItem(result.insertId) as Promise<MediaItem>;
};

// Delete a media item
export const deleteMediaItem = async (id: number): Promise<void> => {
  await execute('DELETE FROM media WHERE id = ?', [id]);
};

// Update a media item
export const updateMediaItem = async (id: number, mediaItem: Partial<MediaItem>): Promise<MediaItem | null> => {
  const updateFields: string[] = [];
  const updateValues: any[] = [];

  Object.entries(mediaItem).forEach(([key, value]) => {
    if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
      updateFields.push(`${key} = ?`);
      updateValues.push(value);
    }
  });
  
  if (updateFields.length === 0) return null;
  
  await execute(
    `UPDATE media SET ${updateFields.join(', ')} WHERE id = ?`,
    [...updateValues, id]
  );
  
  return getMediaItem(id);
};

// Get media analytics
export const getMediaAnalytics = async (): Promise<{
  totalMedia: number;
  totalSize: number;
  byType: Record<string, number>;
}> => {
  const totalMediaResult = await queryOne<{count: number}>('SELECT COUNT(*) as count FROM media');
  const totalSizeResult = await queryOne<{total: number}>('SELECT SUM(size) as total FROM media');
  const typeStatsResult = await query<{mime_type: string; count: number}>(
    'SELECT mime_type, COUNT(*) as count FROM media GROUP BY mime_type'
  );
  
  const byType: Record<string, number> = {};
  typeStatsResult.forEach(item => {
    byType[item.mime_type] = item.count;
  });
  
  return {
    totalMedia: totalMediaResult?.count || 0,
    totalSize: totalSizeResult?.total || 0,
    byType
  };
};
