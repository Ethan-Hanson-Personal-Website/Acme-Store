const pg = require('pg');
const client = new pg.Client('postgress.env.DATABASE_URL' || 'postgres://localhost/acme_store_db');

//returns an array of users
app.get('/api/users', async (req, res, next) => {
});

//returns an array of products
app.get('/api/products', async (req, res, next) => { });

//returns an array of favorites for a user
app.get('/api/users/:id/favorites', async (req, res, next) => { });

//Payload: a product id. returns the created favorite with a status of 201
app.post('/api/users/:id/favorites', async (req, res, next) => { });

//delete a favorite for a user, returns nothing with a status of 204
app.delete('/api/users/:id/favorites/:id', async (req, res, next) => { });


const createTables = async () => {
    const SQL = `
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS favorites;
    CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        username STRING UNIQUE NOT NULL,
        password STRING UNIQUE NOT NULL,
    );
    CREATE TABLE products(
        id SERIAL PRIMARY KEY,
        name STRING UNIQUE NOT NULL,
        );
    CREATE TABLE favorites(
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        product_id INTEGER REFERENCES products(id),
        CONSTRAINT user_product UNIQUE(user_id, product_id)
    );
    `;
    await client.query(SQL);
};

module.exports = {
    client,
    createTables
};