const router = require("koa-router")();
const fs = require("fs");
const Path = require("path");
const axios = require("axios");
const { base64encode } = require("utility");

const getWavData = id => {
  let file = Path.resolve(__dirname, `upload/${id}.wav`);
  let len = fs.statSync(file).size;
  return {
    speech: base64encode(fs.readFileSync(file)),
    len
  };
};

const getToken = async () => {
  const res = await axios({
    method: "get",
    url: "https://openapi.baidu.com/oauth/2.0/token",
    params: {
      grant_type: "client_credentials",
      client_id: "DOANXI7kQ56LET1zACU2rnmt",
      client_secret: "nPgAkVHRtUFPU6rEY1edKZZNwssQinuZ"
    }
  });
  return res.data.access_token;
};

const token =
  "24.911b02d7a19171a50b4b8f67ba28aaf4.2592000.1573839865.282335-17528095";

const getVoiceText = async (wavData, type) => {
  let url = "https://vop.baidu.com/server_api";
  let data = {
    token,
    // dev_pid: 80001,
    format: "wav",
    rate: 16000,
    channel: 1,
    cuid: "9a:00:12:43:d1:20",
    ...wavData
  };
  if (type === 1) {
    data.dev_pid = 80001;
    url = "https://vop.baidu.com/pro_api";
  }
  const ret = await axios({
    method: "post",
    url,
    data
  });

  return ret.data;
};

const getAuth = async type => {
  let url = "https://openapi.baidu.com/oauth/2.0/token";
  type === 1 && (url = "https://aip.baidubce.com/oauth/2.0/token");
  const res = await axios({
    url,
    method: "get",
    params: {
      grant_type: "client_credentials",
      client_id: "DOANXI7kQ56LET1zACU2rnmt",
      client_secret: "nPgAkVHRtUFPU6rEY1edKZZNwssQinuZ"
    }
  });
  return res.data;
};

router.get("/voice/auth", async ctx => {
  const token = await getToken();
  ctx.body = {
    token
  };
});

router.post("/voice/upload", async ctx => {
  const file = ctx.request.files.file;
  if (!file) {
    return;
  }
  if (file.type !== "audio/wav") {
    fs.unlinkSync(file.path);
    ctx.status = 403;
    return (ctx.body = {
      message: "您上传的文件格式错误，仅支持 wav 格式"
    });
  }
  let text = await fetchVoice({
    len: file.size,
    speech: base64encode(fs.readFileSync(file.path))
  });

  const fileData = {
    name: file.name,
    path: file.path,
    size: file.size,
    time: Date.now(),
    text
  };
  const res = await handleJsonMap("add", fileData);
  ctx.body = { ...res, text };
});

router.get("/voice/list", async ctx => {
  const ret = await handleJsonMap();
  ctx.body = ret;
});

router.get("/voice/:id", async ctx => {
  const urlList = ctx.request.url.split("/");
  if (urlList.length !== 3) {
    return (ctx.status = 404);
  }
  const wavId = urlList.pop();

  const wavData = getWavData(wavId);
  let ret = await getVoiceText(wavData);
  ctx.body = ret;
});

module.exports = router;
