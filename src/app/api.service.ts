import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiValues:Array<string> = ["andrei","rares","andreea","Dorel","paul","pauloviciu","cosmin","catalin","alex","lorina","silvia","mitu"];


  getValues(term:string):Observable<Array<string>>{
     var filteredValues :Array<string> = new Array<string>();


     this.apiValues.forEach(element => {
       if(element.toUpperCase().includes(term.toUpperCase())){
         filteredValues.push(element);
       }
     });

     return of(filteredValues);
  }
  constructor() { }
}
