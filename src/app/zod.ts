import { z as zod } from "zod";

const z = zod;
z.setErrorMap((issue, ctx) => {
  if (issue.code === zod.ZodIssueCode.invalid_type) {
    return {
      message: `Must be ${issue.expected}`,
    };
  }

  if (issue.code === zod.ZodIssueCode.too_small) {
    if (issue.type === "string") {
      return {
        message: `Must be at least ${issue.minimum} characters`,
      };
    } else if (issue.type === "number") {
      return {
        message: `Must be greater than or equal to ${issue.minimum}`,
      };
    }
  }

  return {
    message: ctx.defaultError,
  };
});

export default z;
