import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FileI } from '../models/file.interface';
import { PostI } from '../models/post.interface';



@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  private postsCollection: AngularFirestoreCollection<any>;
  private filePath: any;
  private downloadURL: Observable<string> | undefined;

  constructor(private firestore: AngularFirestore,
    private storage: AngularFireStorage) {
    this.postsCollection = firestore.collection<any>('empleados');

  }

  private _savePostEmpleado(empleado: any) {
    const postObj = {
      // titlePost: 'empleado.titlePost',
      // contentPost: 'empleado.contentPost',
      imagePost: this.downloadURL,
      fileRef: this.filePath,
      // tagsPost: 'empleado.tagsPost'
    };
    return this.postsCollection.add(postObj);
  }

  public agregarEmpleado(empleado: any): Promise<any> {
    return this.firestore.collection('empleados').add(empleado);
  }

  getEmpleados(): Observable<any> {
    return this.firestore.collection('empleados', ref => ref.orderBy('fechaCreacion', 'asc')).snapshotChanges();
  }

  eliminarEmpleado(id: string): Promise<any> {
    return this.firestore.collection('empleados').doc(id).delete();
  }

  getEmpleado(id: string): Observable<any> {
    return this.firestore.collection('empleados').doc(id).snapshotChanges();
  }

  actualizarEmpleado(id: string, data: any): Promise<any> {
    return this.firestore.collection('empleados').doc(id).update(data);
  }

  public uploadImage(image: FileI) {
    this.filePath = `images/${image.name}`;
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image);
    task.snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(urlImage => {
            this.downloadURL = urlImage; // Se guarda la url completa de la imagen en Storage ya en FireBase
            // this._savePostEmpleado(empleado);
            sessionStorage.setItem('urlImagenFireBase', urlImage);
          });
        })
      ).subscribe();
  }

}
