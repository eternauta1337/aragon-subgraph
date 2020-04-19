// Templates.
import { Kernel as KernelTemplate } from '../generated/templates'

// Contracts.
import { Kernel as KernelContract } from '../generated/templates/Kernel/Kernel'

// Events.
import { DeployDAO as DeployDAOEvent } from '../generated/DAOFactory/DAOFactory'
import { SetApp as SetAppEvent } from '../generated/templates//Kernel/Kernel'

// Entities.
import {
  DAO as DAOEntity,
  App as AppEntity
} from '../generated/schema'

export function handleDeployDAO(event: DeployDAOEvent): void {
  let daoAddress = event.params.dao
  let daoId = daoAddress.toHex()

  KernelTemplate.create(daoAddress)

  let kernelContract = KernelContract.bind(daoAddress)

  let daoEntity = new DAOEntity(daoId)
  daoEntity.address = daoAddress
  daoEntity.acl = kernelContract.acl()
  daoEntity.save()
}

export function handleSetApp(event: SetAppEvent): void {
  // SetApp events are emitted by Kernels (DAOs).
  // An event's address property represents the contract that emitted the event.
  // So, the event's address is the DAO that emitted the event.
  let daoAddress = event.address
  let daoId = daoAddress.toHex()

  let appAddress = event.params.app
  let appId = appAddress.toHex()

  let appEntity = new AppEntity(appId)
  appEntity.address = appAddress
  appEntity.dao = daoId
  appEntity.save()
}
