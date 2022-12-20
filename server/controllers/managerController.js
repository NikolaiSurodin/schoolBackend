const apiError = require( '../error/api.error' )
const { Manager } = require( '../models/models' )
const { Op } = require( 'sequelize' )

class ManagerController {
    async get( req, res ) {
        const { search } = req.query
        if( search ) {
            const list = await Manager.findAll( {
                where: {
                    [ Op.or ]: [
                        {
                            'secondName':
                                {
                                    [ Op.iLike ]: '%' + search + '%'
                                }
                        }
                    ]
                }
            } )
            return res.json( list )
        } else {
            const managerList = await Manager.findAll()
            return res.json( managerList )
        }
    }

    async create( req, res, next ) {
        const { name, secondName, email } = req.body
        if( !name || !secondName || !email ) {
            return next( apiError.badRequest( 'Ошибка' ) )
        }
        const candidate = await Manager.findOne( { where: { email } } )

        if( candidate ) {
            return next( apiError.badRequest( 'Такой менеджер уже создан' ) )
        }
        const manager = await Manager.create( {
            name,
            secondName,
            email
        } )
        return res.json( { manager } )
    }


}

module.exports = new ManagerController()