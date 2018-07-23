import { createStore, combineReducers, applyMiddleware, compose } from 'redux'

import population from './population'
import range from './range'

export * from './population'
export * from './range'

const asyncMiddleware = ({getState, dispatch}) => (next) => (action) => {
	if (action instanceof Function) {
		return action({getState, dispatch})
	}

	if (action instanceof Promise) {
		return action.then(dispatch)
	}

	return next(action)
}

const reduxCompose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default createStore(
	combineReducers({
		population,
		range,
	}),

	reduxCompose(
		applyMiddleware(
			asyncMiddleware,
		),
	),
)
