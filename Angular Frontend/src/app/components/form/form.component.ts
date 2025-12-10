import { Component, ElementRef, input, output, ViewChild } from '@angular/core';
import { SubmitEventData } from '../../entities';

@Component({
  selector: 'form-component',
  imports: [],
  template: `
    <form #form (submit)="$event.preventDefault(); submitHandler()">

      <h2 class="text-center mb-4 fw-bold position-relative pb-2">
        {{formTitle()}}
        <span class="position-absolute start-50 translate-middle-x bg-primary" 
              style="bottom: 0; width: 60px; height: 3px; border-radius: 2px;"></span>
      </h2>

      <div class="container d-flex flex-column gap-3">

        <ng-content></ng-content>

        <button type="submit" class="btn btn-primary">Submit</button>

      </div>
    </form>
  `,
  styles: ``
})
export class FormComponent {
  @ViewChild('form') form!: ElementRef<HTMLFormElement>;

  formTitle = input('Form title');
  submitEvent = output<SubmitEventData>();

  submitHandler() {
    const formData = new FormData(this.form.nativeElement)
    this.submitEvent.emit({formData, element: this.form.nativeElement})
  }
}
