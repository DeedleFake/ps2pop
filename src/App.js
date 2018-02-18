import React, { Component } from 'react'
import Grid from 'material-ui/Grid'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import { CircularProgress } from 'material-ui/Progress'
import { withStyles } from 'material-ui/styles'
import { DatePicker } from 'material-ui-pickers'

import KeyboardArrowLeftIcon from 'material-ui-icons/KeyboardArrowLeft'
import KeyboardArrowRightIcon from 'material-ui-icons/KeyboardArrowRight'

import Display from './Display'
import * as util from './util'

import { connect } from 'react-redux'
import {
	loadPopulation,

	setRange,
} from './store'

const styles = (theme) => ({
	root: {
		paddingTop: theme.mixins.toolbar.minHeight + (theme.spacing.unit * 2),
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
		return this.props.dateFrom
	}

	set dateFrom(val) {
		this.props.setRange(val, this.props.dateTo)
	}

	get dateTo() {
		return this.props.dateTo
	}

	set dateTo(val) {
		this.props.setRange(this.props.dateFrom, val)
	}

	render() {
		return (
			<div className={this.props.classes.root}>
				<AppBar>
					<Toolbar>
						<Typography variant='title' color='inherit'>
							PlanetSide 2 Population
						</Typography>
					</Toolbar>
				</AppBar>

				<Grid container justify='center'>
					<Grid item xs={10}>
						<Paper className={this.props.classes.paper}>
							<Display />
						</Paper>
					</Grid>

					<Grid item xs={3}>
						<Paper className={this.props.classes.paper}>
							{!this.props.dateFrom || !this.props.population.length
								? <CircularProgress />
								: <DatePicker
										label='From'
										value={this.dateFrom}
										onChange={(date) => this.dateFrom = date}
										minDate={util.dateRoundDown(this.props.population[0].time)}
										maxDate={util.dateRoundUp(this.props.dateTo)}
										leftArrowIcon={<KeyboardArrowLeftIcon />}
										rightArrowIcon={<KeyboardArrowRightIcon />}
									/>
							}
						</Paper>
					</Grid>

					<Grid item xs={3}>
						<Paper className={this.props.classes.paper}>
							{!this.props.dateTo || !this.props.population.length
								? <CircularProgress />
								: <DatePicker
										label='To'
										value={this.dateTo}
										onChange={(date) => this.dateTo = date}
										minDate={util.dateRoundDown(this.props.dateFrom)}
										maxDate={util.dateRoundUp(this.props.population[this.props.population.length - 1].time)}
										leftArrowIcon={<KeyboardArrowLeftIcon />}
										rightArrowIcon={<KeyboardArrowRightIcon />}
									/>
							}
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
