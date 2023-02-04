const router = require('express').Router();
const authRoutes = require('./authRoute');
const todoRoutes = require('./todoRoute');

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'OK',
    });
});

router.use('/auth', authRoutes);
router.use('/todos', todoRoutes);

module.exports = router;
