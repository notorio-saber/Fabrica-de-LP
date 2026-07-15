import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { auth, db } from '../../../firebase/config';

export async function bootstrapAdmin(email: string, password: string): Promise<void> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = credential.user.uid;

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
