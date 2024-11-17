import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import Home from './Components/Index/Home';
import Menu from "./Components/Index/Menu";
import Login from './Components/Authentication/Login';
import Panel from './Components/AdminPanel/Panel';
import CreateItem from './Components/AdminPanel/CreateItem';
import ProtectedRoute from './Components/Authentication/ProtectedRoute';
import EditItem from './Components/AdminPanel/EditItem';
import NotFound from './Components/NotFound/NotFound';
import Test from './Components/Test/Test';
import Header from './Components/Layout/Header';

// کامپوننت Layout که Header را به همراه Outlet نمایش می‌دهد
const LayoutWithHeader = () => (
  <>
    <Header />
    <Outlet />
  </>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/test' element={<Test />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route element={<LayoutWithHeader />}>
          <Route path="/menu" element={<Menu />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/panel" element={<Panel />} />
            <Route path="/panel/create-new-item" element={<CreateItem />} />
            <Route path="/panel/edit-item/:id" element={<EditItem />} />
          </Route>
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
