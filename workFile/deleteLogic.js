const formData = { userList: [], menuList: [] };
const userFormData = {
  showList: [],
  seletedList: [],
  filterList: [],
  deleteList: [],
};

function getData() {
  userFormData.filterList = Array.from({ length: 20 }, (_, index) => {
    return {
      id: index,
      name: `name${index}`,
      age: index,
    };
  });
}

//当添加页面新增数据 - 更新seletedList / 携带 liEnable
function addNewData() {
  userFormData.seletedList = [
    {
      id: "new",
      name: `new name${index}`,
      age: "new",
      liEnable: 1,
    },
  ];
}

//点击删除按钮
function deleteData(index) {
  const deleteItem = userFormData.filterList.splice(index, 1);
  if (deleteItem.liEnable === 1)
    userFormData.seletedList.filter((item) => item.id !== deleteItem.id);
  else {
    userFormData.filterList.filter((item) => item.id !== deleteItem.id);
    userFormData.deleteList.push({
      ...deleteItem,
      liEnable: 0,
    });
  }
}

//监听filterList 和 selectedList的变化 而更新总数组
function updateData() {
  userFormData.showList = [
    ...userFormData.filterList,
    ...userFormData.seletedList,
  ];
}

//最后保存的数据
function save() {
  formData.userList = [...userFormData.seletedList, ...userFormData.deleteList];
}
