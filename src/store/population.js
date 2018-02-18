import * as actions from './actions'

import * as util from '../util'

export const loadPopulation = () => async ({getState, dispatch}) => {
	let sets = util.parseJSON(await util.ajax('/data'))
	let population = await Promise.all(sets.map(async (set) => util.parseJSON(await util.ajax(`/data?data=${set}`))))
	population = sets.map((v, i) => [v, population[i]])
	population = population.reduce((acc, cur) => Object.assign(acc, {[cur[0]]: cur[1]}), {})
	console.log(population)

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
