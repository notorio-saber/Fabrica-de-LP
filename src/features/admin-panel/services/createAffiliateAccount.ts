import { createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { getAdminUserCreationAuth } from '../../../firebase/adminUserCreationApp';
import { defaultLandingPagePermissions } from '../../../types/landingPage';

interface CreateAffiliateInput {
  slug: string;
  email: string;
  affiliateName: string;
  whatsappUrl: string;
  pixelId: string;
  themeId: string;
}

function randomTempPassword() {
  return crypto.randomUUID();
}

export async function createAffiliateAccount(input: CreateAffiliateInput): Promise<void> {
  const existing = await getDoc(doc(db, 'landingPages', input.slug));
  if (existing.exists()) {
    throw new Error('Esse slug já está em uso.');
  }

  const secondaryAuth = getAdminUserCreationAuth();
  const credential = await createUserWithEmailAndPassword(secondaryAuth, input.email, randomTempPassword());
  const uid = credential.user.uid;

  try {
    await setDoc(doc(db, 'users', uid), {
      role: 'affiliate',
      slug: input.slug,
      email: input.email,
      createdAt: serverTimestamp(),
    });

    await setDoc(doc(db, 'landingPages', input.slug), {
      slug: input.slug,
      ownerUid: uid,
      status: 'active',
      affiliateName: input.affiliateName,
      profileImageUrl: null,
      whatsappUrl: input.whatsappUrl,
      pixelId: input.pixelId || null,
      themeId: input.themeId,
      headline: null,
      subheadline: null,
      buttonText: null,
      permissions: defaultLandingPagePermissions,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await sendPasswordResetEmail(secondaryAuth, input.email);
  } finally {
    await signOut(secondaryAuth);
  }
}
