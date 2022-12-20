const { Request, User, Company, DeviceInfo, Manager } = require( '../models/models' )
const ApiError = require( '../error/api.error' )
const jwt = require( 'jsonwebtoken' )
const { where } = require( 'sequelize' )
const apiError = require( '../error/api.error' )

class RequestController {

    async create( req, res, next ) {
        try {
            const { state, city, address, placeSet, coordinates, nameLivingSection, endUser, company } = req.body
            const token = req.headers.authorization.split( ' ' )[ 1 ]
            const decoded = jwt.verify( token, process.env.SECRET_KEY )
            req.user = decoded
            const newCOm = {
                INN: company.INN,
                company_email: company.company_email,
                company_name: company.company_name,
                responsible_full_name: company.responsible_full_name
            }

            const updateCompany = await Company.findOne( { where: { userId: req.user.id } } )
                .then( async ( company ) => {
                    company.update(
                        {
                            INN: newCOm.INN,
                            company_email: newCOm.company_email,
                            company_name: newCOm.company_name,
                            responsible_full_name: newCOm.responsible_full_name
                        }
                    )
                    const request = await Request.create( {
                        state,
                        city,
                        address,
                        placeSet,
                        coordinates,
                        nameLivingSection,
                        endUser,
                        userId: req.user.id,
                        companyId: company.id,
                        userCompany: company
                    } )

                    return res.json( { request } )
                } )

        } catch ( err ) {
            next( ApiError.badRequest( err.message ) )
        }

    }



    async update( req, res, next ) {
        const { id, success, manager } = req.body
        if( Object.keys( manager ).length === 0 ) {
            return next( apiError.badRequest( 'Укажите менеджера' ) )
        }
        const findManager = await Manager.findOne( { where: { id: manager.id } } )

        if( !findManager ) {
            return next( apiError.badRequest( 'Менеджер не найден' ) )
        }

        const request = await Request.findOne( { where: { id: id } } )
            .then( async ( request ) => {
                request.update(
                    {
                        manager: findManager,
                        success: success
                    }
                )
                return res.json( { success: true } )
            } )
            .catch( ( err ) => {
                res.status( 403 ).json( { message: err } )
            } )
    }

    async get( req, res ) {
        const requestList = await Request.findAll()
        return res.json( requestList )
    }

    async getAllMy( req, res, next ) {
        try {
            const token = req.headers.authorization.split( ' ' )[ 1 ]
            const decoded = jwt.verify( token, process.env.SECRET_KEY )
            req.user = decoded

            const types = await Request.findAll( { where: { userId: req.user.id } } )
            return res.json( types )
        } catch ( err ) {
            next( ApiError.badRequest( err.message ) )
        }

    }
}

module.exports = new RequestController()