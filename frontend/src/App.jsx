import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import HabitsPage from "./pages/HabitsPage";
import NotFound from "./pages/NotFound";


function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/habits" element={<HabitsPage/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App;
