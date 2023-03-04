import { describe, expect, test } from "@jest/globals";
import { checkEmptyValue } from '@/src/utils/common/commonUtil';

describe("commonUtil", () => {
  describe("checkEmptyValue", () => {
    describe("typeof val = undefined | null", () => {
      test("val is a undefined", () => {
        const res = checkEmptyValue(undefined);
        expect(res).toBe(true);
      });

      test("val is a null", () => {
        const res = checkEmptyValue(null);
        expect(res).toBe(true);
      });
    });

    describe("typeof val string", () => {
      test("val is a empty string", () => {
        const res = checkEmptyValue('');
        expect(res).toBe(true);
      });

      test("val is a blank", () => {
        const res = checkEmptyValue('   ');
        expect(res).toBe(true);
      });

      test("val has characters ", () => {
        const res = checkEmptyValue('abcd');
        expect(res).toBe(false);
      });
    });

    describe("typeof val Array", () => {
      test("val is empty array", () => {
        const res = checkEmptyValue([]);
        expect(res).toBe(true);
      });

      test("val has elements", () => {
        const res = checkEmptyValue([1, 2]);
        expect(res).toBe(false);
      });
    });
  });
});
