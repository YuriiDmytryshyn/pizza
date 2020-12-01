import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  localStorageUser: any;
  cheackSignIn: Subject<boolean> = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router
  ) { }

  signUp(email: string, password: string): void {
    this.auth.createUserWithEmailAndPassword(email, password)
      .then(userResponse => {
        const user = {
          id: userResponse.user.uid,
          email: userResponse.user.email,
          role: 'user',
        };
        this.db.collection('users').add(user)
          .then(collection => {
            collection.get()
              .then(user => {
                localStorage.setItem('user', JSON.stringify(user.data()));
                this.cheackSignIn.next(true);
                this.router.navigateByUrl('profile');
              })
          })
      })
      .catch(err => console.log(err));
  };

  signIn(email: string, password: string): void {
    this.auth.signInWithEmailAndPassword(email, password)
      .then(userResponse => {
        this.db.collection('users').ref.where('id', '==', userResponse.user.uid)
          .onSnapshot(snap => {
            snap.forEach(user => {
              localStorage.setItem('user', JSON.stringify(user.data()));
              this.cheackSignIn.next(true);
              this.localStorageUser = JSON.parse(localStorage.getItem('user'));
              if (this.localStorageUser.role === 'admin') {
                this.router.navigateByUrl('admin');
              } else {
                this.router.navigateByUrl('profile');
              }
            })
          })
      })
  };

  signOut(): void {
    this.auth.signOut()
      .then(() => {
        localStorage.removeItem('user');
        this.cheackSignIn.next(false);
        this.router.navigateByUrl('home');
      })
  };

}
