const db = require('../database/dbConfig.js')

module.exports= {
    find, 
    add, 
    findById, 
    findBy
}

function find(){
    return db('users').select('id', 'username')
}
async function add(user){
    const [id] = await db('users').insert(user, 'id')
    return findById(id)
}

function findById(id){
    return db('users')
    .where({id})
    .select('id', 'username','password')
    .first()
}

function findBy(filter){
    return db('users').where(filter)
}