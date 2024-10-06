import { createRouter, createWebHistory } from 'vue-router';

import ProjectPage from './components/project/ProjectPage.vue';
import ProjectPage1 from './components/project1/ProjectPage.vue';
import ProjectList from './pages/ProjectList.vue';
import NotFound from './pages/NotFound.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/project/1' },
    {
      path: '/project/:id',
      component: ProjectPage,
      props: true,
    },
    {
      path: '/project1/:id',
      component: ProjectPage1,
      props: true,
    },
    {
      path: '/OpenProject',
      component: ProjectList
    },
    { path: '/:notFound(.*)', component: NotFound }
  ]
});

export default router;
