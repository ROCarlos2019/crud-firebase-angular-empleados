import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-list-empleados',
  templateUrl: './list-empleados.component.html',
  styleUrls: ['./list-empleados.component.css']
})
export class ListEmpleadosComponent implements OnInit {
  /** Variable para almacenar nuestro array de Empleados */
  empleados: any[] = [];

  /**
   * Creates an instance of ListEmpleadosComponent.
   * @param {EmpleadoService} _empleadoService
   * @param {ToastrService} toastr
   * @memberof ListEmpleadosComponent
   */
  constructor(private _empleadoService: EmpleadoService,
              private toastr: ToastrService) {
  }

  /**
   * Ciclo de vida de nuestra app.
   * Mandamos a llamar el metodo al inicializar la vista.
   *
   * @memberof ListEmpleadosComponent
   */
  ngOnInit(): void {
    this.getEmpleados()
  }

  /**
   * Obtenemos todos los empleados de nuestra BD Firebase y
   * los almacenamos en nuestra variable "empleados".
   *
   * @memberof ListEmpleadosComponent
   */
  getEmpleados() {
    this._empleadoService.getEmpleados().subscribe(data => {
      this.empleados = [];
      data.forEach((element: any) => {
        this.empleados.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
      console.log(this.empleados);
    });
  }

  /**
   * Metodo para eliminar nuestro empleado en BD
   * argumento id para saber que registro corresponde eliminar.
   *
   * @param {string} id
   * @memberof ListEmpleadosComponent
   */
  eliminarEmpleado(id: string) {
    this._empleadoService.eliminarEmpleado(id).then(() => {
      console.log('empelado eliminado con exito');
      this.toastr.error('El empleado fue eliminado con exito', 'Registro eliminado!', {
        positionClass: 'toast-bottom-right'
      });
    }).catch(error => {
      console.log(error);
    })
  }

}
