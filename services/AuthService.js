import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ADMIN_COLLECTION = 'admins';
const AUTH_STORAGE_KEY = '@lava_pizza_admin_auth';

/**
 * Authentication Service for Admin Users
 */
class AuthService {
  constructor() {
    this.currentUser = null;
    this.unsubscribeAuth = null;
  }

  /**
   * Initialize auth listener
   * @param {Function} callback - Called when auth state changes
   */
  initializeAuthListener(callback) {
    this.unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Check if user is admin
          const adminData = await this.getAdminProfile(user.uid);
          
          if (adminData) {
            this.currentUser = {
              uid: user.uid,
              email: user.email,
              ...adminData,
            };
            
            // Save to async storage
            await this.saveAuthState(this.currentUser);
            
            callback(this.currentUser, null);
          } else {
            // Not an admin, sign out
            await this.signOut();
            callback(null, new Error('Unauthorized: Admin access required'));
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          callback(null, error);
        }
      } else {
        this.currentUser = null;
        await this.clearAuthState();
        callback(null, null);
      }
    });
  }

  /**
   * Sign in with email and password
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @returns {Promise<Object>} Admin user object
   */
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      const user = userCredential.user;
      
      // Check if user is admin
      const adminData = await this.getAdminProfile(user.uid);
      
      if (!adminData) {
        // Not an admin, sign out
        await signOut(auth);
        throw new Error('Unauthorized: Admin access required');
      }
      
      // Update last login
      await this.updateLastLogin(user.uid);
      
      this.currentUser = {
        uid: user.uid,
        email: user.email,
        ...adminData,
      };
      
      // Save to async storage
      await this.saveAuthState(this.currentUser);
      
      console.log('Admin signed in successfully:', email);
      return this.currentUser;
    } catch (error) {
      console.error('Error signing in:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign out current admin
   * @returns {Promise<void>}
   */
  async signOut() {
    try {
      await signOut(auth);
      this.currentUser = null;
      await this.clearAuthState();
      console.log('Admin signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  /**
   * Get admin profile from Firestore
   * @param {string} uid - User ID
   * @returns {Promise<Object|null>} Admin profile or null
   */
  async getAdminProfile(uid) {
    try {
      const adminDoc = await getDoc(doc(db, ADMIN_COLLECTION, uid));
      
      if (adminDoc.exists()) {
        return adminDoc.data();
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      return null;
    }
  }

  /**
   * Create admin profile (for initial setup)
   * @param {string} uid - User ID
   * @param {Object} profileData - Admin profile data
   * @returns {Promise<void>}
   */
  async createAdminProfile(uid, profileData) {
    try {
      await setDoc(doc(db, ADMIN_COLLECTION, uid), {
        ...profileData,
        role: 'admin',
        createdAt: Timestamp.now(),
        lastLogin: Timestamp.now(),
      });
      
      console.log('Admin profile created for:', uid);
    } catch (error) {
      console.error('Error creating admin profile:', error);
      throw error;
    }
  }

  /**
   * Update last login timestamp
   * @param {string} uid - User ID
   * @returns {Promise<void>}
   */
  async updateLastLogin(uid) {
    try {
      await updateDoc(doc(db, ADMIN_COLLECTION, uid), {
        lastLogin: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating last login:', error);
      // Don't throw, this is not critical
    }
  }

  /**
   * Send password reset email
   * @param {string} email - Admin email
   * @returns {Promise<void>}
   */
  async sendPasswordReset(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent to:', email);
    } catch (error) {
      console.error('Error sending password reset:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Change admin password
   * @param {string} newPassword - New password
   * @returns {Promise<void>}
   */
  async changePassword(newPassword) {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('No user logged in');
      }
      
      await updatePassword(user, newPassword);
      console.log('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get current admin user
   * @returns {Object|null} Current admin user
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated
   */
  isAuthenticated() {
    return this.currentUser !== null;
  }

  /**
   * Check if user has specific permission
   * @param {string} permission - Permission to check
   * @returns {boolean} True if has permission
   */
  hasPermission(permission) {
    if (!this.currentUser) return false;
    
    const permissions = this.currentUser.permissions || [];
    return permissions.includes(permission) || this.currentUser.role === 'superadmin';
  }

  /**
   * Save auth state to AsyncStorage
   * @param {Object} user - User object
   * @returns {Promise<void>}
   */
  async saveAuthState(user) {
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving auth state:', error);
    }
  }

  /**
   * Load auth state from AsyncStorage
   * @returns {Promise<Object|null>} User object or null
   */
  async loadAuthState() {
    try {
      const userJson = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error loading auth state:', error);
      return null;
    }
  }

  /**
   * Clear auth state from AsyncStorage
   * @returns {Promise<void>}
   */
  async clearAuthState() {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing auth state:', error);
    }
  }

  /**
   * Handle Firebase auth errors
   * @param {Error} error - Firebase error
   * @returns {Error} User-friendly error
   */
  handleAuthError(error) {
    const errorMessages = {
      'auth/invalid-email': 'Invalid email address',
      'auth/user-disabled': 'This account has been disabled',
      'auth/user-not-found': 'Invalid email or password',
      'auth/wrong-password': 'Invalid email or password',
      'auth/email-already-in-use': 'Email already in use',
      'auth/weak-password': 'Password is too weak',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later',
      'auth/network-request-failed': 'Network error. Please check your connection',
      'auth/requires-recent-login': 'Please sign in again to continue',
    };
    
    const message = errorMessages[error.code] || error.message;
    return new Error(message);
  }

  /**
   * Clean up auth listener
   */
  cleanup() {
    if (this.unsubscribeAuth) {
      this.unsubscribeAuth();
      this.unsubscribeAuth = null;
    }
  }
}

export default new AuthService();
