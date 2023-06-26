const Todo = require('../models/todoModel');

/*
 * @description - Get all todos
 *  @route - GET /api/v1/todos
 * @access - Public
 * @returns {Object} - todos
 * @returns {Object} - error
 * @returns {Object} - message
 */
const getAllTodos = async (req, res, next) => {
    try {
        const { _id: userId } = req.user;
        // get all todos for a user with sort
        const todos = await Todo.find({ user: userId })
            .sort({ createdAt: -1 })
            .select('-__v')
            .lean()
            .exec();
        return res.status(201).json(todos);
    } catch (err) {
        return next(err);
    }
};

const getTodo = async (req, res, next) => {
    try {
        const { _id: userId } = req.user;
        const { id } = req.params;
        const todo = await Todo.findOne({ _id: id, user: userId })
            .select('-__v')
            .lean()
            .exec();
        if (!todo) {
            return res.status(400).json({
                message: 'Todo not found',
            });
        }
        return res.status(201).json(todo);
    } catch (err) {
        return next(err);
    }
};

/*
 * @description - Create todos
 *  @route - post /api/v1/todos
 * @access - Private
 */

const createTodo = async (req, res, next) => {
    try {
        const { _id: userId } = req.user;
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                message: 'Please provide title and description',
            });
        }

        const todo = await Todo.create({
            title,
            description,
            user: userId,
        });

        return res.status(201).json(todo);
    } catch (err) {
        return next(err);
    }
};

/*
 * @description - Update todos
 *  @route - PUT /api/v1/todos/:id
 * @access - Private
 */

const updateTodo = async (req, res, next) => {
    try {
        const { _id: userId } = req.user;
        const { id } = req.params;
        const { title, description, completed = false } = req.body;
        if (!title || !description) {
            return res.status(400).json({
                message: 'Please provide title and description',
            });
        }

        const todo = await Todo.findOne({ _id: id, user: userId }).exec();
        if (!todo) {
            return res.status(400).json({
                message: 'Todo not found',
            });
        }
        todo.title = title;
        todo.description = description;
        todo.completed = completed;
        await todo.save();

        return res.status(201).json(todo);
    } catch (err) {
        return next(err);
    }
};

/*
 * @description - Delete todos
 *  @route - DELETE /api/v1/todos/:id
 * @access - Private
 */

const deleteTodo = async (req, res, next) => {
    try {
        const { _id: userId } = req.user;
        const { id } = req.params;

        const todo = await Todo.findOne({ _id: id, user: userId }).exec();
        if (!todo) {
            return res.status(400).json({
                message: 'Todo not found',
            });
        }
        await todo.remove();

        return res.status(201).json({
            message: 'Todo deleted successfully',
        });
    } catch (err) {
        return next(err);
    }
};

module.exports = {
    getAllTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    getTodo,
};
