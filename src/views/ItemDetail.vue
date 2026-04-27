<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Copy, Edit, Trash2, MoveRight, Package, MapPin } from 'lucide-vue-next'
import { Button, Card, CardHeader, CardTitle, CardContent, Empty, Badge, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Select, SelectOption, useToast } from '@/components/ui'

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
  code: string
  location: string
  photo: string
}

interface HistoryRecord {
  id: string
  itemId: string
  fromCabinetId?: string
  toCabinetId: string
  operator: string
  operateTime: string
}

const route = useRoute()
const router = useRouter()
const { toast } = useToast()

const itemId = computed(() => route.params.id as string)

const mockCabinets: Cabinet[] = [
  { id: '1', name: '客厅展示柜', code: 'C-20260427-001', location: '客厅电视右侧', photo: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=400&fit=crop' },
  { id: '2', name: '书房储物柜', code: 'C-20260427-002', location: '书房靠窗位置', photo: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=400&h=400&fit=crop' },
  { id: '3', name: '卧室衣柜', code: 'C-20260427-003', location: '主卧室左侧墙面', photo: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop' },
  { id: '4', name: '厨房橱柜', code: 'C-20260427-004', location: '厨房灶台下方', photo: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=400&fit=crop' },
  { id: '5', name: '玄关鞋柜', code: 'C-20260427-005', location: '入户门左侧', photo: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop' },
]

const mockItems: Item[] = [
  { id: '101', code: 'I-20260427-001', name: '陶瓷花瓶', category: '其他', brand: '景德镇', photos: ['https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1578749556935-ef88814b29c3?w=800&h=600&fit=crop'], cabinetId: '1', remark: '景德镇手工制作，高30cm', createdAt: '2026-04-15' },
  { id: '102', code: 'I-20260427-002', name: '相框组合', category: '其他', brand: '宜家', photos: ['https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&h=600&fit=crop'], cabinetId: '1', remark: '含3个相框，白色', createdAt: '2026-04-15' },
  { id: '103', code: 'I-20260427-003', name: '装饰灯', category: '电子产品', brand: '小米', photos: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=600&fit=crop'], cabinetId: '1', remark: '智能控制，可调色温', createdAt: '2026-04-16' },
  { id: '104', code: 'I-20260427-004', name: '书籍套装', category: '书籍', brand: '人民文学出版社', photos: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop'], cabinetId: '2', remark: '四大名著精装版', createdAt: '2026-04-16' },
  { id: '105', code: 'I-20260427-005', name: '文具收纳盒', category: '其他', brand: '得力', photos: ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&h=600&fit=crop'], cabinetId: '2', remark: '', createdAt: '2026-04-17' },
  { id: '106', code: 'I-20260427-006', name: '衬衫', category: '衣物', brand: '优衣库', photos: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=600&fit=crop'], cabinetId: '3', remark: 'L码，白色', createdAt: '2026-04-17' },
  { id: '107', code: 'I-20260427-007', name: '外套', category: '衣物', brand: '无印良品', photos: ['https://images.unsplash.com/photo-1551488852-0801751ac367?w=800&h=600&fit=crop'], cabinetId: '3', remark: '防风防水，藏青色', createdAt: '2026-04-18' },
  { id: '108', code: 'I-20260427-008', name: '锅具套装', category: '厨具', brand: '苏泊尔', photos: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop'], cabinetId: '4', remark: '含炒锅、汤锅、煎锅', createdAt: '2026-04-18' },
  { id: '109', code: 'I-20260427-009', name: '餐盘', category: '厨具', brand: '宜家', photos: ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=600&fit=crop'], cabinetId: '4', remark: '6只装，北欧风格', createdAt: '2026-04-19' },
  { id: '110', code: 'I-20260427-010', name: '运动鞋', category: '衣物', brand: '耐克', photos: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop'], cabinetId: '5', remark: '42码，红色', createdAt: '2026-04-19' },
]

const mockHistory: HistoryRecord[] = [
  { id: '1', itemId: '101', toCabinetId: '1', operator: 'admin@example.com', operateTime: '2026-04-15 10:30:00' },
  { id: '2', itemId: '106', fromCabinetId: '5', toCabinetId: '3', operator: 'admin@example.com', operateTime: '2026-04-17 14:20:00' },
  { id: '3', itemId: '108', toCabinetId: '4', operator: 'admin@example.com', operateTime: '2026-04-18 09:15:00' },
]

const item = computed<Item | undefined>(() => mockItems.find(i => i.id === itemId.value))
const cabinet = computed<Cabinet | undefined>(() => mockCabinets.find(c => c.id === item.value?.cabinetId))

const history = computed<HistoryRecord[]>(() => {
  return mockHistory
    .filter(h => h.itemId === itemId.value)
    .sort((a, b) => new Date(b.operateTime).getTime() - new Date(a.operateTime).getTime())
})

function getCabinetName(id: string): string {
  return mockCabinets.find(c => c.id === id)?.name || '未知柜子'
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

async function copyCode(code: string) {
  try {
    await navigator.clipboard.writeText(code)
    toast({ title: '复制成功', description: '编号已复制到剪贴板' })
  } catch {
    toast({ title: '复制失败', description: '请手动复制', variant: 'destructive' })
  }
}

function goBack() {
  router.push('/items')
}

function goEdit() {
  router.push(`/items/form/${itemId.value}`)
}

function goCabinetDetail(cabinetId: string) {
  router.push(`/cabinets/${cabinetId}`)
}

// 移动相关
const moveDialogOpen = ref(false)
const targetCabinetId = ref('')

function openMoveDialog() {
  targetCabinetId.value = ''
  moveDialogOpen.value = true
}

function confirmMove() {
  if (!targetCabinetId.value) {
    toast({ title: '请选择目标柜子', variant: 'destructive' })
    return
  }
  if (targetCabinetId.value === item.value?.cabinetId) {
    toast({ title: '物品已在该柜子中', variant: 'destructive' })
    return
  }
  moveDialogOpen.value = false
  toast({ title: '移动成功', description: `物品已移动到「${getCabinetName(targetCabinetId.value)}」` })
}

// 删除相关
const deleteDialogOpen = ref(false)

function confirmDelete() {
  deleteDialogOpen.value = false
  toast({ title: '删除成功', description: '物品已删除' })
  router.push('/items')
}

// 图片预览
const previewOpen = ref(false)
const previewIndex = ref(0)

function openPreview(index: number) {
  previewIndex.value = index
  previewOpen.value = true
}
</script>

<template>
  <div class="h-full overflow-auto p-6">
    <!-- 返回按钮 -->
    <Button variant="ghost" class="gap-2 mb-4 -ml-2" @click="goBack">
      <ArrowLeft class="h-4 w-4" />
      返回列表
    </Button>

    <div v-if="item" class="space-y-6">
      <!-- 照片展示区 -->
      <div v-if="item.photos.length > 0">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <div
            v-for="(photo, index) in item.photos"
            :key="index"
            class="photo-thumb aspect-[4/3] cursor-pointer"
            @click="openPreview(index)"
          >
            <img :src="photo" :alt="`${item.name} - ${index + 1}`" />
          </div>
        </div>
        <p class="mt-2 text-xs text-center text-muted-foreground">点击照片放大预览</p>
      </div>

      <!-- 基本信息 -->
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-muted-foreground mb-1">类别</p>
              <Badge :variant="getCategoryVariant(item.category) as any">{{ item.category }}</Badge>
            </div>
            <div>
              <p class="text-sm text-muted-foreground mb-1">名称</p>
              <p class="text-sm font-medium">{{ item.name }}</p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground mb-1">品牌</p>
              <p class="text-sm font-medium">{{ item.brand || '-' }}</p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground mb-1">编号</p>
              <p class="copyable-text text-sm font-medium" @click="copyCode(item.code)">
                {{ item.code }}
                <Copy class="h-3.5 w-3.5" />
              </p>
            </div>
            <div class="md:col-span-2">
              <p class="text-sm text-muted-foreground mb-1">备注</p>
              <p class="text-sm font-medium">{{ item.remark || '-' }}</p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground mb-1">创建时间</p>
              <p class="text-sm font-medium">{{ item.createdAt }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 归属信息 -->
      <Card
        v-if="cabinet"
        class="cursor-pointer hover:border-primary/50 transition-colors"
        @click="goCabinetDetail(cabinet.id)"
      >
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <MapPin class="h-4 w-4 text-primary" />
            当前所在柜子
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex items-center gap-4">
            <img :src="cabinet.photo" :alt="cabinet.name" class="h-16 w-16 object-cover rounded-lg" />
            <div>
              <p class="text-sm font-medium">{{ cabinet.name }}</p>
              <p class="text-xs text-muted-foreground">{{ cabinet.code }}</p>
              <p class="text-xs text-muted-foreground">{{ cabinet.location }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 位置历史 -->
      <Card>
        <CardHeader>
          <CardTitle>位置历史</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="history.length > 0" class="timeline">
            <div v-for="record in history" :key="record.id" class="timeline-item">
              <div class="timeline-dot" />
              <div class="timeline-content">
                <p class="timeline-time">{{ record.operateTime }}</p>
                <p class="timeline-title">
                  <template v-if="record.fromCabinetId">
                    由「{{ getCabinetName(record.fromCabinetId) }}」移动到「{{ getCabinetName(record.toCabinetId) }}」
                  </template>
                  <template v-else>
                    放入「{{ getCabinetName(record.toCabinetId) }}」
                  </template>
                </p>
                <p class="timeline-desc">操作人：{{ record.operator }}</p>
              </div>
            </div>
          </div>
          <Empty v-else title="暂无位置历史" description="该物品暂无位置变更记录" />
        </CardContent>
      </Card>

      <!-- 操作按钮组 -->
      <div class="flex flex-wrap gap-3 pt-4">
        <Button variant="outline" class="gap-2" @click="openMoveDialog">
          <MoveRight class="h-4 w-4" />
          移动到其他柜子
        </Button>
        <Button variant="outline" class="gap-2" @click="goEdit">
          <Edit class="h-4 w-4" />
          编辑
        </Button>
        <Button variant="destructive" class="gap-2" @click="deleteDialogOpen = true">
          <Trash2 class="h-4 w-4" />
          删除
        </Button>
      </div>
    </div>

    <!-- 物品不存在 -->
    <Empty v-else title="物品不存在" description="找不到该物品的信息">
      <template #icon>
        <Package class="h-12 w-12" />
      </template>
    </Empty>

    <!-- 移动弹窗 -->
    <Dialog v-model:open="moveDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>移动物品</DialogTitle>
        </DialogHeader>
        <div class="space-y-4">
          <p class="text-sm text-muted-foreground">
            将「{{ item?.name }}」从「{{ cabinet?.name }}」移动至：
          </p>
          <Select v-model="targetCabinetId" placeholder="请选择目标柜子">
            <SelectOption
              v-for="cab in mockCabinets.filter(c => c.id !== item?.cabinetId)"
              :key="cab.id"
              :value="cab.id"
            >
              {{ cab.name }}
            </SelectOption>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="moveDialogOpen = false">取消</Button>
          <Button variant="default" @click="confirmMove">确认移动</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- 删除确认弹窗 -->
    <Dialog v-model:open="deleteDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认删除</DialogTitle>
        </DialogHeader>
        <p class="text-sm text-muted-foreground">
          确定要删除物品「{{ item?.name }}」吗？此操作不可恢复，同时会清除所有位置历史记录。
        </p>
        <DialogFooter>
          <Button variant="outline" @click="deleteDialogOpen = false">取消</Button>
          <Button variant="destructive" @click="confirmDelete">确认删除</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- 图片预览弹窗 -->
    <Dialog v-model:open="previewOpen">
      <DialogContent class="max-w-3xl">
        <div class="flex items-center justify-center">
          <img
            :src="item?.photos[previewIndex]"
            :alt="item?.name"
            class="max-h-[60vh] object-contain rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
