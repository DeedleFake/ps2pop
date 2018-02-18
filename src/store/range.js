import * as actions from './actions'

export const setRange = (from, to) => ({
	type: actions.SET_RANGE,
	from,
	to,
})

const initial = {
	from: null,
	to: null,
}

export default (state = initial, action) => {
	switch (action.type) {
		case actions.SET_RANGE:
			return {
				...state,
				from: action.from,
				to: action.to,
			}

		default:
			return state
	}
}
