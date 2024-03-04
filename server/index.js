const { client, createTables, createUser, createProduct, createFavorites, fetchUsers, fetchProducts } = require('./db');


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
    };

init();