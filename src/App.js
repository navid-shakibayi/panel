import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./Components/Index/Home";
import Login from './Components/Authentication/Login';
import Panel from './Components/AdminPanel/Panel';
import CreateItem from './Components/AdminPanel/CreateItem';
import ProtectedRoute from './Components/Authentication/ProtectedRoute';
import EditItem from './Components/AdminPanel/EditItem';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/panel" element={<Panel />} />
          <Route path="/panel/create-new-item" element={<CreateItem />} />
          <Route path="/panel/edit-item/:id" element={<EditItem />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
