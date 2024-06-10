module.exports = function validateFields(fields) {
  return (req, res, next) => {
    let requestBody = req.body;
    try {
      if (
        !Array.isArray(fields) ||
        !fields.every((obj) => "fieldName" in obj)
      ) {
        let error = new Error(
          "Wrong input data!! The argument must be an array of objects in which each object has at least a key 'fieldName'."
        );
        error.code = 400;
        throw error;
      }
      fields.forEach((obj) => {
        if (!(obj.fieldName in requestBody) && obj.required) {
          let error = new Error(`Field '${obj.fieldName}' is required`);
          error.code = 400;
          throw error;
        }

        let tempValue = requestBody[obj.fieldName];
        if (typeof tempValue != obj.type) {
          let error = new Error(`Field '${obj.fieldName}' must be ${obj.type}`);
          error.code = 400;
          throw error;
        }

        let callback = obj.validator?.callback;
        let message = obj.validator?.message || "Validation failed";
        let code = obj.validator?.code || 400;
        if (callback) {
          let result = callback(obj.fieldName, tempValue);
          if (!result) {
            let error = new Error(message);
            error.code = code;
            throw error;
          }
        }
      });
      next();
    } catch (error) {
      return res.json({
        message: error?.message,
        code: error?.code || 500,
      });
    }
  };
};
