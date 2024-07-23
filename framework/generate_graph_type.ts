/* eslint-disable @typescript-eslint/no-use-before-define */
import * as fs from "fs";
import {
  buildSchema,
  EnumTypeDefinitionNode,
  InputObjectTypeDefinitionNode,
  ObjectTypeDefinitionNode,
  ObjectTypeExtensionNode,
} from "graphql";
import { loadSchema } from "../src/graphql/SchemaLoader";

type DefinitionNode =
  | ObjectTypeDefinitionNode
  | InputObjectTypeDefinitionNode
  | ObjectTypeExtensionNode
  | EnumTypeDefinitionNode;

interface Defintion {
  type: "ENUM" | "TYPE";
  name: string;
  internalValue: boolean;
  fields: {
    name: string;
    optional: string;
    value: number | string;
  }[];
}

const prefix = "";

function mapGraphQLNonNullType(type): string {
  const map = {
    String: "string",
    Int: "number",
    Float: "number",
    ID: "string",
    Boolean: "boolean",
    JSON: "any",
    Decimal: "string",
  };

  if (type.kind === "ListType") {
    return mapGraphQLType(type.type);
  } else if (map[type.name.value] === undefined) {
    return prefix + type.name.value;
  }

  return map[type.name.value];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function enumValueArgParsing(argValue: { kind: string; value: string }): any {
  if (argValue.kind === "IntValue") return Number(argValue.value);
  return argValue.value;
}

function createTypeScriptEnum(dict, def): void {
  const name = def.name.value;
  if (dict[name] === undefined) {
    dict[name] = {
      name,
      type: "ENUM",
      fields: [],
    };
  }

  const t: Defintion = dict[name];

  if (def.directives.length > 0) {
    if (def.directives.find((x) => x.name.value === "internalValue")) {
      t.internalValue = true;
    }
  }

  for (const value of def.values) {
    const enumFieldDirective = value.directives.find(
      (x) => x.name.value === "value"
    );

    t.fields.push({
      name: value.name.value,
      optional: "",
      value: enumFieldDirective
        ? enumValueArgParsing(enumFieldDirective.arguments[0].value)
        : value.name.value,
    });
  }
}

function mapGraphQLType(type): string {
  if (type.kind === "ListType") {
    return `${mapGraphQLNonNullType(type.type)}[] | null`;
  } else if (type.kind === "NonNullType") {
    return mapGraphQLNonNullType(type.type);
  } else {
    return ["null", mapGraphQLNonNullType(type)].join(" | ");
  }
}

function createTypeScriptFromInput(
  dict,
  def:
    | ObjectTypeDefinitionNode
    | InputObjectTypeDefinitionNode
    | ObjectTypeExtensionNode
): void {
  const name = def.name.value;

  if (dict[name] === undefined) {
    dict[name] = {
      name,
      type: "TYPE",
      fields: [],
    };
  }

  const t: Defintion = dict[name];

  if (def.fields) {
    for (const field of def.fields) {
      const fieldName = field.name.value;
      const fieldType = mapGraphQLType(field.type);
      const optional = fieldType.indexOf("null") >= 0 ? "?" : "";

      t.fields.push({
        name: fieldName,
        optional,
        value: fieldType,
      });
    }
  }
}

/**
 * Converting the intermedia type to code
 */
function convertIntTypeToCode(def: Defintion) {
  const fields = def.fields
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((x) => {
      return `    ${x.name}${x.optional}: ${x.value}`;
    });

  return (
    `  export interface ${def.name} {` + "\r" + fields.join(";\r") + ";\r  }"
  );
}

/**
 * Converting the intermedia enum to code
 */
function convertIntEnumToCode(def: Defintion, client: boolean) {
  if (client || !def.internalValue) {
    return (
      `  export type ${def.name} = ` +
      def.fields.map((x) => `"${x.name}"`).join(" | ") +
      ";"
    );
  }

  const fields = def.fields.map(
    (x) => `    ${x.name} = ${JSON.stringify(x.value)}`
  );
  return `  export enum ${def.name} {` + "\r" + fields.join(",\r") + "\r  }";
}

/**
 * Converting the intermedia enum to internal value
 */
function convertIntEnumToInternalValue(def: Defintion) {
  const fields = def.fields.map(
    (x) => `    ${x.name}: ${JSON.stringify(x.value)}`
  );
  return `  ${def.name}: {` + "\r" + fields.join(",\r") + "\r  },";
}

/**
 * Converting schema structure to intermediate structure
 * that is easy to construct to code
 */
function convertSchemaToIntermediate() {
  const schemas = buildSchema(loadSchema().join("\n"));
  const types = Object.values(schemas.getTypeMap())
    .map((type) => [type.astNode, ...type.extensionASTNodes].filter(Boolean))
    .flat() as DefinitionNode[];
  const dict = {};

  for (const def of types) {
    if (!def?.kind) continue;

    if (def.kind === "InputObjectTypeDefinition") {
      createTypeScriptFromInput(dict, def);
    } else if (def.kind === "ObjectTypeDefinition") {
      createTypeScriptFromInput(dict, def);
    } else if (def.kind === "ObjectTypeExtension") {
      createTypeScriptFromInput(dict, def);
    } else if (def.kind === "EnumTypeDefinition") {
      createTypeScriptEnum(dict, def);
    }
  }

  return dict;
}

/**
 * Convert our intermediate structure into multiple Typescript codes
 *
 * @param dict
 */
function convertIntermediateToCode(dict): [string, string, string] {
  const clientCodeList: string[] = [];
  const serverCodeList: string[] = [];
  const internalValueCodeList: string[] = [];

  for (const obj of Object.values<Defintion>(dict)) {
    if (obj.type === "TYPE") {
      const code = convertIntTypeToCode(obj);
      clientCodeList.push(code);
      serverCodeList.push(code);
    } else if (obj.type === "ENUM") {
      clientCodeList.push(convertIntEnumToCode(obj, true));
      serverCodeList.push(convertIntEnumToCode(obj, false));

      if (obj.internalValue) {
        internalValueCodeList.push(convertIntEnumToInternalValue(obj));
      }
    }
  }

  const serverCode =
    `/* eslint-disable */` +
    "\r" +
    "export namespace Graph {\r" +
    serverCodeList.join("\r\r") +
    "\r}";
  const clientCode =
    `/* eslint-disable */` +
    "\r" +
    "export declare namespace GraphClient {\r" +
    clientCodeList.join("\r\r") +
    "\r}";
  const internalCode =
    `/* eslint-disable */` +
    "\r" +
    "const EnumInternalValue = {\r" +
    internalValueCodeList.join("\r\r") +
    "\r};\r\rexport default EnumInternalValue;";

  return [serverCode, clientCode, internalCode];
}

function run() {
  const [server, client, internalValue] = convertIntermediateToCode(
    convertSchemaToIntermediate()
  );

  if (process.argv.find((x) => x === "--deploy")) {
    fs.writeFileSync(
      "./src/generated/graph_deployment.ts",
      client.replace("namespace GraphClient", "namespace Graph")
    );
  } else {
    fs.writeFileSync("./src/generated/graph.ts", server);
    fs.writeFileSync("./src/generated/graph_client.ts", client);
    fs.writeFileSync("./src/generated/graph_internal.ts", internalValue);
  }
}

run();
