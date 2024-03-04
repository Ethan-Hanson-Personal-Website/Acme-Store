const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_store_db');
const uuid = require('uuid');
const bcrypt = require('bcrypt');


// //returns an array of users
// app.get('/api/users', async (req, res, next) => {
// });

// //returns an array of products
// app.get('/api/products', async (req, res, next) => { });

// //returns an array of favorites for a user
// app.get('/api/users/:id/favorites', async (req, res, next) => { });

// //Payload: a product id. returns the created favorite with a status of 201
// app.post('/api/users/:id/favorites', async (req, res, next) => { });

// //delete a favorite for a user, returns nothing with a status of 204
// app.delete('/api/users/:id/favorites/:id', async (req, res, next) => { });


const createTables = async () => {
    const SQL = `
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS favorites;
    CREATE TABLE users(
        id UUID PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) UNIQUE NOT NULL,
    );
    CREATE TABLE products(
        id UUID PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        );
    CREATE TABLE favorites(
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id) NOT NULL,
        product_id UUID REFERENCES products(id) NOT NULL,
        CONSTRAINT user_product UNIQUE(user_id, product_id)
    );
    `;
    await client.query(SQL);
};

const createUser = async (username, password) => {
    const SQL = `
    INSERT INTO users(username, password) VALUES($1, $2) RETURNING *;
    `;
    const response = await client.query(SQL, [uuid.v4(), username, await bcrypt.hash(password, 5)]);
    return response.rows[0];
}

const fetchUsers = async () => {
    const SQL = `SELECT * FROM users`;
    const response = await client.query(SQL);
    return response.rows;
}

const createProduct = async (name) => {
    const SQL = `
    INSERT INTO products(name) VALUES($1) RETURNING *;
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
}

const fetchProducts = async () => {
    const SQL = `SELECT * FROM products`;
    const response = await client.query(SQL);
    return response.rows;

}

const createFavorites = async ({ user_id, product_id }) => {
    const SQL = `
    INSERT INTO favorites(user_id, product_id) VALUES($1, $2) RETURNING *;
    `;
    const response = await client.query(SQL, [uuid.v4(), user_id, product_id]);
    return response.rows[0];
}

const fetchFavorites = async (id) => {
    const SQL = `SELECT * FROM favorites
    WHERE user_id = $1
    `;
    const response = await client.query(SQL, [id]);
    return response.rows;
}

const deleteFavorites = async (id) => {
    const SQL = `DELETE FROM favorites
    WHERE id = $1 and user_id = $2
    `;
    await client.query(SQL, [ id, user_id]);
}
    

module.exports = {
    client,
    createTables,
    createUser,
    createProduct,
    createFavorites,
    fetchUsers,
    fetchProducts,
    fetchFavorites,
    deleteFavorites
};