const router = require('express').Router();

const { isLogged } = require('../middlewares/authMiddleware');

const {
    getAllTodos,
    createTodo,
    updateTodo,
    deleteTodo,
} = require('../controllers/todoController');

router.get('/', isLogged, getAllTodos);
router.post('/', isLogged, createTodo);
router.put('/:id', isLogged, updateTodo);
router.delete('/:id', isLogged, deleteTodo);

module.exports = router;
