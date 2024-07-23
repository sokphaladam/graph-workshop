import { ContextType } from "src/ContextType";
import { table_category } from "src/generated/tables";

export async function categoryList(_, {}, ctx: ContextType) {
  const knex = ctx.knex.default;

  const category: table_category[] = await knex
    .table<table_category>("category")
    .where("is_active", true);

  const idMapping = category.reduce((acc: any, el, i) => {
    acc[el.id] = i;
    return acc;
  }, {});

  let root;

  category.forEach((el) => {
    if (el.root === 0) {
      root = el;
      return;
    }

    const parentEl: any = category[idMapping[el.root]];

    parentEl.items = [...(parentEl.items || []), el];
  });

  return category.filter((x) => x.root === 0);
}
