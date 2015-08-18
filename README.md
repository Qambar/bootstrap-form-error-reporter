# Bootstrap Form Error Reporter

This plugin takes the validation responsibility from the application and puts a hook to validate form and fields using bootstrap css classes.

![Alt text](screenshot.png?raw=true "Demo")


Installation:
------------

```
npm install bootstrap-form-error-reporter
```
or using package.json

```
{
  "name": "my-app",
  ..
  "devDependencies": {
    ..
    "bootstrap-form-error-reporter": "1.0.0"
  }
}
```
Then do `npm install`


Usage:
------

```
var emailTester = function(val) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(val);
};

var passwordTester = function(val) {
    // at least one number, one lowercase and one uppercase letter
    // at least six characters
    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    return re.test(val);
};

var bfer = new BootstrapFormErrorReporter("#my-form");

bfer
    .initField('#email', emailTester, "Invalid %s, please check if you are using the right email syntax.")
    .initField('#password', passwordTester,"The %s should be at least one number, one lowercase and one uppercase letter and at least six characters.");

bfer.setFieldErrorMessage();

```