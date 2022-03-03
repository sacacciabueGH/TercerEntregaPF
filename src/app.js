import express from 'express';
import {engine} from 'express-handlebars';
import cors from 'cors';
import productosRouter from './routes/productos.js';
import carritoRouter from './routes/carrito.js';
import {Server} from 'socket.io';
import __dirname from './utiles.js';
import session from 'express-session';
import MongoStore from 'connect-mongo'
import { initializePassport } from './passport-config.js';
import passport from 'passport';

const app = express();
const PORT = process.env.PORT||8080;
const server = app.listen(PORT,()=>{
    console.log("servidor escuchando en: "+PORT);
})

export const io = new Server(server);


app.engine('handlebars',engine())
app.set('views',__dirname+'/views')
app.set('view engine','handlebars')
app.use(session({
    store:MongoStore.create({mongoUrl:"mongodb+srv://santi451:123@cluster0.hzxzy.mongodb.net/sessions?retryWrites=true&w=majority"}),
    secret:"eccomercecoder",
    resave:false,
    saveUninitialized:false
}))
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));

app.use('/api/productos',productosRouter);
app.use('/api/carrito',carritoRouter);

app.post('/api/register',passport.authenticate('register',{failureRedirect:'/failedRegister'}),(req,res)=>{
    res.send({messages:"Signed up"})
})

app.post('/api/login',passport.authenticate('login',{failureRedirect:'/failedLogin'}),(req,res)=>{
    res.send({messages:"Logued!"})
})

app.get('/failedRegsiter',(req,res)=>{
    res.send("ERROR AL REGISTRARSE")
})

app.get('/failedLogin',(req,res)=>{
    res.send("ERROR AL LOGUEARSE")
})