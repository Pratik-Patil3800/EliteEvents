import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Page from "./pages/page";
import Home from "./pages/home";
import NotificationsPage from "./pages/notification";
import Register from "./pages/ragister";
import Login from "./pages/login";
import ProfilePage from "./pages/profile";
import { Toaster } from 'react-hot-toast';
import { useUser } from "./context/usercontext";

function App() {
  const { user } = useUser();  
  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={< Login />} />
          <Route path="/notifications" element={< NotificationsPage />} />
          <Route path="/register" element={<Register />} />
         
          {user?.id?(
            <>
            <Route path="/" element={< Home />} />
            <Route path="/profile" element={< ProfilePage />} />
            <Route path="/calendar" element={< Page />} />
            </>
          ):(
           
            <>
              <Route path="/calendar" element={< NotificationsPage />} />
              <Route path="/profile" element={< NotificationsPage />} />
              <Route path="/" element={< NotificationsPage />} />
            </>
        )}
        </Routes>
      </div>
    </Router>
    </>
  );
}

export default App;
