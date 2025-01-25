/*
 * File: reflect.utils.ts                                                      *
 * Project: sanpu-backend                                                      *
 * Created Date: We Aug 2024                                                   *
 * Author: Yuzhe Shi                                                           *
 * -----                                                                       *
 * Last Modified: Wed Aug 28 2024                                              *
 * Modified By: Yuzhe Shi                                                      *
 * -----                                                                       *
 * Copyright (c) 2024 Nanjing University of Information Science & Technology   *
 * -----                                                                       *
 * HISTORY:                                                                    *
 * Date      	By	Comments                                                     *
 * ----------	---	---------------------------------------------------------    *
 */

import { merge } from 'lodash'

export function getMeta(target: any, field: any, default_value = null) {
  return Reflect.getMetadata(field, target) ?? default_value
}

export function mergeMeta(target: any, field: any, value: any) {
  let existingMetadata = getMeta(target, field) || {}

  if (typeof existingMetadata !== 'object') {
    throw new Error(`Cannot merge metadata for ${field} with ${value}`)
  }

  return Reflect.defineMetadata(
    field,
    merge(existingMetadata, value),
    target,
  )
}

export function appendMeta(
  target: any,
  field: any,
  value: any,
) {
  let existingMetadata = getMeta(target, field)

  if (!Array.isArray(existingMetadata)) {
    throw new Error(`Cannot append metadata for ${field} with ${value}`)
  }

  return Reflect.defineMetadata(
    field,
    [...existingMetadata, value],
    target,
  )
}

export function setMeta(target: any, field: any, value: any) {
  return Reflect.defineMetadata(field, value, target)
}

export function getMetaKeys(target: any) {
  return Reflect.getMetadataKeys(target)
}
