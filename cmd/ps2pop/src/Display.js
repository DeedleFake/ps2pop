// @format

import React, { Component } from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'
import {
	ResponsiveContainer,
	AreaChart,
	CartesianGrid,
	Tooltip,
	XAxis,
	YAxis,
	Area,
} from 'recharts'

import * as util from './util'

import { connect } from 'react-redux'

const sets = [
	{ num: 1, stroke: 'navy', fill: 'blue' },
	{ num: 10, stroke: 'purple', fill: 'fuchsia' },
	{ num: 30, stroke: 'maroon', fill: 'red' },
]

class Display extends Component {
	get population() {
		let from = util.dateRoundDown(this.props.dateFrom)
		let to = util.dateRoundUp(this.props.dateTo)

		return this.props.population.filter((v) => v.time > from && v.time < to)
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
					<XAxis dataKey="time" />
					<YAxis />

					{sets.map((set) => (
						<Area
							key={set.num}
							dataKey={`days${set.num}`}
							name={`Prev ${set.num} ${util.plural('day', set.num)}`}
							stroke={set.stroke}
							fill={set.fill}
						/>
					))}
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

	{},
)(Display)
