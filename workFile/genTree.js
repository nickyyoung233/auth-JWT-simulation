const itemLists = [
  {
    group: 101,
    appCode: "1111",
    itemCode: "111",
  },
  {
    group: 201,
    appCode: "1111",
    itemCode: "222333",
  },
  {
    group: 201,
    appCode: "1111",
    itemCode: "222",
  },
  {
    group: 101,
    appCode: "1111",
    itemCode: "111111",
  },
  {
    group: 201,
    appCode: "2222",
    itemCode: "222",
  },
  {
    group: 101,
    appCode: "2222",
    itemCode: "111",
  },
];

/** 
[
  {
    appCode: "1111",
    children: [
      {
        group: 101,
        itemCode: "111",
        children: [{ group: 101, itemCode: "111111" }],
      },
      {
        group: 201,
        itemCode: "222",
        children: [{ group: 201, itemCode: "222222" }],
      },
    ],
  },
  { appCode: "2222" },
];
*/

const obj = {};
const groupIndex = {};

function genTree(item) {
  if (!obj[item.appCode]) {
    if (item.itemCode.length === 3) {
      obj[item.appCode] = [{ ...item, children: [] }];
    } else {
      obj[item.appCode] = [
        { appCode: "占位", itemCode: "占位", children: [{ ...item }] },
      ];
    }
    groupIndex[item.appCode] = new Array(
      Math.pow(10, item.group.toString().length)
    );
    groupIndex[item.appCode][item.group] = obj[item.appCode].length - 1;
  } else {
    const _index = groupIndex[item.appCode][item.group];
    if (_index === void 0) {
      if (item.itemCode.length === 3) {
        obj[item.appCode].push({ ...item, children: [] });
      } else {
        obj[item.appCode].push({
          appCode: "占位",
          itemCode: "占位",
          children: [{ ...item }],
        });
      }
      groupIndex[item.appCode][item.group] = obj[item.appCode].length - 1;
    } else {
      if (item.itemCode.length === 3) {
        obj[item.appCode][_index] = {
          ...item,
          children: obj[item.appCode][_index].children,
        };
      } else {
        obj[item.appCode][_index].children.push({ ...item });
      }
    }
  }
}

itemLists.map((item) => genTree(item));

console.log(JSON.stringify(obj));
