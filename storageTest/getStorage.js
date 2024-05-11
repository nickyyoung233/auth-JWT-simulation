// 永久存储 10mb
setTimeout(() => {
  // localStorage.removeItem("name");
  console.log(localStorage.getItem("name"));
}, 5000);

// tab关闭清除
setTimeout(() => {
  // sessionStorage.removeItem("name");
  console.log(sessionStorage.getItem("name"));
}, 5000);

// cookie 仅5kb大小，原生浏览器设置获取方式书写阅读不便
console.log(document.cookie);
