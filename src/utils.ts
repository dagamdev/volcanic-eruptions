import type { Eruption } from './types'

const eruptionDataKeys = [
  'VolcanoNumber',
  'VolcanoName',
  'ExplosivityIndexMax',
  'StartDate',
  'StartDateYear',
  'StartDateMonth',
  'StartDateDay',
  'EndDate',
  'EndDateYear',
  'EndDateMonth',
  'EndDateDay',
  'ContinuingEruption',
  'LatitudeDecimal',
  'LongitudeDecimal'
]

export function formatXMLData (xml: string) {
  const res = []
  let index = 0
  const startStr = '<gml:featureMember'
  const endStr = '</gml:featureMember'

  while (xml.slice(index).includes(startStr)) {
    const obj: Record<string, string | number | boolean> = {}
    const targetText = xml.slice(index)
    const startIndex = targetText.indexOf(startStr)
    const endIndex = targetText.indexOf(endStr)
    const dataText = targetText.slice(startIndex, endIndex)

    if (endIndex >= 0) index += endIndex + endStr.length

    for (const key of eruptionDataKeys) {
      const strKey = `<GVP-VOTW:${key}>`
      const valueIndex = dataText.indexOf(strKey) + strKey.length
      const valueStr = dataText.slice(valueIndex, valueIndex + dataText.slice(valueIndex).indexOf('<'))
      let value: string | number | boolean = ''

      const num = Number(valueStr)

      if (isNaN(Number(num))) {
        if (valueStr === 'False') value = false
        else if (valueStr === 'True') value = true
        else value = valueStr
      } else value = num

      obj[key] = value
    }

    res.push(obj)
  }

  return res
}

export async function getEruptions () {
  const url = 'https://webservices.volcano.si.edu/geoserver/GVP-VOTW/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=GVP-VOTW:E3WebApp_Eruptions1960'
  const res = await fetch(url)
  const text = await res.text()
  
  return formatXMLData(text)
}