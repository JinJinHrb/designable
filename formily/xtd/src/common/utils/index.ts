import { formatTime, FormatType } from './dates'
import _ from 'lodash'
// import { DVA_LOGGER } from '@/utils/constants';
const DVA_LOGGER = 'dvaLogger'
export const DEVELOPMENT = 'development'

// console.log('@@@UMI_ENV', process.env);

/**
 * menu Highlight key
 * @param pathname string
 */
export const queryKeysByPath = (
  pathname: string
): { openKey: string; selectKey: string } => {
  const reg = /(^\/*)|(\/*$)/g // 匹配字符串首尾斜杠
  const path = pathname.replace(reg, '')
  const routes = path.split('/')
  return { openKey: routes[0], selectKey: routes[1] || routes[0] }
}

/**
 * 本地打印自动带上时间戳
 * @returns
 */
export const umiConsole =
  process.env.NODE_ENV === DEVELOPMENT
    ? (function (this: any) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const ctx = this
        const getFn = function (op: string) {
          return function (...args: any[]) {
            /* args = args.map((el) => {
              if (Iterable.isIterable(el)) {
                return el.toJS();
              } else if (_.isObjectLike(el)) {
                const elCopy = {};
                Object.keys(el).forEach((k) => {
                  const val = el[k];
                  if (Iterable.isIterable(val)) {
                    elCopy[`${k}.toJS()`] = val.toJS();
                  } else {
                    elCopy[k] = val;
                  }
                });
                return elCopy;
              }
              return el;
            }); */
            const dateStr = formatTime(new Date(), FormatType.Y4M2D2_H2m2s2S3)
            args.unshift(dateStr)
            if (_.get(args, 1) === DVA_LOGGER) {
              const argSubArr1 = args.slice(0, 4)
              const argSubArr2 = args.slice(4)
              argSubArr1.splice(3, 1, `%c${argSubArr1[3]}`)
              argSubArr1.splice(2, 1, `%c${argSubArr1[2]}`)
              argSubArr1.splice(1, 1, `%c${argSubArr1[1]}`)
              args = [argSubArr1.join(' ')]
              args.push('color: grey')
              args.push('color: darkBlue')
              args.push('color: darkGreen')
              args.push(...argSubArr2)
            }
            ;(console as any)[op].apply(ctx, args)
          }
        }
        const rtn = {} as typeof console
        Object.keys(console)
          .filter((k) => {
            const v = _.get(console, k)
            return _.isFunction(v)
          })
          .forEach((op) => {
            ;(rtn as any)[op] = getFn(op)
          })
        return rtn
      })()
    : (function () {
        const nilFn = () => {}
        const rtn = {} as typeof console
        Object.keys(console)
          .filter((k) => {
            const v = _.get(console, k)
            return _.isFunction(v)
          })
          .forEach((op) => {
            if (['log', 'warn'].includes(op)) {
              ;(rtn as any)[op] = nilFn
            } else {
              ;(rtn as any)[op] = (console as any)[op]
            }
          })
        return rtn
      })()

export const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
export const differenceWithObject = (object: any, base: any) => {
  // const objectToJS = Iterable.isIterable(object) ? (object as any).toJS() : object
  // const baseToJs = Iterable.isIterable(base) ? (base as any).toJS() : base
  function changes(obj: any, bs: any) {
    return _.transform(obj, function (result: any, value, key) {
      if (!_.isEqual(value, bs[key])) {
        result[key] =
          _.isObject(value) && _.isObject(bs[key])
            ? changes(value, bs[key])
            : value
      }
    })
  }
  // return changes(objectToJS, baseToJs)
  return changes(object, base)
}

/**
 * 比较不同
 * @param prevObj
 * @param nextObj
 * @param deepComparePropsKeys
 * 若是 undefined，全部浅比较
 * 若是数组且为空，全部深比较
 * 若是数组且不为空，只有数组内的 key 需要深比较
 * @returns
 */
export const getMutatedKeys = (
  prevObj: object = {},
  nextObj: object = {},
  deepComparePropsKeys?: string[]
): any[] => {
  const keys = _.merge(
    [],
    Object.keys(prevObj || {}),
    Object.keys(nextObj || {})
  )
  const diffKeys = keys
    .filter((k) => prevObj[k] !== _.get(nextObj, k))
    .map((k) => {
      const prevVal = _.get(prevObj, k)
      const thisVal = _.get(nextObj, k)
      const typeofVal = typeof (prevVal || thisVal)
      let isEqual: boolean
      if (_.isNil(deepComparePropsKeys)) {
        isEqual = false
      } else if (
        !_.isEmpty(deepComparePropsKeys) &&
        !_.includes(deepComparePropsKeys, k)
      ) {
        isEqual = false
      } else {
        isEqual = _.isEqual(prevVal, thisVal)
      }
      if (isEqual) {
        // 值比较不相等说明不需要更新
        return undefined
      }
      const subArr = ['typeofVal:', typeofVal, 'isEqual:', isEqual]
      if (process.env.NODE_ENV === DEVELOPMENT) {
        if (!isEqual) {
          if (_.isObjectLike(thisVal) && _.isObjectLike(prevVal)) {
            const difference = differenceWithObject(thisVal, prevVal)
            subArr.push('difference:', difference)
          }
        }
      }
      return {
        [k]: subArr,
      }
    })
    .filter((a) => a)
  return diffKeys
}
