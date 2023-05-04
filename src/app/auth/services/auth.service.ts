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
import Swal from 'sweetalert2';

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
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/invalid-email') {
          Swal.fire({
            title: 'Error!',
            text: 'Invalid email, MAN!',
            icon: 'error',
            confirmButtonText: 'Cool',
          });
        } else if (error.code === 'auth/user-not-found') {
          Swal.fire({
            title: 'Error!',
            text: 'User not found, MAN!',
            icon: 'error',
            confirmButtonText: 'Cool',
          });
        } else if (error.code === 'auth/user-disabled') {
          Swal.fire({
            title: 'Error!',
            text: 'User disabled, MAN!',
            icon: 'error',
            confirmButtonText: 'Cool',
          });
        } else if (error.code === 'auth/wrong-password') {
          Swal.fire({
            title: 'Error!',
            text: 'Wrong password, MAN!',
            icon: 'error',
            confirmButtonText: 'Cool',
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: `${error.message}, MAN!`,
            icon: 'error',
            confirmButtonText: 'Cool',
          });
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
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/invalid-email') {
          Swal.fire({
            title: 'Error!',
            text: 'Invalid email, MAN!',
            icon: 'error',
            confirmButtonText: 'Cool',
          });
        } else if (error.code === 'auth/email-already-in-use') {
          Swal.fire({
            title: 'Error!',
            text: 'Email already in use, MAN!',
            icon: 'error',
            confirmButtonText: 'Cool',
          });
        } else if (error.code === 'auth/operation-not-allowed') {
          Swal.fire({
            title: 'Error!',
            text: 'Operation not allowed, MAN!',
            icon: 'error',
            confirmButtonText: 'Cool',
          });
        } else if (error.code === 'auth/weak-password') {
          Swal.fire({
            title: 'Error!',
            text: 'Weak password, MAN!',
            icon: 'error',
            confirmButtonText: 'Cool',
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: `${error.message}, MAN!`,
            icon: 'error',
            confirmButtonText: 'Cool',
          });
        }
      }
    }
  }

  async sendVerificationMail() {
    try {
      await (await this.afAuth.currentUser)?.sendEmailVerification();
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.log(error);
    }
  }

  async ForgotPassword(passwordResetEmail: string) {
    try {
      await this.afAuth.sendPasswordResetEmail(passwordResetEmail);
      Swal.fire({
        title: 'Email Sent',
        text: 'Please, check your email',
        icon: 'success',
        confirmButtonText: 'Cool',
      });
      this.router.navigate(['/auth/login']);
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/invalid-email') {
          Swal.fire({
            title: 'Error!',
            text: 'Invalid email, MAN!',
            icon: 'error',
            confirmButtonText: 'Cool',
          });
        } else if (error.code === 'auth/user-not-found') {
          Swal.fire({
            title: 'Error!',
            text: 'User not found, MAN!',
            icon: 'error',
            confirmButtonText: 'Cool',
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: `${error.message}, MAN!`,
            icon: 'error',
            confirmButtonText: 'Cool',
          });
        }
      }
    }
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false;
  }

  async GoogleAuth() {
    try {
      const result = await this.afAuth.signInWithPopup(
        new firebase.auth.GoogleAuthProvider()
      );
      this.router.navigate(['dashboard']);
      await this.updateUserData(result.user!);
    } catch (error) {
      console.log(error);
    }
  }

  async SignOut() {
    await this.afAuth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['login']);
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
