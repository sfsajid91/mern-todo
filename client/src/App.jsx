import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { Private, Public } from './components/Outlet';
import EditTodo from './pages/EditTodo';
import EmailVerification from './pages/EmailVerification';
import Login from './pages/Login';
import NewTodo from './pages/NewTodo';
import NotFound from './pages/NotFound';
import Signup from './pages/Signup';
import Todos from './pages/Todos';

function App() {
    return (
        <Routes>
            <Route path="" element={<Layout />}>
                <Route path="/" element={<Private />}>
                    {/* <Route index element={<Todos />} /> */}
                    <Route index element={<Todos />} />
                    <Route path="create" element={<NewTodo />} />
                    <Route path="todos/:id" element={<EditTodo />} />
                </Route>
                <Route path="/" element={<Public />}>
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                </Route>
                <Route path="verify/:token" element={<EmailVerification />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default App;
