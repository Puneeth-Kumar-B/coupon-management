const coupon = require('../models/coupon')
const express = require('express')
const router = express.Router()

const couponController = require('../controllers/couponController')

router.get('/', async(req, res) => {
    try {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const start = (page - 1) * limit
        const end = page * limit

        const allCoupons = {}

        if (start > 0) {
            allCoupons.previous = {
                page: page - 1
            }
        }

        allCoupons.coupons = await coupon.find().limit(limit).skip(start).exec()

        if (end < await coupon.countDocuments().exec()) {
            allCoupons.next = {
                page: page + 1
            }
        }

        return res.status(200).json(allCoupons)

    } catch (err) {
        console.log(err)
    }
})


router.post('/create', couponController.createCoupon)
router.get('/search', couponController.searchCoupon)
router.get('/:id', couponController.getCoupon)
router.put('/update/:id', couponController.updateCoupon)
router.delete('/delete/:id', couponController.deleteCoupon)

module.exports = router