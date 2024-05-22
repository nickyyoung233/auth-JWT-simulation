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

let refreshTokens = [];

//采用cookie执行鉴权
app.get("/token", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  console.log(refreshToken);
  if (refreshToken == null) return res.sendStatus(401); //401 unauthorized —— 没有通过授权；refreshToken不存在
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403); //403 forbidden —— 没有权限；说明refreshToken失效或无效
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    console.log("refreshUser---");
    // "username": "Rayn",jwt 会根据token解析出用户信息

    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
});

//采用authenizition
app.post("/token", (req, res) => {
  const { token: refreshToken } = req.body;
  console.log(req.body, refreshToken);
  if (refreshToken == null) return res.sendStatus(401); //401 unauthorized —— 没有通过授权；refreshToken不存在
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403); //403 forbidden —— 没有权限；说明refreshToken失效或无效
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    console.log("refreshUser---");
    // "username": "Rayn",jwt 会根据token解析出用户信息

    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
});

app.post("/login", (req, res) => {
  //登录校验处理
  /** --------- TODO：此处假设成功登录 ------------  */
  //JWT生成
  try {
    const username = req.body.username;
    const user = { name: username };
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);
    // res.setHeader("Access-Control-Expose-Headers", "Authorization");
    // res.setHeader("Authorization", `Bearer ${refreshToken}`);
    res.cookie("accessToken", accessToken, {
      maxAge: 10 * 1000,
      // domain: "http://localhost:5500",
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 30 * 60 * 1000,
      // domain: "http://localhost:5500",
      httpOnly: true,
    });

    // res.cookie("accessToken", accessToken);
    // res.json({ accessToken, refreshToken });
    res.json("login success");
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
}
function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

app.listen(4000, () => {
  console.log("JWT auth is running on 4000");
});
