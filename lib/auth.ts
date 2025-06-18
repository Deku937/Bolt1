// Simple authentication system with localStorage
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType?: 'patient' | 'professional';
  isSignedIn: boolean;
}

class AuthService {
  private storageKey = 'mindwell_user';

  // Check if user is signed in
  isSignedIn(): boolean {
    if (typeof window === 'undefined') return false;
    const user = this.getCurrentUser();
    return user?.isSignedIn || false;
  }

  // Get current user from localStorage
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const userData = localStorage.getItem(this.storageKey);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  // Sign in with any credentials (always succeeds)
  signIn(email: string, password: string, firstName?: string, lastName?: string): User {
    const user: User = {
      id: Date.now().toString(),
      email,
      firstName: firstName || email.split('@')[0],
      lastName: lastName || 'User',
      isSignedIn: true
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(user));
    }

    return user;
  }

  // Update user type
  updateUserType(userType: 'patient' | 'professional'): User | null {
    const user = this.getCurrentUser();
    if (!user) return null;

    const updatedUser = { ...user, userType };
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(updatedUser));
    }

    return updatedUser;
  }

  // Sign out
  signOut(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }
}

export const authService = new AuthService();