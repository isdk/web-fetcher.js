export type ExtractSchema =
  | ExtractObjectSchema
  | ExtractArraySchema
  | ExtractValueSchema

// 基础值提取
export interface ExtractValueSchema {
  type?: 'string' | 'number' | 'boolean' | 'html' // 默认为 'string'
  selector?: string // CSS 选择器
  attribute?: string // 要提取的属性, 如 'href'。如果指定,则提取属性值,否则提取文本内容(或 html,如果 type 为 'html')
  has?: string // 进一步筛选选定元素,仅包括那些包含与此 CSS 选择器匹配的后代的元素
  exclude?: string // 从选区中排除与此 CSS 选择器匹配的元素
}

// 数组提取
export interface ExtractArraySchema {
  type: 'array'
  selector: string // 选择器, 用于匹配列表中的每个项目
  has?: string // 进一步筛选选定元素,仅包括那些包含与此 CSS 选择器匹配的后代的元素
  exclude?: string // 从选区中排除与此 CSS 选择器匹配的元素
  items?: ExtractSchema // 对每个列表项递归应用此 schema. 如果省略,默认为提取文本.
  attribute?: string // 'items'的简写形式,用于提取属性. e.g. 'href'
  zip?:
    | boolean
    | {
        strict?: boolean // Default: true. If true, requires all fields to have the same number of matches.
        inference?: boolean // Default: false. If true, tries to infer item wrapper from fields.
      }
}

// 对象提取
export interface ExtractObjectSchema {
  type: 'object'
  selector?: string // 根选择器 (可选)
  has?: string // 进一步筛选选定元素,仅包括那些包含与此 CSS 选择器匹配的后代的元素
  exclude?: string // 从选区中排除与此 CSS 选择器匹配的元素
  properties: {
    [key: string]: ExtractSchema // 对象的每个属性
  }
}
