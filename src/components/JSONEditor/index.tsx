import { Button } from 'antd'
import * as React from 'react'
import { exportToXState } from 'utils/export'
import { load } from 'utils/storage'
import ErrorPage from '../ErrorPage'
import { notifyCanvas } from '../Notify'

import './json-editor.css'

interface IProps {
	getFlow(): any
}

export default class JSONEditor extends React.Component<IProps> {
	state = {
		error: null,
		xstate: {},
	}
	componentDidMount() {
		this.loadXState()
		const flow = this.props.getFlow()
		flow.on('afterchange', this.loadXState)
	}
	loadXState = async () => {
		try {
			const data = await load()
			const xstate = exportToXState(data)
			this.setState({ error: null, xstate })
		} catch (error) {
			this.setState({ error: error.message, xstate: {} })
		}
	}
	copy = () => {
		let navigator: any
		navigator = window.navigator
		navigator.clipboard.writeText(JSON.stringify(this.state.xstate, null, 2))
		notifyCanvas.info('Copied to clipboard')
	}
	render() {
		if (this.state.error) {
			return <ErrorPage>{this.state.error}</ErrorPage>
		}
		return (
			<div id="jsoneditor" style={{ minHeight: window.innerHeight - 76 }}>
				<Button
					className="copy"
					onClick={this.copy}
					icon="copy"
					ghost={true}
					size="small"
				/>
				<code>
					<pre id="json">{JSON.stringify(this.state.xstate, null, 2)}</pre>
				</code>
			</div>
		)
	}
}