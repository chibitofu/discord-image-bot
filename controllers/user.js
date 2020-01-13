const db = require('../models');
const Sequelize = require('sequelize')
const client = new Sequelize(
    'image_bot', 'moon', '',
    {
        host: 'localhost',
        dialect: 'postgres'
    }
)

client
    .authenticate()
    .then(() => {
        console.log("Connection successful")
    })
    .catch(err => {
        console.err("Unable to connect")
    })

const getUsers = (request, response) => {
    client.query('SELECT * FROM users ORDER BY id ASC', (err, results) => {
        if (err) {
            throw err
        }
        console.log(results.rows)
        // response.status(200).json(results.rows)

        return results.rows
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
    // const { name, email } = request.body
    const discordInfo = request.discordInfo
    const imageInfo = request.imageInfo

    db.user.findOrCreate({
        where: { discordID: discordInfo.id },
        defaults: { name: discordInfo.username,
                    currentImage: imageInfo.link,
                    history: [imageInfo.link],
                    discordID: discordInfo.id 
                }
        })
    .then(([user, created]) => {
        if (!created) {
            let currentHistory = user.history;
            currentHistory.push(imageInfo.link)

            user.update({
                currentImage: imageInfo.link,
                history: currentHistory
            },
            {
                where: { discordID: discordInfo.id }
            })
            .then((result) => {
                console.log(result);
            })
        }
        // console.log(user.get({
        //   plain: true
        // }))
        // console.log(created)
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