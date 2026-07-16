import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase/config';

export async function renameAffiliateSlug(oldSlug: string, newSlugInput: string): Promise<string> {
  const newSlug = newSlugInput.trim().toLowerCase();
  if (!newSlug) {
    throw new Error('Informe o novo slug.');
  }
  if (newSlug === oldSlug) {
    throw new Error('O novo slug é igual ao atual.');
  }

  const oldRef = doc(db, 'landingPages', oldSlug);
  const newRef = doc(db, 'landingPages', newSlug);

  await runTransaction(db, async (tx) => {
    const [oldSnap, newSnap] = await Promise.all([tx.get(oldRef), tx.get(newRef)]);

    if (!oldSnap.exists()) {
      throw new Error('Afiliada não encontrada.');
    }
    if (newSnap.exists()) {
      throw new Error('Esse slug já está em uso.');
    }

    const data = oldSnap.data();
    const userRef = doc(db, 'users', data.ownerUid);

    // The Storage download URL for the profile photo stays valid regardless
    // of the folder name it was uploaded under, so it's copied as-is here
    // instead of moving the underlying file in Storage.
    tx.set(newRef, { ...data, slug: newSlug, updatedAt: serverTimestamp() });
    tx.update(userRef, { slug: newSlug });
    tx.delete(oldRef);
  });

  return newSlug;
}
