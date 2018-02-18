import React from 'react'
import { CircularProgress } from 'material-ui/Progress'
import { ResponsiveContainer, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, Area } from 'recharts'

import { connect } from 'react-redux'

const Display = (props) => (
		!props.population.length
			? <CircularProgress />
			: <ResponsiveContainer height={300}>
					<AreaChart data={props.population}>
						<CartesianGrid />
						<Tooltip />
						<XAxis dataKey='time' />
						<YAxis dataKey='number' />

						<Area dataKey='number' />
					</AreaChart>
				</ResponsiveContainer>
)

export default connect(
	(state) => ({
		population: state.population,

		dateFrom: state.range.from,
		dateTo: state.range.to,
	}),

	{
	},
)(Display)
