const router = require('express').Router();

const {
    getAllTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    getTodo,
} = require('../controllers/todoController');

router.get('/', getAllTodos);
router.get('/:id', getTodo);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

module.exports = router;
