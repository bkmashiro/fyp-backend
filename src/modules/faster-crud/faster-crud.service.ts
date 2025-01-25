import { Global, Injectable, Logger } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { getMeta } from '@/utils/reflect.utils'
import { invert, mapValues, merge } from 'lodash'
import { FCColumn as FCEColumn } from '@/utils/decorators'

@Global()
@Injectable()
export class FasterCrudService {
  static entities: any[] = []
  logger = new Logger(FasterCrudService.name)
  constructor(private readonly dataSource: DataSource) {
    // setTimeout(() => {
    // this.buildDataDict(User)
    // }, 1000)
    FasterCrudService.entities.forEach((entity) => {
      this.buildDataDict(entity)
    })

    this.logger.debug(
      `FasterCrudService initialized, created ${FasterCrudService.entities.length} dicts`,
    )
  }

  getColumns(entity: any) {
    return this.dataSource.getMetadata(entity).ownColumns
  }

  dictMap: Map<string, Record<string, any>> = new Map()

  buildDataDict(entity: { new (): any }) {
    const userDict = getMeta(entity.prototype, 'fc:columns')

    const columns = this.getColumns(entity)
    const dataDict = {}
    columns.forEach((column) => {
      dataDict[column.propertyName] = {
        title: column.propertyName,
        type: column.type,
      }
    })

    const FCEDict = merge(dataDict, userDict)
    // remove all cols that has hiddenInForm: true
    Object.keys(FCEDict).forEach((key) => {
      if (FCEDict[key].hiddenInTable) {
        delete FCEDict[key]
      }
    })

    const transformedDict = {
      dict: mapValues(FCEDict, transformFastCRUDDataDictEntry),
      crud: {
        //end points
        create: `/${entity.name.toLowerCase()}`, //POST
        read: `/${entity.name.toLowerCase()}`, //GET
        update: `/${entity.name.toLowerCase()}`, //PUT
        delete: `/${entity.name.toLowerCase()}`, //DELETE
      },
    }

    this.dictMap.set(entity.name.toLowerCase(), transformedDict)
    return transformedDict
  }

  getDict(entity: string) {
    // console.log(entity, this.dictMap)
    return this.dictMap.get(entity)
  }
}
// text | password | textarea
// dict-select| table-select | dict-radio | dict-checkbox | dict-switch
// datetime | date | time | daterange | datetimerange
// file-uploader（文件上传） | image-uploader（图片上传） | avatar-uploader（头像上传，单图片） | avatar-cropper (头像裁剪上传)
//
enum FastCrudType {
  number = 'number',
  text = 'text',
  textarea = 'textarea',
  password = 'password',
  dict_select = 'dict-select',
  dict_radio = 'dict-radio',
  dict_checkbox = 'dict-checkbox',
  dict_switch = 'dict-switch',
  datetime = 'datetime',
  date = 'date',
  time = 'time',
  daterange = 'daterange',
  datetimerange = 'datetimerange',
  file_uploader = 'file-uploader',
  image_uploader = 'image-uploader',
  avatar_uploader = 'avatar-uploader',
  avatar_cropper = 'avatar-cropper',
}

const typeFallbackMap = {
  char: 'text',
  varchar: 'text',
  int: 'number',
  float: 'number',
  double: 'number',
  decimal: 'number',
  numeric: 'number',
  date: 'text',
  datetime: 'text',
  timestamp: 'text',
  bytea: 'text',
}
type FCColumn = {
  title: string
  type: string
  column?: Record<string, any>
  form?: Record<string, any>
  dict?: {
    value: string
    label: string
    data: Record<string, any>
  }
  search?: {
    show: boolean
  }
}

function tryGetFastCrudTypeFromType(type: any): FastCrudType {
  if (type in FastCrudType) {
    return FastCrudType[type]
  }
  if (type in typeFallbackMap) {
    return FastCrudType[typeFallbackMap[type]]
  }
  if (type === String) {
    return FastCrudType.text
  }

  if (type === Number) {
    return FastCrudType.number
  }
  Logger.warn(`Unknown type: ${type}`, FasterCrudService.name)

  // our customized Fast CRUD type
  if (['line', 'polygon', 'point', 'geometry', 'raster'].includes(type)) {
    return type
  }

  return FastCrudType.text
}
function dict(obj: Record<string, any>): any {
  return {
    __make_dict: obj,
  }
}

function transformFastCRUDDataDictEntry(fcc: FCEColumn): FCColumn {
  const res: FCColumn = {
    title: fcc.title,
    type: tryGetFastCrudTypeFromType(fcc.type),
  }

  if ('isIn' in fcc) {
    let get_id: (v: string) => string
    if (fcc.isInMap) {
      const invertMap = invert(fcc.isInMap)
      get_id = (v: string) => invertMap[v] || v
    } else {
      // get_id = (v: string) => fcc.isIn.indexOf(v).toString()
      get_id = (v: string) => v
    }

    let get_text: (v: string) => string
    if (fcc.mapper) {
      get_text = (v: string) => fcc.mapper[v]
    } else {
      get_text = (v: string) => v
    }

    // this is a dict-select
    res['dict'] = dict({
      value: 'id',
      label: 'text',
      data: fcc.isIn.map((v: string) => ({ id: get_id(v), text: get_text(v) })),
    })
    // override type to dict-select
    res.type = FastCrudType.dict_select
  }

  if ('form' in fcc) {
    merge(res, {
      form: fcc.form,
    })
  }

  //hint: [key].form.helper
  if ('hint' in fcc) {
    merge(res, {
      form: {
        helper: fcc.hint,
      },
    })
  }

  return res
}
