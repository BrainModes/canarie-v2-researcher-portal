import Users from "../Views/Admin/AdminContent/AdminUsers";
import Requests from "../Views/Admin/AdminContent/AdminRequests";

const routes = [
    {
        path: "/users",
        component: Users,
    },
    {
        path: "/requests",
        component: Requests,
    },
];

export default routes;
