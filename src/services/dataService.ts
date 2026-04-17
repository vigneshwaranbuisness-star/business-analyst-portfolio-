import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy,
  getDocFromServer,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Transaction } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testConnection(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      // Try to get a non-existent doc to test connection
      await getDocFromServer(doc(db, 'test', 'connection'));
      console.log("Firebase connection successful.");
      return; // Success
    } catch (error: any) {
      console.warn(`Firebase Connection Attempt ${i + 1} failed:`, error.message);
      
      if (i === retries - 1) {
        console.error("CRITICAL: Firebase Connection Test Failed after multiple attempts.");
        if (error.message.includes('unavailable') || error.message.includes('offline')) {
          console.error("This usually means the Firestore backend is unreachable from this environment.");
          console.error("Fixes tried: experimentalForceLongPolling, useFetchStreams: false.");
        }
      } else {
        // Wait 1s before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
}

export function subscribeToTransactions(userId: string, callback: (transactions: Transaction[]) => void) {
  const path = 'transactions';
  const q = query(
    collection(db, path),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Transaction));
    callback(transactions);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
}

// Helper to remove undefined values from Firestore payloads
function sanitizeData(data: any) {
  const sanitized = { ...data };
  Object.keys(sanitized).forEach(key => {
    if (sanitized[key] === undefined) {
      delete sanitized[key];
    }
  });
  return sanitized;
}

export async function addTransaction(transaction: Omit<Transaction, 'id'>) {
  const path = 'transactions';
  try {
    const docRef = await addDoc(collection(db, path), sanitizeData({
      ...transaction,
      userId: auth.currentUser?.uid // Ensure userId is correctly set from current user
    }));
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateTransaction(id: string, updates: Partial<Transaction>) {
  const path = `transactions/${id}`;
  try {
    await updateDoc(doc(db, 'transactions', id), sanitizeData(updates));
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteTransaction(id: string) {
  const path = `transactions/${id}`;
  try {
    await deleteDoc(doc(db, 'transactions', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
