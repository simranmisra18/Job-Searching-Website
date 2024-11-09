import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/jobseeker';
import { expand, flyInOut } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback;
  yourSubmission: Feedback;
  errMess: string;
  isFeedbackSubmitPending: boolean = false;
  contactType=ContactType;
  @ViewChild('fform') feedbackFormDirective;

  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };
  validationMessages = {
    'firstname': {
      'required': 'First name is required.',
      'minlength': 'First name must be at least 2 characters long',
      'maxlength': 'First name cannot be more than 25 characters long'
    },
    'lastname': {
      'required': 'Last name is required.',
      'minlength': 'Last name must be at least 2 characters long',
      'maxlength': 'Last name cannot be more than 25 characters long'
    },
    'telnum': {
      'required': 'Tel. number is required.',
      'pattern': 'Tel. number must contain only numbers.'
    },
    'email': {
      'required': 'Email is required.',
      'email': 'Email not in valid format.'
    }
  };
  
  constructor(private fb: FormBuilder,
              private feedbackService: FeedbackService) {
      this.createForm();
  }
  
  ngOnInit() {}

  createForm() {
    this.feedbackForm = this.fb.group({
        firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
        lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
        telnum: [0, [Validators.required, Validators.pattern]],
        email: ['', [Validators.required, Validators.email]],
        agree: false,
        contacttype: 'None',
        message: ''
    });

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); //(re)set form validation messages
}

onValueChanged(data?: any) { // ? means that the parameter is optional
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    
    for (const field in this.formErrors) {
        if (this.formErrors.hasOwnProperty(field)) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    if (control.errors.hasOwnProperty(key)) {
                        this.formErrors[field] += messages[key] + '';
                    }
                }
            }
        }
    }
}

onSubmit() {
    this.errMess = null;
    this.isFeedbackSubmitPending = true;

    this.feedbackService.submitFeedback(this.feedbackForm.value)
      .subscribe(feedback => {
          this.yourSubmission = feedback;
          this.isFeedbackSubmitPending = false;

          setTimeout(() => {
              this.yourSubmission = null; //Timer
          }, 30000);

          this.feedback = feedback;
      },
      errmess => {
          this.feedback = null;
          this.yourSubmission = null;
          this.errMess = <any>errmess;
      });

      if (this.errMess) {
          console.log(this.errMess);
      }

      this.feedbackForm.reset({
          firstname: '',
          lastname: '',
          telnum: '',
          email: '',
          agree: false,
          contacttype: 'None',
          message: ''
      });
      
      this.feedbackFormDirective.resetForm();
      this.yourSubmission = null;
}
}
