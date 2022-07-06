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
    mdSessionToken: (await userStore.get('mdSessionToken')) as string,
    mdRefreshToken: (await userStore.get('mdRefreshToken')) as string,
  };
}

export async function updateUser(user: User): Promise<void> {
  await userStore.set('anilistId', user.anilistId);
  await userStore.set('anilistToken', user.anilistToken);
  await userStore.set('mdSessionToken', user.mdSessionToken);
  await userStore.set('mdRefreshToken', user.mdRefreshToken);
  await userStore.save();
}
