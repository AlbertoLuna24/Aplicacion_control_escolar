import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-editar-materia',
  templateUrl: './editar-materia.component.html',
  styleUrls: ['./editar-materia.component.scss']
})
export class EditarMateriaComponent {
  constructor(
    private dialogRef: MatDialogRef<EditarMateriaComponent>,
    @Inject (MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    // Solo recibimos datos para mostrar si fuera necesario, pero no hacemos acciones aquí
  }

  public cerrar_modal(){
    // Retornamos false indicando cancelación
    this.dialogRef.close({isConfirmed: false});
  }

  public confirmarEdicion(){
    // Retornamos true indicando que SÍ quiere editar
    this.dialogRef.close({isConfirmed: true});
  }

}
