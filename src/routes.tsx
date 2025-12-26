import { createBrowserRouter } from "react-router";
import NotFound from "./app/pages/(errors)/NotFound";
import ErrorBoundary from "./app/pages/(errors)/ErrorBoundary";
import PermissionsAdminPage from "./app/pages/(dashboard)";

const router = createBrowserRouter([
    {
        path: "/",
        errorElement: <ErrorBoundary fallback={<NotFound />}><NotFound /></ErrorBoundary>,
        children: [
            {
                index: true,
                element: <PermissionsAdminPage />
            }
        ]
    },
])

export default router