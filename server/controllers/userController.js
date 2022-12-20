const apiError = require( '../error/api.error' )
const bcrypt = require( 'bcrypt' )
const jwt = require( 'jsonwebtoken' )
const { User, Company } = require( '../models/models' )


const generateJwt = ( id, email, role ) => {
    return jwt.sign(
        {
            id,
            email,
            role
        },
        process.env.SECRET_KEY,
        {
            expiresIn: '24h'// жизнь токена
        }
    )
}

class UserController {
    async registration( req, res, next ) {
        try {
            // берем из тела запроса данные
            let { email, password, company, role } = req.body
            if( !email || !password ) {
                return next( apiError.badRequest( 'Не кореектные данные' ) )
            }
            const candidate = await User.findOne( { where: { email } } ) //проверим что такого пользователя нет или есть
            if( candidate ) {
                return next( apiError.badRequest( 'Такой email уже зарегистрирован' ) )
            }
            //если пользователя нет то хешируем пароль
            const hashPassword = await bcrypt.hash( password, 5 )
            // создаем пользователя
            const user = await User.create( { email, role, password: hashPassword } )

            const userCompany = await Company.create( {
                userId: user.id,
                company_email: company.company_email,
                company_name: company.company_name,
                responsible_full_name: company.responsible_full_name,
                INN: company.INN
            } ).catch( () => {
                return next( apiError.badRequest( 'Ошибка' ) )
            } )

            //создаем токен. передаем ему что нужно зашить в него и секретный ключ
            const jwtToken = generateJwt( user.id, user.email, user.role )

            return res.json( { jwtToken } )
        } catch ( e ) {
            return next( apiError.badRequest( 'Ошибка' ) )
        }
    }

    async login( req, res, next ) {
        const { email, password } = req.body
        const user = await User.findOne( { where: { email } } )
        if( !user ) {
            return next( apiError.badRequest( 'Пользователь не найден' ) )
        }
        let comparePassword = bcrypt.compareSync( password, user.password )
        if( !comparePassword ) {
            next( apiError.badRequest( 'Ошибка' ) )
        }
        const jwtToken = generateJwt( user.id, user.email, user.role )
        if( jwtToken ) {
            return res.json( { jwtToken } )
        }
    }

    async getMe( req, res ) {
        const token = req.headers.authorization.split( ' ' )[ 1 ]
        const decoded = jwt.verify( token, process.env.SECRET_KEY )
        req.user = decoded
        const me = await User.findOne( { where: { id: req.user.id } } )
        const companyUser = await Company.findOne( { where: { userId: req.user.id } } )
        const { email, role, id } = me
        return res.json( { company: companyUser, me: { email, role, id }  } )
    }

    async checkAuth( req, res, next ) {
        const jwtToken = generateJwt( req.user.id, req.user.email, req.user.role )
        return res.json( { jwtToken } )
    }
}

module.exports = new UserController()