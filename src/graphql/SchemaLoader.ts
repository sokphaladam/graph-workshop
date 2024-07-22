/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from "fs";
import { Glob, globSync } from "glob";

export function loadSchema(): any[] {
  const schema = [];
  const files = globSync("src/schema/**/*.gql").map((x) => {
    const str = x.split(/\\|\//g);
    return str[str.length - 1];
  });

  for (const file of files) {
    schema.push(`#graphql
      ${fs.readFileSync(__dirname + "/../schema/" + file)}
    `);
  }

  return schema;
}
