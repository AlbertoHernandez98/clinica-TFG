import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
    public loadUserRol(username: any){
        const options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        };
    
        const url = 'http://localhost:8080/persona';
    
        fetch(url, options)
          .then((response) => response.text())
          .then((data) => {
              const res = JSON.parse(data).find((user: { username: any; }) => user.username === username);
              return res.idRolNativo;
          }).catch((error) => {
            console.error('Error:', error);
          });
      }
      
      public loadUser() {
        const str = document.cookie;
    
        const match: any = str.match(/user=([^;]*)/);
    
        const userLogged = match[1].trim();
    
        const options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        };
    
        const url = 'http://localhost:8080/persona';
    
        fetch(url, options)
          .then((response) => response.text())
          .then((data) => {
            const res = JSON.parse(data).find(
              (user: { username: any }) => user.username === userLogged
            );
        
            return res;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
      }

      public loadServices() {
        const options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        };
    
        const url = 'http://localhost:8080/servicio';
    
        fetch(url, options)
          .then((response) => response.text())
          .then((data) => {
              return data;
          }).catch((error) => {
            console.error('Error:', error);
          });
      }
}