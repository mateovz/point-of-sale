import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceInterceptor implements HttpInterceptor{

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = localStorage.getItem('user');
    
    if(req.url.includes('logout')) localStorage.removeItem('user');

    let request = req;
    request = req.clone({
      setHeaders:{
        Accept: 'application/json',
      }
    });

    if(!req.headers.get('enctype')){
      request = request.clone({
        setHeaders:{
          'Content-Type': 'application/json'
        }
      })
    }

    if(user){
      const token = JSON.parse(user).token || null;
      if(token){
        request = req.clone({
          setHeaders:{
            authorization: `Bearer ${token}`
          }
        });
      }
    }
    return next.handle(request);
  }
}
