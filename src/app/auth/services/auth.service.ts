import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import * as alertifyjs from 'alertifyjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router
  ) {
    // Get the auth state, then fetch the Firestore user document or null
    this.afAuth.authState.subscribe(async (user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        await this.updateUserData(this.userData);
      } else {
        localStorage.setItem('user', 'null');
      }
    });
  }

  async SignIn(email: string, password: string) {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      if (result.user) {
        this.router.navigate(['/main/home']);
        alertifyjs.success('Successful logged in');
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/invalid-email') {
          alertifyjs.error('Invalid email');
        } else if (error.code === 'auth/user-not-found') {
          alertifyjs.error('User not found');
        } else if (error.code === 'auth/user-disabled') {
          alertifyjs.error('User disabled');
        } else if (error.code === 'auth/wrong-password') {
          alertifyjs.error('Wrong password');
        } else {
          alertifyjs.error(`${error.message}`);
        }
      }
    }
  }

  async SignUp(email: string, password: string) {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      await this.sendVerificationMail();
      await this.updateUserData(result.user!);
      alertifyjs.success('Successful registration');
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/invalid-email') {
          alertifyjs.error('Invalid email');
        } else if (error.code === 'auth/email-already-in-use') {
          alertifyjs.error('Email already in use');
        } else if (error.code === 'auth/operation-not-allowed') {
          alertifyjs.error('Operation not allowed');
        } else if (error.code === 'auth/weak-password') {
          alertifyjs.error('Wrong password');
        } else {
          alertifyjs.error(`${error.message}`);
        }
      }
    }
  }

  async sendVerificationMail() {
    try {
      await (await this.afAuth.currentUser)?.sendEmailVerification();
      this.router.navigate(['/auth/login']);
    } catch (error) {
      if (error instanceof FirebaseError) {
        alertifyjs.error(`${error.message}`);
      }
    }
  }

  async ForgotPassword(passwordResetEmail: string) {
    try {
      await this.afAuth.sendPasswordResetEmail(passwordResetEmail);

      this.router.navigate(['/auth/login']);
      alertifyjs.warning('Email has been sent');
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/invalid-email') {
          alertifyjs.error('Invalid email');
        } else if (error.code === 'auth/user-not-found') {
          alertifyjs.error('User not found');
        } else {
          alertifyjs.error(`${error.message}`);
        }
      }
    }
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false;
  }

  // async GoogleAuth() {
  //   try {
  //     const result = await this.afAuth.signInWithPopup(
  //       new firebase.auth.GoogleAuthProvider()
  //     );
  //     this.router.navigate(['/main/home']);
  //     await this.updateUserData(result.user!);
  //   } catch (error) {
  //     if (error instanceof FirebaseError) {
  //       alertifyjs.error(`${error.message}`);
  //     }
  //   }
  // }

  async SignOut() {
    await this.afAuth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
    alertifyjs.warning('Logged out');
  }

  private async updateUserData(user: firebase.User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );

    const data = {
      uid: user.uid,
      email: user.email!,
      username: user.displayName!,
    };

    return userRef.set(data, { merge: true });
  }
}
