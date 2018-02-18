import { createStore, combineReducers, applyMiddleware, compose } from 'redux'

import population from './store/population'
import range from './store/range'

export * from './store/population'
export * from './store/range'

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
