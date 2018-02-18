import * as actions from './actions'

import * as util from '../util'

export const loadPopulation = () => async ({getState, dispatch}) => {
	let data = await util.ajax('/data?data=days30')

	return dispatch({
		type: actions.LOAD_POPULATION,
		population: util.parseJSON(data),
	})
}

const initial = []

export default (state = initial, action) => {
	switch (action.type) {
		case actions.LOAD_POPULATION:
			return action.population

		default:
			return state
	}
}
