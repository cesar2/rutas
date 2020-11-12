import { Injectable } from '@angular/core';
import {UserI} from '../models/user.interface';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { FileI } from '../models/file.interface';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userData$: Observable<firebase.User>;
  private filePath: string;


  constructor(private afAuth: AngularFireAuth, private storage: AngularFireStorage) {
    this.userData$ = afAuth.authState;
   }


  loginByEmail(user:UserI){
    const { email, password } = user;
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logout(){
    this.afAuth.signOut();
  }

  async saveUserProfile(user: UserI): Promise<any> {
    (await this.afAuth.currentUser).updateProfile({
      displayName: user.displayName,
      photoURL: user.photoURL
    }).then(() => console.log('User updated'))
      .catch(err => console.log('error', err));
  }

  private uploadImage(user: UserI, image: FileI): void {
    this.filePath = `images/${image.name}`;
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image);
    task.snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(urlImage => {
            user.photoURL = urlImage;
            this.saveUserProfile(user);
          });
        })
      ).subscribe();
  }

  preSaveUserProfile(user: UserI, image?: FileI): void {
    if (image) {
      this.uploadImage(user, image);
    } else {
      this.saveUserProfile(user);
    }
  }

}
