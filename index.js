var restify = require('restify');

var errs = require('restify-errors');

const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    user : 'root',
    password : 'root',
    database : 'mydb'
  }
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.get('/echo/:name', function (req, res, next) {
  res.send(req.params);
  return next();
});

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});



server.get('/', restify.plugins.serveStatic({
  directory: './dist',
  file: 'index.html'
}));

//Listando dados

server.get('/read', function (req, res, next) {
  
  knex('rest').then((dados)=>{

   res.send(dados);

  },next);
 
 return next();
});


//Inserindo dados

server.post('/create', function (req, res, next) {
  
  knex('rest')
    .insert(req.body) 
    .then((dados)=>{

      res.send(dados);

  },next);
 
 return next();
});



// Consulta dados por id

server.get('/show/:id', function (req, res, next) {
  
  const { id} = req.params;

  knex('rest')
   
   .where('id', id)
   
   .first()
    
   .then((dados)=>{

   if (!dados) return res.send(new errs.BadRequestError('nada foi encontrado') )
    res.send(dados);

  },next);
 
 
});

// Atualizando dados

server.put('/update/:id', function (req, res, next) {
  
  const { id} = req.params;

  knex('rest')
   
   .where('id', id)
   
   .update(req.body)
    
   .then((dados)=>{

   if (!dados) return res.send(new errs.BadRequestError('nada foi encontrado') )
    res.send('dados atualizados');

  },next);
 
 
});

//Excluindo dados

server.del('/delete/:id', function (req, res, next) {
  
  const { id} = req.params;

  knex('rest')
   
   .where('id', id)
   
   .delete()
    
   .then((dados)=>{

   if (!dados) return res.send(new errs.BadRequestError('nada foi encontrado') )
    res.send('dados excluidos');

  },next);
 
 
});