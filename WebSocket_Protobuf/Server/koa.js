const Koa = require('koa'),
  websockify = require('koa-websocket');
const pbjs = require('./Custom');

const app = websockify(new Koa());

// Regular middleware
// Note it's app.ws.use and not app.use
app.ws.use(function(ctx, next) {
  ctx.websocket.send('Here is Server.');
  ctx.websocket.on('message', function(message) {
    // do something with the message from client
      let person = pbjs.decodePerson(message);
      console.log(JSON.stringify(person));

      person.msg = "Here is the person from server.";
      ctx.websocket.send(pbjs.encodePerson(person));
      // ctx.websocket.send(person);
  });
});

app.listen(3000);