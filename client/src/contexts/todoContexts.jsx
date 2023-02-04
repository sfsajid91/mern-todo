import { createContext, useContext, useReducer } from 'react';

const initialState = {
    todos: [],
    loading: false,
    error: null,
    user: null,
};

const reducer = (state, { type, payload }) => {
    switch (type) {
        case 'LOADING':
            return {
                ...state,
                loading: true,
            };
        case 'GET_TODOS_SUCCESS':
            return {
                ...state,
                todos: payload,
                loading: false,
            };
        case 'GET_TODOS_ERROR':
            return {
                ...state,
                error: payload,
                loading: false,
            };
        case 'ADD_TODO':
            return {
                ...state,
                todos: [...state.todos, payload],
            };
        case 'DELETE_TODO':
            return {
                ...state,
                todos: state.todos.filter((todo) => todo._id !== payload),
            };
        case 'UPDATE_TODO':
            return {
                ...state,
                todos: state.todos.map((todo) => (todo._id === payload._id ? payload : todo)),
            };
        case 'LOGIN':
            return {
                ...state,
                user: payload.user,
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
            };
        default:
            return state;
    }
};

export const TodoContext = createContext({
    ...initialState,
    dispatch: () => {},
});

export function TodoProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    return <TodoContext.Provider value={{ ...state, dispatch }}>{children}</TodoContext.Provider>;
}

export function useTodo() {
    return useContext(TodoContext);
}
