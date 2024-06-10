# Request Fields Validator
This module helps you to validate JSON fields in the body of HTTP requests.
## Installation
To install the package, run the following command: 
``` 
npm install request-fields-validator
``` 
## USAGE 
**Use the module as middleware in your routers.** 
``` 
// Load the library
var validateFields = require('request-fields-validator');

// Create an array of objects where each object represents a field in the request.body
let arraySchema = [
  {
    fieldName: "age",
    type: "number",
    required: false,
    validator: {
      callback: (field, value) => value > 10,
      message: 'Age must be greater than 10',
      code: 400
    }
  },
  {
    fieldName: "name",
    type: "string",
    required: true,
    validator: {
      callback: (field, value) => value.length === 5,
      message: 'Name must be exactly 5 characters long',
      code: 400
    }
  }
];

// Example of request.body: {"age": 12, "name": "john doe"}

// In the router
router.post("/", validateFields(arraySchema), function(req, res, next) {
  return res.json({message: "hello world", code: 200});
});
``` 

## Important Notes 

- ***fieldName*** is required for each object defined in `arraySchema`. 

- ***required*** is `false` by default. Set `required: true` if the field must exist in the `request.body`

- By default, the ***callback*** function takes two arguments: the first argument is the key defined in the `request.body`, and the second argument is the corresponding value to the key. The ***callback***  function must return either `true` or `false`.

