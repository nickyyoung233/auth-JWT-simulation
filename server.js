// 此处需要调用该库保证.env文件中的环境变量生效
require("dotenv").config();

const express = require("express");

const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    origin: "http://localhost:5500",
    credentials: true,
  })
);

const jwt = require("jsonwebtoken");

app.use(express.json());

app.use(cookieParser());

const posts = [
  { username: "Kyle", title: "Post 1", content: "This is Kyle's post 1" },
  { username: "Jim", title: "Post 2", content: "This is Jim's post 2" },
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
  // console.log("authenticateToken----", req.headers, req.cookies);
  console.log("authenticateToken----", req.cookies.accessToken);
  // const authHeader = req.headers["authorization"];
  // const token = authHeader && authHeader.split(" ")[1];
  const token = req.cookies.accessToken;
  if (token == null) return res.sendStatus(401); //401 unauthorized —— 没有通过授权
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log("err:", err);
    if (err) return res.sendStatus(403); //403 forbidden —— 没有权限
    req.user = user;
    next();
  });
}

app.listen(3000, () => {
  console.log("running on 3000");
});
