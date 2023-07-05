import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@app/models/identity/User';
import { UserUpdate } from '@app/models/identity/UserUpdate';
import { Observable, ReplaySubject, map, take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AccountService {
  private currentUserSource = new ReplaySubject<User>(1);
  public currentUser$ = this.currentUserSource.asObservable();
  
  baseUrl = environment.apiUrl + 'api/Account/';
  constructor(private http: HttpClient) { }
  
  public login(model: any): Observable<void>{
    return this.http.post<User>(this.baseUrl + 'Login', model).pipe(
      take(1),
      map((response: User) =>{
        const user = response;
        if(user){
          this.setCurrentUser(user);
        }
      })
      );
    }
    
    public register(model: any): Observable<void>{
      return this.http.post<User>(this.baseUrl + 'Register', model).pipe(
        take(1),
        map((response: User) =>{
          const user = response;
          if(user){
            this.setCurrentUser(user);
        }
      })
      );
    }
    
    public logout():void{
      localStorage.removeItem('user');
      this.currentUserSource.next(null);
      this.currentUserSource.complete();
    }
    
    
    public setCurrentUser(user: User): void {
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSource.next(user);
    }

    getUser(): Observable<UserUpdate> {
      return this.http.get<UserUpdate>(this.baseUrl + 'getUser').pipe(take(1));
    }

    updateUser(model: UserUpdate): Observable<void>{
      this.http.put<UserUpdate>(this.baseUrl + 'userUpdate', model)
      .pipe(
        take(1),
        map((user: UserUpdate) =>{
          this.setCurrentUser(user);
        })
      )
    }
  }
  