import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

export async function login(values: any) {
  const { user } = await signInWithEmailAndPassword(auth, values.email, values.password);
  return user;
}

export async function signup(values: any) {
  const { user } = await createUserWithEmailAndPassword(auth, values.email, values.password);
  
  // Create user profile in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    displayName: values.displayName || user.email?.split('@')[0],
    email: user.email,
    role: 'client',
    createdAt: serverTimestamp()
  });
  
  return user;
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const { user } = await signInWithPopup(auth, provider);
  
  // Check if profile exists, if not create
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) {
    await setDoc(doc(db, 'users', user.uid), {
      displayName: user.displayName,
      email: user.email,
      role: 'client',
      photoURL: user.photoURL,
      createdAt: serverTimestamp()
    });
  }
  
  return user;
}

export async function logout() {
  await signOut(auth);
}
