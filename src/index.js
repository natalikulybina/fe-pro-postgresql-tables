import { Client } from 'pg';

export const initConnection = () => {
  const {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB,
    POSTGRES_PORT,
    POSTGRES_HOST,
  } = process.env;
  const client = new Client({
    user: POSTGRES_USER || 'postgres',
    host: POSTGRES_HOST || 'localhost',
    database: POSTGRES_DB || 'postgres',
    password: POSTGRES_PASSWORD || 'postgres',
    port: POSTGRES_PORT || 5556,
  });

  return client;
};

export const createStructure = async () => {
  const client = initConnection();
  client.connect();

  await client.query(`
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      name VARCHAR (30) NOT NULL,
      date DATE NOT NULL DEFAULT CURRENT_DATE
    );`);

    await client.query(`
    CREATE TABLE categories(
      id SERIAL PRIMARY KEY,
      name VARCHAR (30) NOT NULL
    );`);

    await client.query(`
    CREATE TABLE authors(
      id SERIAL PRIMARY KEY,
      name VARCHAR (30) NOT NULL
    ); `);

    await client.query(`
    CREATE TABLE books(
      id SERIAL PRIMARY KEY,
      title VARCHAR(30) NOT NULL,
      userid INTEGER NOT NULL,
      foreign key (userid) REFERENCES users (id) ON DELETE CASCADE,
      authorid INTEGER NOT NULL,
      foreign key (authorid) REFERENCES authors (id) ON DELETE CASCADE,
      categoryid INTEGER NOT NULL,    
      foreign key (categoryid) REFERENCES categories (id) ON DELETE CASCADE
    );`);

    await client.query(`
    CREATE TABLE descriptions(
      id SERIAL PRIMARY KEY,
      description VARCHAR(10000) NOT NULL,
      bookid INTEGER NOT NULL,
      foreign key (bookid) REFERENCES books (id) ON DELETE CASCADE
    );`);

    await client.query(`
    CREATE TABLE reviews(
      id SERIAL PRIMARY KEY,
      message VARCHAR(10000) NOT NULL,
      userid INTEGER NOT NULL,
      foreign key (userid) REFERENCES users (id) ON DELETE CASCADE,
      bookid INTEGER NOT NULL,
      foreign key (bookid) REFERENCES books (id) ON DELETE CASCADE
    );`);

  client.end();
};

export const createItems = async () => {
  const client = initConnection();
  client.connect();

  await client.query(`
    INSERT INTO users(name) VALUES('Natali');
  `);

  await client.query(`
    INSERT INTO categories(name) VALUES('High-fantasy novel');
  `);

  await client.query(`
    INSERT INTO authors(name) VALUES('J. R. R. Tolkien');
  `);

  await client.query(`
    INSERT INTO books(name, userid, authorid, categoryid) VALUES ('The Lord of the Rings', 1, 1, 1);
  `);

  await client.query(`
    INSERT INTO descriptions(description, bookid) VALUES ('It explains how the narrative follows on from The Hobbit, in which the hobbit Bilbo Baggins finds the One Ring, which had been in the possession of Gollum.', 1);
  `);

  await client.query(`
    INSERT INTO reviews(message, userid, bookid) VALUES ('Love him and his son's books - greatest fantasy of all time.', 1, 1);
  `);

  client.end();
};

export const dropTables = async () => {
  const client = initConnection();
  client.connect();

  await client.query('DROP TABLE reviews;');
  await client.query('DROP TABLE descriptions;');
  await client.query('DROP TABLE books;');
  await client.query('DROP TABLE authors;');
  await client.query('DROP TABLE categories;');
  await client.query('DROP TABLE users;');

  client.end();
};
