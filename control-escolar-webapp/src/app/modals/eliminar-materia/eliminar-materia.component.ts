import { Component, Inject, OnInit } from '@angular/core';
import { MateriasService } from 'src/app/services/materias.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-eliminar-materia',
  templateUrl: './eliminar-materia.component.html',
  styleUrls: ['./eliminar-materia.component.scss']
})
export class EliminarMateriaComponent {

  constructor(
    private materiasService: MateriasService,
    private dialogRef: MatDialogRef<EliminarMateriaComponent>,
    @Inject (MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log("Id evento a eliminar:", this.data.id);
  }

  public cerrar_modal(){
    this.dialogRef.close({isDeleted:false});
  }

  public eliminarEvento(){
    //entonces elimina una materia
    this.materiasService.eliminarMateria(this.data.id).subscribe(
      (response)=>{
        console.log(response);
        this.dialogRef.close({isDeleted:true});
      }, (error)=>{
        console.error(error);
        this.dialogRef.close({isDeleted:false});
      }
    );
  }
}
