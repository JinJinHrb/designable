import React, { Fragment, useState } from 'react'
import { observer } from '@formily/react'
import { Collapse } from 'antd'
import { CollapseProps, CollapsePanelProps } from 'antd/lib/collapse'
import { TreeNode, createBehavior, createResource } from '@designable/core'
import {
  useTreeNode,
  useNodeIdProps,
  DroppableWidget,
  TreeNodeWidget,
  DnFC,
} from '@designable/react'
import { toArr } from '@formily/shared'
import { LoadTemplate } from '../../common/LoadTemplate'
import { useDropTemplate } from '../../hooks'
import { createVoidFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'
import { matchComponent } from '../../shared'
import { umiConsole } from '../../common/utils'
import _ from 'lodash'

const parseCollapse = (parent: TreeNode) => {
  const tabs: TreeNode[] = []
  parent.children.forEach((node) => {
    if (matchComponent(node, 'FormCollapse.CollapsePanel')) {
      tabs.push(node)
    }
  })
  return tabs
}

// let _oldProps

export const FormCollapse: DnFC<CollapseProps> & {
  CollapsePanel?: React.FC<CollapsePanelProps>
} = observer((props) => {
  const [activeKey, setActiveKey] = useState<string | string[]>([])

  /* if(process.env.NODE_ENV === DEVELOPMENT){
    if (_oldProps) {
        const diffKeys = getMutatedKeys(_oldProps, props)
        umiConsole.log('FormCollapse #41 diffKeys:', diffKeys)
      }
      _oldProps = _.clone(props)
  } */

  const node = useTreeNode()
  const nodeId = useNodeIdProps()
  const designer = useDropTemplate('FormCollapse', (source) => {
    const panelNode = new TreeNode({
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'FormCollapse.CollapsePanel',
        'x-component-props': {
          header: `Unnamed Title`,
        },
      },
      children: source,
    })

    const newActiveKey = toArr(activeKey).concat(panelNode.id)
    umiConsole.log('FormCollapse #64 newActiveKey:', newActiveKey)
    setActiveKey(newActiveKey)
    return [panelNode]
  })
  const getCorrectActiveKey = (
    activeKey: string[] | string,
    tabs: TreeNode[]
  ) => {
    if (!tabs.length || !activeKey?.length) {
      if (props.accordion) {
        return tabs[0]?.id
      }
      return tabs.map((item) => item.id)
    }
    if (
      tabs.some((node) =>
        Array.isArray(activeKey)
          ? activeKey.includes(node.id)
          : node.id === activeKey
      )
    ) {
      umiConsole.log('getCorrectActiveKey #85, activeKey1', activeKey)
      return activeKey
    }
    umiConsole.log(
      'getCorrectActiveKey #89, activeKey2',
      tabs[tabs.length - 1].id
    )
    return tabs[tabs.length - 1].id
  }
  const panels = parseCollapse(node)
  umiConsole.log('FormCollapse #89, panels:', panels)
  const renderCollapse = () => {
    umiConsole.log(
      'renderCollapse #97 designer.props.nodeIdAttrName:',
      designer.props?.nodeIdAttrName,
      'node.children.length:',
      node.children?.length
    )
    if (!node.children?.length) return <DroppableWidget />
    return (
      <Collapse {...props} activeKey={getCorrectActiveKey(activeKey, panels)}>
        {panels.map((panel) => {
          const props = panel.props['x-component-props'] || {}
          return (
            <Collapse.Panel
              {...props}
              style={{ ...props.style }}
              header={
                <span
                  data-content-editable="x-component-props.header"
                  data-content-editable-node-id={panel.id}
                >
                  {props.header}
                </span>
              }
              key={panel.id}
            >
              {React.createElement(
                'div',
                {
                  [designer.props.nodeIdAttrName]: panel.id,
                  style: {
                    padding: '20px 0',
                  },
                },
                panel.children.length ? (
                  <TreeNodeWidget node={panel} />
                ) : (
                  <DroppableWidget />
                )
              )}
            </Collapse.Panel>
          )
        })}
      </Collapse>
    )
  }
  return (
    <div {...nodeId}>
      {renderCollapse()}
      <LoadTemplate
        actions={[
          {
            title: node.getMessage('addCollapsePanel'),
            icon: 'AddPanel',
            onClick: () => {
              const tabPane = new TreeNode({
                componentName: 'Field',
                props: {
                  type: 'void',
                  'x-component': 'FormCollapse.CollapsePanel',
                  'x-component-props': {
                    header: `Unnamed Title`,
                  },
                },
              })
              node.append(tabPane)
              const keys = toArr(activeKey)
              setActiveKey(keys.concat(tabPane.id))
            },
          },
        ]}
      />
    </div>
  )
})

FormCollapse.CollapsePanel = (props) => {
  return <Fragment>{props.children}</Fragment>
}

FormCollapse.Behavior = createBehavior(
  {
    name: 'FormCollapse',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'FormCollapse',
    designerProps: {
      droppable: true,
      allowAppend: (target, source) => {
        const bool =
          target.children.length === 0 ||
          source.every(
            (node) => node.props['x-component'] === 'FormCollapse.CollapsePanel'
          )
        umiConsole.log(
          'FormCollapse allowAppend #189 target.children.length:',
          target.children.length
        )
        umiConsole.log(
          'FormCollapse allowAppend #190 source.map.props["x-component"]:',
          source.map((node) => node.props['x-component'])
        )
        umiConsole.log('FormCollapse allowAppend #191 bool:', bool)
        return bool
      },
      propsSchema: createVoidFieldSchema(AllSchemas.FormCollapse),
    },
    designerLocales: AllLocales.FormCollapse,
  },
  {
    name: 'FormCollapse.CollapsePanel',
    extends: ['Field'],
    selector: (node) =>
      node.props['x-component'] === 'FormCollapse.CollapsePanel',
    designerProps: {
      droppable: true,
      allowDrop: (node) => node.props['x-component'] === 'FormCollapse',
      propsSchema: createVoidFieldSchema(AllSchemas.FormCollapse.CollapsePanel),
    },
    designerLocales: AllLocales.FormCollapsePanel,
  }
)

FormCollapse.Resource = createResource({
  icon: 'CollapseSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'FormCollapse',
      },
    },
  ],
})
