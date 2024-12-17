const Koa = require("koa");
const Router = require("koa-router");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const bodyParser = require("koa-bodyparser");
const fs = require("fs");
const path = require("path");
dotenv.config();
const app = new Koa();
const router = new Router();
app.use(bodyParser());
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  secure: true,
});
// 读取并缓存国际化消息
const responseMessages = loadLocaleMessages();
function loadLocaleMessages() {
  const messages = {};
  const localesPath = path.join(__dirname, "locale");
  fs.readdirSync(localesPath).forEach((locale) => {
    const filePath = path.join(localesPath, locale);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const localeData = JSON.parse(fileContent);
    messages[locale.replace(".json", "")] = localeData;
  });
  return messages;
}
function getResponseMessage(key, language = "zh") {
  return responseMessages[language][key] || responseMessages["zh"][key];
}
// 获取默认邮件内容
function getDefaultMailOptions(language = "zh") {
  return {
    defaultName: getResponseMessage("defaultName", language),
    defaultTitle: getResponseMessage("defaultTitle", language),
    defaultMsg: getResponseMessage("defaultMsg", language),
  };
}
// 发送邮件的通用函数
async function sendEmail(ctx, to, name, title, msg, language) {
  const defaultMailOptions = getDefaultMailOptions(language);
  const mailOptions = {
    from: `"${name || defaultMailOptions.defaultName}" <${
      process.env.SMTP_USER
    }>`,
    subject: title || defaultMailOptions.defaultTitle,
    text: msg || defaultMailOptions.defaultMsg,
    to: to,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: getResponseMessage("success", language),
      info: info,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: getResponseMessage("failure", language),
      error: error.message,
    };
  }
}
// 邮件发送接口 - POST
router.post("/push", async (ctx) => {
  const { to, name, title, msg } = ctx.request.body;
  const language = ctx.headers["accept-language"] || "zh";
  if (!to) {
    ctx.status = 400;
    ctx.body = {
      code: 400,
      message: getResponseMessage("missingFields", language),
    };
    return;
  }
  await sendEmail(ctx, to, name, title, msg, language);
});
// 邮件发送接口 - GET
router.get("/push", async (ctx) => {
  const { to, name, title, msg } = ctx.query;
  const language = ctx.headers["accept-language"] || "zh";
  if (!to) {
    ctx.status = 400;
    ctx.body = {
      code: 400,
      message: getResponseMessage("missingFields", language),
    };
    return;
  }
  await sendEmail(ctx, to, name, title, msg, language);
});
app.use(router.routes()).use(router.allowedMethods());
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});
