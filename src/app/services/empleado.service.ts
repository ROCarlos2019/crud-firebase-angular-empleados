import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  /**
   * Creates an instance of EmpleadoService.
   * @param {AngularFirestore} firestore
   * @param {AngularFireStorage} storage
   * @memberof EmpleadoService
   */
  constructor(private firestore: AngularFirestore) {
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

}
