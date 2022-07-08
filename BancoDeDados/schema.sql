create database data_base 

create table if not exists usuarios(
  id serial primary key,
  nome text not null,
  email text null unique,
  senha text not null,
  cpf varchar(14),
  telefone varchar(15) 
);
 
 create table if not exists clientes(
  id serial primary key,
  usuario_id integer not null, 
  nome text not null,
  email text null unique,
  cpf varchar(14) not null unique,
  telefone varchar(15) not null unique,
  cep varchar(9),
  logradouro text,
  complemento text,
  bairro text,
  cidade text,
  estado varchar(2),
  status text default 'Em Dia',
  foreign key (usuario_id) references usuarios(id)
);

create table if not exists cobrancas(
 id serial primary key,
 descricao text not null,
 status text not null, 
 valor  int not null, 
 vencimento timestamptz not null,
 cliente_id int references clientes(id),
 usuario_id int references usuarios(id)
);

