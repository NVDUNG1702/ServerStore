
const { Order, DetailOrder, Product, SizeProduct, DeliveryInfo, sequelize } = require("../models/index");


const cartController = {
    createCart: async (req, res) => {
        try {
            const { uid, detail } = req.body;
            console.log(req.user);



            const findOrder = await Order.findOne({ where: { status: 0, uid: uid } });

            if (!findOrder) {
                const orderNew = await Order.create({ uid, detail, status: 0 });
                return res.status(200).json({
                    code: 1,
                    data: orderNew
                })
            }

            return res.status(200).json({
                code: 2,
                data: findOrder
            })
        } catch (error) {
            console.log("error create cart: ", error);

            res.status(500).json({
                error
            })
        }
    },

    // addOrUpdateDetailCart: async (req, res) => {

    //     // code 0 create error
    //     // code 1 quantity
    //     // code 2 success
    //     // code 3 delete because quantity
    //     try {
    //         const { productID, orderID, sizeID, quantity } = req.body;
    //         console.log(productID, orderID, sizeID, quantity);


    //         const findDetailCart = await DetailOrder.findOne({ where: { productID, orderID, sizeID } });
    //         const findSize = await SizeProduct.findOne({ where: { id_product: productID, id: sizeID } })
    //         if (!findSize || findSize.quantity < quantity || findSize.quantity < findDetailCart.quantity + quantity) {
    //             return res.status(200).json({
    //                 code: 1
    //             })
    //         }
    //         if ((findSize.quantity == 0 || !findSize) && findDetailCart) {
    //             await DetailOrder.destroy({ where: { id: findDetailCart.id } })
    //             return res.status(200).json({
    //                 code: 3
    //             })
    //         }
    //         if (!findDetailCart) {


    //             const newDetail = await DetailOrder.create({ productID, orderID, sizeID, quantity });
    //             if (!newDetail) {
    //                 return res.status(200).json({
    //                     code: 0
    //                 })
    //             }
    //             return res.status(200).json({
    //                 code: 2
    //             })

    //         }

    //         findDetailCart.quantity += quantity;
    //         await findDetailCart.save();
    //         res.status(200).json({
    //             code: 2
    //         })

    //     } catch (error) {
    //         console.log(error);

    //         res.status(500).json({
    //             error
    //         })
    //     }
    // }
    addOrUpdateDetailCart: async (req, res) => {
        // code 0: create error
        // code 1: insufficient quantity
        // code 2: success
        // code 3: delete because quantity is 0

        try {
            const { productID, orderID, sizeID, quantity } = req.body;
            console.log("data detail: ", productID, orderID, sizeID, quantity);

            // Tìm thông tin chi tiết của sản phẩm trong giỏ hàng
            const findDetailCart = await DetailOrder.findOne({ where: { productID, orderID, sizeID } });

            // Tìm kích thước của sản phẩm
            const findSize = await SizeProduct.findOne({ where: { id_product: productID, id: sizeID } });

            // Kiểm tra xem kích thước có tồn tại và đủ số lượng không
            if (!findSize || findSize.quantity < quantity || (findDetailCart && findSize.quantity < findDetailCart.quantity + quantity)) {
                return res.status(200).json({
                    code: 1
                });
            }

            // Trường hợp kích thước sản phẩm có số lượng bằng 0 và có chi tiết trong giỏ hàng => Xóa chi tiết này
            if (findSize.quantity === 0 && findDetailCart) {
                await DetailOrder.destroy({ where: { id: findDetailCart.id } });
                return res.status(200).json({
                    code: 3
                });
            }

            // Trường hợp không tìm thấy chi tiết sản phẩm trong giỏ hàng => Thêm mới
            if (!findDetailCart) {
                const newDetail = await DetailOrder.create({ productID, orderID, sizeID, quantity });
                if (!newDetail) {
                    return res.status(200).json({
                        code: 0
                    });
                }


                return res.status(200).json({
                    code: 2
                });
            }

            if (findDetailCart.quantity + quantity <= 0) {
                await DetailOrder.destroy({ where: { id: findDetailCart.id } });
                return res.status(200).json({
                    code: 4
                });
            }

            // Trường hợp đã có chi tiết sản phẩm trong giỏ hàng => Cập nhật số lượng
            findDetailCart.quantity += quantity;
            await findDetailCart.save();
            // console.log(findDetailCart);
            return res.status(200).json({
                code: 2
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                error
            });
        }
    },

    getCartByID: async (req, res) => {
        try {
            const { id } = req.params;

            const cart = await sequelize.query(
                `
                SELECT 
                    Orders.id as orderID,
                    DetailOrders.id as detailID,
                    Products.id as productID,
                    SizeProducts.id as sizeID,
                    Products.name as productName,
                    SizeProducts.sizeName as size,
                    DetailOrders.quantity as quantity,
                    Products.image,
                    SizeProducts.quantity as totalQuantity,
                    SUM(DetailOrders.quantity * Products.price) AS totalAmount
                FROM 
                    DetailOrders 
                JOIN
                    Orders ON DetailOrders.orderID = Orders.id
                JOIN
                    Products ON DetailOrders.productID = Products.id
                JOIN 
                    SizeProducts ON SizeProducts.id = DetailOrders.sizeID
                WHERE Orders.id = ${id}
                GROUP BY 
                    Orders.id, 
                    DetailOrders.id, 
                    Products.name, 
                    SizeProducts.sizeName, 
                    DetailOrders.quantity;
                `
            )

            res.status(200).json({
                data: cart
            })
        } catch (error) {
            console.log(error);

            res.status(500).json({
                error
            })
        }
    },


    pay: async (req, res) => {
        const { id, infoID } = req.body;
        const uid = req.user.uid;

        console.log('ID:', id);
        console.log('InfoID:', infoID);

        if (!id || !infoID) {
            return res.status(400).json({ message: 'Thiếu thông tin cần thiết.' });
        }

        try {
            if (uid) {
                // Thực hiện query để lấy dữ liệu
                const results = await sequelize.query(`
                    SELECT 
                        Orders.id as orderID,
                        DetailOrders.id as detailID,
                        Products.id as productID,
                        SizeProducts.id as sizeID,
                        Products.name as productName,
                        SizeProducts.sizeName as size,
                        DetailOrders.quantity as quantity,
                        Products.image,
                        SizeProducts.quantity as totalQuantity,
                        SUM(DetailOrders.quantity * Products.price) AS totalAmount
                    FROM 
                        DetailOrders 
                    JOIN
                        Orders ON DetailOrders.orderID = Orders.id
                    JOIN
                        Products ON DetailOrders.productID = Products.id
                    JOIN 
                        SizeProducts ON SizeProducts.id = DetailOrders.sizeID
                    WHERE Orders.id = ${id}
                    GROUP BY 
                        Orders.id, 
                        DetailOrders.id, 
                        Products.name, 
                        SizeProducts.sizeName, 
                        DetailOrders.quantity;
                `, { type: sequelize.QueryTypes.SELECT });

                console.log('Results:', results);

                // Kiểm tra số lượng
                const insufficientItems = results.filter(item => item.quantity > item.totalQuantity);

                if (insufficientItems.length > 0) {
                    const messages = insufficientItems.map(item => `Sản phẩm ${item.productName} (size ${item.size}) không đủ số lượng.`);
                    return res.status(400).json({ message: messages.join(' ') });
                }

                // Cập nhật trạng thái đơn hàng
                const orderUpdate = await Order.findOne({ where: { id, status: 0 } });
                if (!orderUpdate) {
                    return res.status(404).json({ message: 'Đơn hàng không tồn tại hoặc đã được cập nhật.' });
                }

                orderUpdate.infoID = infoID;
                orderUpdate.time = new Date();
                orderUpdate.status = 1;

                await orderUpdate.save();

                // Cập nhật số lượng sản phẩm trong SizeProducts
                for (const item of results) {
                    await SizeProduct.update(
                        { quantity: sequelize.literal(`quantity - ${item.quantity}`) },
                        { where: { id: item.sizeID } }
                    );
                }

                return res.status(200).json({ message: 'Đơn hàng đã được cập nhật thành công.' });
            }
        } catch (error) {
            console.log('Error:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi kiểm tra số lượng sản phẩm.' });
        }
    },

    getAll: async (req, res) => {
        try {

            const uid = req.user.uid;

            if (!uid) {
                return res.status(404).json({
                    message: "uid not found"
                })
            }

            const data = await sequelize.query(`
                    SELECT 
                        Orders.id as orderID,
                        Orders.time,
                        DetailOrders.id as detailID,
                        Products.id as productID,
                        SizeProducts.id as sizeID,
                        Products.name as productName,
                        DeliveryInfos.recipientName as namePerson,
                        DeliveryInfos.phoneNumber,
                        DeliveryInfos.address,
                        SizeProducts.sizeName as size,
                        DetailOrders.quantity as quantity,
                        Products.image,
                        Orders.status,
                        SizeProducts.quantity as totalQuantity,
                        SUM(DetailOrders.quantity * Products.price) AS totalAmount
                    FROM 
                        DetailOrders 
                    JOIN
                        Orders ON DetailOrders.orderID = Orders.id
                    JOIN
                        Products ON DetailOrders.productID = Products.id
                    JOIN 
                        SizeProducts ON SizeProducts.id = DetailOrders.sizeID
                    JOIN 
                        DeliveryInfos ON DeliveryInfos.id = Orders.infoID
                    WHERE 
                        Orders.uid = ${uid} 
                        AND Orders.status != 0
                    GROUP BY 
                        Orders.id, 
                        DetailOrders.id, 
                        Products.name, 
                        SizeProducts.sizeName, 
                        DetailOrders.quantity;

                `)
            // console.log(data[0]);
            let dataRerurn = []
            data[0].forEach((item) => {
                // Tìm đối tượng `order` trong `dataRerurn` với `orderID` tương ứng
                const existingOrder = dataRerurn.find(order => order.orderID === item.orderID);

                if (!existingOrder) {
                    // Nếu không tìm thấy `orderID` trong `dataRerurn`, tạo đối tượng `order` mới
                    const newOrder = {
                        orderID: item.orderID,
                        name: item.namePerson,
                        phoneNumber: item.phoneNumber,
                        address: item.address,
                        time: item.time,
                        status: item.status,
                        sumPrice: item.totalAmount,
                        listDetail: [
                            {
                                id: item.detailID,
                                productName: item.productName,
                                size: item.size,
                                quantity: item.quantity,
                                totalAmount: item.totalAmount,
                                image: item.image,
                                productID: item.productID
                            }
                        ]
                    };
                    dataRerurn.push(newOrder);
                } else {
                    // Nếu đã có `orderID` trong `dataRerurn`, thêm chi tiết vào `listDetail` của `order` đã tồn tại
                    const newDataDetail = {
                        id: item.detailID,
                        productName: item.productName,
                        size: item.size,
                        quantity: item.quantity,
                        totalAmount: item.totalAmount,
                        image: item.image,
                        productID: item.productID
                    };
                    existingOrder.sumPrice += item.totalAmount
                    existingOrder.listDetail.push(newDataDetail);
                }
            });




            res.status(200).json({
                data: dataRerurn
            })
        } catch (error) {
            console.log(error);

            res.status(500).json({
                message: 'get all error',
                error
            })

        }
    },

    cancelOrder: async (req, res) => {
        const { id } = req.body;
        const uid = req.user.uid;

        if (!id) {
            return res.status(400).json({ message: 'Thiếu thông tin cần thiết.' });
        }

        try {
            if (uid) {
                // Tìm đơn hàng cần hủy
                const order = await Order.findOne({ where: { id, status: 1, uid } });
                if (!order) {
                    return res.status(404).json({ message: 'Đơn hàng không tồn tại hoặc không thể hủy.' });
                }

                // Lấy tất cả chi tiết đơn hàng để cập nhật lại số lượng sản phẩm
                const details = await sequelize.query(`
                    SELECT 
                        DetailOrders.id as detailID,
                        DetailOrders.quantity as quantity,
                        SizeProducts.id as sizeID
                    FROM 
                        DetailOrders 
                    JOIN 
                        SizeProducts ON SizeProducts.id = DetailOrders.sizeID
                    WHERE DetailOrders.orderID = ${id}
                `, { type: sequelize.QueryTypes.SELECT });

                console.log('Order Details:', details);

                for (const item of details) {
                    await SizeProduct.update(
                        { quantity: sequelize.literal(`quantity + ${item.quantity}`) },
                        { where: { id: item.sizeID } }
                    );
                }

                order.status = 5;
                await order.save();

                return res.status(200).json({ message: 'Đơn hàng đã được hủy thành công.' });
            }
        } catch (error) {
            console.log('Error:', error);
            return res.status(500).json({ message: 'Đã xảy ra lỗi khi hủy đơn hàng.' });
        }
    },






}



module.exports = cartController