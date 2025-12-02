import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-registro-alumnos',
  templateUrl: './registro-alumnos.component.html',
  styleUrls: ['./registro-alumnos.component.scss']
})
export class RegistroAlumnosComponent implements OnInit {

  @Input() rol: string = "";
  @Input() datos_user: any = {};

  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public alumno:any= {};
  public token: string = "";
  public errors:any={};
  public editar:boolean = false;
  public idUser: Number = 0;

  constructor(
    private location: Location,
    public activatedRoute: ActivatedRoute,
    private alumnosService: AlumnosService,
    private facadeService: FacadeService,
    private router: Router
  ) { }

  ngOnInit(): void {
   //el primer if valida si existe un parametro en la URL
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
      //Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idUser = this.activatedRoute.snapshot.params['id'];
      console.log("ID User: ", this.idUser);
      //Al iniciar la vista asignamos los datos del user
      this.alumno = this.datos_user;
    }else{
      //VA a registrar un alumno por primera vez
      this.alumno = this.alumnosService.esquemaAlumno();
      this.alumno.rol = this.rol;
      this.token =this.facadeService.getSessionToken();
    }
    //Imprimir datos en la consola
    console.log('Alumno: ', this.alumno);
  }

  public regresar(){
    this.location.back();
  }

  public registrar(){
    // Validaciones del formulario
    this.errors = {};
    this.errors = this.alumnosService.validarAlumno(this.alumno, this.editar);
    if(Object.keys(this.errors).length > 0){
      return false;
    }
    // Se verifica si las contraseñas coinciden
    if(this.alumno.password != this.alumno.confirmar_password){
      alert('Las contraseñas no coinciden');
      return false;
    }
    // Si pasa todas las validaciones se registra el alumno
    this.alumnosService.registrarAlumno(this.alumno).subscribe({
      next: (response:any) => {
        //Aquí va la ejecución del servicio si todo es correcto
        alert('Alumno registrado con éxito');
        console.log("Alumno registrado",response);

        //Validar si se registro que entonces navegue a la lista de alumno
        if(this.token != ""){
          this.router.navigate(['alumno']);
        }else{
          this.router.navigate(['/']);
        }
      },
      error: (error:any) => {
        if(error.status === 422){
          this.errors = error.error.errors;
        } else {
          alert('Error al registrar el alumno');
        }
      }
    });
  }

  public actualizar(){
    // Validación de los datos
    this.errors = {};
    this.errors = this.alumnosService.validarAlumno(this.alumno, this.editar);
    if(Object.keys(this.errors).length > 0){
      return false;
    }

    // Ejecutamos el servicio de actualización
    this.alumnosService.actualizarAlumno(this.alumno).subscribe(
      (response) => {
        // Redirigir o mostrar mensaje de éxito
        alert("Alumno actualizado exitosamente");
        console.log("Alumno actualizado: ", response);
        this.router.navigate(["Alumno"]);
      },
      (error) => {
        // Manejar errores de la API
        alert("Error al actualizar alumno");
        console.error("Error al actualizar alumno: ", error);
      }
    );
  }

  //Funciones para password
  showPassword()
  {
    if(this.inputType_1 == 'password'){
      this.inputType_1 = 'text';
      this.hide_1 = true;
    }
    else{
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  showPwdConfirmar()
  {
    if(this.inputType_2 == 'password'){
      this.inputType_2 = 'text';
      this.hide_2 = true;
    }
    else{
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

  //Función para detectar el cambio de fecha
  public changeFecha(event :any){
    console.log(event);
    console.log(event.value.toISOString());

    this.alumno.fecha_nacimiento = event.value.toISOString().split("T")[0];
    console.log("Fecha: ", this.alumno.fecha_nacimiento);
  }

  validarCaracter(event: KeyboardEvent): void {
    const regex = /^[a-zA-Z0-9]$/;
    const inputChar = event.key;
    if (!regex.test(inputChar)) {
      event.preventDefault(); // bloquea espacios y símbolos
    }

  }
  public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permitir solo letras (mayúsculas y minúsculas) y espacio
    if (
      !(charCode >= 65 && charCode <= 90) &&  // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      charCode !== 32                         // Espacio
    ) {
      event.preventDefault();
    }
  }

}
