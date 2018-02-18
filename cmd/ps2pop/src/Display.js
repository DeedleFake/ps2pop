import React, { Component } from 'react'
import { CircularProgress } from 'material-ui/Progress'
import { ResponsiveContainer, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, Area } from 'recharts'

import * as util from './util'

import { connect } from 'react-redux'

class Display extends Component {
	get population() {
		let from = util.dateRoundDown(this.props.dateFrom)
		let to = util.dateRoundUp(this.props.dateTo)

		return this.props.population.filter((v) => (v.time > from) && (v.time < to))
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

					<Area dataKey='days1' stroke='navy' fill='blue' />
					<Area dataKey='days10' stroke='purple' fill='fuchsia' />
					<Area dataKey='days30' stroke='maroon' fill='red' />
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