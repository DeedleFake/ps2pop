import React from 'react'
import { CircularProgress } from 'material-ui/Progress'
import { ResponsiveContainer, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, Area } from 'recharts'

import * as util from './util'

import { connect } from 'react-redux'

const filter = (population, from, to) => population.filter((v) => (v.time > util.dateRoundDown(from)) && (v.time < util.dateRoundUp(to)))

const Display = (props) => (
		!props.population.length
			? <CircularProgress />
			: <ResponsiveContainer height={300}>
					<AreaChart data={filter(props.population, props.dateFrom, props.dateTo)}>
						<CartesianGrid />
						<Tooltip />
						<XAxis dataKey='time' />
						<YAxis />

						<Area dataKey='days1' />
						<Area dataKey='days10' />
						<Area dataKey='days30' />
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
