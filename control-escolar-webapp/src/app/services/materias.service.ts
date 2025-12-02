import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FacadeService } from './facade.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MateriasService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService

  ) { }

  public esquemaMateria(){
    return {
      'nrc':'',
      'nombre_materia': '',
      'seccion': '',
      'dias_json': [],
      'hora_inicial': '',
      'hora_final': '',
      'salon': '',
      'programa_educativo': '',
      'profesor': '',
      'creditos': '',
    }
  }

  //Validación para el formulario
  public validarMateria(data: any, editar: boolean){
    console.log("Validando materia... ", data);
    let error: any = [];

    if(!this.validatorService.required(data["nrc"])){
      error["nrc"] = this.errorService.required;
    }else if(!this.validatorService.numeric(data["nrc"])){
      alert("El formato es solo números");
    }

    if(!this.validatorService.required(data["nombre_materia"])){
      error["nombre_materia"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["seccion"])){
      error["seccion"] = this.errorService.required;
    }else if(!this.validatorService.numeric(data["seccion"])){
      alert("El formato es solo números");
    }

    if(data["dias_json"].length == 0){
      error["dias_json"] = "Debes seleccionar al menos un dia" ;
    }

    if(!this.validatorService.required(data["hora_inicial"])){
      error["hora_inicial"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["hora_final"])){
      error["hora_final"] = this.errorService.required;
    }

    if (data["hora_inicial"] && data["hora_final"]) {
      // Convertimos a minutos para comparar correctamente
      const inicioMinutos = this.convertirHoraAMinutos(data["hora_inicial"]);
      const finMinutos = this.convertirHoraAMinutos(data["hora_final"]);

      if (inicioMinutos >= finMinutos) {
        error["hora_final"] = "La hora final debe ser mayor a la inicial";
      }
    }

    if(!this.validatorService.required(data["salon"])){
      error["salon"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["programa_educativo"])){
      error["programa_educativo"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["profesor"])){
      error["profesor"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["creditos"])){
      error["creditos"] = this.errorService.required;
    }
    //Return arreglo
    return error;
  }

  private convertirHoraAMinutos(horaStr: string): number {
    // Soporta formato "HH:MM"
    const [hours, minutes] = horaStr.split(':').map(Number);
    return (hours * 60) + minutes;
  }

  public obtenerProfesores(): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    return this.http.get<any>(`${environment.url_api}/lista-profesores/`, { headers });
  }

  //Aquí van los servicios HTTP
  //Servicio para registrar un nuevo usuario
  public registrarMateria (data: any): Observable <any>{
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

    return this.http.post<any>(`${environment.url_api}/materia/`,data,  { headers });
  }


  public obtenerListaMaterias (): Observable <any>{
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.get<any>(`${environment.url_api}/lista-materias/`, {headers});
  }

  //Servicio para actualizar un usuario
  public actualizarMateria (data: any): Observable <any>{
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.put<any>(`${environment.url_api}/materia/`, data, {headers});
  }

  public ObtenerMateriaPorID(idUser: Number){
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    return this.http.get<any>(`${environment.url_api}/materia/?id=${idUser}`, { headers } );
  }

  //Eliminar Materia
  public eliminarMateria(idMateria: number): Observable <any>{
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.delete<any>(`${environment.url_api}/materia/?id=${idMateria}`,{headers});
  }



}

