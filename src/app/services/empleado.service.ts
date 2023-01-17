import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FileI } from '../models/file.interface';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  /** Variable para obtener el path de la ruta relativa en Storage de Firebase */
  private filePath: any;
  /** Variable para almacenar URL image.*/
  private downloadURL: Observable<string> | undefined;

  /**
   * Creates an instance of EmpleadoService.
   * @param {AngularFirestore} firestore
   * @param {AngularFireStorage} storage
   * @memberof EmpleadoService
   */
  constructor(private firestore: AngularFirestore,
    private storage: AngularFireStorage) {
  }

  /**
   * Metodo Publico tipo Promesa consumo servicio
   * agregar los datos del empleado a nuestra collection en Firebase.
   *
   * @param {*} empleado
   * @return {*}  {Promise<any>}
   * @memberof EmpleadoService
   */
  public agregarEmpleado(empleado: any): Promise<any> {
    return this.firestore.collection('empleados').add(empleado);
  }

  /**
   * Metodo para obtener todos los empleados ordenados por fechaCreacion de manera "asc".
   *
   * @return {*}  {Observable<any>}
   * @memberof EmpleadoService
   */
  getEmpleados(): Observable<any> {
    return this.firestore.collection('empleados', ref => ref.orderBy('fechaCreacion', 'asc')).snapshotChanges();
  }

  /**
   * Metodo para Eliminar Empleado por su id.
   *
   * @param {string} id
   * @return {*}  {Promise<any>}
   * @memberof EmpleadoService
   */
  eliminarEmpleado(id: string): Promise<any> {
    return this.firestore.collection('empleados').doc(id).delete();
  }

  /**
   * Nos permite obtener un unico Empleado por su id.
   *
   * @param {string} id
   * @return {*}  {Observable<any>}
   * @memberof EmpleadoService
   */
  getEmpleado(id: string): Observable<any> {
    return this.firestore.collection('empleados').doc(id).snapshotChanges();
  }

  /**
   * Actualizamos el registro en BD por su ID.
   *
   * @param {string} id
   * @param {*} data
   * @return {*}  {Promise<any>}
   * @memberof EmpleadoService
   */
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
            sessionStorage.setItem('urlImagenFireBase', urlImage); // Setiamos la url para su recuperación
          });
        })
      ).subscribe();
  }

}
