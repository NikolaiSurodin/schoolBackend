const sequelize = require( '../bd' )
const { DataTypes } = require( 'sequelize' )

const User = sequelize.define( 'user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: 'USER' }
} )

const Company = sequelize.define( 'company', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    company_email: { type: DataTypes.STRING, unique: false },
    company_name: { type: DataTypes.STRING, allowNull: false },
    responsible_full_name: { type: DataTypes.STRING, allowNull: false },
    INN: { type: DataTypes.STRING, unique: true, allowNull: false }
} )

const Request = sequelize.define( 'request', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    state: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    placeSet: { type: DataTypes.STRING, allowNull: false },
    coordinates: { type: DataTypes.STRING, allowNull: false },
    nameLivingSection: { type: DataTypes.STRING, allowNull: false },
    endUser: { type: DataTypes.STRING, allowNull: false },
    success: { type: DataTypes.BOOLEAN, defaultValue: false },
    userCompany: { type: DataTypes.JSON },
    manager: { type: DataTypes.JSON }
} )

const Basket = sequelize.define( 'basket', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
} )

const Manager = sequelize.define( 'manager', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    secondName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, require: true }
} )

const BasketDevice = sequelize.define( 'basketDevice', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
} )

const Device = sequelize.define( 'device', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, defaultValue: 0 },
    img: { type: DataTypes.STRING, allowNull: false }
} )

const Type = sequelize.define( 'type', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false }
} )

const Brand = sequelize.define( 'brand', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false }
} )

const Rating = sequelize.define( 'rating', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    rate: { type: DataTypes.INTEGER, defaultValue: 0 }
} )

const DeviceInfo = sequelize.define( 'deviceInfo', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false }
} )

const TypeBrand = sequelize.define( 'typeBrand', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
} )

//делаем связи между таблицами
User.hasOne( Basket ) // один пользователь имеет одну корзину
Basket.belongsTo( User ) // корзина принадлежит пользователю

User.hasMany( Rating ) // пользователь может ставить много рейтингов
Rating.belongsTo( User )


User.hasOne( Company )
Company.belongsTo( User )

Company.hasMany( Request )
Request.belongsTo( Company )

User.hasMany( Request )
Request.belongsTo( User )

Request.hasOne( Company )
Company.belongsTo( Request )


Basket.hasMany( BasketDevice )
BasketDevice.belongsTo( Basket )

Type.hasMany( Device )
Device.belongsTo( Type )

Brand.hasMany( Device )
Device.belongsTo( Brand )

Device.hasMany( Rating )
Rating.belongsTo( Device )

Device.hasMany( BasketDevice )
BasketDevice.belongsTo( Device )

Device.hasMany( DeviceInfo, { as: 'info' } )
DeviceInfo.belongsTo( DeviceInfo )


Type.belongsToMany( Brand, { through: TypeBrand } )
Brand.belongsToMany( Type, { through: TypeBrand } )

module.exports = {
    User,
    Company,
    Request,
    Basket,
    BasketDevice,
    Device,
    Type,
    TypeBrand,
    Brand,
    Rating,
    DeviceInfo,
    Manager
}