import { type ComponentData } from 'editor-components-sw'
import type { AllComponentProps } from './props'

export interface UpdateData {
  key: string | string[]
  id?: string
  value: string | string[]
  isRoot?: boolean
  isPage?: boolean
}

export interface HistoryData {
  id: string
  componentId: string
  type: 'delete' | 'add' | 'update'
  data: any
  //删除时记录数组位置方便插入
  index?: number
}
export interface EditorData {
  /**编辑器渲染数组 */
  components: ComponentData[]
  currentElement: string
  pageData: PageData
  copyComponent: ComponentData
  history: HistoryData[]
  historyIndex: number
  debounceOldData: any
  maxRecordLength: number
}

export interface PageData {
  title: string
  props: AllComponentProps
}

export interface UpdateHistoryData {
  key?: string | string[]
  preData?: string | string[]
  newData?: string | string[]
  id?: string
}

export interface EditWrapper {
  id: string
  active: boolean
  props: Record<string, any>
}
