const { client, createTables } = require('./db');


const init = async()=> {
try{
    await client.connect();
    console.log('connected to database');
    await createTables();
    console.log('tables created');
}catch(err){
    console.log('error connecting to database');
    console.log(err);
}
}

init();