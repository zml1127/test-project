<template>
  <div class="min-h-screen flex">
    <!-- 左侧温馨背景 -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5" />
      <!-- 装饰性插画元素 -->
      <div class="absolute top-20 left-20 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl" />
      <div class="absolute bottom-20 right-20 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-200/10 rounded-full blur-3xl" />

      <!-- 内容 -->
      <div class="relative z-10 flex flex-col justify-center items-center w-full px-12">
        <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl mb-8">
          <Home class="h-10 w-10 text-white" />
        </div>
        <h2 class="text-3xl font-bold text-slate-800 mb-4">家庭物品管理系统</h2>
        <p class="text-slate-600 text-center max-w-sm leading-relaxed">
          轻松管理家中每一个柜子与物品，<br />让收纳变得井井有条，查找一目了然。
        </p>

        <!-- 装饰图标 -->
        <div class="flex items-center gap-6 mt-12 text-slate-400">
          <div class="flex flex-col items-center gap-2">
            <div class="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center shadow-sm">
              <Archive class="h-6 w-6 text-emerald-600" />
            </div>
            <span class="text-xs">柜子管理</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <div class="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center shadow-sm">
              <Package class="h-6 w-6 text-teal-600" />
            </div>
            <span class="text-xs">物品追踪</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <div class="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center shadow-sm">
              <Search class="h-6 w-6 text-amber-600" />
            </div>
            <span class="text-xs">全局搜索</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧登录卡片 -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-4 bg-background">
      <div class="w-full max-w-sm">
        <!-- Logo (移动端显示) -->
        <div class="lg:hidden flex flex-col items-center mb-8">
          <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg mb-4">
            <Home class="h-8 w-8 text-white" />
          </div>
          <h1 class="text-xl font-bold text-foreground">家庭物品管理系统</h1>
        </div>

        <Card>
          <CardHeader class="space-y-1">
            <CardTitle class="text-2xl font-bold text-center">欢迎回来</CardTitle>
            <CardDescription class="text-center">
              请登录您的账户以继续
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="onSubmit" class="space-y-4">
              <div class="space-y-2">
                <Label for="email">邮箱</Label>
                <Input
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="admin@example.com"
                  :disabled="loading"
                />
              </div>
              <div class="space-y-2">
                <Label for="password">密码</Label>
                <div class="relative">
                  <Input
                    id="password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="请输入密码"
                    :disabled="loading"
                  />
                  <button
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    @click="showPassword = !showPassword"
                  >
                    <Eye v-if="!showPassword" class="h-4 w-4" />
                    <EyeOff v-else class="h-4 w-4" />
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                class="w-full"
                size="lg"
                :disabled="loading"
              >
                <Loader2 v-if="loading" class="h-4 w-4 mr-2 animate-spin" />
                {{ loading ? '登录中...' : '登录' }}
              </Button>
            </form>
          </CardContent>
          <CardFooter class="flex flex-col gap-3">
            <div class="w-full border-t border-border pt-4">
              <p class="text-xs text-muted-foreground text-center">
                演示账号
              </p>
              <div class="mt-2 flex items-center justify-center gap-4 text-sm">
                <div class="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                  <User class="h-3.5 w-3.5 text-muted-foreground" />
                  <span class="font-medium">admin@example.com</span>
                </div>
                <div class="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                  <KeyRound class="h-3.5 w-3.5 text-muted-foreground" />
                  <span class="font-medium">password</span>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>

    <!-- Toast 通知 -->
    <Toaster />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Home,
  Archive,
  Package,
  Search,
  Eye,
  EyeOff,
  Loader2,
  User,
  KeyRound,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { toast } from '@/components/ui'
import {
  Button,
  Input,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Toaster,
} from '@/components/ui'

const router = useRouter()
const auth = useAuthStore()

const email = ref('admin@example.com')
const password = ref('password')
const loading = ref(false)
const showPassword = ref(false)

async function onSubmit() {
  if (!email.value || !password.value) {
    toast({
      title: '请填写完整信息',
      description: '邮箱和密码不能为空',
      variant: 'destructive',
    })
    return
  }

  loading.value = true
  try {
    const ok = await auth.login(email.value, password.value)
    if (ok) {
      toast({
        title: '登录成功',
        description: '欢迎回到家庭物品管理系统',
      })
      router.push('/')
    } else {
      toast({
        title: '登录失败',
        description: '邮箱或密码错误，请重试',
        variant: 'destructive',
      })
    }
  } catch {
    toast({
      title: '登录异常',
      description: '网络请求失败，请稍后重试',
      variant: 'destructive',
    })
  } finally {
    loading.value = false
  }
}
</script>
