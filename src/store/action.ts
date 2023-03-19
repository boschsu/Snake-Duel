import { ActionContext, ActionTree } from 'vuex'
import { Mutations, MutationType } from './mutation'
import { State } from './state'

export enum ActionTypes {
    GetRecordsItem = 'GET_RECORDS_ITEM',
}

type ActionAugments = Omit < ActionContext < State, State > , 'commit' > & {
    commit < K extends keyof Mutations > (
        key: K,
        payload: Parameters < Mutations[K] > [1]
    ): ReturnType < Mutations[K] > ;
}


export type Actions = {
    [ActionTypes.GetRecordsItem](context: ActionAugments): void;

}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const actions: ActionTree < State, State > & Actions = {
    async [ActionTypes.GetRecordsItem]({ commit }) {
        commit(
        	MutationType.SET_RECORDS, 
        	payloads
        )
    },
}