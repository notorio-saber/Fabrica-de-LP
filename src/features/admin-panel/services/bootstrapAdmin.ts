import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { auth, db } from '../../../firebase/config';

export async function bootstrapAdmin(email: string, password: string): Promise<void> {
  let uid: string;
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    uid = credential.user.uid;
  } catch {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      uid = credential.user.uid;
    } catch (createErr) {
      if (createErr instanceof Error && 'code' in createErr && createErr.code === 'auth/email-already-in-use') {
        throw new Error('Essa conta já existe e a senha informada está incorreta. Use "Esqueci minha senha" acima.');
      }
      throw createErr;
    }
  }

  const batch = writeBatch(db);
  batch.set(doc(db, 'users', uid), {
    role: 'admin',
    email,
    createdAt: serverTimestamp(),
  });
  batch.set(doc(db, 'bootstrap', 'admin'), {
    uid,
    createdAt: serverTimestamp(),
  });
  await batch.commit();
}
