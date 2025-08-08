import { IRouter, Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { DriverRoutes } from "../modules/driver/driver.route";

interface IModuleRoute {
  path: string;
  route: IRouter;
}

export const router = Router();

const moduleRoutes: IModuleRoute[] = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/drivers",
    route: DriverRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
