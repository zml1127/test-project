<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Save } from 'lucide-vue-next'
import { Button, Card, CardContent, Input, Label, Textarea, Upload, useToast } from '@/components/ui'

interface Cabinet {
  id: string
  name: string
  code: string
  location: string
  photo: string
  itemCount: number
  createdAt: string
}

const route = useRoute()
const router = useRouter()
const { toast } = useToast()

const isEdit = computed(() => !!route.params.id)
const cabinetId = computed(() => route.params.id as string | undefined)

const name = ref('')
const location = ref('')
const code = ref('')
const photoUrl = ref('')
const loading = ref(false)

const errors = ref<Record<string, string>>({})

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

function generateCode(): string {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  const prefix = `C-${yyyy}${mm}${dd}-`
  const existing = mockCabinets.filter(c => c.code.startsWith(prefix))
  const seq = String(existing.length + 1).padStart(3, '0')
  return `${prefix}${seq}`
}

function validateCode(): boolean {
  const c = code.value.trim()
  if (!c) {
    errors.value.code = '请输入柜子编号'
    return false
  }
  const exists = mockCabinets.some(cab => cab.code === c && cab.id !== cabinetId.value)
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

  if (!name.value.trim()) {
    errors.value.name = '请输入柜子名称'
    valid = false
  }
  if (!location.value.trim()) {
    errors.value.location = '请输入位置描述'
    valid = false
  }
  if (!code.value.trim()) {
    errors.value.code = '请输入柜子编号'
    valid = false
  } else if (!validateCode()) {
    valid = false
  }
  if (!photoUrl.value.trim()) {
    errors.value.photo = '请上传柜子照片'
    valid = false
  }

  return valid
}

function handleUploadChange(files: File[]) {
  if (files.length > 0) {
    photoUrl.value = URL.createObjectURL(files[0])
    errors.value.photo = ''
  }
}

function handleSubmit() {
  if (!validateForm()) {
    toast({ title: '表单校验失败', description: '请检查并完善必填项', variant: 'destructive' })
    return
  }

  loading.value = true
  setTimeout(() => {
    loading.value = false
    toast({ title: isEdit.value ? '编辑成功' : '新增成功', description: `柜子「${name.value}」已保存` })
    if (isEdit.value) {
      router.push('/cabinets')
    } else {
      const newId = String(mockCabinets.length + 1)
      router.push(`/cabinets/${newId}`)
    }
  }, 500)
}

function goBack() {
  router.back()
}

onMounted(() => {
  if (isEdit.value && cabinetId.value) {
    const data = mockCabinets.find(c => c.id === cabinetId.value)
    if (data) {
      name.value = data.name
      location.value = data.location
      code.value = data.code
      photoUrl.value = data.photo
    }
  } else {
    code.value = generateCode()
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
    <h1 class="text-xl font-semibold mb-6">{{ isEdit ? '编辑柜子' : '新增柜子' }}</h1>

    <Card class="max-w-3xl">
      <CardContent class="space-y-4">
        <!-- 柜子名称 -->
        <div class="space-y-2">
          <Label htmlFor="name">柜子名称 <span class="text-destructive">*</span></Label>
          <Input
            id="name"
            v-model="name"
            placeholder="请输入柜子名称"
            maxlength="100"
          />
          <p v-if="errors.name" class="text-xs text-destructive">{{ errors.name }}</p>
        </div>

        <!-- 位置描述 -->
        <div class="space-y-2">
          <Label htmlFor="location">位置描述 <span class="text-destructive">*</span></Label>
          <Textarea
            id="location"
            v-model="location"
            placeholder="请输入位置描述"
            rows="3"
            maxlength="255"
          />
          <p v-if="errors.location" class="text-xs text-destructive">{{ errors.location }}</p>
        </div>

        <!-- 柜子编号 -->
        <div class="space-y-2">
          <Label htmlFor="code">柜子编号 <span class="text-destructive">*</span></Label>
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
          <Label>照片上传 <span class="text-destructive">*</span></Label>
          <Upload
            accept="image/*"
            :multiple="false"
            :maxCount="1"
            hint="请上传柜子照片，支持JPG/PNG格式"
            @fileChange="handleUploadChange"
          />
          <div v-if="photoUrl" class="mt-2">
            <img :src="photoUrl" alt="预览" class="h-32 w-32 object-cover rounded-lg border border-border" />
          </div>
          <p v-if="errors.photo" class="text-xs text-destructive">{{ errors.photo }}</p>
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
