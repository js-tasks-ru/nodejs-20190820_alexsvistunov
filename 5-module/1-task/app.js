const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const subscriptions = [];

router.get('/subscribe', async (ctx, next) => {
  const getNewMessage = () => new Promise((resolve, reject) => {
    subscriptions.push(resolve);

    ctx.res.on('close', () => {
      const resolveIndex = subscriptions.indexOf(resolve);
      subscriptions.splice(resolveIndex, 1);
    });
  });

  ctx.response.body = await getNewMessage();
});

router.post('/publish', async (ctx, next) => {
  const newMessage = ctx.request.body.message;

  if (newMessage) {
    subscriptions.forEach((resolve) => resolve(newMessage));
    ctx.response.status = 200;
    ctx.response.body = 'OK';
  } else {
    ctx.response.status = 204;
    ctx.response.body = 'No Content';
  }
});

app.use(router.routes());

module.exports = app;
