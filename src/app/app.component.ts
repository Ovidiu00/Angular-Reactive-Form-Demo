import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { Observable, Subject } from 'rxjs';
import { ApiService } from './api.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

class Data {
  FormControl1: string;
  FormControl2: string;
  FormControl3: string;
  FormControl4: number;
  FormControl5: string;
  password: string;
  confirmPassword: string;
  customValidator: string;
}

export class FormPreview {

  FormControl1: string;
  FormControl2: string;
  FormControl3: string;
  FormControl4: number;
  FormControl5: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'reactive-form';

  demoForm: FormGroup;
  @ViewChild('formTabs') formTabs: TabsetComponent;

  formControl1Items: Array<string> = ['A', 'B', 'C'];

  nextClicked: boolean;

  formData: Data = new Data;

  //TODO : Create model class
  preview: FormPreview = new FormPreview();

  items$!: Observable<string[]>;
  private searchTerms = new Subject<string>();
  showItems:boolean = false;

  SearchItem(item:string){

    this.searchTerms.next(item);

    this.showItems = true;


  }
  SelectItem(item:string){
    this.FormControl2.setValue(item);
    this.showItems = false;
  }

  HideSelectionList(){
    setTimeout(()=> this.showItems = false,500);
  }
  constructor(private fb: FormBuilder,private datePipe:DatePipe,private service:ApiService) {}

  ngOnInit() {
    this.CreateDemoForm();


    this.items$ = this.searchTerms.pipe(

      debounceTime(300),


      distinctUntilChanged(),


      switchMap((term: string) => this.service.getValues(term)),
    );
  }

  //#region custom validators

  passwordMatchingValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    return password?.value !== confirmPassword?.value
      ? { passwordsMatching: false }
      : null;
  };

  forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? { forbiddenName: { value: control.value } } : null;
    };
  }
  //#endregion

  CreateDemoForm() {
    this.demoForm = this.fb.group({
      Group1: this.fb.group({
        FormControl1: [null, Validators.required],
        FormControl3: [null, [Validators.required, Validators.email]],
        FormControl4: [null, Validators.pattern('^[0-9]*$')],
        FormControl2: [null, Validators.required],
        FormControl5: [null],
      }),

      Group2: this.fb.group(
        {
          password: [null, [Validators.required, Validators.minLength(4)]],
          confirmPassword: [
            null,
            [Validators.required, Validators.minLength(4)],
          ],
          customValidator: [null, this.forbiddenNameValidator(/paul/i)],
        },
        { validators: this.passwordMatchingValidator }
      ),
    });
  }

  onSubmit() {
    this.nextClicked = true;
    if (this.allTabsValid()) {
      this.mapProperty();
      //this.service.addItem(this.data);

      console.log(this.formData);
    }
  }
  allTabsValid(): boolean {
    if (this.Group1.invalid) {
      this.formTabs.tabs[0].active = true;
      return false;
    }

    if (this.Group2.invalid) {
      this.formTabs.tabs[1].active = true;
      return false;
    }

    return true;
  }

  selectTab(NextTabId: number, IsCurrentTabValid: boolean) {
    this.nextClicked = true;
    if (IsCurrentTabValid) {
      this.formTabs.tabs[NextTabId].active = true;
    }
  }



  mapProperty(): void {
    this.formData.FormControl1 = this.FormControl1.value;
    this.formData.FormControl4 = this.FormControl4.value;
    this.formData.FormControl2 = this.FormControl2.value;
    this.formData.FormControl3 = this.FormControl3.value;
    this.formData.FormControl5 = <string>this.datePipe.transform(this.FormControl5.value,"dd-MM-YYYY")
    this.formData.password = this.password.value;
    this.formData.confirmPassword = this.confirmPassword.value;
    this.formData.customValidator = this.customValidator.value;
  }

  //#region <Getter Methods>
  // #region <FormGroups>
  get Group1() {
    return this.demoForm.controls.Group1 as FormGroup;
  }

  get Group2() {
    return this.demoForm.controls.Group2 as FormGroup;
  }
  // #endregion

  //#region <Form Controls>

  get FormControl1() {
    return this.Group1.controls.FormControl1 as FormControl;
  }

  get FormControl3() {
    return this.Group1.controls.FormControl3 as FormControl;
  }

  get FormControl4() {
    return this.Group1.controls.FormControl4 as FormControl;
  }
  get FormControl5() {
    return this.Group1.controls.FormControl5 as FormControl;
  }

  get FormControl2() {
    return this.Group1.controls.FormControl2 as FormControl;
  }

  get password() {
    return this.Group2.controls.password as FormControl;
  }
  get confirmPassword() {
    return this.Group2.controls.confirmPassword as FormControl;
  }
  get customValidator() {
    return this.Group2.controls.customValidator as FormControl;
  }

  //#endregion
  //#endregion
}
