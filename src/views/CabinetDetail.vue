<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Copy, ArrowLeft, Trash2, Edit, Plus, Package } from 'lucide-vue-next'
import { Button, Card, CardHeader, CardTitle, CardContent, Empty, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, useToast } from '@/components/ui'

interface Cabinet {
  id: string
  name: string
  code: string
  location: string
  photo: string
  itemCount: number
  createdAt: string
}

interface Item {
  id: string
  name: string
  photo: string
  cabinetId: string
}

const route = useRoute()
const router = useRouter()
const { toast } = useToast()
const deleteDialogOpen = ref(false)

const mockCabinets: Cabinet[] = [
  { id: '1', name: '客厅展示柜', code: 'C-20260427-001', location: '客厅电视右侧', photo: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=600&fit=crop', itemCount: 12, createdAt: '2026-04-15' },
  { id: '2', name: '书房储物柜', code: 'C-20260427-002', location: '书房靠窗位置', photo: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=800&h=600&fit=crop', itemCount: 8, createdAt: '2026-04-16' },
  { id: '3', name: '卧室衣柜', code: 'C-20260427-003', location: '主卧室左侧墙面', photo: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop', itemCount: 25, createdAt: '2026-04-17' },
  { id: '4', name: '厨房橱柜', code: 'C-20260427-004', location: '厨房灶台下方', photo: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop', itemCount: 18, createdAt: '2026-04-18' },
  { id: '5', name: '玄关鞋柜', code: 'C-20260427-005', location: '入户门左侧', photo: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop', itemCount: 6, createdAt: '2026-04-19' },
  { id: '6', name: '阳台收纳柜', code: 'C-20260427-006', location: '阳台洗衣机旁', photo: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800&h=600&fit=crop', itemCount: 4, createdAt: '2026-04-20' },
  { id: '7', name: '儿童房书柜', code: 'C-20260427-007', location: '儿童房学习区', photo: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop', itemCount: 15, createdAt: '2026-04-21' },
  { id: '8', name: '杂物间置物架', code: 'C-20260427-008', location: '杂物间进门处', photo: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop', itemCount: 3, createdAt: '2026-04-22' },
  { id: '9', name: '卫生间镜柜', code: 'C-20260427-009', location: '洗手台上方', photo: 'https://images.unsplash.com/photo-1620626012053-10165ddf6f7a?w=800&h=600&fit=crop', itemCount: 9, createdAt: '2026-04-23' },
  { id: '10', name: '餐厅酒柜', code: 'C-20260427-010', location: '餐厅靠墙位置', photo: 'https://images.unsplash.com/photo-1583847661884-38e125a6158f?w=800&h=600&fit=crop', itemCount: 7, createdAt: '2026-04-24' },
]

const mockItems: Item[] = [
  { id: '101', name: '陶瓷花瓶', photo: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=200&h=200&fit=crop', cabinetId: '1' },
  { id: '102', name: '相框组合', photo: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=200&h=200&fit=crop', cabinetId: '1' },
  { id: '103', name: '装饰灯', photo: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=200&h=200&fit=crop', cabinetId: '1' },
  { id: '104', name: '书籍套装', photo: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=200&fit=crop', cabinetId: '2' },
  { id: '105', name: '文具收纳盒', photo: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&h=200&fit=crop', cabinetId: '2' },
  { id: '106', name: '衬衫', photo: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=200&fit=crop', cabinetId: '3' },
  { id: '107', name: '外套', photo: 'https://images.unsplash.com/photo-1551488852-0801751ac367?w=200&h=200&fit=crop', cabinetId: '3' },
  { id: '108', name: '锅具套装', photo: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop', cabinetId: '4' },
  { id: '109', name: '餐盘', photo: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200&h=200&fit=crop', cabinetId: '4' },
  { id: '110', name: '运动鞋', photo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop', cabinetId: '5' },
]

const cabinetId = computed(() => route.params.id as string)

const cabinet = computed<Cabinet | undefined>(() =>
  mockCabinets.find(c => c.id === cabinetId.value)
)

const items = computed<Item[]>(() =>
  mockItems.filter(i => i.cabinetId === cabinetId.value)
)

function goBack() {
  router.push('/cabinets')
}

function goEdit() {
  router.push(`/cabinets/form/${cabinetId.value}`)
}

function goAddItem() {
  router.push(`/items/form?cabinetId=${cabinetId.value}`)
}

function goItemDetail(itemId: string) {
  router.push(`/items/${itemId}`)
}

async function copyCode(code: string) {
  try {
    await navigator.clipboard.writeText(code)
    toast({ title: '复制成功', description: '编号已复制到剪贴板' })
  } catch {
    toast({ title: '复制失败', description: '请手动复制', variant: 'destructive' })
  }
}

function onDelete() {
  deleteDialogOpen.value = true
}

function confirmDelete() {
  deleteDialogOpen.value = false
  toast({ title: '删除成功', description: '柜子已删除' })
  router.push('/cabinets')
}
</script>

<template>
  <div class="h-full overflow-auto p-6">
    <!-- 返回按钮 -->
    <Button variant="ghost" class="gap-2 mb-4 -ml-2" @click="goBack">
      <ArrowLeft class="h-4 w-4" />
      返回列表
    </Button>

    <div v-if="cabinet" class="space-y-6">
      <!-- 照片展示大图区 -->
      <div class="relative">
        <img
          :src="cabinet.photo"
          :alt="cabinet.name"
          class="w-full h-64 object-cover rounded-xl"
        />
        <p class="mt-2 text-xs text-center text-muted-foreground">点击放大预览</p>
      </div>

      <!-- 基本信息 -->
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-muted-foreground mb-1">名称</p>
              <p class="text-sm font-medium">{{ cabinet.name }}</p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground mb-1">编号</p>
              <p class="copyable-text text-sm font-medium" @click="copyCode(cabinet.code)">
                {{ cabinet.code }}
                <Copy class="h-3.5 w-3.5" />
              </p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground mb-1">位置描述</p>
              <p class="text-sm font-medium">{{ cabinet.location }}</p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground mb-1">创建时间</p>
              <p class="text-sm font-medium">{{ cabinet.createdAt }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 柜内物品区 -->
      <div>
        <h2 class="text-lg font-semibold mb-4">柜内物品 ({{ items.length }}件)</h2>
        <div v-if="items.length > 0" class="photo-grid">
          <div
            v-for="item in items"
            :key="item.id"
            class="photo-thumb cursor-pointer"
            @click="goItemDetail(item.id)"
          >
            <img :src="item.photo" :alt="item.name" />
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
              <p class="text-xs text-white truncate">{{ item.name }}</p>
            </div>
          </div>
        </div>
        <Empty v-else title="暂无物品" description="这个柜子里还没有物品">
          <template #icon>
            <Package class="h-12 w-12" />
          </template>
          <template #default>
            <Button variant="default" class="gap-2 mt-4" @click="goAddItem">
              <Plus class="h-4 w-4" />
              添加物品
            </Button>
          </template>
        </Empty>
      </div>

      <!-- 操作按钮组 -->
      <div class="flex flex-wrap gap-3 pt-4">
        <Button variant="outline" class="gap-2" @click="goEdit">
          <Edit class="h-4 w-4" />
          编辑
        </Button>
        <Button variant="destructive" class="gap-2" @click="onDelete">
          <Trash2 class="h-4 w-4" />
          删除
        </Button>
        <Button variant="default" class="gap-2" @click="goAddItem">
          <Plus class="h-4 w-4" />
          添加物品
        </Button>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <Dialog v-model:open="deleteDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认删除</DialogTitle>
        </DialogHeader>
        <p class="text-sm text-muted-foreground">确定要删除柜子「{{ cabinet?.name }}」吗？此操作不可恢复。</p>
        <DialogFooter>
          <Button variant="outline" @click="deleteDialogOpen = false">取消</Button>
          <Button variant="destructive" @click="confirmDelete">确认删除</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
