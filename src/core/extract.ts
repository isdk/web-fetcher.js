export type ExtractSchema =
  | ExtractObjectSchema
  | ExtractArraySchema
  | ExtractValueSchema

// 基础值提取
export interface ExtractValueSchema {
  type?: 'string' | 'number' | 'boolean' | 'html' // 默认为 'string'
  mode?: 'text' | 'innerText' // 提取模式: 'text' (textContent, 默认) 或 'innerText' (视觉文本, 处理换行)
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
  /**
   * Zip extraction strategy (Column Alignment Mode).
   *
   * Used when the page structure is "flat" (i.e., item properties are scattered under a common 
   * container rather than being nested within each item's own wrapper element).
   * It extracts fields defined in `items` in parallel and "sews" them into an array of 
   * objects based on their indices.
   *
   * @example
   * // Structure: <h3>Title1</h3><p>Desc1</p><h3>Title2</h3><p>Desc2</p>
   * // Using zip: true, items: { title: 'h3', desc: 'p' }
   * // Result: [{title: 'Title1', desc: 'Desc1'}, {title: 'Title2', desc: 'Desc2'}]
   */
  zip?:
    | boolean
    | {
        /**
         * Whether to enable strict mode.
         * Default is true. If true, requires all fields in `items` to have the exact 
         * same number of matches, otherwise throws an error.
         */
        strict?: boolean
        /**
         * Whether to enable heuristic inference.
         * Default is false. If true, when match counts differ, it tries to find a common 
         * parent node to infer the item wrapper container.
         */
        inference?: boolean
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
