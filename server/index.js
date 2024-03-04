const { client, createTables, createUser, createProduct, createFavorites, fetchUsers, fetchProducts, fetchFavorites, deleteFavorites } = require('./db');
const express = require('express');
const app = express();

//returns an array of users
app.get('/api/users', async (req, res, next) => {
    try {
        res.send(await fetchUsers());
    } catch (error) {
        next(error);
    }
});

//returns an array of products
app.get('/api/products', async (req, res, next) => { 
    try {
        res.send(await fetchProducts());
    } catch (error) {
        next(error);
    }
});

//returns an array of favorites for a user
app.get('/api/users/:id/favorites', async (req, res, next) => {
    try {
        res.send(await fetchFavorites(req.params.id));
    } catch (error) {
        next(error);
    }
});

//Payload: a product id. returns the created favorite with a status of 201
app.post('/api/users/:id/favorites', async (req, res, next) => { 
    try {
        res.status(201).send(await createFavorites({ user_id: req.params.id, product_id: req.body.product_id }));
    } catch (error) {
        next(error);
    }
});

//delete a favorite for a user, returns nothing with a status of 204
app.delete('/api/users/:id/favorites/:id', async (req, res, next) => { 
    try {
        await deleteFavorites(req.params.id);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
});


const init = async()=> {
    await client.connect();
    console.log('connected to database');
    await createTables();
    console.log('tables created');
    const [Thing1, Thing2, Thing3, apple, banana, cherry] = await Promise.all([
        createUser({ username: 'Thing1', password: 's3cr3t' }),
        createUser({ username: 'Thing2', password: 's3cr3t!!' }),
        createUser({ username: 'Thing3', password: 'shhh' }),
        createProduct({ name: 'apple'}),
        createProduct({ name: 'banana'}),
        createProduct({ name: 'cherry'}),
    ]);
    const users = await fetchUsers();
    console.log(users);
    const products = await fetchProducts();
    console.log(products);

    const createdFavorites = await Promise.all([
        createFavorites({ user_id: Thing1.id, product_id: apple.id }),
        createFavorites({ user_id: Thing1.id, product_id: banana.id }),
        createFavorites({ user_id: Thing2.id, product_id: banana.id }),
        createFavorites({ user_id: Thing3.id, product_id: cherry.id }),
    ]);
    console.log(await fetchFavorites(Thing1.id));
    await deleteFavorites(createdFavorites[0].id);
    console.log(await fetchFavorites(Thing1.id));

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));

    console.log(`CURL localhost:3000/api/users/${Thing1.id}/favorites -X POST -d '{"product_id": "${cherry.id}"}' -H "Content-Type: application/json"`);

    };

init();