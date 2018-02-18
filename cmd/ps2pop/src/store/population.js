import * as actions from './actions'

import * as util from '../util'

export const loadPopulation = () => async ({getState, dispatch}) => {
	let population = util.parseJSON(await util.ajax('/data'))

	return dispatch({
		type: actions.LOAD_POPULATION,
		population,
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
