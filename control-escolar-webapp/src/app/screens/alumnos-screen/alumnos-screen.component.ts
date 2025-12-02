import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { EliminarUserModalComponent } from './../../modals/eliminar-user-modal/eliminar-user-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-alumnos-screen',
  templateUrl: './alumnos-screen.component.html',
  styleUrls: ['./alumnos-screen.component.scss']
})

export class AlumnosScreenComponent implements OnInit, AfterViewInit {

  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_alumnos: any[] = [];
  public displayedColumns: string[] = [];


  dataSource = new MatTableDataSource<DatosAlumno>(this.lista_alumnos as DatosAlumno[]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public facadeService: FacadeService,
    public alumnosService: AlumnosService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();

    this.token = this.facadeService.getSessionToken();
    if (this.token == "") {
      this.router.navigate(["/"]);
    }

    if(this.rol === 'administrador'){
    this.displayedColumns = [
      'matricula',
      'nombre',
      'email',
      'fecha_nacimiento',
      'curp',
      'rfc',
      'edad',
      'telefono',
      'ocupacion',
      'editar',
      'eliminar'
    ];
    }else{
      this.displayedColumns = [
        'matricula',
        'nombre',
        'email',
        'fecha_nacimiento',
        'curp',
        'rfc',
        'edad',
        'telefono',
        'ocupacion'
      ];
    }


    this.obtenerAlumnos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public obtenerAlumnos() {
    this.alumnosService.obtenerListaAlumnos().subscribe(
      (response) => {
        this.lista_alumnos = response;
        console.log("Lista alumnos: ", this.lista_alumnos);
        if (this.lista_alumnos.length > 0) {
          this.lista_alumnos.forEach(alumno => {
            alumno.first_name = alumno.user.first_name;
            alumno.last_name = alumno.user.last_name;
            alumno.email = alumno.user.email;
          });

          this.dataSource.data = this.lista_alumnos as DatosAlumno[];
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      (error) => {
        console.error("Error al obtener la lista de alumnos: ", error);
        alert("No se pudo obtener la lista de alumnos");
      }
    );
  }
  // aplicar filtro de búsqueda
  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public goEditar(idUser: number) {
    this.router.navigate(["registro-usuarios/alumno/" + idUser]);
  }

  public delete(idUser: number) {
  // Se obtiene el ID del usuario en sesión, es decir, quien intenta eliminar
      const userIdSession = Number(this.facadeService.getUserId());
      // --------- Pero el parametro idUser (el de la función) es el ID del maestro que se quiere eliminar ---------
      // Administrador puede eliminar cualquier maestro
      // Maestro solo puede eliminar su propio registro
      if (this.rol === 'administrador' || (this.rol === 'maestro' && userIdSession === idUser)) {
        //Si es administrador o es maestro, es decir, cumple la condición, se puede eliminar
        const dialogRef = this.dialog.open(EliminarUserModalComponent,{
          data: {id: idUser, rol: 'alumno'}, //Se pasan valores a través del componente
          height: '288px',
          width: '328px',
        });

      dialogRef.afterClosed().subscribe(result => {
        if(result.isDelete){
          console.log("Alumno eliminado");
          alert("Alumno eliminado correctamente.");
          //Recargar página
          window.location.reload();
        }else{
          alert("Alumno no se ha podido eliminar.");
          console.log("No se eliminó el Alumno");
        }
      });
      }else{
        alert("No tienes permisos para eliminar este Alumno.");
      }
  }

}



export interface DatosAlumno {
  id: number;
  matricula: string;
  first_name: string;
  last_name: string;
  email: string;
  fecha_nacimiento: string;
  curp: string;
  rfc: string;
  edad: number;
  telefono: string;
  ocupacion: string;
}
