import { App } from 'vue';
import {
  createRouter as createVueRouter,
  createWebHistory as createVueWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized
} from 'vue-router';
import { createIonRouter } from './router';
import { createViewStacks } from './viewStacks';
import { IonicVueRouterOptions } from './types';

export const createRouter = (opts: IonicVueRouterOptions) => {
  const routerOptions = { ...opts };
  delete routerOptions.tabsPrefix;

  const router = createVueRouter(routerOptions);
  const ionRouter = createIonRouter(opts, router);
  const viewStacks = createViewStacks();

  const oldInstall = router.install.bind(router);
  router.install = (app: App) => {
    app.provide('navManager', ionRouter);
    app.provide('viewStacks', viewStacks);

    oldInstall(app);
  };

  router.beforeEach((to: RouteLocationNormalized, _: RouteLocationNormalized, next: NavigationGuardNext) => {
    ionRouter.handleHistoryChange(to);
    next();
  });

  return router;
}

export const createWebHistory = (base?: string) => createVueWebHistory(base);