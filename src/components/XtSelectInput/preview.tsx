import React from 'react'
import { XtSelectInput as SelectInput } from '@formily/xtd'
import { createBehavior, createResource } from '@designable/core'
import { DnFC } from '@designable/react'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export const XtSelectInput: DnFC<React.ComponentProps<typeof SelectInput>> =
  SelectInput

XtSelectInput.Behavior = createBehavior({
  name: 'XtSelectInput',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'XtSelectInput',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.XtSelectInput),
  },
  designerLocales: AllLocales.XtSelectInput,
})

XtSelectInput.Resource = createResource({
  icon: 'XtSelectInputSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        title: 'XtSelectInput',
        'x-decorator': 'FormItem',
        'x-component': 'XtSelectInput',
      },
    },
  ],
})
