/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      name: 'register',
      component: () => import('@/pages/RegisterView.vue'),
    },
    {
      path: '/register',
      name: 'register-page',
      component: () => import('@/pages/RegisterView.vue'),
    },
    {
      path: '/login',
      name: 'login-page',
      component: () => import('@/pages/LoginView.vue'),
    },
    {
      path: '/redirect',
      name: 'redirect-page',
      component: () => import('@/pages/Redirect.vue'),
    },
    {
      path: '/home',
      name: 'home-page',
      component: () => import('@/pages/Home.vue'),
      meta: {
        requireAuth: true,
      },
    },

  ],
})

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      user => {
        removeListener()
        resolve(user)
      },
      reject
    )
  })
}

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (await getCurrentUser()) {
      next()
    } else {
      next('/Redirect')
    }
  } else {
    next()
  }
})

export default router
