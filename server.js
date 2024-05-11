// 此处需要调用该库保证.env文件中的环境变量生效
require("dotenv").config();

const express = require("express");

const app = express();

const jwt = require("jsonwebtoken");

app.use(express.json());

const posts = [
  { username: "Kyle", title: "Post 1", content: "This is post 1" },
  { username: "Jim", title: "Post 2", content: "This is post 2" },
  { username: "Rayn", title: "Post 3", content: "This is Rayn's post" },
];

const users = [];

/** 路由从这里开始定义------- */

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user?.name));
});

/** 中间件从这里开始定义------- */
function authenticateToken(req, res, next) {
  // header的格式为：Bearer token
  //   console.log(req);
  console.log(req.headers, req.body);
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401); //401 unauthorized —— 没有通过授权
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); //403 forbidden —— 没有权限
    req.user = user;
    next();
  });
}

app.listen(3000, () => {
  console.log("running on 3000");
});
