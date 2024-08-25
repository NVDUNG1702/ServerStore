const { TypeProduct } = require("../models/index");


const type = [
    { typeName: 'Pants', detailType: 'Quần' },
    { typeName: 'Shirt', detailType: 'Áo' },
    { typeName: 'Hat', detailType: 'Mũ' },
    { typeName: 'Shoes', detailType: 'Giày' },
    { typeName: 'Sandals', detailType: 'Dép' },
    { typeName: 'Dress', detailType: 'Váy' },
]

const typeProductController = {
    create: async (req, res) => {
        
        const newType = await TypeProduct.create(type[4])

        res.json({
            newType
        })
    }


}


module.exports = typeProductController