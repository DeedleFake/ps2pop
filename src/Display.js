import React from 'react'
import { CircularProgress } from 'material-ui/Progress'
import { AreaChart, CartesianGrid, XAxis, YAxis, Area } from 'recharts'

import { connect } from 'react-redux'

const Display = (props) => (
		!props.population.length
			? <CircularProgress />
			: <AreaChart data={props.population}>
					<CartesianGrid />
					<XAxis dataKey='time' />
					<YAxis dataKey='number' />

					<Area dataKey='number' />
				</AreaChart>
)

export default connect(
	(state) => ({
		population: state.population,
	}),

	{
	},
)(Display)
