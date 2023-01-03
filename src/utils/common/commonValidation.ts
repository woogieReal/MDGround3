import { ValidationResponse } from "@/src/models/validation.model";
import { cloneDeep } from "lodash";

const createInitialValidationResponse = <T>(validationTarget: T): ValidationResponse<T> => {
  return {
    isValid: false,
    processedData: cloneDeep(validationTarget),
  };
};

const trimValues = <T, K extends keyof T>(
  validationTarget: T,
  needTrimProperty: Array<K>
): void => {
  needTrimProperty.forEach((key: K) => {
    validationTarget[key] = String(validationTarget[key]).trim() as any;
  })
}

export const validateExecutor = <T, K extends keyof T>(
  validationTarget: T,
  needTrimProperty: Array<K>,
  checkInvalid: (processedData: T) => Array<boolean>,
): ValidationResponse<T> => {
  let response: ValidationResponse<T> = createInitialValidationResponse(validationTarget);
  try {
    trimValues(response.processedData, needTrimProperty);
    response.isValid = checkInvalid(response.processedData).includes(true) ? false : true;
  } catch (err) {
    response.isValid = false;
  }
  return response;
};
