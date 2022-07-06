import { Manga } from '@models/Manga';
import Database, { QueryResult } from 'tauri-plugin-sql-api';

let db: Database;

export async function conenct(): Promise<Database> {
  db = await Database.load('sqlite:ryu.db');
  return db;
}

export async function all(): Promise<Manga[]> {
  return await db.select('SELECT * FROM library');
}

export async function get(id: string): Promise<Manga> {
  return await db.select('SELECT * FROM library WHERE mangadexId = $1', [id]);
}

export async function add(manga: Manga): Promise<QueryResult> {
  return await db.execute(
    'INSERT INTO library (mangadexId, coverId, title) VALUES ($1, $2, $3)',
    [manga.mangadexId, manga.coverId, manga.title],
  );
}

export async function update(manga: Manga): Promise<QueryResult> {
  return await db.execute(
    'UPDATE library SET mangadexId = $1, coverId = $2, title = $3, anilistId = $4 WHERE mangadexId = $1',
    [manga.mangadexId, manga.coverId, manga.title, manga.anilistId],
  );
}

export async function remove(id: string): Promise<QueryResult> {
  return await db.execute('DELETE FROM library WHERE mangadexId = $1', [id]);
}
