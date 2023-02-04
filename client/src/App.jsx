import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { Private, Public } from './components/Outlet';
import Login from './pages/Login';
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
                </Route>
                <Route path="/" element={<Public />}>
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default App;
