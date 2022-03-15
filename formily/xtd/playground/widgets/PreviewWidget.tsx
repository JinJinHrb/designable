import React, { useMemo } from 'react'
import { createForm } from '@formily/core'
import { createSchemaField } from '@formily/react'
import {
  Editable,
  NumberPicker,
  Password,
  PreviewText,
  Reset,
  Submit,
  TimePicker,
  Transfer,
  TreeSelect,
} from '@formily/antd'
import {
  ArrayTable,
  ArrayCards,
  Form,
  FormItem,
  FormGrid,
  FormLayout,
  FormTab,
  FormCollapse,
  Cascader,
  Checkbox,
  DatePicker,
  Input,
  Radio,
  Select,
  Space,
  Switch,
  Upload,
  XtCustomSelect,
  XtSelectInput,
} from '@formily/xtd'
// import XtCustomSelect from 'xt-design/es/FormilyCustomSelect'
import { Card } from 'xt-design/es/Card'
import Slider from 'antd/es/slider'
import Rate from 'antd/es/rate'
import { TreeNode } from '@designable/core'
import { transformToSchema } from '@designable/formily-transformer'

const Text: React.FC<{
  value?: string
  content?: string
  mode?: 'normal' | 'h1' | 'h2' | 'h3' | 'p'
}> = ({ value, mode, content, ...props }) => {
  const tagName = mode === 'normal' || !mode ? 'div' : mode
  return React.createElement(tagName, props, value || content)
}

const SchemaField = createSchemaField({
  components: {
    Space,
    FormGrid,
    FormLayout,
    FormTab,
    FormCollapse,
    ArrayTable,
    ArrayCards,
    FormItem,
    DatePicker,
    Checkbox,
    Cascader,
    Editable,
    Input,
    Text,
    NumberPicker,
    Switch,
    Password,
    PreviewText,
    Radio,
    Reset,
    Select,
    Submit,
    TimePicker,
    Transfer,
    TreeSelect,
    Upload,
    Card,
    Slider,
    Rate,
    XtCustomSelect,
    XtSelectInput,
  },
})

export interface IPreviewWidgetProps {
  tree: TreeNode
}

export const PreviewWidget: React.FC<IPreviewWidgetProps> = (props) => {
  const form = useMemo(() => createForm(), [])
  const { form: formProps, schema } = transformToSchema(props.tree)
  return (
    <Form {...formProps} form={form}>
      <SchemaField schema={schema} />
    </Form>
  )
}
