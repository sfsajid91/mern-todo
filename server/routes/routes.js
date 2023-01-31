const router = require('express').Router();
const authRoutes = require('./authRoute');

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'OK',
    });
});

router.use('/auth', authRoutes);

module.exports = router;
