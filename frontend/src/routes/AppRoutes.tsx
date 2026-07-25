import { Routes, Route } from "react-router-dom";

import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";

const AppRoutes = () => {
    return(
        <Routes>
            <Route path="/" element={<Register/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
        </Routes>
    )
}

export default AppRoutes;