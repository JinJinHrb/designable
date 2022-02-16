import React, { ChangeEvent, EventHandler, SyntheticEvent } from 'react'
import {
  Input as AntdInput,
  Select as AntdSelect,
  Divider as AntdDivider,
  Button as AntdButton,
  Popover as AntdPopover,
  Tag as AntdTag,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { LabeledValue } from 'antd/lib/select/index.d'
import _ from 'lodash'
const { Option: AntdOption } = AntdSelect
// import styles from './style.less';
import './style.less'
import './inlineStyle.less'
import { FieldDataSource } from '@formily/core/esm/types'
import { CustomTagProps } from 'rc-select/lib/BaseSelect.d'
// import { umiConsole } from '@/utils';

const lessPrefix = 'customSelect'

const PREDEFINED_COLORS = [
  '#fa541c',
  '#fa8c16',
  '#fadb14',
  '#52c41a',
  '#2f54eb',
  '#eb2f96',
]

const DEFAULT_TEXT = {
  'zh-cn': {
    deleteText: '删除',
    addText: '添加',
    colorText: '颜色',
  },
  en: {
    deleteText: 'delete',
    addText: 'add',
    colorText: 'color',
  },
}

const DEFAULT_LANGUAGE = 'zh-cn' // 'en'; // 'zh-cn';

interface IProps {
  value: string[]
  suffixIcon?: string
  options: LabeledValue | LabeledValue[]
  loading?: boolean
  title?: string
  upperTitle?: string
  inputType?: string
  required?: boolean
  placeholder?: string
  locales: {
    deleteText?: string
    addText?: string
    colorText?: string
  }
  onChange: (data: any) => void
  setDataSource: (dataSource?: FieldDataSource) => void
}

interface IParsedValue {
  text: string
  color: string
}

interface IState {
  value: string[]
  options: LabeledValue[]
  name: string // 当前输入的文字
  open?: boolean // true - 保持下拉框打开
  color: string // 当前选中的文字
  popoverVisible: boolean // 气泡框是否打开
  initDone: boolean // 补丁：防止主动删除所有选项后又加载出老的选项
  locales: {
    deleteText: string
    addText: string
    colorText: string
  }
}

type TPartialState = Partial<IState>

class MyComponent extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      value: [],
      options: [],
      name: '',
      color: PREDEFINED_COLORS[0],
      popoverVisible: false,
      initDone: false,
      locales: _.merge(this.props.locales, DEFAULT_TEXT[DEFAULT_LANGUAGE]),
    }
    this.inputRef = React.createRef()
  }

  inputRef: React.RefObject<AntdInput>

  onChange(newData: TPartialState) {
    const value = newData?.value
    // umiConsole.log('onChange #53 value:', value);
    if (!_.isEmpty(value)) {
      this.props?.onChange(value)
    } else {
      //   this.props?.onChange(undefined);
      this.inputRef.current?.focus()
    }
  }

  onAntdSelectChange(value: string[], option: LabeledValue | LabeledValue[]) {
    // umiConsole.log('onAntdSelectChange #60 value:', value);
    const newState = {} as any
    newState.value = value
    this.setState(newState, () => this.onChange(newState))
  }

  /*  onAntdInputChange(event: SyntheticEvent) {
    const value = (event.target as any)?.value;
    // umiConsole.log('onAntdInputChange #61 value:', value);
    const newState = { ...this.state };
    newState.value = { ...this.state.value };
    newState.value.entered = value;
    this.setState(newState, () => this.onChange(newState));
  } */

  onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target?.value
    if (_.isNil(name)) {
      return
    }
    this.setState({
      name,
    })
  }

  static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
    const options = nextProps.options || []
    const polyfillOptions = _.isArray(options) ? options : [options]
    const nextState = {} as any
    // if (!_.isEqual(polyfillOptions, prevState.options)) {
    if (_.isEmpty(prevState.options)) {
      nextState.options = polyfillOptions
    }
    /* umiConsole.log(
      'xt/customedSelect/MyComponent/getDerivedStateFromProps #110',
      'prevState.options:',
      prevState.options,
      'nextState.options:',
      nextState.options,
    ); */
    const propsValue = nextProps.value || []
    const stateValue = prevState.value || []
    // umiConsole.log('xt/customedSelect/MyComponent/getDerivedStateFromProps #107 nextProps:', nextProps);
    // umiConsole.log('xt/customedSelect/MyComponent/getDerivedStateFromProps #108 prevState:', prevState);
    if (
      !prevState.initDone &&
      _.isEmpty(stateValue) &&
      !_.isEmpty(propsValue)
    ) {
      let arr = [] as string[]
      Object.entries(propsValue).forEach(([, value]) => {
        arr.push(value)
      })
      nextState.value = arr
      nextState.options = _.uniqWith(
        (nextState.options || prevState.options).concat(
          arr.map((value) => ({ value, label: value }))
        ),
        (a: LabeledValue, b: LabeledValue) => {
          let aObj = {} as IParsedValue
          let bObj = {} as IParsedValue
          try {
            aObj = JSON.parse(a.value as string)
            bObj = JSON.parse(b.value as string)
          } catch (e) {
            return false
          }
          return aObj.text === bObj.text
        }
      )
      if (!prevState.initDone) {
        nextState.initDone = true
      }
    }
    /* if (!prevState.initDone) {
      umiConsole.log('#220 nextProps.value:', nextProps.value);
    } */

    const newLocales = _.merge(nextProps.locales, prevState.locales)
    if (!_.isEqual(newLocales, prevState.locales)) {
      nextState.locales = newLocales
    }

    if (_.isEmpty(nextState)) {
      return null
    }
    // umiConsole.log('xt/customedSelect/MyComponent/getDerivedStateFromProps #114 nextState:', nextState);
    return nextState
  }

  addItem = () => {
    const { options } = this.state
    const color = this.state.color
    const name = _.trim(this.state.name)
    const trimmedName = _.trim(name)
    // umiConsole.log('addItem #127 trimmedName:', trimmedName);
    // if (!name) {
    //   return;
    // }
    // 有 label 或 value 重复的记录
    const duplicates = options.filter(
      (el) => /* el.label === trimmedName ||  */ {
        let parsedValue
        try {
          parsedValue = JSON.parse(el.value as string)
        } catch (e) {
          parsedValue = { text: el.value }
        }
        return parsedValue.text === trimmedName
      }
    )
    if (!_.isEmpty(duplicates)) {
      return
    }
    const newState = { name: '' } as any

    if (trimmedName) {
      const newOptions = [...options]
      const labelValue = JSON.stringify({ text: trimmedName, color })
      newOptions.push({
        label: labelValue,
        value: labelValue,
      })
      newState.options = newOptions
      this.props.setDataSource(newOptions)
    }
    this.setState(newState)
  }

  deleteHandler = (value: LabeledValue['value']) => {
    if (!value) {
      return
    }
    const options = (this.state?.options || []).filter((a) => a.value !== value)
    const stateValue = Object.values(this.state?.value || []).filter(
      (a) => a !== value
    )
    this.setState({ options, value: stateValue }, () =>
      this.onChange({ value: stateValue })
    )
  }

  /**
   * @param visible
   * true 保持上一级模态框打开状态
   */
  handleClickChange = (visible: boolean) => {
    // umiConsole.log('xt/customedSelect #160 visible:', visible);
    if (visible) {
      this.setState({ open: true, popoverVisible: true })
    } else {
      this.setState({ /* open: undefined, */ popoverVisible: false })
    }
  }

  /**
   * 选择颜色
   */
  pickColorHandler = (e: SyntheticEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()
    const target = e.target as any
    // umiConsole.log('pickColorHandler #167 target:', target);
    const color = target?.getAttribute('color')
    if (!color) {
      return
    }
    // umiConsole.log('pickColorHandler #180 color:', color);
    this.setState({ color, popoverVisible: false /* open: undefined */ })
  }

  content = (
    <div
      className={`${lessPrefix}-colorPalette`}
      onClick={this.pickColorHandler}
    >
      {PREDEFINED_COLORS.map((color) => (
        <div
          key={color}
          color={`${color}`}
          style={{ background: `${color}` }}
        ></div>
      ))}
    </div>
  )

  // 透明浮层 Start
  transparentLayerClickHandler = (e: SyntheticEvent<HTMLDivElement>) => {
    // umiConsole.log('#225');
    if (this.state.open) {
      this.setState({ open: undefined })
    }
  }

  transparentLayer = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: document.body.offsetWidth,
        height: document.body.offsetHeight,
        // border: '1px solid red',
      }}
      onMouseOver={this.transparentLayerClickHandler}
    >
      {/* 透明浮层 */}
    </div>
  )
  // 透明浮层 End

  tagRender = (props: CustomTagProps) => {
    const { label, value, closable, onClose } = props
    let parsedLabel = {}
    try {
      label && (parsedLabel = JSON.parse(label as string))
    } catch (e) {
      //   umiConsole.error(e, 'xt/customedSelect/.../tagRender #255 props:', props);
      parsedLabel = { color: 'black', text: label }
    }
    const { text, color } = parsedLabel as any
    return (
      <AntdTag color={color} closable={closable} onClose={onClose}>
        {text}
      </AntdTag>
    )
  }

  optionRender = (label: string) => {
    let parsedLabel = {}
    try {
      parsedLabel = JSON.parse(label)
    } catch (e) {
      parsedLabel = {
        text: label,
        color: 'white',
      }
    }
    const { text, color } = parsedLabel as { text: string; color: string }
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span>{text}</span>
        <span
          style={{
            backgroundColor: color,
            width: '15px',
            height: '15px',
            marginLeft: '10px',
          }}
        ></span>
      </div>
    )
  }

  render() {
    const {
      suffixIcon,
      value: propsValue,
      options: propsState,
      loading,
      title,
      upperTitle,
      inputType,
      required,
      placeholder,
      locales: propsLocales,
      onChange,
      setDataSource,
      ...props
    } = this.props
    const { options, value, name, open, color, popoverVisible, locales } =
      this.state
    // umiConsole.log('xt/customedSelect/.../render #303 name:', name, 'value:', value);
    return (
      <div {...props}>
        {this.state.open && this.transparentLayer}

        {upperTitle && !title && (
          <div style={{ width: '100%' }}>
            <div className="ant-formily-item-label ant-formily-item-item-col-5">
              <div className="ant-formily-item-label-content">
                <span className="ant-formily-item-asterisk">*</span>
                <label>{upperTitle}</label>
              </div>
              <span className="ant-formily-item-colon">:</span>
            </div>
          </div>
        )}
        <div className={`${lessPrefix}-wrapper`}>
          {/* <div className={`${lessPrefix}-selectClass`}>
            <AntdSelect
              suffixIcon={suffixIcon}
              onChange={this.onAntdSelectChange.bind(this)}
              options={options}
              value={value.selected}
            />
          </div>
          <div className={`${lessPrefix}-inputClass`}>
            <AntdInput onChange={this.onAntdInputChange.bind(this)} value={value.entered} type={inputType} />
          </div> */}
          <AntdSelect
            placeholder={placeholder}
            onChange={this.onAntdSelectChange.bind(this)}
            tagRender={this.tagRender}
            dropdownRender={(menu) => (
              <div className={'xt-dropdownWrapper'}>
                {menu}
                <AntdDivider className={`${lessPrefix}-dropdownDivider`} />
                <div className={`${lessPrefix}-dropdownExtension`}>
                  <AntdInput
                    className={`${lessPrefix}-inputItem`}
                    value={name}
                    onChange={this.onNameChange}
                    ref={this.inputRef}
                  />
                  <AntdPopover
                    placement="topRight"
                    title={locales.colorText}
                    content={this.content}
                    trigger="click"
                    zIndex={1051}
                    visible={popoverVisible}
                    onVisibleChange={this.handleClickChange}
                  >
                    <div className={`${lessPrefix}-colorPaletteButton`}>
                      <div
                        style={{
                          backgroundColor: color,
                          width: '15px',
                          height: '15px',
                        }}
                      >
                        &nbsp;
                      </div>
                    </div>
                  </AntdPopover>
                  <a
                    className={`${lessPrefix}-addItemButton`}
                    onClick={this.addItem}
                  >
                    <PlusOutlined /> {locales.addText}
                  </a>
                </div>
              </div>
            )}
            mode="multiple"
            optionLabelProp="label"
            open={open}
            value={value}
          >
            {options.map((item) => {
              const { value, label } = item
              //   return <AntdOption key={value}>{label}</AntdOption>;
              //   umiConsole.log('xt/customedSelect/MyComponent #367 item:', item);
              return (
                <AntdOption key={value} value={value}>
                  <div className={`${lessPrefix}-optionItem`}>
                    <span className={`${lessPrefix}-optionLabelItem`}>
                      {this.optionRender(label as string)}
                    </span>
                    <AntdButton
                      size={'small'}
                      onClick={(e) => {
                        const selectedValues =
                          Object.values(this.state?.value || []).filter(
                            (a) => a === value
                          ) || []
                        // umiConsole.log('xt/customedSelect #213 selectedValues:', selectedValues);
                        if (selectedValues.length < 1) {
                          e.stopPropagation()
                        }
                        this.deleteHandler(value)
                      }}
                    >
                      <span style={{ fontSize: '12px' }}>
                        {locales.deleteText}
                      </span>
                    </AntdButton>
                  </div>
                </AntdOption>
              )
            })}
          </AntdSelect>
        </div>
      </div>
    )
  }
}
export default MyComponent
