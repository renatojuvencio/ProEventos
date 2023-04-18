import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, take } from 'rxjs';

import { Evento } from '../models/Evento';

@Injectable()
export class EventoService {
  baseURL = environment.apiUrl+ 'api/eventos';
  constructor(private http: HttpClient) { }

  public getEventos() : Observable<Evento[]>{
    return this.http.get<Evento[]>(this.baseURL)
    .pipe(
      take(1)
    );
  }

  public getEventosByTema(tema : string) : Observable<Evento[]>{
    return this.http.get<Evento[]>(`${this.baseURL}/tema/${tema}`)
    .pipe(
      take(1)
    );
  }

  public getEventoById(id : number) : Observable<Evento>{
    return this.http.get<Evento>(`${this.baseURL}/${id}`)
    .pipe(
      take(1)
    );
  }

  public post(evento: Evento) : Observable<Evento>{
    return this.http.post<Evento>(this.baseURL, evento)
    .pipe(
      take(1)
    );
  }

  public put (evento: Evento) : Observable<Evento>{
    return this.http.put<Evento>(`${this.baseURL}/${evento.id}`,evento)
    .pipe(
      take(1)
    );
  }

  public delete(id : number) : Observable<any>{
    return this.http.delete(`${this.baseURL}/${id}`)
    .pipe(
      take(1)
    );
  }
  postUpload(eventoId : number, file: File): Observable<Evento>{
    const fileToUpLoad = file[0] as File;
    const formData = new FormData();
    formData.append('file', fileToUpLoad);
    return this.http
    .post<Evento>(`${this.baseURL}/upload-image/${eventoId}`, formData)
    .pipe(
      take(1)
    );
  }
}
