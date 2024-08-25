// const { where } = require("sequelize");
const { Product, SizeProduct, sequelize, FavoriteProduct } = require("../models/index");



const productController = {
    getAllProduct: async (req, res) => {
        try {
            const [results] = await sequelize.query(
                `SELECT 
                    Products.id AS productId,
                    Products.name AS productName,
                    Products.price,
                    Products.detail,
                    Products.image,
                    TypeProducts.typeName,
                    TypeProducts.detailType
                    FROM 
                        Products
                    JOIN 
                        TypeProducts ON Products.type_id = TypeProducts.id
                    ORDER BY 
                        Products.id;`
            )

            if (!results) {
                res.status(404).json({
                    message: "null"
                })
            }
            res.status(200).json({
                status: 200,
                data: results
            })
        } catch (error) {
            res.status(500).json({
                message: error
            })
        }
    },

    getProductById: async (req, res) => {
        try {
            const { id } = req.params;
            const [results] = await sequelize.query(
                `SELECT 
                    Products.id AS productId,
                    Products.name AS productName,
                    Products.price,
                    Products.detail,
                    Products.image,
                    TypeProducts.typeName,
                    TypeProducts.detailType
                    FROM 
                        Products
                    JOIN 
                        TypeProducts ON Products.type_id = TypeProducts.id
                    WHERE Products.id=${id}
                    ORDER BY 
                        Products.id;`
            )

            if (!results) {
                res.status(404).json({
                    message: "null"
                })
            }
            res.status(200).json({

                results
            })
        } catch (error) {
            res.status(500).json({
                message: error
            })
        }
    },

    updateQuantity: async (req, res) => {
        try {
            const { idProduct, quantity, sizeID } = req.body

            const sizeProductFind = await SizeProduct.findOne({
                where: { id_product: idProduct, id: sizeID }
            })

            if (!sizeProductFind) {
                res.status(404).json({
                    message: "size not found"
                })
            }

            if (sizeProductFind.quantity < quantity) {
                res.status(501).json({
                    message: "quantity is not enough"
                })
            }

            sizeProductFind.quantity -= quantity;
            await sizeProductFind.save();
            res.status(200).json({
                data: "update success"
            })

        } catch (error) {
            res.status(500).json({
                message: error
            })
        }
    },

    getDetailProduct: async (req, res) => {
        try {

        } catch (error) {

        }
    },
    getSizeProductByIdProduct: async (req, res) => {
        try {
            const { id } = req.params;
            console.log(id);

            const listSize = await SizeProduct.findAll({ where: { id_product: id } });
            if (!listSize) {
                res.status(404).json({
                    message: "size null"
                })
            }
            console.log(listSize == '');

            res.status(200).json({
                status: 200,
                data: listSize
            })
        } catch (error) {

        }
    },
    getAllSize: async (req, res) => {
        try {
            const listSize = await SizeProduct.findAll();
            if (!listSize) {
                res.status(404).json({
                    message: "size null"
                })
            }
            res.status(200).json({
                status: 200,
                data: listSize
            })
        } catch (error) {

        }
    },
    createSizeProduct: async (req, res) => {
        try {
            const { vt } = req.body
            const newSize = await SizeProduct.create(additionalSizes[vt])
            console.log(ls.length);

            res.json({
                newSize,
                vt
            })

        } catch (error) {
            res.json({
                error,

            })
        }
    },
    createProducts: async (req, res) => {
        const { vt } = req.body
        const newProduct = await Product.create(List[vt])
        res.json({
            newProduct,
            vt
        })

    },

    checkFavoriteProduct: async (req, res) => {
        try {
            const { uid, productID } = req.body;
            const dataFind = await FavoriteProduct.findOne({ where: { uid: uid, productID: productID } });
            console.log(dataFind);

            if (!dataFind) {
                return res.status(200).json({
                    data: 0
                })
            }
            res.status(200).json({
                data: 1
            })
        } catch (error) {
            res.status(501).json({
                error
            })
        }

    },
    addOrRemoveFavorite: async (req, res) => {
        try {
            const { uid, productID } = req.body;
            const dataFind = await FavoriteProduct.findOne({ where: { uid: uid, productID: productID } });
            if (!dataFind) {
                await FavoriteProduct.create({ uid, productID });
                res.status(200).json({
                    data: 1
                })
            } else {
                const dataFind = await FavoriteProduct.destroy({ where: { uid: uid, productID: productID } });
                res.status(200).json({
                    data: 0
                })
            }

        } catch (error) {
            res.status(500).json({
                error
            })
        }
    },

    getAllFavorite: async (req, res) => {
        try {
            const { id } = req.params;
            console.log(id);

            const dataFind = await sequelize.query(
                `
                    select DISTINCT
                        Products.name,
                        Products.id as productID,
                        Products.price,
                        Products.image,
                        FavoriteProducts.id
                    from
                        FavoriteProducts
                    join 
                        Products on Products.id = FavoriteProducts.productID
                    join 
                        Users on Users.id = FavoriteProducts.uid
                    where Users.id = ${id};
                `
            )
            if (!dataFind) {
                res.status(200).json({
                    data: 0
                })
            } else {
                res.status(200).json({
                    data: dataFind[0]
                })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error
            })
        }
    },
    deleteFavorite: async (req, res) => {
        try {
            const { id } = req.params;
            const dataDelete = await FavoriteProduct.destroy({ where: { id } });
            console.log(dataDelete);
            res.status(200).json({
                dataDelete
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error
            })
            
        }
    }


}

module.exports = productController













const List = [
    { name: 'Jeans', price: 500000, detail: 'Quần jean chất liệu cotton', image: ["https://i.pinimg.com/564x/d5/04/3e/d5043e5446e357324a1a2d0948b325c7.jpg", "https://i.pinimg.com/564x/a8/e2/5c/a8e25c4b824b34b037a49a84cbe11254.jpg", "https://i.pinimg.com/564x/b7/f7/08/b7f7080c0b87c06f1df5fc3c582ebf65.jpg"], type_id: 1 },
    { name: 'T-Shirt', price: 200000, detail: 'Áo thun chất liệu cotton', image: ["https://i.pinimg.com/564x/12/0a/aa/120aaa1b08d3990f7cc92ded68d8730c.jpg", "https://i.pinimg.com/564x/23/94/4d/23944dfecfcb7430175f9c622ca05818.jpg", "https://i.pinimg.com/564x/81/9b/2d/819b2dda471d5fa3a7ea21508a87525a.jpg"], type_id: 2 },
    { name: 'Cap', price: 100000, detail: 'Mũ lưỡi trai', image: ["https://i.pinimg.com/564x/4b/4c/60/4b4c600dc8ca5d887674881be65bfae7.jpg", "https://i.pinimg.com/736x/c6/09/c6/c609c60042b4d55cf5955f1165a5fa9f.jpg", "https://i.pinimg.com/564x/11/ec/e7/11ece7f621f6919bc0f4edf05356642e.jpg"], type_id: 3 },
    { name: 'Sneakers', price: 800000, detail: 'Giày thể thao', image: ["https://i.pinimg.com/564x/c5/7a/be/c57abe4f070b63fab6378f3cfd8dcfcb.jpg", "https://i.pinimg.com/564x/e0/17/0a/e0170ab2b961d1570fa2e99c298cc16c.jpg, https://i.pinimg.com/564x/49/0f/32/490f32b6a4cc06740110b518f0b027a2.jpg"], type_id: 4 },
    { name: 'Flip Flops', price: 150000, detail: 'Dép xỏ ngón', image: ["https://i.pinimg.com/564x/41/4c/de/414cde89d2388305cac6860a11ba3cc1.jpg", "https://i.pinimg.com/564x/8f/97/fc/8f97fc1a37af926a05928d73a0d55814.jpg", "https://i.pinimg.com/564x/3c/20/83/3c2083f2065b473f9ac1ba30980a7719.jpg"], type_id: 5 },
    { name: 'Evening Dress', price: 1200000, detail: 'Váy dạ hội', image: ["https://i.pinimg.com/564x/fb/ed/c8/fbedc864e38f3e5c8f97de74a097bffc.jpg", "https://i.pinimg.com/564x/d5/61/8c/d5618c8ed377ec8513d80a3d0e243547.jpg", "https://i.pinimg.com/564x/dd/3c/17/dd3c17c282b8b785321cd4e2a7c18ba8.jpg"], type_id: 6 },
    { name: 'Chinos', price: 550000, detail: 'Quần chinos thời trang', image: ["https://i.pinimg.com/564x/5c/47/89/5c47893cb3f8d4d522f78cc402a377d8.jpg", "https://i.pinimg.com/564x/20/20/9a/20209a96e832caa3d4866face3ae88a1.jpg", "https://i.pinimg.com/564x/a9/68/d2/a968d2a203cb0e271d8a9ab7adb10501.jpg"], type_id: 1 },
    { name: 'Polo Shirt', price: 250000, detail: 'Áo polo lịch sự', image: ["https://i.pinimg.com/564x/20/e5/5e/20e55e578dde7ceea39c49e06c64327c.jpg", "https://i.pinimg.com/564x/f9/49/85/f94985606b9e06e904a85e0ea81c952f.jpg"], type_id: 2 },
    { name: 'Beanie', price: 120000, detail: 'Mũ len mùa đông', image: ["https://i.pinimg.com/564x/b5/22/d0/b522d0387b0acbbb0bc4a4c47de267ff.jpg", "https://i.pinimg.com/564x/0e/a3/6e/0ea36efc092eca335fe4af5931cb5733.jpg", "https://i.pinimg.com/564x/1d/73/2d/1d732d2c14df064f84cc9f464f9d6412.jpg"], type_id: 3 },
    { name: 'Boots', price: 900000, detail: 'Giày boots da', image: ["https://i.pinimg.com/564x/aa/24/05/aa24052379a9611106e952546cf2fa6a.jpg", "https://i.pinimg.com/564x/75/7f/3c/757f3c6742fb6932bca6cc057b00465f.jpg", "https://i.pinimg.com/564x/1d/2a/99/1d2a99da34c41d229a138b68db97a532.jpg"], type_id: 4 },
    { name: 'Sandals', price: 180000, detail: 'Dép sandal thoải mái', image: ["https://i.pinimg.com/564x/fb/99/46/fb9946688ecac7f3e6091585461ddd0b.jpg", "https://i.pinimg.com/564x/e1/a1/1a/e1a11a6c23ba5aec2b049ee2a65b772b.jpg", "https://i.pinimg.com/564x/13/6d/2d/136d2d18b68a628bd34ab7947af07ab6.jpg"], type_id: 5 },
    { name: 'Summer Dress', price: 1100000, detail: 'Váy mùa hè', image: ["https://i.pinimg.com/564x/e6/54/61/e65461756139f039fbb9984dfca80cd8.jpg", "https://i.pinimg.com/564x/40/43/7f/40437f6f1e52548f4f959babe43c4022.jpg"], type_id: 6 },
    { name: 'Cargo Pants', price: 600000, detail: 'Quần cargo nhiều túi', image: ["https://i.pinimg.com/564x/85/12/bf/8512bf024ffdc8d95611ebdac894408d.jpg", "https://i.pinimg.com/564x/05/07/64/050764f0142f2169b387ad38d88a45f4.jpg"], type_id: 1 },
    { name: 'Hoodie', price: 300000, detail: 'Áo hoodie thời trang', image: ["https://i.pinimg.com/564x/ab/0c/88/ab0c880492959104043a6397bee06338.jpg", "https://i.pinimg.com/564x/a3/f5/35/a3f5356306fc40d8826d600f15d9df76.jpg"], type_id: 2 },
    { name: 'Sun Hat', price: 150000, detail: 'Mũ rộng vành mùa hè', image: ["https://i.pinimg.com/564x/16/6b/00/166b0029c7cee0a1c8683f5e31045014.jpg", "https://i.pinimg.com/564x/6f/5a/94/6f5a94a41465d74e42903d838f104e12.jpg"], type_id: 3 },
    { name: 'Loafers', price: 850000, detail: 'Giày lười da', image: ["https://i.pinimg.com/564x/2e/6d/13/2e6d13fc0e2d91403e074d49cc9989f5.jpg", "https://i.pinimg.com/564x/cd/77/5f/cd775f49588c569b27bac738bfdf001b.jpg", "https://i.pinimg.com/564x/07/6a/3b/076a3b08da804c91ec8c9a8d9bdd3400.jpg"], type_id: 4 },
    { name: 'Slippers', price: 100000, detail: 'Dép đi trong nhà', image: ["https://i.pinimg.com/564x/e7/06/68/e70668786f567c305f99c58a4a526fb7.jpg", "https://i.pinimg.com/564x/27/b3/e9/27b3e9fe2c7178b64b0cc2279332aaee.jpg"], type_id: 5 },
    { name: 'Cocktail Dress', price: 1250000, detail: 'Váy cocktail dự tiệc', image: ["https://i.pinimg.com/564x/38/5e/c4/385ec44e58314680f5db9ea87c35b47e.jpg", "https://i.pinimg.com/564x/cf/09/51/cf0951f2fad0816335d6ca17b549ac35.jpg"], type_id: 6 },
    { name: 'Sweatpants', price: 350000, detail: 'Quần thể thao', image: ["https://i.pinimg.com/564x/51/77/37/517737caa432f8a07444e82ad2d3086b.jpg", "https://i.pinimg.com/564x/00/08/4e/00084e40f35c3835f4107d17b4503ae2.jpg"], type_id: 1 },
    { name: 'Sweater', price: 400000, detail: 'Áo len ấm áp', image: ["https://i.pinimg.com/564x/ed/a1/2a/eda12a97066e7bd601de7e86763362ea.jpg", "https://i.pinimg.com/564x/ef/f7/b7/eff7b782e552ef795f21551f9f12db41.jpg"], type_id: 2 },
]


const ls = [
    { sizeName: 'M', quantity: 100, detailSize: 'Quần jean size M', id_product: 1 },
    { sizeName: 'L', quantity: 50, detailSize: 'Quần jean size L', id_product: 1 },
    { sizeName: 'S', quantity: 120, detailSize: 'Áo thun size S', id_product: 2 },
    { sizeName: 'M', quantity: 80, detailSize: 'Áo thun size M', id_product: 2 },
    { sizeName: 'One Size', quantity: 200, detailSize: 'Mũ free size', id_product: 3 },
    { sizeName: '42', quantity: 60, detailSize: 'Giày thể thao size 42', id_product: 4 },
    { sizeName: '43', quantity: 40, detailSize: 'Giày thể thao size 43', id_product: 4 },
    { sizeName: 'L', quantity: 30, detailSize: 'Dép size L', id_product: 5 },
    { sizeName: 'M', quantity: 70, detailSize: 'Váy dạ hội size M', id_product: 6 },
    // Thêm các size cho các sản phẩm khác theo cách tương tự
    { sizeName: 'M', quantity: 100, detailSize: 'Quần chinos size M', id_product: 7 },
    { sizeName: 'L', quantity: 50, detailSize: 'Áo polo size L', id_product: 8 },
    { sizeName: 'One Size', quantity: 150, detailSize: 'Mũ len size free', id_product: 9 },
    { sizeName: '42', quantity: 45, detailSize: 'Giày boots size 42', id_product: 10 },
    { sizeName: 'M', quantity: 90, detailSize: 'Váy mùa hè size M', id_product: 12 },
    { sizeName: 'M', quantity: 120, detailSize: 'Quần cargo size M', id_product: 13 },
    { sizeName: 'S', quantity: 100, detailSize: 'Áo hoodie size S', id_product: 14 },
    { sizeName: 'One Size', quantity: 100, detailSize: 'Mũ rộng vành size free', id_product: 15 },
    { sizeName: '42', quantity: 70, detailSize: 'Giày lười size 42', id_product: 16 },
    { sizeName: 'M', quantity: 60, detailSize: 'Váy cocktail size M', id_product: 18 },
    { sizeName: 'M', quantity: 80, detailSize: 'Quần thể thao size M', id_product: 19 },
    { sizeName: 'L', quantity: 55, detailSize: 'Áo len size L', id_product: 20 },
    { sizeName: 'XL', quantity: 30, detailSize: 'Quần jean size XL', id_product: 1 },
    { sizeName: 'XS', quantity: 70, detailSize: 'Quần jean size XS', id_product: 1 },
    { sizeName: 'XL', quantity: 45, detailSize: 'Áo thun size XL', id_product: 2 },
    { sizeName: 'XS', quantity: 60, detailSize: 'Áo thun size XS', id_product: 2 },
    { sizeName: 'Small', quantity: 120, detailSize: 'Mũ free size nhỏ', id_product: 3 },
    { sizeName: '43', quantity: 50, detailSize: 'Giày thể thao size 43', id_product: 4 },
    { sizeName: '44', quantity: 35, detailSize: 'Giày thể thao size 44', id_product: 4 },
    { sizeName: 'XL', quantity: 25, detailSize: 'Dép size XL', id_product: 5 },
    { sizeName: 'L', quantity: 60, detailSize: 'Váy dạ hội size L', id_product: 6 },
    { sizeName: 'S', quantity: 90, detailSize: 'Quần chinos size S', id_product: 7 },
    { sizeName: 'XL', quantity: 35, detailSize: 'Áo polo size XL', id_product: 8 },
    { sizeName: 'Large', quantity: 100, detailSize: 'Mũ len size lớn', id_product: 9 },
    { sizeName: '43', quantity: 55, detailSize: 'Giày boots size 43', id_product: 10 },
    { sizeName: 'S', quantity: 85, detailSize: 'Váy mùa hè size S', id_product: 12 },
    { sizeName: 'L', quantity: 110, detailSize: 'Quần cargo size L', id_product: 13 },
    { sizeName: 'M', quantity: 85, detailSize: 'Áo hoodie size M', id_product: 14 },
    { sizeName: 'Medium', quantity: 90, detailSize: 'Mũ rộng vành size vừa', id_product: 15 },
    { sizeName: '43', quantity: 65, detailSize: 'Giày lười size 43', id_product: 16 },
    { sizeName: 'L', quantity: 55, detailSize: 'Váy cocktail size L', id_product: 18 },
    { sizeName: 'L', quantity: 65, detailSize: 'Quần thể thao size L', id_product: 19 },
    { sizeName: 'XL', quantity: 40, detailSize: 'Áo len size XL', id_product: 20 },
]

const additionalSizes = [

];

// Kết hợp danh sách size ban đầu với các size mới



