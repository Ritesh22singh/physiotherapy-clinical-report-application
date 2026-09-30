import { Navigate, useLocation } from "react-router-dom";
import { useSyncExternalStore } from "react";
import { getSessionToken, subscribeToSession } from "../services/session";

interface ProtectedRouteProps {
	children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	const location = useLocation();
	const token = useSyncExternalStore(subscribeToSession, getSessionToken);

	if (!token) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	return children;
};

export default ProtectedRoute;
