<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Archive, Search } from 'lucide-vue-next'
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, Empty, PaginationBar } from '@/components/ui'

interface Cabinet {
  id: string
  name: string
  code: string
  location: string
  photo: string
  itemCount: number
  createdAt: string
}

const router = useRouter()
const keyword = ref('')
const page = ref(1)
const pageSize = ref(8)

const mockCabinets: Cabinet[] = [
  { id: '1', name: '客厅展示柜', code: 'C-20260427-001', location: '客厅电视右侧', photo: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=400&fit=crop', itemCount: 12, createdAt: '2026-04-15' },
  { id: '2', name: '书房储物柜', code: 'C-20260427-002', location: '书房靠窗位置', photo: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=400&h=400&fit=crop', itemCount: 8, createdAt: '2026-04-16' },
  { id: '3', name: '卧室衣柜', code: 'C-20260427-003', location: '主卧室左侧墙面', photo: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', itemCount: 25, createdAt: '2026-04-17' },
  { id: '4', name: '厨房橱柜', code: 'C-20260427-004', location: '厨房灶台下方', photo: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=400&fit=crop', itemCount: 18, createdAt: '2026-04-18' },
  { id: '5', name: '玄关鞋柜', code: 'C-20260427-005', location: '入户门左侧', photo: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop', itemCount: 6, createdAt: '2026-04-19' },
  { id: '6', name: '阳台收纳柜', code: 'C-20260427-006', location: '阳台洗衣机旁', photo: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=400&h=400&fit=crop', itemCount: 4, createdAt: '2026-04-20' },
  { id: '7', name: '儿童房书柜', code: 'C-20260427-007', location: '儿童房学习区', photo: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop', itemCount: 15, createdAt: '2026-04-21' },
  { id: '8', name: '杂物间置物架', code: 'C-20260427-008', location: '杂物间进门处', photo: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', itemCount: 3, createdAt: '2026-04-22' },
  { id: '9', name: '卫生间镜柜', code: 'C-20260427-009', location: '洗手台上方', photo: 'https://images.unsplash.com/photo-1620626012053-10165ddf6f7a?w=400&h=400&fit=crop', itemCount: 9, createdAt: '2026-04-23' },
  { id: '10', name: '餐厅酒柜', code: 'C-20260427-010', location: '餐厅靠墙位置', photo: 'https://images.unsplash.com/photo-1583847661884-38e125a6158f?w=400&h=400&fit=crop', itemCount: 7, createdAt: '2026-04-24' },
]

const filteredCabinets = computed(() => {
  const k = keyword.value.trim().toLowerCase()
  if (!k) return mockCabinets
  return mockCabinets.filter(c =>
    c.name.toLowerCase().includes(k) || c.code.toLowerCase().includes(k)
  )
})

const pagedCabinets = computed(() => {
  const start = (page.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredCabinets.value.slice(start, end)
})

const total = computed(() => filteredCabinets.value.length)

function goDetail(id: string) {
  router.push(`/cabinets/${id}`)
}

function goAdd() {
  router.push('/cabinets/form')
}
</script>

<template>
  <div class="h-full overflow-auto p-6">
    <!-- 页面标题栏 -->
    <div class="page-header">
      <h1 class="page-header-title">柜子管理</h1>
      <Button variant="default" class="gap-2" @click="goAdd">
        <Plus class="h-4 w-4" />
        新增柜子
      </Button>
    </div>

    <!-- 搜索栏 -->
    <div class="filter-bar">
      <div class="relative flex-1 max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input v-model="keyword" placeholder="搜索柜子名称或编号..." class="pl-9" />
      </div>
    </div>

    <!-- 柜子卡片网格 -->
    <div v-if="pagedCabinets.length > 0" class="item-card-grid">
      <Card
        v-for="cabinet in pagedCabinets"
        :key="cabinet.id"
        class="cursor-pointer group relative overflow-hidden"
        @click="goDetail(cabinet.id)"
      >
        <!-- 物品数量角标 -->
        <span class="corner-badge">{{ cabinet.itemCount }}</span>

        <!-- 照片缩略图 -->
        <div class="photo-thumb aspect-square">
          <img :src="cabinet.photo" :alt="cabinet.name" />
        </div>

        <CardHeader class="p-4">
          <CardTitle class="text-base truncate">{{ cabinet.name }}</CardTitle>
          <CardDescription class="text-xs">{{ cabinet.code }}</CardDescription>
        </CardHeader>
      </Card>
    </div>

    <!-- 空状态 -->
    <Empty v-else title="暂无柜子" description="快去添加您的第一个柜子吧">
      <template #icon>
        <Archive class="h-12 w-12" />
      </template>
      <template #default>
        <Button variant="default" class="gap-2 mt-4" @click="goAdd">
          <Plus class="h-4 w-4" />
          新增柜子
        </Button>
      </template>
    </Empty>

    <!-- 分页 -->
    <div v-if="total > 0" class="mt-6 flex justify-end">
      <PaginationBar
        :total="total"
        v-model:page="page"
        v-model:pageSize="pageSize"
        :pageSizes="[8, 12, 16, 24]"
      />
    </div>
  </div>
</template>
