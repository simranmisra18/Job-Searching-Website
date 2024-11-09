dishForm: FormGroup;
dish: Dish;
dishcopy: Dish;
yourSubmission: Dish;
isDishSubmitPending: boolean = false;
errMess: string;

formErrors = {
  'name': '',
  'category': '',
  'label': '',
  'price': '',
  'description': ''
};

validationMessages = {
  'name': {
    'required': 'Name is required.',
    'minlength': 'Name must be at least 2 characters long',
    'maxlength': 'Name cannot be more than 25 characters long'
  },
  'category': {
    'required': 'Company name is required.',
    'minlength': 'Company name must be at least 2 characters long',
    'maxlength': 'Company name cannot be more than 25 characters long'
  },
  'label': {
    'required': 'Label is required.'
  },
  'price': {
    'required': 'Package is required.'
  },
  'description': {
    'required': 'Description is required.'
  }
};

constructor(private fb: FormBuilder,
            private dishService: DishService,
            private route: ActivatedRoute,
            @Inject('BaseURL') private BaseURL) {
    this.createForm();
}

ngOnInit() {}

createForm() {
    this.dishForm = this.fb.group({
        name: ['', Validators.required],
        image: 'images/blank.jpg',
        category: ['', Validators.required],
        featured: false,
        label: ['', Validators.required],
        price: ['', Validators.required],
        description: ['', Validators.required],
        comments: [[{
          "rating": 5,
          "comment": "Could you please add more information about the place of work?",
          "author": "John Lemon",
          "date": "2012-10-16T17:57:28.556094Z"
        }]]
    });

    this.dishForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set form validation messages
}

onValueChanged(data?: any) { 
    if (!this.dishForm) { return; }
    const form = this.dishForm;
    
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
    this.isDishSubmitPending = true;

    this.dishService.submitDish(this.dishForm.value)
      .subscribe(dish => {
          this.yourSubmission = dish;
          this.isDishSubmitPending = false;

          setTimeout(() => {
              this.yourSubmission = null; // Timer
          }, 4000);

          this.dish = dish;
      },
      errmess => {
          this.dish = null;
          this.yourSubmission = null;
          this.errMess = <any>errmess;
      });

      if (this.errMess) {
          console.log(this.errMess);
      }

      this.dishForm.reset({
          id: '',
          name: '',
          image: 'images/blank.jpg',
          category: '',
          featured: false,
          label: '',
          price: '',
          description: '',
          comments: [{
              "rating": 5,
              "comment": "Could you please add more information about the place of work?",
              "author": "John Lemon",
              "date": "2012-10-16T17:57:28.556094Z"
          }]
      });

      this.dishFormDirective.resetForm();
      this.yourSubmission = null;
}