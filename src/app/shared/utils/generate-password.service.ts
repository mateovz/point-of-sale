import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneratePasswordService {

  private num = '0123456789';
  private characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  constructor() { }

  generate(length: number):string{
    const characters = this.characters+this.num;
    let pass = '';
    for(let i = 0; i < length; i++){
      pass += characters.charAt(Math.floor(Math.random()*characters.length));
    }
    return pass;
  }
}
