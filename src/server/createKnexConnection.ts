/* eslint-disable @typescript-eslint/no-var-requires */
import { KnexList } from "src/ContextType";
import { Connection } from "mysql2";
import { envconfig } from "src/lib/envconfig";
const knex = require("knex");

function createKnexList(
  knexConfigs: { config: string; name: string }[]
): KnexList {
  const knexPools = {};

  for (let i = 0; i < knexConfigs.length; i++) {
    const { config, name } = knexConfigs[i];

    knexPools[name] = knex({
      client: "mysql2",
      connection: config,
      pool: {
        afterCreate: (conn: Connection, done: () => void) => {
          conn.query("SET SESSION innodb_lock_wait_timeout = 5;", () => {
            done();
          });
        },
        min: 1,
        max: 15,
      },
      dateStrings: true,
    });

    // Debugger
    if (process.env.DEBUG === "true") {
      knexPools[name].on("query", function (queryData) {
        // eslint-disable-next-line no-console
        // console.log(DebugQueryCounter.counter, name, new Date(), queryData.sql);
      });
    }
  }

  // runInitialState(knexPools['default']);
  return knexPools as unknown as KnexList;
}

export function createKnexConnectionsFromSetting() {
  return createKnexList([{ name: "default", config: envconfig.db }]);
}
