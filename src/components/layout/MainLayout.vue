<template>
  <div class="flex h-screen overflow-hidden">
    <!-- 侧边栏 -->
    <aside
      :class="cn(
        'bg-slate-900 text-slate-100 transition-all duration-300 flex flex-col relative flex-shrink-0',
        collapsed ? 'w-[68px]' : 'w-60'
      )"
    >
      <div class="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/15 via-primary/5 to-transparent pointer-events-none" />
      <!-- Logo 区域 -->
      <div :class="cn('h-16 flex items-center border-b border-slate-800/60 relative z-10', collapsed ? 'justify-center px-0' : 'px-4')">
        <div :class="cn('flex items-center', collapsed ? 'justify-center' : 'gap-3')">
          <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600 shadow-lg flex-shrink-0">
            <Home class="h-5 w-5 text-white" />
          </div>
          <div v-if="!collapsed" class="overflow-hidden">
            <div class="font-bold text-white text-sm">家庭物品管理系统</div>
            <div class="text-[10px] text-slate-500 truncate">Home Item Manager</div>
          </div>
        </div>
      </div>

      <!-- 导航菜单 -->
      <nav :class="cn('flex-1 py-3 relative z-10 overflow-y-auto space-y-1', collapsed ? 'px-2' : 'px-3')">
        <button
          v-for="item in menuItems"
          :key="item.id"
          type="button"
          :class="cn(
            'w-full flex items-center gap-3 rounded-xl transition-all duration-200 py-2.5',
            collapsed ? 'justify-center w-11 h-11 mx-auto' : 'px-3',
            activeMenu === item.id ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
          )"
          @click="handleMenuClick(item)"
        >
          <component :is="item.icon" class="h-5 w-5 shrink-0" />
          <span v-if="!collapsed" class="font-medium text-sm">{{ item.label }}</span>
        </button>
      </nav>

      <!-- 收起按钮 -->
      <div :class="cn('border-t border-slate-800/60 p-3 relative z-10', collapsed ? 'flex justify-center' : '')">
        <button
          type="button"
          :class="cn(
            'flex items-center gap-2 text-slate-400 hover:text-white transition-colors',
            collapsed ? 'justify-center w-11 h-11 mx-auto rounded-xl hover:bg-slate-800/70' : 'w-full py-2 rounded-lg hover:bg-slate-800/50'
          )"
          @click="collapsed = !collapsed"
        >
          <ChevronRight :class="cn('h-4 w-4', collapsed && 'rotate-180')" />
          <span v-if="!collapsed" class="text-sm">收起菜单</span>
        </button>
      </div>
    </aside>

    <!-- 主内容区 -->
    <div class="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <!-- 顶部 Header -->
      <header class="h-14 px-4 lg:px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
        <!-- 面包屑区域 -->
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <template v-for="(crumb, index) in breadcrumbs" :key="index">
            <span v-if="index > 0" class="text-slate-300">/</span>
            <button
              v-if="crumb.path && index < breadcrumbs.length - 1"
              type="button"
              class="hover:text-primary transition-colors"
              @click="router.push(crumb.path)"
            >
              {{ crumb.label }}
            </button>
            <span v-else :class="index === breadcrumbs.length - 1 ? 'text-foreground font-medium' : ''">{{ crumb.label }}</span>
          </template>
        </div>

        <!-- 右侧操作区 -->
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-muted text-slate-600 dark:text-slate-400 transition-colors"
            @click="router.push('/search')"
          >
            <Search class="h-4 w-4" />
          </button>
          <button
            type="button"
            class="h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-muted text-slate-600 dark:text-slate-400 transition-colors relative"
          >
            <Bell class="h-4 w-4" />
            <span class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
          </button>

          <!-- 用户下拉 -->
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <button type="button" class="flex items-center gap-2 ml-1 rounded-md hover:bg-muted px-2 py-1 transition-colors">
                <Avatar class="h-8 w-8">
                  <AvatarFallback class="bg-primary text-primary-foreground text-xs">
                    {{ auth.user?.name?.charAt(0) || '管' }}
                  </AvatarFallback>
                </Avatar>
                <span v-if="!isMobile" class="text-sm text-foreground hidden sm:inline">{{ auth.user?.name || '管理员' }}</span>
                <ChevronDown class="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-48">
              <DropdownMenuLabel>账户信息</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div class="px-3 py-2 text-sm text-muted-foreground">
                <p>{{ auth.user?.email }}</p>
                <p class="text-xs mt-0.5">角色: {{ auth.user?.role === 'admin' ? '管理员' : auth.user?.role }}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="handleLogout">
                <LogOut class="h-4 w-4 mr-2" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <!-- 主内容 -->
      <main class="flex-1 overflow-auto p-4 lg:p-6">
        <router-view />
      </main>
    </div>

    <!-- 全局 Toast 通知 -->
    <Toaster />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, markRaw, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Home,
  LayoutDashboard,
  Archive,
  Package,
  Search,
  Bell,
  ChevronRight,
  ChevronDown,
  LogOut,
} from 'lucide-vue-next'
import { cn } from '@/utils/cn'
import { useAuthStore } from '@/stores/auth'
import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Toaster,
} from '@/components/ui'

interface MenuItem {
  id: string
  label: string
  icon: object
  path: string
}

interface Breadcrumb {
  label: string
  path?: string
}

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const collapsed = ref(false)
const isMobile = ref(false)

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: '首页', icon: markRaw(LayoutDashboard), path: '/dashboard' },
  { id: 'cabinets', label: '柜子管理', icon: markRaw(Archive), path: '/cabinets' },
  { id: 'items', label: '物品管理', icon: markRaw(Package), path: '/items' },
  { id: 'search', label: '搜索', icon: markRaw(Search), path: '/search' },
]

const activeMenu = computed(() => {
  const path = route.path
  if (path.startsWith('/dashboard')) return 'dashboard'
  if (path.startsWith('/cabinets')) return 'cabinets'
  if (path.startsWith('/items')) return 'items'
  if (path.startsWith('/search')) return 'search'
  return 'dashboard'
})

const breadcrumbs = computed<Breadcrumb[]>(() => {
  const result: Breadcrumb[] = [{ label: '首页', path: '/dashboard' }]
  const path = route.path

  if (path === '/dashboard') {
    result[0] = { label: '仪表盘' }
    return result
  }

  if (path.startsWith('/cabinets')) {
    result.push({ label: '柜子管理', path: '/cabinets' })
    if (path === '/cabinets') {
      result[result.length - 1] = { label: '柜子列表' }
    } else if (path.includes('/form/')) {
      const id = route.params.id
      result.push({ label: id ? '编辑柜子' : '新增柜子' })
    } else if (route.params.id) {
      result.push({ label: '柜子详情' })
    }
  }

  if (path.startsWith('/items')) {
    result.push({ label: '物品管理', path: '/items' })
    if (path === '/items') {
      result[result.length - 1] = { label: '物品列表' }
    } else if (path.includes('/form/')) {
      const id = route.params.id
      result.push({ label: id ? '编辑物品' : '新增物品' })
    } else if (route.params.id) {
      result.push({ label: '物品详情' })
    }
  }

  if (path.startsWith('/search')) {
    result.push({ label: '全局搜索' })
  }

  return result
})

function handleMenuClick(item: MenuItem) {
  router.push(item.path)
}

function handleLogout() {
  auth.logout()
  router.push('/login')
}

// 检测移动端
watch(
  () => window.innerWidth,
  (width) => {
    isMobile.value = width < 768
    if (width < 1024) {
      collapsed.value = true
    }
  },
  { immediate: true }
)
</script>
