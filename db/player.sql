create table player(
  id bigserial PRIMARY KEY,
  session_id uuid unique,
  username VARCHAR(20) not null unique,
  banned bool not null default false,
  email varchar(100) not null unique,
  password varchar(20) not null,
  wallet varchar(100) unique,
  role varchar(30) not null default 'player',
  gems int not null default 10 check(gems >= 0),
  hearts int not null default 10 check(hearts >= 0),
  wei bigint not null default 0
);



insert into player(
  id,username,email,banned,wallet,password,role,gems,hearts,wei
)
