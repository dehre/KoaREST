const Koa = require('koa'),
      bodyParser = require('koa-body'),
      morgan = require('koa-morgan'),
      mongoose = require('mongoose')

const app = new Koa(),
      router = require('./router')


//error handling
app.use(async (ctx,next)=>{
  try {
    await next()
  } catch(err){
    console.log(`Koa Error --> ${err}`);
    ctx.status = err.status || 500
    ctx.body = {
      error: 'Error happened'
    }
  }
})

//MONGO DB
const {DBHost} = require(`./config/${process.env.NODE_ENV}.json`)
mongoose.connect(DBHost, { useMongoClient: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

//MIDDLEWARES
app.use(bodyParser())
//disable morgan when testing
if(process.env.NODE_ENV !== 'test'){
  app.use(morgan(':method :url :status'))
}

//SERVE STATIC FILES
app.use(require('koa-static-server')({
  rootDir: 'static',
  rootPath: '/static'
}))

//ROUTER
app.use(router.routes())


app.listen(3000)
