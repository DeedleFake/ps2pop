import React, { Component } from 'react'
import { CircularProgress } from 'material-ui/Progress'
import { ResponsiveContainer, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, Area } from 'recharts'

import * as util from './util'

import { connect } from 'react-redux'

class Display extends Component {
	get population() {
		return this.props.population.filter((v) => (v.time > util.dateRoundDown(this.props.dateFrom)) && (v.time < util.dateRoundUp(this.props.dateTo)))
	}

	render() {
		if (!this.props.population.length) {
			return <CircularProgress />
		}

		return (
			<ResponsiveContainer height={300}>
				<AreaChart data={this.population}>
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
	}
}

export default connect(
	(state) => ({
		population: state.population,

		dateFrom: state.range.from,
		dateTo: state.range.to,
	}),

	{
	},
)(Display)
