import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { messageError } from './base-form.interface';

@Injectable({
    providedIn: 'root'
})
export class BaseForm{
    public baseForm!: FormGroup;
    public errorMessage!: string;

    constructor(
        private formBuilder: FormBuilder,
    ){
        this.baseForm = formBuilder.group({
            email: [
                '',
                [Validators.required, Validators.email]
            ],
            password: [
                '',
                [Validators.required, Validators.minLength(6)]
            ]
        });
    }

    isValidField(field: string){
        this.getErrorMessage(field);
        const value = this.baseForm.get(field);
        return ((value?.touched || value?.dirty) && !value.valid);
    }

    private getErrorMessage(field: string):void{
        const formField = this.baseForm.get(field);
        const errors = formField?.errors;
        if(errors){
            const minlength = errors['minlength']?.requiredLength;
            
            const messages: messageError = {
                required: 'You must enter a value.',
                email: 'Not a valid email.',
                minlength: `This field must be longer than ${minlength} characters-`,
                invalid: formField.getError('invalid')
            };

            const errorKey = Object.keys(errors).find(Boolean);
            if(errorKey) this.errorMessage = messages[errorKey];
        }
    }
}