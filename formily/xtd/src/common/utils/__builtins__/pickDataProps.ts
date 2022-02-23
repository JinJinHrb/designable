export const pickDataProps = (props: any = {}) => {
  const results: { [key: string]: string } = {}

  for (let key in props) {
    if (key.indexOf('data-') > -1) {
      results[key] = props[key]
    }
  }

  return results
}
