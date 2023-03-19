import { GetterTree } from 'vuex'
import { State, RecordItem } from './state'

export type Getters = {
  validRecordsCount(state: State): number
}

export const getters: GetterTree<State, State> & Getters = {
  validRecordsCount(state) {
    return state.dashboard.filter(item => parseInt(item.score) > 0).length
  },
}