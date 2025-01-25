//
import { RolesBuilder } from 'nest-access-control'

export enum AppRoles {
  USER = 'user',
  ADMIN = 'admin',
}

export const roles: RolesBuilder = new RolesBuilder()

/** 三普的数据 */
const sanpu = 'default-sanpu-entry-key'

// prettier-ignore
roles
  .grant(AppRoles.USER) // define new or modify existing role. also takes an array.
    // 创建、读取三普的数据
    .createOwn(sanpu) // equivalent to .createOwn('video', ['*'])
    .readAny(sanpu)
    // 禁止删除和修改
    // .deleteOwn(defaultEntryKey)
    // .updateOwn(defaultEntryKey)
    .updateOwn('user') // 用户可以更改自己的信息
  .grant(AppRoles.ADMIN) // switch to another role without breaking the chain
    .extend(AppRoles.USER) // inherit role capabilities. also takes an array
    .updateAny(sanpu) // explicitly defined attributes
    .deleteAny(sanpu)
    .updateAny('user') // 管理员可以更改用户的信息
