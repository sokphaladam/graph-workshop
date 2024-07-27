import { ContextType } from "src/ContextType";
import { table_category } from "src/generated/tables";

interface CategoryTreeNode {
  id: number;
  name: string;
  path: string;
  children: CategoryTreeNode[];
}

interface CategoryPrebuild {
  root: CategoryTreeNode;
  hash: { [key: number]: CategoryTreeNode };
}

function buildPath(path: string, children: any[]) {
  for (const child of children) {
    child.path = path;
    buildPath(path + child.name + ">", child.children);
  }
}

export async function categoryList(_, {}, ctx: ContextType) {
  const knex = ctx.knex.default;

  const category: table_category[] = await knex
    .table<table_category>("category")
    .where("is_active", true);

  // const idMapping = category.reduce((acc: any, el, i) => {
  //   acc[el.id] = i;
  //   return acc;
  // }, {});

  // let root;

  // category.forEach((el) => {
  //   if (el.root === 0) {
  //     root = el;
  //     return;
  //   }

  //   const parentEl: any = category[idMapping[el.root]];

  //   parentEl.items = [...(parentEl.items || []), el];
  // });

  // return category.filter((x) => x.root === 0);

  const hash: { [key: number]: CategoryTreeNode } = {
    0: {
      children: [],
      id: 0,
      name: "",
      path: "",
    },
  };

  for (const item of category) {
    const node: CategoryTreeNode = {
      id: item.id,
      name: item.name as string,
      path: "",
      children: [],
    };

    hash[item.id] = node;
  }

  // Attach all the children
  for (const item of category) {
    if (item.root) {
      if (hash[item.root]) {
        hash[item.root].children.push(hash[item.id]);
      }
    } else {
      hash[0].children.push(hash[item.id]);
    }
  }

  buildPath("", hash[0].children);

  return {
    root: hash[0],
    hash,
  };
}
