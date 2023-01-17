import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-create-empleado',
  templateUrl: './create-empleado.component.html',
  styleUrls: ['./create-empleado.component.css']
})
export class CreateEmpleadoComponent implements OnInit {
  /** Varuable FormGroup para nuestro formulario Reactivo. */
  createEmpleado: FormGroup;
  /** Bandera para condicionar nuestro template HTML */
  submitted = false;
  /** Bandera para el efecto del loading... */
  loading = false;
  /** Variable para almacenar el ID del Empleado */
  id: string | null;
  /** Variable para condicionar el titulo de la vista. */
  titulo = 'Agregar Empleado';
  /** Variable para guardar propiedades de la imagen. */
  image: any;
  /** Obtenemos la url de la Imagen recuperada */
  imageRecuperada: string = '';

  /**
   * Creates an instance of CreateEmpleadoComponent.
   * @param {FormBuilder} fb
   * @param {EmpleadoService} _empleadoService
   * @param {Router} router
   * @param {ToastrService} toastr
   * @param {ActivatedRoute} aRoute
   * @memberof CreateEmpleadoComponent
   */
  constructor(private fb: FormBuilder,
    private _empleadoService: EmpleadoService,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute) {
    this.createEmpleado = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      documento: ['', Validators.required],
      salario: ['', Validators.required],
      imagePost: ['', Validators.required],
      estatus: ['', Validators.required],
    })
    /**  Obtenemos ID del Empleado en base a la Url de nuestra app */
    this.id = this.aRoute.snapshot.paramMap.get('id');
  }

  /**
   * Ciclo de Vida Angular se manda a llamar metodo para realizar la evaluación.
   *
   * @memberof CreateEmpleadoComponent
   */
  ngOnInit(): void {
    this.esEditar();
  }

  /**
   * Metodo para evaluar si sera un Nuevo Empleado o
   * Edición del empleado.
   *
   * @return {*} 
   * @memberof CreateEmpleadoComponent
   */
  agregarEditarEmpleado() {
    this.submitted = true;

    if (this.createEmpleado.invalid) {
      return;
    }

    if (this.id === null) {
      this.agregarEmpleado();
    } else {
      this.editarEmpleado(this.id);
    }

  }

  /**
   * Metodo para guardar el Empleado en BD.
   *
   * @memberof CreateEmpleadoComponent
   */
  agregarEmpleado() {
    this.loading = true;
    this._empleadoService.uploadImage(this.image);
    setTimeout(() => {
      const empleado: any = {
        nombre: this.createEmpleado.value.nombre,
        apellido: this.createEmpleado.value.apellido,
        documento: this.createEmpleado.value.documento,
        salario: this.createEmpleado.value.salario,
        imagePost: sessionStorage.getItem('urlImagenFireBase') || null,
        estatus: this.createEmpleado.value.estatus,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      }
      this._empleadoService.agregarEmpleado(empleado).then(() => {
        this.toastr.success('El empleado fue registrado con exito!', 'Empleado Registrado', {
          positionClass: 'toast-bottom-right'
        });
        this.loading = false;
        sessionStorage.clear(); // Se borra la SessionStorage
        this.router.navigate(['/list-empleados']);
      }).catch(error => {
        console.log(error);
        this.loading = false;
      })
    }, 2500);
  }

  /**
   * Metodo para recuperar el Empleado y volver a consumir servicio
   * para la actualización de sus datos en BD Firebase. 
   *
   * @param {string} id
   * @memberof CreateEmpleadoComponent
   */
  editarEmpleado(id: string) {
    const empleado: any = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      documento: this.createEmpleado.value.documento,
      salario: this.createEmpleado.value.salario,
      fechaActualizacion: new Date(),
      estatus: this.createEmpleado.value.estatus,
    }

    this.loading = true;

    this._empleadoService.actualizarEmpleado(id, empleado).then(() => {
      this.loading = false;
      this.toastr.info('El empleado fue modificado con exito', 'Empleado modificado', {
        positionClass: 'toast-bottom-right'
      })
      this.router.navigate(['/list-empleados']);
    })
  }

  /**
   * Metodo para evaluar si la vista es para Agregar o Editar.
   *
   * @memberof CreateEmpleadoComponent
   */
  esEditar() {
    this.id === null ? this.titulo = 'Agregar Empleado' : this.titulo = 'Editar Empleado'
    if (this.id !== null) {
      this.loading = true;
      this._empleadoService.getEmpleado(this.id).subscribe(data => {
        console.log('dataaaaaaa ----- ', data.payload.data());
        this.imageRecuperada = data.payload.data()['imagePost'];
        this.loading = false;
        this.createEmpleado.setValue({
          nombre: data.payload.data()['nombre'],
          apellido: data.payload.data()['apellido'],
          documento: data.payload.data()['documento'],
          salario: data.payload.data()['salario'],
          imagePost: data.payload.data()['imagePost'],
          estatus: data.payload.data()['estatus']
        })
      })
    }
  }

  /**
   * Metodo para seleccionar la imagen y recuperar sus propiedades.
   *
   * @param {*} event
   * @memberof CreateEmpleadoComponent
   */
  selectFile(event: any): void {
    this.image = event.target.files[0];
  }

}
