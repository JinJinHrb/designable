import React from 'react';
import { connect, mapProps, mapReadPretty } from '@formily/react';
// import { Input as AntdInput, Select as AntSelect } from 'antd';
// import { InputProps, TextAreaProps } from 'antd/lib/input';
import { PreviewText } from '../preview-text';
import { LoadingOutlined } from '@ant-design/icons';
import MyComponent from './MyComponent';
// import { umiConsole } from '@/utils';

// type ComposedInput = React.FC<InputProps> & {
//   TextArea?: React.FC<TextAreaProps>;
// };

export const SelectInput: React.FC<any> = connect(
  MyComponent,
  mapProps(
    {
      dataSource: 'options',
      loading: true,
      value: true,
      title: true,
    },
    (props: any, field: any) => {
      return {
        ...props,
        suffixIcon: field?.['loading'] || field?.['validating'] ? <LoadingOutlined /> : props.suffixIcon,
      };
    },
  ),
  mapReadPretty(PreviewText.Input),
);

// Input.TextArea = connect(AntdInput.TextArea /* , mapReadPretty(PreviewText.Input) */);

export default SelectInput;
