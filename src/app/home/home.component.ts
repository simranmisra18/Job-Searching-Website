onSubmit() {
  console.log('User: ', this.user);
  if (this.user.username == "Simran" && this.user.password == "hello1234") {
    alert('Welcome! Successful Login!!');
    this.router.navigate(['/contactus']);
  } else {
    alert('Invalid username or password!!');
  }
}

onSubmit() {
  console.log('User: ', this.user);
  if (this.user.username == "Simran" && this.user.password == "hello1234") {
    alert('Welcome! Successful Login!!');
    this.router.navigate(['/employer']);
  } else {
    alert('Invalid username or password!!');
  }
}