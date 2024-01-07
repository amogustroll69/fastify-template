interface ValidationResult {
  errorMsg?: string;
  success: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (schema: any, input: any): ValidationResult => {
  for (const key in input) {
    if (!schema[key])
      return {
        errorMsg: `${key}: unexpected key`,
        success: false,
      };

    if (typeof input[key] !== schema[key].type)
      return {
        errorMsg: `${key}: expected ${schema[key]}, got ${typeof input[key]}`,
        success: false,
      };

    if (schema[key].minLength)
      if (input[key] < schema[key].minLength)
        return {
          errorMsg: `${key}: minimum length is ${schema[key].minLength}`,
          success: false,
        };

    if (schema[key].maxLength)
      if (input[key] < schema[key].maxLength)
        return {
          errorMsg: `${key}: maximum length is ${schema[key].maxLength}`,
          success: false,
        };

    if (schema[key].email)
      if (!RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(input[key]))
        return {
          errorMsg: `${key}: expected email`,
          success: false,
        };

    if (schema[key].password) {
      if (!RegExp(/\p{Lu}/u).test(input[key]))
        return {
          errorMsg: `${key}: uppercase letters required`,
          success: false,
        };

      if (!RegExp(/\p{Ll}/u).test(input[key]))
        return {
          errorMsg: `${key}: lowercase letters required`,
          success: false,
        };

      if (!RegExp(/[\p{P}\p{S}]/u).test(input[key]))
        return {
          errorMsg: `${key}: symbols required`,
          success: false,
        };
    }
  }

  for (const key in schema)
    if (!input[key] && !schema[key].optional)
      return {
        errorMsg: `${key}: not defined`,
        success: false,
      };

  return {
    success: true,
  };
};
