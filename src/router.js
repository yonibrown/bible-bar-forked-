import { createRouter, createWebHistory } from 'vue-router';

import ProjectPage from './components/project/ProjectPage.vue';
import NotFound from './pages/NotFound.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/projects/1' },
    {
      path: '/projects/:id',
      component: ProjectPage,
      props: true,
    },
    { path: '/:notFound(.*)', component: NotFound }
  ]
});

export default router;
