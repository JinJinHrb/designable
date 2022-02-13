/** @format */

import moment, { Moment } from 'moment'
import _ from 'lodash'

export enum FormatType {
  Y4M2D2 = 'YYYY-MM-DD',
  Y4M2D2_H2 = 'YYYY-MM-DD HH',
  Y4M2D2_H2m2 = 'YYYY-MM-DD HH:mm',
  Y4M2D2_H2m2s2 = 'YYYY-MM-DD HH:mm:ss',
  Y4M2D2_H2m2s2S3 = 'YYYY-MM-DD HH:mm:ss.SSS',
  Y4M2D2_h2 = 'YYYY-MM-DD hh',
  Y4M2D2_h2m2 = 'YYYY-MM-DD hh:mm',
  Y4M2D2_h2m2s2 = 'YYYY-MM-DD hh:mm:ss',
  Y4M2D2_h2m2s2S3 = 'YYYY-MM-DD hh:mm:ss.SSS',
}

type TFormatType = typeof FormatType[keyof typeof FormatType]

/**
 *
 * @param date @type string | number | Date | Moment | undefined
 * @param formatedDate @type string | null
 */
export const formatTime = (
  date: string | number | Date | Moment | undefined,
  formatType: TFormatType,
  formatedDate?: string
) => {
  if (_.isNil(date)) {
    return formatedDate || moment().format(formatType)
  }
  return moment(date).format(formatType)
}
