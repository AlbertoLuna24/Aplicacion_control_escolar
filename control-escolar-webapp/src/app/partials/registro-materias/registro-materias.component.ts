import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { MateriasService } from 'src/app/services/materias.service';
import { Location } from '@angular/common';


declare var $:any;

@Component({
  selector: 'app-registro-materias',
  templateUrl: './registro-materias.component.html',
  styleUrls: ['./registro-materias.component.scss']
})
export class RegistroMateriasComponent implements OnInit {
  @Input() datos_user: any = {};
  public tipo:string = "registro-materias";
  public valoresCheckbox: any = [];
  public dias_json: any [] = [];
  public lista_profesores: any[] = [];

  //Para el select
  public programas: any[] = [
    {value: '1', viewValue: 'Ingeniería en Ciencias de la Computación'},
    {value: '2', viewValue: 'Licenciatura en Ciencias de la Computación'},
    {value: '3', viewValue: 'Ingeniería en Tecnologías de la Información'},
  ];

  public dias:any[]= [
    {value: '1', nombre: 'Lunes'},
    {value: '2', nombre: 'Martes'},
    {value: '3', nombre: 'Miercoles'},
    {value: '4', nombre: 'Jueves'},
    {value: '5', nombre: 'Viernes'},
  ];


  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public materia:any= {};
  public token: string = "";
  public errors:any={};
  public editar:boolean = false;
  public idUser: Number = 0;

  constructor(
    private location : Location,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private materiasService: MateriasService,
    private facadeService: FacadeService
  ){}

  ngOnInit(): void {


    //El primer if valida si existe un parámetro en la URL
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
      //Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idUser = this.activatedRoute.snapshot.params['id'];
      console.log("ID Materia: ", this.idUser);
      this.materiasService.ObtenerMateriaPorID(this.idUser).subscribe(
        (response) => {
          // Llenar los campos del formulario con los datos de la materia
          this.materia = response;
          console.log("Datos de la materia: ", this.materia);
        },
        (error) => {
          console.error("Error al obtener los datos de la materia:", error);
          // Manejar el error adecuadamente (por ejemplo, mostrar un mensaje al usuario)
        }
      );
    }else{
      this.materia = this.materiasService.esquemaMateria();
      this.token = this.facadeService.getSessionToken();
    }
    //Imprimir datos en consola
    console.log("Materia: ", this.materia);

    this.obtenerProfesores();

  }

  public checkboxChange(event:any){
    //console.log("Evento: ", event);
    if(event.checked){
      this.materia.dias_json.push(event.source.value)
    }else{
      console.log(event.source.value);
      this.materia.dias_json.forEach((materia, i) => {
        if(materia == event.source.value){
          this.materia.dias_json.splice(i,1)
        }
      });
    }
    console.log("Array dias: ", this.materia.dias_json);
  }

  public revisarSeleccion(nombre: string){
    if(this.materia.dias_json){
      var busqueda = this.materia.dias_json.find((element)=>element==nombre);
      if(busqueda != undefined){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }


  //obtener maestros
  public obtenerProfesores() {
    this.materiasService.obtenerProfesores().subscribe(
      (response: any[]) => {
        this.lista_profesores = response;
        console.log("Profesores cargados:", this.lista_profesores);
      },
      (error) => { console.error("Error al cargar profesores", error); }
    );
  }


  public regresar(){
    this.location.back();
  }

  public registrar(){
    // Validaciones del formulario
    this.errors = {};
    this.errors = this.materiasService.validarMateria(this.materia, this.editar);
    if(Object.keys(this.errors).length > 0){
      return false;
    }

    // Si pasa todas las validaciones se registra el maestro
    this.materiasService.registrarMateria(this.materia).subscribe({
      next: (response:any) => {
        //Aquí va la ejecución del servicio si todo es correcto
        alert('Materia registrada con éxito');
        console.log("Materia registrada",response);

        //Validar si se registro que entonces navegue a la lista de maestro
        if(this.token != ""){
          this.router.navigate(['home']);
        }else{
          this.router.navigate(['/']);
        }
      },
      error: (error:any) => {
        if(error.status === 422){
          this.errors = error.error.errors;
        } else {
          alert('Error al registrar la materia');
        }
      }
    });

  }


  public actualizar(){
    //Validación
    this.errors = [];

    this.errors = this.materiasService.validarMateria(this.materia, this.editar);
    if(!$.isEmptyObject(this.errors)){
      return false;
    }
    console.log("Pasó la validación");

    this.materiasService.actualizarMateria(this.materia).subscribe(
      (response)=>{
        alert("Materia editada correctamente");
        console.log("Materia editada: ", response);
        //Si se editó, entonces mandar al home
        this.router.navigate(["home"]);
      }, (error)=>{
        alert("No se pudo editar la materia");
      }
    );
  }

  validarCaracter(event: KeyboardEvent): void {
    const regex = /^[0-9]$/;
    const inputChar = event.key;
    if (!regex.test(inputChar)) {
      event.preventDefault(); // bloquea espacios y símbolos
    }

  }

  validarEntrada(event: KeyboardEvent) {
    const pattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]$/;
    const inputChar = event.key;
    if (!pattern.test(inputChar)) {
      event.preventDefault(); // Bloquea el carácter inválido
    }
  }

  validarEntradaSalon(event: KeyboardEvent) {
    const pattern = /^[0-9A-Za-zÁÉÍÓÚáéíóúÑñ\s]$/;
    const inputChar = event.key;
    if (!pattern.test(inputChar)) {
      event.preventDefault(); // Bloquea el carácter inválido
    }
  }




}
