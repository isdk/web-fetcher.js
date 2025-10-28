export type ExtractSchema = ExtractObjectSchema | ExtractArraySchema | ExtractValueSchema;

// 基础值提取
export interface ExtractValueSchema {
  type?: 'string' | 'number' | 'boolean' | 'html'; // 默认为 'string'
  selector?: string; // CSS 选择器
  attribute?: string; // 要提取的属性, 如 'href'
}

// 数组提取
export interface ExtractArraySchema {
  type: 'array';
  selector: string; // 选择器, 用于匹配列表中的每个项目
  items: ExtractSchema; // 对每个列表项递归应用此 schema
}

// 对象提取
export interface ExtractObjectSchema {
  type: 'object';
  selector?: string; // 根选择器 (可选)
  properties: {
    [key: string]: ExtractSchema; // 对象的每个属性
  };
}
