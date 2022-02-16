import React, { SyntheticEvent } from 'react'
import { Input as AntdInput, Select as AntdSelect } from 'antd'
import { LabeledValue } from 'antd/lib/select/index.d'
import _ from 'lodash'
import styles from './style.less'
// import { umiConsole } from '@/utils';

interface IProps {
  value: {
    selected: string
    entered: string
  }
  suffixIcon?: string
  onChange: (data: any) => void
  options: LabeledValue | LabeledValue[]
  loading?: boolean
  title?: string
  upperTitle?: string
  inputType?: string
  required?: boolean
}

interface IState {
  value: {
    selected: string
    entered: string
  }
  options: LabeledValue[]
}

class MyComponent extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      value: {
        selected: '',
        entered: '',
      },
      options: [],
    }
  }

  onChange(newData: IState) {
    const value = newData?.value
    // umiConsole.log('onChange #53 value:', value);
    if (value?.selected && value?.entered) {
      this.props?.onChange(value)
    } else {
      this.props?.onChange(undefined)
    }
  }

  onAntdSelectChange = (
    value: string /* option: LabeledValue | LabeledValue[] */
  ) => {
    // umiConsole.log('onAntdSelectChange #53 value:', value, 'option:', option);
    const newState = { ...this.state }
    newState.value = { ...this.state.value }
    newState.value.selected = value
    this.setState(newState, () => this.onChange(newState))
  }

  onAntdInputChange = (event: SyntheticEvent) => {
    const value = (event.target as any)?.value
    // umiConsole.log('onAntdInputChange #61 value:', value);
    const newState = { ...this.state }
    newState.value = { ...this.state.value }
    newState.value.entered = value
    this.setState(newState, () => this.onChange(newState))
  }

  static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
    const options = nextProps.options || []
    const polyfillOptions = _.isArray(options) ? options : [options]
    const nextState = {} as any
    if (!_.isEqual(polyfillOptions, prevState.options)) {
      nextState.options = polyfillOptions
    }
    const nextStateValue = {}
    const propsValue = nextProps.value || {}
    const stateValue = prevState.value || {}
    Object.keys(stateValue).forEach((k) => {
      const stateVal = (stateValue as any)?.[k]
      const propsVal = (propsValue as any)?.[k]
      if (stateVal && !propsVal) {
        ;(nextStateValue as any)[k] = stateVal
      } else if (propsVal && !stateVal) {
        if (stateVal === undefined) {
          ;(nextStateValue as any)[k] = propsVal
        } else {
          // 场景：全选 input 删除后，stateVal === ''
          ;(nextStateValue as any)[k] = stateVal
        }
      } else {
        ;(nextStateValue as any)[k] = propsVal
      }
    })
    if (!_.isEmpty(nextStateValue)) {
      nextState.value = nextStateValue
    }
    if (_.isEmpty(nextState)) {
      return null
    }
    // umiConsole.log('getDerivedStateFromProps #84 nextState:', nextState);
    return nextState
  }

  render() {
    const {
      suffixIcon,
      onChange,
      value: propsValue,
      options: propsState,
      loading,
      title,
      upperTitle,
      inputType,
      required,
      ...props
    } = this.props
    const { options, value } = this.state
    return (
      <div {...props}>
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
        <div className={styles.wrapper}>
          <div className={styles.selectClass}>
            <AntdSelect
              suffixIcon={suffixIcon}
              onChange={this.onAntdSelectChange}
              options={options}
              value={value.selected}
            />
          </div>
          <div className={styles.inputClass}>
            <AntdInput
              onChange={this.onAntdInputChange}
              value={value.entered}
              type={inputType}
            />
          </div>
        </div>
      </div>
    )
  }
}
export default MyComponent
