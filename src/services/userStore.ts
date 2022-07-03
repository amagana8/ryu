import { User } from '@contexts/UserContext';
import { Store } from 'tauri-plugin-store-api';

const userStore = new Store('.user');

export async function loadStore() {
  await userStore.load();
}

export async function getStoredUser(): Promise<User> {
  return {
    anilistId: (await userStore.get('anilistId')) as string,
    anilistToken: (await userStore.get('anilistToken')) as string,
    mangadexToken: (await userStore.get('mangadexToken')) as string,
  };
}

export async function updateUser(user: User): Promise<void> {
  await userStore.set('anilistId', user.anilistId);
  await userStore.set('anilistToken', user.anilistToken);
  await userStore.set('mangadexToken', user.mangadexToken);
  await userStore.save();
}
