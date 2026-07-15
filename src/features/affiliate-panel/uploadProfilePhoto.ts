import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase/config';

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function uploadProfilePhoto(slug: string, file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Formato de imagem não suportado. Use JPG, PNG ou WEBP.');
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error('A imagem deve ter no máximo 5MB.');
  }

  const photoRef = ref(storage, `affiliates/${slug}/profile.jpg`);
  await uploadBytes(photoRef, file, { contentType: file.type });
  const url = await getDownloadURL(photoRef);

  await updateDoc(doc(db, 'landingPages', slug), { profileImageUrl: url });

  return url;
}
