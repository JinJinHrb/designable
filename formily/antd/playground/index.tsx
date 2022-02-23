/* eslint-disable no-console */
import '../public-path'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './main'

function render(props) {
  const { container } = props
  ReactDOM.render(
    <App />,
    container
      ? container.querySelector('#designRoot')
      : document.querySelector('#designRoot')
  )
}

if (!(window as any).__POWERED_BY_QIANKUN__) {
  render({})
}

export async function bootstrap() {
  console.log('[react16] react app bootstraped')
}

export async function mount(props) {
  console.log('[react16] props from main framework', props)
  render(props)
}

export async function unmount(props) {
  const { container } = props
  ReactDOM.unmountComponentAtNode(
    container
      ? container.querySelector('#designRoot')
      : document.querySelector('#designRoot')
  )
}
