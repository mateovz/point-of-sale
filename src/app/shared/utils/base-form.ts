import { Injectable } from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";
import { ErrorMessage } from "./interfaces/base-form.interface";

@Injectable({providedIn: 'root'})
export class BaseForm{
    
    public baseForm!: FormGroup;
    public errorMessage!: string;

    constructor(){}

    public isValidField(field: string):boolean{
        const checkField = this.baseForm.get(field);
        const valid = ((checkField?.touched || checkField?.dirty) && !checkField.valid) ? false : true;
        if(!valid && checkField) this.getMessageError(checkField);
        return valid;
    }

    private getMessageError(field: AbstractControl):void{
        const errors = field.errors;
        if(errors){
            const minlength = errors['minlength']?.requiredLength;
            const messages: ErrorMessage = {
                required: 'You must enter a value.',
                email: 'Not a valid email.',
                minlength: `This field must be longer than ${minlength} characters.`,
                invalid: field.getError('invalid'),
            };
            const errorKey = Object.keys(errors).find(Boolean);
            if(errorKey) this.errorMessage = messages[errorKey];
        }
    }
}