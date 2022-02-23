/**
 *  eslint-disable react/display-name
 *
 * @format
 */
/* eslint-disable */

import React from 'react'
import ConfigProvider0 from 'antd/es/config-provider'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import { ConfigProvider as XTConfigProvider0 } from 'xt-design/es/ConfigProvider'

const ConfigProvider = ConfigProvider0 as any
const XTConfigProvider = XTConfigProvider0 as any

const getPopupContainer = (node: { parentNode: any }) => {
  const targets = document.querySelectorAll(`[data-qiankun="designable"]`)
  return targets?.[0] || document.body
}

export const XtProvider = ({ children }) => (
  <ConfigProvider locale={zhCN} getPopupContainer={getPopupContainer}>
    <XTConfigProvider getPopupContainer={getPopupContainer}>
      {children}
    </XTConfigProvider>
  </ConfigProvider>
)
