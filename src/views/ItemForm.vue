<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Save, Trash2 } from 'lucide-vue-next'
import { Button, Card, CardContent, Input, Label, Textarea, Upload, Select, SelectOption, useToast } from '@/components/ui'

interface Cabinet {
  id: string
  name: string
  code: string
}

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

const route = useRoute()
const router = useRouter()
const { toast } = useToast()

const isEdit = computed(() => !!route.params.id)
const itemId = computed(() => route.params.id as string | undefined)

const category = ref('')
const name = ref('')
const brand = ref('')
const code = ref('')
const photos = ref<string[]>([])
const cabinetId = ref('')
const remark = ref('')
const loading = ref(false)

const errors = ref<Record<string, string>>({})

const categories = ['电子产品', '厨具', '书籍', '衣物', '药品', '其他']

const mockCabinets: Cabinet[] = [
  { id: '1', name: '客厅展示柜', code: 'C-20260427-001' },
  { id: '2', name: '书房储物柜', code: 'C-20260427-002' },
  { id: '3', name: '卧室衣柜', code: 'C-20260427-003' },
  { id: '4', name: '厨房橱柜', code: 'C-20260427-004' },
  { id: '5', name: '玄关鞋柜', code: 'C-20260427-005' },
  { id: '6', name: '阳台收纳柜', code: 'C-20260427-006' },
  { id: '7', name: '儿童房书柜', code: 'C-20260427-007' },
  { id: '8', name: '杂物间置物架', code: 'C-20260427-008' },
  { id: '9', name: '卫生间镜柜', code: 'C-20260427-009' },
  { id: '10', name: '餐厅酒柜', code: 'C-20260427-010' },
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

const prefillCabinetId = computed(() => route.query.cabinetId as string | undefined)

function generateCode(): string {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  const prefix = `I-${yyyy}${mm}${dd}-`
  const existing = mockItems.filter(i => i.code.startsWith(prefix))
  const seq = String(existing.length + 1).padStart(3, '0')
  return `${prefix}${seq}`
}

function validateCode(): boolean {
  const c = code.value.trim()
  if (!c) {
    errors.value.code = '请输入物品编号'
    return false
  }
  const exists = mockItems.some(it => it.code === c && it.id !== itemId.value)
  if (exists) {
    errors.value.code = '该编号已存在，请更换'
    return false
  }
  errors.value.code = ''
  return true
}

function handleCodeBlur() {
  validateCode()
}

function validateForm(): boolean {
  errors.value = {}
  let valid = true

  if (!category.value) {
    errors.value.category = '请选择物品类别'
    valid = false
  }
  if (!name.value.trim()) {
    errors.value.name = '请输入物品名称'
    valid = false
  }
  if (!code.value.trim()) {
    errors.value.code = '请输入物品编号'
    valid = false
  } else if (!validateCode()) {
    valid = false
  }
  if (photos.value.length === 0) {
    errors.value.photos = '请至少上传1张照片'
    valid = false
  }
  if (!cabinetId.value) {
    errors.value.cabinet = '请选择所属柜子'
    valid = false
  }

  return valid
}

function handleUploadChange(files: File[]) {
  if (photos.value.length + files.length > 5) {
    toast({ title: '照片数量超限', description: '最多只能上传5张照片', variant: 'destructive' })
    return
  }
  files.forEach(file => {
    photos.value.push(URL.createObjectURL(file))
  })
  errors.value.photos = ''
}

function handleRemovePhoto(index: number) {
  photos.value.splice(index, 1)
}

function handleSubmit() {
  if (!validateForm()) {
    toast({ title: '表单校验失败', description: '请检查并完善必填项', variant: 'destructive' })
    return
  }

  loading.value = true
  setTimeout(() => {
    loading.value = false
    toast({ title: isEdit.value ? '编辑成功' : '新增成功', description: `物品「${name.value}」已保存` })
    if (isEdit.value) {
      router.push('/items')
    } else {
      const newId = String(Math.max(...mockItems.map(i => Number(i.id))) + 1)
      router.push(`/items/${newId}`)
    }
  }, 500)
}

function goBack() {
  router.back()
}

onMounted(() => {
  if (isEdit.value && itemId.value) {
    const data = mockItems.find(i => i.id === itemId.value)
    if (data) {
      category.value = data.category
      name.value = data.name
      brand.value = data.brand
      code.value = data.code
      photos.value = [...data.photos]
      cabinetId.value = data.cabinetId
      remark.value = data.remark
    }
  } else {
    code.value = generateCode()
    if (prefillCabinetId.value) {
      cabinetId.value = prefillCabinetId.value
    }
  }
})
</script>

<template>
  <div class="h-full overflow-auto p-6">
    <!-- 返回按钮 -->
    <Button variant="ghost" class="gap-2 mb-4 -ml-2" @click="goBack">
      <ArrowLeft class="h-4 w-4" />
      返回
    </Button>

    <!-- 动态标题 -->
    <h1 class="text-xl font-semibold mb-6">{{ isEdit ? '编辑物品' : '新增物品' }}</h1>

    <Card class="max-w-3xl">
      <CardContent class="space-y-4">
        <!-- 物品类别 -->
        <div class="space-y-2">
          <Label>物品类别 <span class="text-destructive">*</span></Label>
          <Select v-model="category" placeholder="请选择类别">
            <SelectOption v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</SelectOption>
          </Select>
          <p v-if="errors.category" class="text-xs text-destructive">{{ errors.category }}</p>
        </div>

        <!-- 物品名称 -->
        <div class="space-y-2">
          <Label htmlFor="itemName">物品名称 <span class="text-destructive">*</span></Label>
          <Input
            id="itemName"
            v-model="name"
            placeholder="请输入物品名称"
            maxlength="100"
          />
          <p v-if="errors.name" class="text-xs text-destructive">{{ errors.name }}</p>
        </div>

        <!-- 品牌 -->
        <div class="space-y-2">
          <Label htmlFor="brand">品牌</Label>
          <Input
            id="brand"
            v-model="brand"
            placeholder="如：小米/美的/无品牌"
            maxlength="100"
          />
        </div>

        <!-- 物品编号 -->
        <div class="space-y-2">
          <Label htmlFor="code">物品编号 <span class="text-destructive">*</span></Label>
          <Input
            id="code"
            v-model="code"
            placeholder="自动生成编号"
            @blur="handleCodeBlur"
          />
          <p v-if="errors.code" class="text-xs text-destructive">{{ errors.code }}</p>
        </div>

        <!-- 照片上传 -->
        <div class="space-y-2">
          <Label>
            照片上传
            <span class="text-destructive">*</span>
            <span class="text-xs text-muted-foreground font-normal">（至少1张，最多5张）</span>
          </Label>
          <Upload
            accept="image/*"
            :multiple="true"
            :maxCount="5"
            :showFileList="false"
            hint="请上传物品照片，支持JPG/PNG格式"
            @fileChange="handleUploadChange"
          />
          <!-- 已上传照片预览 -->
          <div v-if="photos.length > 0" class="flex flex-wrap gap-2 mt-2">
            <div
              v-for="(photo, index) in photos"
              :key="index"
              class="relative h-20 w-20 rounded-lg border border-border overflow-hidden group"
            >
              <img :src="photo" alt="预览" class="h-full w-full object-cover" />
              <button
                type="button"
                class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                @click="handleRemovePhoto(index)"
              >
                <Trash2 class="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
          <p v-if="errors.photos" class="text-xs text-destructive">{{ errors.photos }}</p>
        </div>

        <!-- 所属柜子 -->
        <div class="space-y-2">
          <Label>所属柜子 <span class="text-destructive">*</span></Label>
          <Select v-model="cabinetId" placeholder="请选择柜子">
            <SelectOption
              v-for="cab in mockCabinets"
              :key="cab.id"
              :value="cab.id"
            >
              {{ cab.name }}（{{ cab.code }}）
            </SelectOption>
          </Select>
          <p v-if="errors.cabinet" class="text-xs text-destructive">{{ errors.cabinet }}</p>
        </div>

        <!-- 备注 -->
        <div class="space-y-2">
          <Label htmlFor="remark">备注</Label>
          <Textarea
            id="remark"
            v-model="remark"
            placeholder="如：购买日期、保修期、颜色等"
            rows="3"
            maxlength="500"
          />
        </div>
      </CardContent>
    </Card>

    <!-- 底部操作区 -->
    <div class="flex justify-end gap-3 mt-6 max-w-3xl">
      <Button variant="outline" @click="goBack">取消</Button>
      <Button type="submit" :disabled="loading" class="gap-2" @click="handleSubmit">
        <Save class="h-4 w-4" />
        {{ loading ? '保存中...' : '保存' }}
      </Button>
    </div>
  </div>
</template>
