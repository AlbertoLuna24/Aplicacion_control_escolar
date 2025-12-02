

import { MateriasService } from 'src/app/services/materias.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
// Imports para el Modal
import { MatDialog } from '@angular/material/dialog';
import { EditarMateriaComponent } from '../../modals/editar-materia/editar-materia.component';
import { EliminarMateriaComponent } from '../../modals/eliminar-materia/eliminar-materia.component';


@Component({
  selector: 'app-materias-screens',
  templateUrl: './materias-screens.component.html',
  styleUrls: ['./materias-screens.component.scss']
})
export class MateriasScreensComponent implements OnInit, AfterViewInit {
  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_materias: any[] = [];
  public displayedColumns: string[] = [];

  dataSource = new MatTableDataSource<DatosMateria>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private facadeService: FacadeService,
    private materiasService: MateriasService,
    private router: Router,
    public dialog: MatDialog // Inyectamos Dialog
  ) { }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();


    this.token = this.facadeService.getSessionToken();
    if(this.token == ""){
      this.router.navigate(["/"]);
    }


    if(this.rol === 'administrador'){
    this.displayedColumns = [
      'NRC',
      'nombre_materia',
      'dias','horario',
      'salon','profesor',
      'creditos',
      'editar',
      'eliminar'
    ];
    }else{
      this.displayedColumns = [
        'NRC',
        'nombre_materia',
        'dias','horario',
        'salon','profesor',
        'creditos',

      ];
    }
    this.obtenerMaterias();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public obtenerMaterias() {
    this.materiasService.obtenerListaMaterias().subscribe(
      (response) => {
        this.lista_materias = response;
        console.log("Lista Materias", this.lista_materias);
        if (this.lista_materias.length > 0) {
          this.lista_materias.forEach(materia => {
            if (typeof materia.dias_json === 'string') {
              try {
                materia.dias_json = JSON.parse(materia.dias_json);
              } catch (e) {
                materia.dias_json = [];
              }
            }

            if (Array.isArray(materia.dias_json)) {
              materia.dias_formateados = materia.dias_json.join(', ');
            } else {
              materia.dias_formateados = '';
            }
          });
          this.dataSource = new MatTableDataSource<DatosMateria>(this.lista_materias as DatosMateria[]);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      (error) => {
        alert("No se pudo obtener la lista de eventos");
      }
    );
  }



  public goEditar(id: number) {
    const dialogRef = this.dialog.open(EditarMateriaComponent, {
      data: { id: id },
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result && result.isConfirmed){
        this.router.navigate(["registro-materias/" +id]);
      }
    });
  }

  public delete(idMateria: number) {
     const dialogRef = this.dialog.open(EliminarMateriaComponent, {
      data: { id: idMateria },
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result && result.isDeleted){
        alert("materia eliminada correctamente");
        this.obtenerMaterias();
      }
    });
  }





}

export interface DatosMateria {
  id: number;
  nrc: number;
  nombre_materia: string;
  seccion: number;
  dias_json: string[];
  hora_inicial: string;
  hora_final: string;
  salon: string;
  profesor: string;
  creditos: number;
}


