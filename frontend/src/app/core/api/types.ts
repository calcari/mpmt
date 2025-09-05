import { components } from './schema';

export type ProjectRole = NonNullable<components['schemas']['ProjectMembershipCoreDTO']['role']>
export type TaskPriority = NonNullable<components['schemas']['TaskCoreDTO']['priority']>
export type TaskStatus = NonNullable<components['schemas']['TaskCoreDTO']['status']>

export type HistoryEntry = NonNullable<components['schemas']['TaskHistoryEntryDTO']>


export type TaskCoreDTO = NonNullable<components['schemas']['TaskCoreDTO']>
export type ProjectMembershipCoreDTO = NonNullable<components['schemas']['ProjectMembershipCoreDTO']>
export type ProjectOfUserDTO = NonNullable<components['schemas']['ProjectOfUserDTO']>