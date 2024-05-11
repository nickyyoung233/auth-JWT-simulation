// 永久存储 10mb
localStorage.setItem("name", "John");
console.log(localStorage.getItem("name"));

// tab关闭清除
sessionStorage.setItem("name", "John");
console.log(sessionStorage.getItem("name"));

// cookie 仅5kb大小，原生浏览器设置获取方式书写阅读不便
document.cookie =
  "name=John; expires=" + new Date(1715300193459 + 1000 * 60).toUTCString();
document.cookie =
  "lastName=Hose; expires=" +
  new Date(1715300193459 + 1000 * 100).toUTCString();
