const router = require('express').Router();
const authRoutes = require('./authRoute');
const todoRoutes = require('./todoRoute');
const { isLogged } = require('../middlewares/authMiddleware');

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'OK',
    });
});

router.use('/auth', authRoutes);
router.use('/todos', isLogged, todoRoutes);

module.exports = router;
