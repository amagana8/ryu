import Dexie from 'dexie';

const db = new Dexie('ryuDB');
db.version(1).stores({
    library: `id, title, anilistId, coverId`
});

export { db };
