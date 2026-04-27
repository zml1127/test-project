<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardContent, CardHeader, CardTitle, Chart } from '@/components/ui'
import {
  Search,
  Archive,
  Package,
  Plus,
  PackageOpen,
  PlusSquare,
  Eye,
} from 'lucide-vue-next'

const router = useRouter()

interface Cabinet {
  id: string
  name: string
  location: string
  description: string
  createdAt: string
}

interface Item {
  id: string
  name: string
  brand: string
  category: string
  cabinetId: string
  cabinetName: string
  imageUrl?: string
  createdAt: string
}

const cabinets: Cabinet[] = [
  { id: '1', name: '客厅储物柜', location: '客厅', description: '存放日常杂物和电器', createdAt: '2026-01-15' },
  { id: '2', name: '厨房吊柜', location: '厨房', description: '存放厨具和食材', createdAt: '2026-01-20' },
  { id: '3', name: '卧室衣柜', location: '卧室', description: '存放衣物和床品', createdAt: '2026-02-01' },
  { id: '4', name: '书房书柜', location: '书房', description: '存放书籍和数码产品', createdAt: '2026-02-10' },
  { id: '5', name: '玄关鞋柜', location: '玄关', description: '存放鞋子和外出用品', createdAt: '2026-02-15' },
  { id: '6', name: '阳台收纳柜', location: '阳台', description: '存放清洁用品和工具', createdAt: '2026-03-01' },
  { id: '7', name: '卫生间镜柜', location: '卫生间', description: '存放洗漱和美妆用品', createdAt: '2026-03-10' },
  { id: '8', name: '杂物间置物架', location: '杂物间', description: '存放不常用物品和工具', createdAt: '2026-03-20' },
]

const items: Item[] = [
  { id: '1', name: '戴森吸尘器 V15', brand: 'Dyson', category: '电器', cabinetId: '1', cabinetName: '客厅储物柜', createdAt: '2026-04-20' },
  { id: '2', name: '飞利浦空气净化器', brand: 'Philips', category: '电器', cabinetId: '1', cabinetName: '客厅储物柜', createdAt: '2026-04-18' },
  { id: '3', name: '双立人刀具套装', brand: 'ZWILLING', category: '厨具', cabinetId: '2', cabinetName: '厨房吊柜', createdAt: '2026-04-15' },
  { id: '4', name: '索尼 WH-1000XM5', brand: 'Sony', category: '数码', cabinetId: '4', cabinetName: '书房书柜', createdAt: '2026-04-12' },
  { id: '5', name: '北面冲锋衣', brand: 'The North Face', category: '服装', cabinetId: '3', cabinetName: '卧室衣柜', createdAt: '2026-04-10' },
  { id: '6', name: '耐克 Air Max', brand: 'Nike', category: '服装', cabinetId: '5', cabinetName: '玄关鞋柜', createdAt: '2026-04-08' },
  { id: '7', name: '宜家收纳盒套装', brand: 'IKEA', category: '生活用品', cabinetId: '6', cabinetName: '阳台收纳柜', createdAt: '2026-04-05' },
  { id: '8', name: '小米电饭煲 Pro', brand: 'Xiaomi', category: '厨具', cabinetId: '2', cabinetName: '厨房吊柜', createdAt: '2026-04-03' },
  { id: '9', name: '雅诗兰黛小棕瓶精华', brand: 'Estee Lauder', category: '生活用品', cabinetId: '7', cabinetName: '卫生间镜柜', createdAt: '2026-04-01' },
  { id: '10', name: '博世电钻套装', brand: 'Bosch', category: '工具', cabinetId: '8', cabinetName: '杂物间置物架', createdAt: '2026-03-28' },
  { id: '11', name: 'Kindle Paperwhite', brand: 'Amazon', category: '数码', cabinetId: '4', cabinetName: '书房书柜', createdAt: '2026-03-25' },
  { id: '12', name: '乐扣保鲜盒十件套', brand: 'Lock&Lock', category: '厨具', cabinetId: '2', cabinetName: '厨房吊柜', createdAt: '2026-03-22' },
]

const totalCabinets = computed(() => cabinets.length)
const totalItems = computed(() => items.length)

const recentItems = computed(() => {
  return [...items]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
})

const recentlyAddedCount = computed(() => {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  return items.filter((i) => new Date(i.createdAt).getTime() > thirtyDaysAgo.getTime()).length
})

const categoryData = computed(() => {
  const counts: Record<string, number> = {}
  items.forEach((item) => {
    counts[item.category] = (counts[item.category] || 0) + 1
  })
  return Object.entries(counts).map(([name, value]) => ({ name, value }))
})

function goToSearch() {
  router.push('/search')
}

function goTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="h-full overflow-auto p-6 space-y-6">
    <!-- 顶部全局搜索 -->
    <div
      class="flex items-center gap-3 rounded-xl border border-border/50 bg-card px-4 py-3.5 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/30"
      @click="goToSearch"
    >
      <Search class="h-5 w-5 text-muted-foreground flex-shrink-0" />
      <span class="text-muted-foreground text-sm">搜索物品、品牌、编号或柜子…</span>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <div class="stat-card-value">{{ totalCabinets }}</div>
            <div class="stat-card-label">总柜子数</div>
          </div>
          <div class="stat-card-icon">
            <Archive class="h-5 w-5" />
          </div>
        </div>
      </div>
      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <div class="stat-card-value">{{ totalItems }}</div>
            <div class="stat-card-label">总物品数</div>
          </div>
          <div class="stat-card-icon">
            <Package class="h-5 w-5" />
          </div>
        </div>
      </div>
      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <div class="stat-card-value">{{ recentlyAddedCount }}</div>
            <div class="stat-card-label">最近新增物品数</div>
          </div>
          <div class="stat-card-icon">
            <Plus class="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="quick-action-btn" @click="goTo('/items/form')">
        <div class="quick-action-btn-icon">
          <PackageOpen class="h-5 w-5" />
        </div>
        <span class="quick-action-btn-label">新增物品</span>
      </div>
      <div class="quick-action-btn" @click="goTo('/cabinets/form')">
        <div class="quick-action-btn-icon">
          <PlusSquare class="h-5 w-5" />
        </div>
        <span class="quick-action-btn-label">新增柜子</span>
      </div>
      <div class="quick-action-btn" @click="goTo('/cabinets')">
        <div class="quick-action-btn-icon">
          <Archive class="h-5 w-5" />
        </div>
        <span class="quick-action-btn-label">按柜子查看</span>
      </div>
      <div class="quick-action-btn" @click="goTo('/items')">
        <div class="quick-action-btn-icon">
          <Eye class="h-5 w-5" />
        </div>
        <span class="quick-action-btn-label">按类别查看</span>
      </div>
    </div>

    <!-- 最近新增 + 类别分布 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 最近新增物品 -->
      <Card>
        <CardHeader>
          <CardTitle class="text-base">最近新增物品</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div
              v-for="item in recentItems"
              :key="item.id"
              class="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              @click="goTo(`/items/${item.id}`)"
            >
              <div class="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <Package class="h-4 w-4 text-muted-foreground" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-foreground truncate">{{ item.name }}</div>
                <div class="text-xs text-muted-foreground">{{ item.cabinetName }}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 物品类别分布 -->
      <Card>
        <CardHeader>
          <CardTitle class="text-base">物品类别分布</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            type="donut"
            :data="categoryData"
            name-key="name"
            value-key="value"
            theme="rainbow"
            height="280px"
          />
        </CardContent>
      </Card>
    </div>
  </div>
</template>
