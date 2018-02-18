import { createStore, combineReducers, applyMiddleware } from 'redux'

import population from './store/population'
export * from './store/population'

const asyncMiddleware = ({getState, dispatch}) => (next) => (action) => {
	if (action instanceof Function) {
		return action({getState, dispatch})
	}

	if (action instanceof Promise) {
		return action.then(dispatch)
	}

	return next(action)
}

export default createStore(
	combineReducers({
		population,
	}),

	applyMiddleware(
		asyncMiddleware,
	),
)
