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
        console.log("Databse connection successful")
    })
    .catch(err => {
        console.err("Unable to connect to database")
    })

const getUserByDiscordID = async (request, response) => {
    let userId = BigInt(request.id)

    return db.user.findOne({
        where: { discordID: userId }
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

// finds or creates a user and updates currentImage and history fields=
const createUser = (request, response) => {
    const discordInfo = request.discordInfo
    const imageInfo = request.imageInfo
    let history = { [imageInfo.title]: { link: imageInfo.link, count: 1 } }
    

    db.user.findOrCreate({
        where: { discordID: discordInfo.id },
        defaults: { name: discordInfo.username,
                    currentImage: imageInfo.link,
                    history: JSON.stringify(history),
                    discordID: discordInfo.id 
                }
        })
    .then(([user, created]) => {
        if (!created) {
            let currentHistory = JSON.parse(user.history)

            if (currentHistory[imageInfo.title]) {
                currentHistory[imageInfo.title].count += 1
            } else {
                currentHistory[imageInfo.title] = {
                                                    link: imageInfo.link,
                                                    count: 1
                                                }
            }

            user.update({
                currentImage: imageInfo.link,
                history: JSON.stringify(currentHistory)
            },
            {
                where: { discordID: discordInfo.id }
            })
            .catch(err => {
                console.log('Unable to update.')
            })
        }
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
    getUserByDiscordID,
    getUsersById,
    createUser,
    updateUser,
    deleteUser,
}