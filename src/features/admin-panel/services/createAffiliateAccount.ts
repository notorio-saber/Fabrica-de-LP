import { createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { getAdminUserCreationAuth } from '../../../firebase/adminUserCreationApp';
import { defaultLandingPagePermissions, defaultSectionsConfig } from '../../../types/landingPage';

interface CreateAffiliateInput {
  slug: string;
  email: string;
  affiliateName: string;
  whatsappUrl: string;
  pixelId: string;
  themeId: string;
}

const PASSWORD_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';

function randomTempPassword() {
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += PASSWORD_CHARS[Math.floor(Math.random() * PASSWORD_CHARS.length)];
  }
  return password;
}

export interface CreateAffiliateResult {
  password: string;
}

export async function createAffiliateAccount(input: CreateAffiliateInput): Promise<CreateAffiliateResult> {
  const existing = await getDoc(doc(db, 'landingPages', input.slug));
  if (existing.exists()) {
    throw new Error('Esse slug já está em uso.');
  }

  const password = randomTempPassword();
  const secondaryAuth = getAdminUserCreationAuth();
  const credential = await createUserWithEmailAndPassword(secondaryAuth, input.email, password);
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
      sections: defaultSectionsConfig,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Best-effort backup: the admin shares the password above directly, so a
    // failure to send this email (deliverability, spam filters) shouldn't
    // block affiliate creation.
    try {
      await sendPasswordResetEmail(secondaryAuth, input.email);
    } catch {
      // ignored — password above is the primary way the affiliate gets in.
    }
  } finally {
    await signOut(secondaryAuth);
  }

  return { password };
}
