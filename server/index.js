const Koa = require("koa");
const Static = require("koa-static");
const Body = require("koa-body");
const Cors = require("koa2-cors");
const Logger = require("koa-logger");
const Path = require("path");
const router = require("./router");
const app = new Koa();

const uploadDir = Path.resolve(__dirname, "upload");
const buildDir = Path.resolve(__dirname, "../dist");

app.use(Logger());
app.use(Cors());

app.use(Static(uploadDir));
app.use(Static(buildDir));
app.use(
  Body({
    multipart: true,
    formidable: {
      uploadDir,
      maxFileSize: 200 * 1024 * 1024,
      keepExtensions: true
    }
  })
);

app.use((ctx, next) => {
  return next().catch(err => {
    let [err_no = 500000, err_msg = "unknown error"] = err.message.split(":");
    ctx.statusCode = err_no.slice(0, 3);
    ctx.body = {
      err_no,
      err_msg
    };
  });
});

app.use(router.routes());
app.use(router.allowedMethods());

app.on("error", async (err, ctx) => {
  console.error("error occured:", err);
});

app.listen(3001);
