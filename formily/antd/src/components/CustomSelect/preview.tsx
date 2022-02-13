import React from 'react'
import XtCustomSelect from '../xt/CustomSelect'
import { createBehavior, createResource } from '@designable/core'
import { DnFC } from '@designable/react'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export const CustomSelect: DnFC<React.ComponentProps<typeof XtCustomSelect>> =
  XtCustomSelect

CustomSelect.Behavior = createBehavior({
  name: 'CustomSelect',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'CustomSelect',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.CustomSelect),
  },
  designerLocales: AllLocales.CustomSelect,
})

CustomSelect.Resource = createResource({
  icon: 'CustomSelectSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        title: 'CustomSelect',
        'x-decorator': 'FormItem',
        'x-component': 'CustomSelect',
      },
    },
  ],
})
