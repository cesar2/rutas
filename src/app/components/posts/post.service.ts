import { Injectable, ɵSWITCH_IVY_ENABLED__POST_R3__ } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { map, timestamp, finalize } from 'rxjs/operators';
import { PostI } from '../../shared/models/post.interface'; 
import { FileI } from '../../shared/models/file.interface';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private postsCollection: AngularFirestoreCollection<PostI>;
  private filePath: any;
  private filePathGpx: any;
  private downloadURL: Observable<string>;  
  private downloadTrackURL: Observable<string>;  


  constructor(private afs: AngularFirestore, private storage: AngularFireStorage ) { 
    this.postsCollection = afs.collection<PostI>('posts');
  }


  public getAllPost():Observable<PostI[]>{
    return this.postsCollection
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as PostI;
          const id = a.payload.doc.id;
          return {id, ...data};
        }))
      )
  }

  public getOnePost(id: string):Observable<PostI>{
    return this.afs.doc<PostI>(`posts/${id}`).valueChanges();
  }

  public deletePostById(post: PostI){
    return this.postsCollection.doc(post.id).delete();
  }

  public editPostById(post: PostI, newImage?: FileI){

    if(newImage){
      console.log("Hay nueva imagen");
      this.uploadImage(post,newImage);
    }else{
      console.log("Actualizando cuando no hay nueva imagen");
      return this.postsCollection.doc(post.id).update(post);
    }
  }

  public async preAdAndUpdatePost(post: PostI, image: FileI, gpx: FileI){
     this.uploadImage(post, image).then(value => {
      this.uploadTrack(post, gpx)
     }
       );
  }

  private savePost(post: PostI){
    console.log("Entra en SAVEPOST()");
    const postObj = {
      titlePost: post.titlePost,
      subTitle: post.subTitle,
      urlTitle: post.titlePost.replace(/-/g, ' ').replace(/\s+/g,' ').replace(/\s+/g, '-').toLowerCase(),
      contentPost: post.contentPost,
      imagePost: this.downloadURL,
      gpxPost: this.downloadTrackURL,
      fileRef: this.filePath,
      fileRefimagekit: "https://ik.imagekit.io/fd7vntlxh/"+this.filePath+"?tr=w-300,h-200",
      tagsPost: post.tagsPost
    };

    if(post.id){
      console.log("SavePost() cuando ya tiene ID");
      return this.postsCollection.doc(post.id).update(postObj);
    }
    else{
      console.log("SavePost() cuando ES NUEVO");
      return this.postsCollection.doc(postObj.urlTitle).set(postObj);
    }
  }

  private uploadImage(post: PostI, image:FileI){
    console.log("Subiendo imagen...");
    this.filePath = `images/`+post.titlePost+`/`+image[0].name;
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image[0]);
    return new Promise(resolve => {
      task.snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe( urlImage => {
            this.downloadURL = urlImage;
            console.log("DonloadURL", this.downloadURL);
            post.imagePost =this.downloadURL;
            resolve(post.imagePost);
          })
        }

        )
      ).subscribe();
    })
  }

  private uploadTrack(post: PostI, gpx:FileI){
    console.log("Subiendo Track...");
    this.filePathGpx = `tracks/${gpx.name}`;
    const fileRef = this.storage.ref(this.filePathGpx);
    const task = this.storage.upload(this.filePathGpx, gpx);
    task.snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe( urlTrack => {
            this.downloadTrackURL = urlTrack;
            console.log("download Track URL", this.downloadTrackURL);
            this.savePost(post);
          })
        }

        )
      ).subscribe();
  }

}
