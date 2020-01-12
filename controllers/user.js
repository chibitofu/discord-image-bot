const Client = require('pg').Client;
const client = new Client({
    user: 'moon',
    host: 'localhost',
    database: 'image_bot',
    password: '',
    port: 5432,
})

client.connect();

const getUsers = (request, response) => {
    client.query('SELECT * FROM users ORDER BY id ASC', (err, results) => {
        if (err) {
            throw err
        }
        console.log(results)
        response.status(200).json(results.rows)
    })
}

const getUsersById = (request, response) => {
    const id = parseInt(request.params.id)

    client.query('SELET * FROM users WHERE id = $1', [id], (err, results) => {
        if (err) {
            throw err
        }
        response.status(200).json(results.rows)
    })
}

const createUser = (request, response) => {
    const { name, email } = request.body

    client.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (err, results) => {
        if (err) {
            throw err
        }
        response.status(201).send(`User added with ID: ${result.inserId}`)
    })
}

const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, email } = request.body

    client.query(
        'UPDATE users SET name =$1, email = $2 WHERE id = $3',
        [name, email, id],
        (err, results) => {
            if (err) {
                throw err
            }

            response.status(200).send(`User modified with ID: ${id}`)
        }
    )
}

const deleteUser = (request, response) => {
    const id = parseInt(request.params,id)

    client.query('DELETE FROM users WHERE id = $1', [id], (err, results) => {
        response.status(200).send(`User deleted with ID: ${id}`)
    })
}

module.exports = {
    getUsers,
    getUsersById,
    createUser,
    updateUser,
    deleteUser,
}