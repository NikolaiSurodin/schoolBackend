const Router = require( 'express' )
const router = new Router()

const userRouter = require( './userRouter' )
const deviceRouter = require( './deviceRouter' )
const brandRouter = require( './brandRouter' )
const typeRouter = require( './typeRouter' )
const requestRouter = require( './requestRouter' )
const managerRouter = require( './managerRouter' )

router.use( '/user', userRouter )
router.use( '/device', deviceRouter )
router.use( '/brand', brandRouter )
router.use( '/type', typeRouter )
router.use( '/request', requestRouter )
router.use( '/manager', managerRouter )

module.exports = router