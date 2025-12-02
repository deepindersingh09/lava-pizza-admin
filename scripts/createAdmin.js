// scripts/createAdmin.js
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

async function createAdmin() {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      'admin@lavapizza.com',
      'YourSecurePassword123!'
    );
    
    const user = userCredential.user;
    
    // Create admin profile
    await setDoc(doc(db, 'admins', user.uid), {
      email: user.email,
      name: 'Admin User',
      role: 'admin',
      permissions: ['all'],
      createdAt: Timestamp.now(),
      lastLogin: Timestamp.now(),
    });
    
    console.log('✅ Admin created successfully!');
    console.log('Email:', user.email);
    console.log('UID:', user.uid);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  }
}

createAdmin();