import { MutationTree } from 'vuex'
import { State, RecordItem } from './state'

export enum MutationType {
    CreateNewRecord = 'CREATE_NEW_RECORD',
    SetRecords = 'SET_RECORDS',
}

export type Mutations = {
    CREATE_NEW_RECORD(state: State, record: RecordItem): void;
    [MutationType.SetRecords](state: State, records: RecordItem[]): void;
};

export const mutations: MutationTree<State> & Mutations = {
    CREATE_NEW_RECORD(state, record) {
        state.dashboard.unshift(record)
    },
    [MutationType.SetRecords](state, records) {
        state.records = records
    },
}