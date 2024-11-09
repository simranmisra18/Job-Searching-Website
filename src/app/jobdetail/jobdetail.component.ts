commentForm: FormGroup;
comment: Comment;
dishcopy: Dish;
visibility = 'shown';

dish: Dish;
leader: Leader[];
errMess: string;
dishIds: string[];
prev: string;
next: string;

formErrors = {
  'author': '',
  'rating': '',
  'comment': ''
};

validationMessages = {
  'author': {
    'required': 'Name is required',
    'minlength': 'Name must be at least 2 characters long'
  },
  'comment': {
    'required': 'Query/Comment is required'
  }
};

constructor(private dishService: DishService,
            private leaderService: LeaderService,
            private route: ActivatedRoute,
            private location: Location,
            private fb: FormBuilder,
            public dialog: MatDialog,
            @Inject('BaseURL') private BaseURL) {
    this.createForm();
}

ngOnInit() {
    this.dishService.getDishIds()
      .subscribe((dishIds) => this.dishIds = dishIds);
    this.route.params
      .pipe(switchMap((params: Params) => { 
        this.visibility = 'hidden'; 
        return this.dishService.getDish(params['id']); 
      }))
      .subscribe(dish => { 
        this.dish = dish; 
        this.dishcopy = dish; 
        this.setPrevNext(dish.id); 
        this.visibility = 'shown'; 
      },
      errmess => this.errMess = <any>errmess);
      
    this.leaderService.getLeaders()
      .subscribe((leaders) => this.leader = leaders,
                 errmess => this.errMess = <any>errmess);
}

createForm() {
    this.commentForm = this.fb.group({
        author: ['', [Validators.required, Validators.minLength(2)]],
        rating: 5,
        comment: ['', Validators.required],
        date: ''
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set form validation messages
}

onValueChanged(data?: any) { 
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    
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
    this.comment = this.commentForm.value;
    this.comment['date'] = new Date().toISOString();
    
    console.log(this.comment);
    
    this.dishcopy.comments.push(this.comment);
    
    this.dishService.putDish(this.dishcopy)
      .subscribe(dish => {
          this.dish = dish; 
          this.dishcopy = dish;
      },
      errmess => { 
          this.dish = null; 
          this.dishcopy = null; 
          this.errMess = <any>errmess; 
      });
    
    this.commentForm.reset({
        author: '',
        comment: '',
        rating: 5
    });
}