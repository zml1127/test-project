import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// ============================================================
// 📌 路由配置规则（修改本文件时必须遵循）
// ------------------------------------------------------------
// 1. 顶层路由（不需要布局）：/login、/register 等独立页面，直接 component: Login
// 2. 布局子路由（需要布局）：放在 MainLayout 的 children 里
// 3. 默认跳转：用 { path: '', redirect: '/xxx' } 作为默认子路由
// 4. 懒加载：业务页面使用 () => import('@/views/xxx.vue')
// 5. 路径格式：不带前导斜杠，如 path: 'users' 而非 path: '/users'
// 6. 页面导航必须使用 useRouter()，禁止 window.location.href
// ============================================================

declare const __ROUTER_BASENAME__: string
const base = typeof __ROUTER_BASENAME__ !== 'undefined' ? __ROUTER_BASENAME__ : '/'

const router = createRouter({
  history: createWebHistory(base),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/',
      component: () => import('@/components/layout/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/dashboard' },
        { path: 'dashboard', name: 'Dashboard', component: () => import('@/views/Dashboard.vue') },
        { path: 'cabinets', name: 'Cabinets', component: () => import('@/views/Cabinets.vue') },
        { path: 'cabinets/:id', name: 'CabinetDetail', component: () => import('@/views/CabinetDetail.vue') },
        { path: 'cabinets/form/:id?', name: 'CabinetForm', component: () => import('@/views/CabinetForm.vue') },
        { path: 'items', name: 'Items', component: () => import('@/views/Items.vue') },
        { path: 'items/:id', name: 'ItemDetail', component: () => import('@/views/ItemDetail.vue') },
        { path: 'items/form/:id?', name: 'ItemForm', component: () => import('@/views/ItemForm.vue') },
        { path: 'search', name: 'Search', component: () => import('@/views/Search.vue') },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/login' },
  ],
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ path: '/login' })
  } else {
    next()
  }
})

export default router
