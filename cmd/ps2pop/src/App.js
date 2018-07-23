// @format

import React, { Component } from 'react'

import Grid from '@material-ui/core/Grid'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles'

import Display from './Display'
import * as util from './util'

import { connect } from 'react-redux'
import { loadPopulation, setRange } from './store'

const styles = (theme) => ({
	root: {
		paddingTop: theme.mixins.toolbar.minHeight + theme.spacing.unit * 2,
	},

	paper: {
		display: 'flex',
		justifyContent: 'center',
		padding: theme.spacing.unit,
	},
})

class App extends Component {
	componentDidMount() {
		this.props.loadPopulation()
	}

	get dateFrom() {
		let date = this.props.dateFrom
		if (date instanceof Date) {
			date = util.formatDate(date)
		}

		return date
	}

	set dateFrom(val) {
		if (!val) {
			return
		}

		this.props.setRange(new Date(val), this.props.dateTo)
	}

	get dateTo() {
		let date = this.props.dateTo
		if (date instanceof Date) {
			date = util.formatDate(date)
		}

		return date
	}

	set dateTo(val) {
		if (!val) {
			return
		}

		this.props.setRange(this.props.dateFrom, new Date(val))
	}

	render() {
		return (
			<div className={this.props.classes.root}>
				<AppBar>
					<Toolbar>
						<Typography variant="title" color="inherit">
							PlanetSide 2 Population
						</Typography>
					</Toolbar>
				</AppBar>

				<Grid container justify="center">
					<Grid item xs={10}>
						<Paper className={this.props.classes.paper}>
							<Display />
						</Paper>
					</Grid>

					<Grid item xs={3}>
						<Paper className={this.props.classes.paper}>
							{!this.props.dateFrom || !this.props.population.length ? (
								<CircularProgress />
							) : (
								<TextField
									type="date"
									value={this.dateFrom}
									onChange={(ev) => (this.dateFrom = ev.currentTarget.value)}
									inputProps={{
										min: util.formatDate(
											util.dateRoundDown(this.props.population[0].time),
										),
										max: this.dateTo,
									}}
									required
								/>
							)}
						</Paper>
					</Grid>

					<Grid item xs={3}>
						<Paper className={this.props.classes.paper}>
							{!this.props.dateTo || !this.props.population.length ? (
								<CircularProgress />
							) : (
								<TextField
									type="date"
									value={this.dateTo}
									onChange={(ev) => (this.dateTo = ev.currentTarget.value)}
									inputProps={{
										min: this.dateFrom,
										max: util.formatDate(
											util.dateRoundUp(
												this.props.population[this.props.population.length - 1]
													.time,
											),
										),
									}}
									required
								/>
							)}
						</Paper>
					</Grid>
				</Grid>
			</div>
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
		loadPopulation,
		setRange,
	},
)(withStyles(styles)(App))
