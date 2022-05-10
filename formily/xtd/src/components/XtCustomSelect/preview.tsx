import React from 'react'
import { XtCustomSelect as FormilyXtCustomSelect } from '@formily/xtd'
import { createBehavior, createResource } from '@designable/core'
import { DnFC } from '@designable/react'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export const XtCustomSelect: DnFC<
  React.ComponentProps<typeof FormilyXtCustomSelect>
> = FormilyXtCustomSelect

XtCustomSelect.Behavior = createBehavior({
  name: 'XtCustomSelect',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'XtCustomSelect',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.XtCustomSelect),
  },
  designerLocales: AllLocales.XtCustomSelect,
})

XtCustomSelect.Resource = createResource({
  icon: 'CustomSelectSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        title: 'XtCustomSelect',
        'x-decorator': 'FormItem',
        'x-component': 'XtCustomSelect',
      },
    },
  ],
})
