<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Package, Search, Eye, Pencil, Trash2 } from 'lucide-vue-next'
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, Empty, PaginationBar, Badge, Select, SelectOption, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, useToast } from '@/components/ui'

interface Item {
  id: string
  code: string
  name: string
  category: string
  brand: string
  photos: string[]
  cabinetId: string
  remark: string
  createdAt: string
}

interface Cabinet {
  id: string
  name: string
}

const router = useRouter()
const { toast } = useToast()

const keyword = ref('')
const categoryFilter = ref('all')
const cabinetFilter = ref('all')
const sortBy = ref('createdAtDesc')
const page = ref(1)
const pageSize = ref(8)

const deleteDialogOpen = ref(false)
const deleteItemId = ref<string | null>(null)

const categories = ['电子产品', '厨具', '书籍', '衣物', '药品', '其他']

const mockCabinets: Cabinet[] = [
  { id: '1', name: '客厅展示柜' },
  { id: '2', name: '书房储物柜' },
  { id: '3', name: '卧室衣柜' },
  { id: '4', name: '厨房橱柜' },
  { id: '5', name: '玄关鞋柜' },
  { id: '6', name: '阳台收纳柜' },
  { id: '7', name: '儿童房书柜' },
  { id: '8', name: '杂物间置物架' },
  { id: '9', name: '卫生间镜柜' },
  { id: '10', name: '餐厅酒柜' },
]

const mockItems: Item[] = [
  { id: '101', code: 'I-20260427-001', name: '陶瓷花瓶', category: '其他', brand: '景德镇', photos: ['https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=400&fit=crop'], cabinetId: '1', remark: '景德镇手工制作', createdAt: '2026-04-15' },
  { id: '102', code: 'I-20260427-002', name: '相框组合', category: '其他', brand: '宜家', photos: ['https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=400&fit=crop'], cabinetId: '1', remark: '含3个相框', createdAt: '2026-04-15' },
  { id: '103', code: 'I-20260427-003', name: '装饰灯', category: '电子产品', brand: '小米', photos: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=400&fit=crop'], cabinetId: '1', remark: '智能控制', createdAt: '2026-04-16' },
  { id: '104', code: 'I-20260427-004', name: '书籍套装', category: '书籍', brand: '人民文学出版社', photos: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop'], cabinetId: '2', remark: '四大名著', createdAt: '2026-04-16' },
  { id: '105', code: 'I-20260427-005', name: '文具收纳盒', category: '其他', brand: '得力', photos: ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop'], cabinetId: '2', remark: '', createdAt: '2026-04-17' },
  { id: '106', code: 'I-20260427-006', name: '衬衫', category: '衣物', brand: '优衣库', photos: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop'], cabinetId: '3', remark: 'L码', createdAt: '2026-04-17' },
  { id: '107', code: 'I-20260427-007', name: '外套', category: '衣物', brand: '无印良品', photos: ['https://images.unsplash.com/photo-1551488852-0801751ac367?w=400&h=400&fit=crop'], cabinetId: '3', remark: '防风防水', createdAt: '2026-04-18' },
  { id: '108', code: 'I-20260427-008', name: '锅具套装', category: '厨具', brand: '苏泊尔', photos: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'], cabinetId: '4', remark: '含炒锅、汤锅、煎锅', createdAt: '2026-04-18' },
  { id: '109', code: 'I-20260427-009', name: '餐盘', category: '厨具', brand: '宜家', photos: ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=400&fit=crop'], cabinetId: '4', remark: '6只装', createdAt: '2026-04-19' },
  { id: '110', code: 'I-20260427-010', name: '运动鞋', category: '衣物', brand: '耐克', photos: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'], cabinetId: '5', remark: '42码', createdAt: '2026-04-19' },
]

function getCabinetName(id: string): string {
  return mockCabinets.find(c => c.id === id)?.name || '-'
}

function getCategoryVariant(category: string): string {
  const map: Record<string, string> = {
    '电子产品': 'default',
    '厨具': 'warning',
    '书籍': 'secondary',
    '衣物': 'success',
    '药品': 'destructive',
    '其他': 'outline',
  }
  return map[category] || 'outline'
}

const filteredItems = computed(() => {
  let result = [...mockItems]

  if (categoryFilter.value !== 'all') {
    result = result.filter(i => i.category === categoryFilter.value)
  }

  if (cabinetFilter.value !== 'all') {
    result = result.filter(i => i.cabinetId === cabinetFilter.value)
  }

  const k = keyword.value.trim().toLowerCase()
  if (k) {
    result = result.filter(i =>
      i.name.toLowerCase().includes(k) ||
      i.brand.toLowerCase().includes(k) ||
      i.code.toLowerCase().includes(k)
    )
  }

  if (sortBy.value === 'nameAsc') {
    result.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
  } else {
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  return result
})

const pagedItems = computed(() => {
  const start = (page.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredItems.value.slice(start, end)
})

const total = computed(() => filteredItems.value.length)

function goDetail(id: string) {
  router.push(`/items/${id}`)
}

function goAdd() {
  router.push('/items/form')
}

function goEdit(id: string) {
  router.push(`/items/form/${id}`)
}

function onDelete(id: string) {
  deleteItemId.value = id
  deleteDialogOpen.value = true
}

function confirmDelete() {
  if (deleteItemId.value) {
    deleteDialogOpen.value = false
    toast({ title: '删除成功', description: '物品已删除' })
    deleteItemId.value = null
  }
}
</script>

<template>
  <div class="h-full overflow-auto p-6">
    <!-- 页面标题栏 -->
    <div class="page-header">
      <h1 class="page-header-title">物品管理</h1>
      <Button variant="default" class="gap-2" @click="goAdd">
        <Plus class="h-4 w-4" />
        新增物品
      </Button>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <Select v-model="categoryFilter" placeholder="全部类别" class="w-36">
        <SelectOption value="all">全部类别</SelectOption>
        <SelectOption v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</SelectOption>
      </Select>

      <Select v-model="cabinetFilter" placeholder="全部柜子" class="w-40">
        <SelectOption value="all">全部柜子</SelectOption>
        <SelectOption v-for="cab in mockCabinets" :key="cab.id" :value="cab.id">{{ cab.name }}</SelectOption>
      </Select>

      <Select v-model="sortBy" placeholder="排序方式" class="w-36">
        <SelectOption value="createdAtDesc">创建时间倒序</SelectOption>
        <SelectOption value="nameAsc">名称正序</SelectOption>
      </Select>

      <div class="relative flex-1 max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input v-model="keyword" placeholder="搜索物品名称、品牌或编号..." class="pl-9" />
      </div>
    </div>

    <!-- 物品卡片网格 -->
    <div v-if="pagedItems.length > 0" class="item-card-grid">
      <Card v-for="item in pagedItems" :key="item.id" class="overflow-hidden">
        <div class="photo-thumb aspect-[4/3] cursor-pointer" @click="goDetail(item.id)">
          <img :src="item.photos[0]" :alt="item.name" />
        </div>
        <CardHeader class="p-4 pb-2">
          <div class="flex items-center justify-between gap-2">
            <CardTitle class="text-base truncate">{{ item.name }}</CardTitle>
            <Badge :variant="getCategoryVariant(item.category) as any">{{ item.category }}</Badge>
          </div>
          <CardDescription class="text-xs">{{ item.code }}</CardDescription>
        </CardHeader>
        <CardContent class="px-4 pb-3 pt-0 space-y-1">
          <p class="text-sm text-muted-foreground">
            品牌：{{ item.brand || '-' }}
          </p>
          <p class="text-sm text-muted-foreground">
            所在柜子：
            <span class="text-primary cursor-pointer hover:underline" @click.stop="router.push(`/cabinets/${item.cabinetId}`)">
              {{ getCabinetName(item.cabinetId) }}
            </span>
          </p>
          <p class="text-xs text-muted-foreground">创建时间：{{ item.createdAt }}</p>
        </CardContent>
        <CardContent class="px-4 pb-4 pt-0 flex gap-2">
          <Button variant="ghost" size="sm" class="gap-1 h-8 px-2" @click="goDetail(item.id)">
            <Eye class="h-3.5 w-3.5" />
            查看
          </Button>
          <Button variant="ghost" size="sm" class="gap-1 h-8 px-2" @click="goEdit(item.id)">
            <Pencil class="h-3.5 w-3.5" />
            编辑
          </Button>
          <Button variant="ghost" size="sm" class="gap-1 h-8 px-2 text-destructive hover:text-destructive" @click="onDelete(item.id)">
            <Trash2 class="h-3.5 w-3.5" />
            删除
          </Button>
        </CardContent>
      </Card>
    </div>

    <!-- 空状态 -->
    <Empty v-else title="暂无物品" description="快去添加您的第一个物品吧">
      <template #icon>
        <Package class="h-12 w-12" />
      </template>
      <template #default>
        <Button variant="default" class="gap-2 mt-4" @click="goAdd">
          <Plus class="h-4 w-4" />
          新增物品
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

    <!-- 删除确认弹窗 -->
    <Dialog v-model:open="deleteDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认删除</DialogTitle>
        </DialogHeader>
        <p class="text-sm text-muted-foreground">确定要删除该物品吗？此操作不可恢复，同时会清除所有位置历史记录。</p>
        <DialogFooter>
          <Button variant="outline" @click="deleteDialogOpen = false">取消</Button>
          <Button variant="destructive" @click="confirmDelete">确认删除</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
