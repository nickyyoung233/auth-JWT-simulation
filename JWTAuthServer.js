// 此处需要调用该库保证.env文件中的环境变量生效
require("dotenv").config();

const express = require("express");

const app = express();

const jwt = require("jsonwebtoken");

app.use(express.json());

let refreshTokens = [];

app.post("/token", (req, res) => {
  const { token: refreshToken, username } = req.body;
  if (refreshToken == null) return res.sendStatus(401); //401 unauthorized —— 没有通过授权；refreshToken不存在
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403); //403 forbidden —— 没有权限；说明refreshToken失效或无效
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: username });
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
    res.json({ accessToken, refreshToken });
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
