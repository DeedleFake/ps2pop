import React, { Component } from 'react'
import Grid from 'material-ui/Grid'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import { CircularProgress } from 'material-ui/Progress'
import { withStyles } from 'material-ui/styles'

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
		if (!this.props.dateFrom) {
			return null
		}

		return util.formatDate(this.props.dateFrom)
	}

	get dateTo() {
		if (!this.props.dateTo) {
			return null
		}

		return util.formatDate(this.props.dateTo)
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
							{!this.props.dateFrom
								? <CircularProgress />
								: <TextField
										label='From'
										type='date'
										value={this.dateFrom}
										InputLabelProps={{
											shrink: true,
										}}
									/>
							}
						</Paper>
					</Grid>

					<Grid item xs={3}>
						<Paper className={this.props.classes.paper}>
							{!this.props.dateTo
								? <CircularProgress />
								: <TextField
										label='To'
										type='date'
										value={this.dateTo}
										InputLabelProps={{
											shrink: true,
										}}
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
