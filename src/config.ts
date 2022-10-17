import { IConstant } from "./datatypes";

const NODE_ENV = process.env.NODE_ENV || "development";

const constant: IConstant = {
  domain: process.env.DOMAIN as string,
  env: NODE_ENV,
  dev: NODE_ENV === "development",
  prod: NODE_ENV === "production",
  test: NODE_ENV === "test",
};

export default constant;
