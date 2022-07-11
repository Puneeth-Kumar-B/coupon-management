const coupon = require('../models/coupon')


const createCoupon = async(req, res) => {
    try {
        let { offerName, couponCode, startDate, endDate, discount, amount, status } = req.body;

        if (!offerName) {
            return res.status(400).json({ error: "Please Enter Offer Name" });
        }
        if (!couponCode) {
            return res.status(400).json({ error: "Please Enter Coupon Code" });
        }
        if (!startDate) {
            return res.status(400).json({ error: "Please Enter Start Date" });
        }
        if (!endDate) {
            return res.status(400).json({ error: "Please Enter End Date" });
        }
        if (!discount) {
            return res.status(400).json({ error: "Please Enter Discount Percentage" });
        }
        if (!amount) {
            return res.status(400).json({ error: "Please Enter Discount Amount" });
        }
        if (!status) {
            return res.status(400).json({ error: "Please Enter Coupon Status" });
        }

        const couponExist = await coupon.findOne({ $or: [{ offerName: offerName }, { couponCode: couponCode }] });
        if (couponExist) {
            return res.status(200).json({ message: "Coupon Code Already Exists" });
        } else {
            const Coupon = new coupon({
                offerName: req.body.offerName,
                couponCode: req.body.couponCode,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                discount: req.body.discount,
                amount: req.body.amount,
                status: req.body.status
            });

            const couponCreation = await Coupon;
            if (couponCreation) {
                couponCreation.save();
                return res.status(200).json({ message: "Coupon Created Successfully :)" });
            } else {
                return res.status(400).json({ error: "Something Went Wrong :(" });
            }
        }

    } catch (err) {
        console.log("Please Fill Offer/Coupon Details");

    }
}

const updateCoupon = async(req, res) => {
    try {
        const couponExist = await coupon.findOne({ couponCode: req.body.couponCode, _id: { $ne: req.params.id } });
        if (couponExist) {
            return res.status(200).json({ message: "Coupon Details Already Exists" });
        } else {
            const update_coupon = await coupon.findOneAndUpdate({ _id: req.params.id }, {
                $set: {
                    offerName: req.body.offerName,
                    couponCode: req.body.couponCode,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    discount: req.body.discount,
                    amount: req.body.amount,
                    status: req.body.status
                }
            }, { new: true });
            return res.status(200).json({ message: 'Coupon details updated', update_coupon });
        }

    } catch (err) {
        console.log('Details not found!!')
    }
}

const deleteCoupon = async(req, res) => {
    try {
        await coupon.findByIdAndDelete(req.params.id)
        if (!req.params.id) {
            return res.status(404).json({ error: "Coupon not found" })
        }
        return res.status(200).json({ message: "Coupon Deleted" })

    } catch (err) {
        console.log(err)
    }
}

const getCoupon = async(req, res) => {
    try {
        const get_coupon = await coupon.findById(req.params.id)
        if (!req.params.id) {
            return res.status(404).json({ error: "Coupon not found" })
        }
        return res.status(200).json(get_coupon)

    } catch (err) {
        console.log(err)
    }
}

const searchCoupon = async(req, res) => {
    const { offerName, couponCode, status } = req.query

    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const start = (page - 1) * limit
    const end = page * limit

    const results = {}

    if (start > 0) {
        results.previous = {
            page: page - 1
        }
    }

    results.coupons = await coupon.find({
        $or: [
            { offerName: { $regex: `${offerName}`, $options: "i" } },
            { couponCode: { $regex: `${couponCode}`, $options: "i" } },
            { status: { $in: [status] } }
        ]
    }).sort({ offerName: 1 }).limit(limit).skip(start).exec()

    if (end < await coupon.countDocuments().exec()) {
        results.next = {
            page: page + 1
        }
    }

    if (!results.coupons) {
        return res.status(404).json({ error: "No results found" })
    }

    return res.status(200).json(results)

}

//================================================================================
//     Pagination of search results without previous & next pages mentioned:-
//================================================================================
// const searchCoupon = async(req, res) => {
//     let { offerName, couponCode, status } = req.query;
//     let data = await coupon.find({
//         $or: [
//             { offerName: { $regex: `${offerName}`, $options: "i" } },
//             { couponCode: { $regex: `${couponCode}`, $options: "i" } },
//             { status: { $in: [status] } }
//         ]
//     }).sort({ offerName: 1 })
//     const page = parseInt(req.query.page)
//     const limit = parseInt(req.query.limit)
//     const start = (page - 1) * limit
//     const end = page * limit

//     if (!data) {
//         return res.status(404).json({ error: "No results found" })
//     } else {
//         return res.status(200).json(data.slice(start, end));
//     }
// }


module.exports = { createCoupon, updateCoupon, deleteCoupon, getCoupon, searchCoupon }
