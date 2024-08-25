const { DeliveryInfo } = require("../models/index");


const deliveryInfoController = {
    add: async (req, res) => {
        try {
            const { recipientName, address, phoneNumber, note } = req.body;
            const uid = req.user.uid;
            console.log("uid: ", uid);

            if (uid) {
                const newDeliveryInfo = await DeliveryInfo.create({
                    recipientName,
                    address,
                    phoneNumber,
                    note,
                    uid,
                });
                return res.status(201).json({
                    data: newDeliveryInfo
                });
            } else {
                return res.status(400).json({ message: "UID không tồn tại." });
            }
        } catch (error) {
            console.log(error);

            return res.status(500).json({ message: "Lỗi khi thêm thông tin giao hàng.", error });
        }
    },

    // Sửa thông tin giao hàng
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { recipientName, address, phoneNumber, note } = req.body;
            const uid = req.user.uid;

            if (uid) {
                const deliveryInfo = await DeliveryInfo.findOne({ where: { id, uid } });

                if (!deliveryInfo) {
                    return res.status(404).json({ message: "Thông tin giao hàng không tồn tại." });
                }

                deliveryInfo.recipientName = recipientName || deliveryInfo.recipientName;
                deliveryInfo.address = address || deliveryInfo.address;
                deliveryInfo.phoneNumber = phoneNumber || deliveryInfo.phoneNumber;
                deliveryInfo.note = note || deliveryInfo.note;

                await deliveryInfo.save();

                return res.status(200).json(deliveryInfo);
            } else {
                return res.status(400).json({ message: "UID không tồn tại." });
            }
        } catch (error) {
            return res.status(500).json({ message: "Lỗi khi sửa thông tin giao hàng.", error });
        }
    },

    // Xóa thông tin giao hàng
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const uid = req.user.uid;

            if (uid) {
                const deliveryInfo = await DeliveryInfo.findOne({ where: { id, uid } });

                if (!deliveryInfo) {
                    return res.status(404).json({ message: "Thông tin giao hàng không tồn tại." });
                }

                await deliveryInfo.destroy();

                return res.status(200).json({
                    message: "Xóa thông tin giao hàng thành công."
                    
                });
            } else {
                return res.status(400).json({ message: "UID không tồn tại." });
            }
        } catch (error) {
            return res.status(500).json({ message: "Lỗi khi xóa thông tin giao hàng.", error });
        }
    },
    getByUid: async (req, res) => {
        try {
            const { id } = req.params;
            const deliveryInfos = await DeliveryInfo.findAll({ where: { uid: id } });
            // console.log(deliveryInfos);

            if (!deliveryInfos) {
                return res.status(404).json({
                    message: "data null"
                })
            }
            return res.status(200).json({
                data: deliveryInfos
            })
        } catch (error) {
            console.log(error);

            res.status(500).json({
                message: "get data error"
            })
        }
    }
}


module.exports = deliveryInfoController