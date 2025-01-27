import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import firestore from '@/utils/database';
import DB_COLLECTIONS from '@/utils/constant';

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: 'Missing email' });

  const db = new firestore();
  const userRef = db.getCollection(DB_COLLECTIONS.LOGIN);
  const querySnapshot = await userRef.where('email', '==', email).get();

  if (querySnapshot.empty) {
    return res.status(404).json({ message: 'User not found' });
  }

  const userData = querySnapshot.docs[0].data();
  return res.status(200).json({ user: userData });
};

export const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, email } = req.body;

  if (!email) return res.status(400).json({ message: 'Missing email' });

  const db = new firestore();
  const userRef = db.getCollection(DB_COLLECTIONS.LOGIN);
  const querySnapshot = await userRef.where('email', '==', email).get();

  if (querySnapshot.empty) {
    return res.status(404).json({ message: 'User not found' });
  }

  const userDoc = querySnapshot.docs[0];
  await userDoc.ref.update({ name });

  return res.status(200).json({ message: 'User updated successfully', user: { name, email } });
};
