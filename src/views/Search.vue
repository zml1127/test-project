<template>
  <div class="h-full overflow-auto p-6 space-y-6">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-header-title">全局搜索</h1>
    </div>

    <!-- 搜索输入框 -->
    <div class="relative max-w-2xl">
      <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        ref="searchInputRef"
        v-model="searchQuery"
        placeholder="搜索物品、品牌、编号或柜子…"
        class="pl-10 pr-10"
      />
      <button
        v-if="searchQuery"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        @click="clearSearch"
      >
        <XIcon class="h-4 w-4" />
      </button>
    </div>

    <!-- 搜索类型标签 -->
    <Tabs v-model="activeTab">
      <TabsList>
        <TabsTrigger value="all">
          全部
          <Badge v-if="totalResults > 0" variant="secondary" class="ml-1.5 text-[10px] px-1 py-0">
            {{ totalResults }}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="item">
          物品
          <Badge v-if="filteredItems.length > 0" variant="secondary" class="ml-1.5 text-[10px] px-1 py-0">
            {{ filteredItems.length }}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="cabinet">
          柜子
          <Badge v-if="filteredCabinets.length > 0" variant="secondary" class="ml-1.5 text-[10px] px-1 py-0">
            {{ filteredCabinets.length }}
          </Badge>
        </TabsTrigger>
      </TabsList>
    </Tabs>

    <!-- 加载态 -->
    <div v-if="loading" class="space-y-4">
      <Skeleton v-for="i in 4" :key="i" class="h-24 w-full" />
    </div>

    <!-- 结果列表 -->
    <div v-else-if="searchQuery.trim() && hasResults" class="space-y-8">
      <!-- 物品结果组 -->
      <div
        v-if="displayItems.length > 0 && (activeTab === 'all' || activeTab === 'item')"
        class="space-y-3"
      >
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <PackageIcon class="h-4 w-4" />
            物品
            <span class="text-xs text-muted-foreground/70">({{ filteredItems.length }})</span>
          </h2>
          <Button
            v-if="activeTab === 'all' && filteredItems.length > pageSize"
            variant="ghost"
            size="sm"
            class="text-xs h-7"
            @click="activeTab = 'item'"
          >
            查看更多
            <ChevronRightIcon class="h-3 w-3 ml-1" />
          </Button>
        </div>
        <div class="item-card-grid">
          <Card
            v-for="item in displayItems"
            :key="item.id"
            class="cursor-pointer hover:border-primary/50 transition-colors"
            @click="goToItem(item.id)"
          >
            <CardContent class="p-4 flex gap-4">
              <div class="photo-thumb h-16 w-16 shrink-0 rounded-lg">
                <img :src="item.photoUrl" :alt="item.name" loading="lazy" />
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="font-medium text-foreground truncate" v-html="highlightText(item.name)" />
                <div class="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="secondary" class="text-[10px]">{{ item.category }}</Badge>
                  <span class="text-xs text-muted-foreground" v-html="highlightText(item.code)" />
                </div>
                <p class="text-xs text-muted-foreground mt-1.5 truncate">
                  所在柜子：
                  <span
                    class="text-primary cursor-pointer hover:underline"
                    @click.stop="goToCabinet(item.cabinetId)"
                  >
                    {{ item.cabinetName }}
                  </span>
                </p>
                <p
                  v-if="item.brand"
                  class="text-xs text-muted-foreground mt-0.5"
                  v-html="`品牌：${highlightText(item.brand)}`"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <!-- 物品分页 -->
        <PaginationBar
          v-if="activeTab === 'item' && itemTotal > pageSize"
          v-model:page="itemPage"
          v-model:pageSize="pageSize"
          :total="itemTotal"
        />
      </div>

      <!-- 柜子结果组 -->
      <div
        v-if="displayCabinets.length > 0 && (activeTab === 'all' || activeTab === 'cabinet')"
        class="space-y-3"
      >
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <ArchiveIcon class="h-4 w-4" />
            柜子
            <span class="text-xs text-muted-foreground/70">({{ filteredCabinets.length }})</span>
          </h2>
          <Button
            v-if="activeTab === 'all' && filteredCabinets.length > pageSize"
            variant="ghost"
            size="sm"
            class="text-xs h-7"
            @click="activeTab = 'cabinet'"
          >
            查看更多
            <ChevronRightIcon class="h-3 w-3 ml-1" />
          </Button>
        </div>
        <div class="item-card-grid">
          <Card
            v-for="cabinet in displayCabinets"
            :key="cabinet.id"
            class="cursor-pointer hover:border-primary/50 transition-colors"
            @click="goToCabinet(cabinet.id)"
          >
            <CardContent class="p-4 flex gap-4">
              <div class="photo-thumb h-16 w-16 shrink-0 rounded-lg">
                <img :src="cabinet.photoUrl" :alt="cabinet.name" loading="lazy" />
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="font-medium text-foreground truncate" v-html="highlightText(cabinet.name)" />
                <p class="text-xs text-muted-foreground mt-1" v-html="highlightText(cabinet.code)" />
                <p class="text-xs text-muted-foreground mt-1 truncate">
                  位置：{{ cabinet.location }}
                </p>
                <div class="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <PackageIcon class="h-3 w-3" />
                  <span>{{ cabinet.itemCount }} 件物品</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <!-- 柜子分页 -->
        <PaginationBar
          v-if="activeTab === 'cabinet' && cabinetTotal > pageSize"
          v-model:page="cabinetPage"
          v-model:pageSize="pageSize"
          :total="cabinetTotal"
        />
      </div>
    </div>

    <!-- 搜索无结果 -->
    <Empty
      v-else-if="searchQuery"
      title="未找到相关结果"
      description="换个关键词试试"
    >
      <template #icon>
        <SearchIcon class="h-12 w-12 text-muted-foreground/50" />
      </template>
    </Empty>

    <!-- 初始空状态 -->
    <Empty
      v-else
      title="输入关键词开始搜索"
      description="支持搜索物品名称、品牌、编号或柜子名称、编号"
    >
      <template #icon>
        <SearchIcon class="h-12 w-12" />
      </template>
    </Empty>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  Search as SearchIcon,
  X as XIcon,
  Package as PackageIcon,
  Archive as ArchiveIcon,
  ChevronRight as ChevronRightIcon,
} from 'lucide-vue-next'
import {
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
  Card,
  CardContent,
  Badge,
  Empty,
  Skeleton,
  PaginationBar,
  Button,
} from '@/components/ui'

// ============================================================
// 类型定义
// ============================================================

interface ItemData {
  id: string
  name: string
  code: string
  category: string
  brand: string
  photoUrl: string
  cabinetId: string
  cabinetName: string
}

interface CabinetData {
  id: string
  name: string
  code: string
  location: string
  photoUrl: string
  itemCount: number
}

// ============================================================
// 路由
// ============================================================

const router = useRouter()

function goToItem(id: string) {
  router.push(`/items/${id}`)
}

function goToCabinet(id: string) {
  router.push(`/cabinets/${id}`)
}

// ============================================================
// 搜索状态
// ============================================================

const searchQuery = ref('')
const activeTab = ref('all')
const loading = ref(false)
const searchInputRef = ref<InstanceType<typeof Input>>()

let debounceTimer: ReturnType<typeof setTimeout> | null = null

// 分页状态
const pageSize = ref(8)
const itemPage = ref(1)
const cabinetPage = ref(1)

// ============================================================
// Mock 数据
// ============================================================

const mockItems: ItemData[] = [
  {
    id: '101',
    name: '小米电饭煲',
    code: 'I-20260427-001',
    category: '电子产品',
    brand: '小米',
    photoUrl: 'https://placehold.co/200x200/e0f2fe/0369a1?text=电饭煲',
    cabinetId: '1',
    cabinetName: '客厅电视柜左抽屉',
  },
  {
    id: '102',
    name: '美的微波炉',
    code: 'I-20260427-002',
    category: '厨具',
    brand: '美的',
    photoUrl: 'https://placehold.co/200x200/fef3c7/b45309?text=微波炉',
    cabinetId: '2',
    cabinetName: '厨房吊柜',
  },
  {
    id: '103',
    name: '三体全集',
    code: 'I-20260427-003',
    category: '书籍',
    brand: '无品牌',
    photoUrl: 'https://placehold.co/200x200/f3e8ff/7c3aed?text=三体',
    cabinetId: '3',
    cabinetName: '书房书架',
  },
  {
    id: '104',
    name: '波司登羽绒服',
    code: 'I-20260428-001',
    category: '衣物',
    brand: '波司登',
    photoUrl: 'https://placehold.co/200x200/ecfccb/3f6212?text=羽绒服',
    cabinetId: '4',
    cabinetName: '卧室衣柜',
  },
  {
    id: '105',
    name: '999感冒药',
    code: 'I-20260428-002',
    category: '药品',
    brand: '999',
    photoUrl: 'https://placehold.co/200x200/fee2e2/b91c1c?text=感冒药',
    cabinetId: '5',
    cabinetName: '客厅药箱',
  },
  {
    id: '106',
    name: 'iPad Pro',
    code: 'I-20260428-003',
    category: '电子产品',
    brand: 'Apple',
    photoUrl: 'https://placehold.co/200x200/e0f2fe/0369a1?text=iPad',
    cabinetId: '6',
    cabinetName: '书房书桌抽屉',
  },
  {
    id: '107',
    name: '苏泊尔不粘锅',
    code: 'I-20260429-001',
    category: '厨具',
    brand: '苏泊尔',
    photoUrl: 'https://placehold.co/200x200/fef3c7/b45309?text=不粘锅',
    cabinetId: '7',
    cabinetName: '厨房地柜',
  },
  {
    id: '108',
    name: '红楼梦',
    code: 'I-20260429-002',
    category: '书籍',
    brand: '无品牌',
    photoUrl: 'https://placehold.co/200x200/f3e8ff/7c3aed?text=红楼梦',
    cabinetId: '3',
    cabinetName: '书房书架',
  },
  {
    id: '109',
    name: 'Nike运动鞋',
    code: 'I-20260429-003',
    category: '衣物',
    brand: 'Nike',
    photoUrl: 'https://placehold.co/200x200/ecfccb/3f6212?text=运动鞋',
    cabinetId: '8',
    cabinetName: '玄关鞋柜',
  },
  {
    id: '110',
    name: '养生堂维生素C',
    code: 'I-20260430-001',
    category: '药品',
    brand: '养生堂',
    photoUrl: 'https://placehold.co/200x200/fee2e2/b91c1c?text=维生素C',
    cabinetId: '5',
    cabinetName: '客厅药箱',
  },
]

const mockCabinets: CabinetData[] = [
  {
    id: '1',
    name: '客厅电视柜左抽屉',
    code: 'C-20260427-001',
    location: '客厅东墙电视柜下方第一层',
    photoUrl: 'https://placehold.co/200x200/f1f5f9/475569?text=电视柜',
    itemCount: 2,
  },
  {
    id: '2',
    name: '厨房吊柜',
    code: 'C-20260427-002',
    location: '厨房北墙上方吊柜',
    photoUrl: 'https://placehold.co/200x200/f1f5f9/475569?text=吊柜',
    itemCount: 1,
  },
  {
    id: '3',
    name: '书房书架',
    code: 'C-20260427-003',
    location: '书房西墙书架',
    photoUrl: 'https://placehold.co/200x200/f1f5f9/475569?text=书架',
    itemCount: 2,
  },
  {
    id: '4',
    name: '卧室衣柜',
    code: 'C-20260428-001',
    location: '卧室南墙衣柜',
    photoUrl: 'https://placehold.co/200x200/f1f5f9/475569?text=衣柜',
    itemCount: 1,
  },
  {
    id: '5',
    name: '客厅药箱',
    code: 'C-20260428-002',
    location: '客厅茶几下方抽屉',
    photoUrl: 'https://placehold.co/200x200/f1f5f9/475569?text=药箱',
    itemCount: 2,
  },
  {
    id: '6',
    name: '书房书桌抽屉',
    code: 'C-20260428-003',
    location: '书房书桌右侧抽屉',
    photoUrl: 'https://placehold.co/200x200/f1f5f9/475569?text=书桌',
    itemCount: 1,
  },
  {
    id: '7',
    name: '厨房地柜',
    code: 'C-20260429-001',
    location: '厨房南墙下方地柜',
    photoUrl: 'https://placehold.co/200x200/f1f5f9/475569?text=地柜',
    itemCount: 1,
  },
  {
    id: '8',
    name: '玄关鞋柜',
    code: 'C-20260429-002',
    location: '玄关右侧鞋柜',
    photoUrl: 'https://placehold.co/200x200/f1f5f9/475569?text=鞋柜',
    itemCount: 1,
  },
]

// ============================================================
// 搜索逻辑
// ============================================================

function matchesQuery(text: string, query: string): boolean {
  if (!query) return true
  return text.toLowerCase().includes(query.toLowerCase())
}

const filteredItems = computed(() => {
  const q = searchQuery.value.trim()
  if (!q) return mockItems
  return mockItems.filter((item) =>
    matchesQuery(item.name, q) ||
    matchesQuery(item.brand, q) ||
    matchesQuery(item.code, q)
  )
})

const filteredCabinets = computed(() => {
  const q = searchQuery.value.trim()
  if (!q) return mockCabinets
  return mockCabinets.filter((cabinet) =>
    matchesQuery(cabinet.name, q) ||
    matchesQuery(cabinet.code, q)
  )
})

// 显示的结果（考虑分页）
const displayItems = computed(() => {
  if (activeTab.value === 'all') {
    return filteredItems.value.slice(0, pageSize.value)
  }
  const start = (itemPage.value - 1) * pageSize.value
  return filteredItems.value.slice(start, start + pageSize.value)
})

const displayCabinets = computed(() => {
  if (activeTab.value === 'all') {
    return filteredCabinets.value.slice(0, pageSize.value)
  }
  const start = (cabinetPage.value - 1) * pageSize.value
  return filteredCabinets.value.slice(start, start + pageSize.value)
})

const itemTotal = computed(() => filteredItems.value.length)
const cabinetTotal = computed(() => filteredCabinets.value.length)
const totalResults = computed(() => itemTotal.value + cabinetTotal.value)
const hasResults = computed(() => totalResults.value > 0)

// ============================================================
// 高亮
// ============================================================

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

function highlightText(text: string): string {
  const q = searchQuery.value.trim()
  if (!q) return escapeHtml(text)
  const regex = new RegExp(`(${escapeRegExp(q)})`, 'gi')
  return escapeHtml(text).replace(regex, '<span class="search-highlight-strong">$1</span>')
}

// ============================================================
// 交互
// ============================================================

function clearSearch() {
  searchQuery.value = ''
  nextTick(() => {
    const el = searchInputRef.value?.$el as HTMLInputElement | undefined
    el?.focus()
  })
}

// 防抖搜索
watch(searchQuery, () => {
  loading.value = true
  itemPage.value = 1
  cabinetPage.value = 1
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    loading.value = false
  }, 300)
})

// 切换标签时重置页码
watch(activeTab, () => {
  itemPage.value = 1
  cabinetPage.value = 1
})

// 自动聚焦
onMounted(() => {
  nextTick(() => {
    const el = searchInputRef.value?.$el as HTMLInputElement | undefined
    el?.focus()
  })
})
</script>
