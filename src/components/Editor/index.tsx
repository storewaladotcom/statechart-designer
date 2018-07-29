import * as React from 'react'

import './Cards'
// import * as components from './components'
import './editor.css'
import items from './items'
import './modelFlowEditor.css'

import ContextMenu from '../ContextMenu'
import Navigator from '../Navigator'
import Page from '../Page'
import Toolbar from '../Toolbar'
import initEditorComponents from './components'
import DetailsCanvas from './Details/Canvas'
import DetailsState from './Details/State'
import DetailsTransition from './Details/State'
import Zoom from './Zoom'

interface IState {
	curZoom: number
	maxZoom: number
	minZoom: number
	selectedModel: object
	tempModel: object | null
}

class Editor extends React.Component<{}, IState> {
	page: any
	editor: any
	state = {
		tempModel: null,
		selectedModel: {},
	}
	componentDidMount() {
		const { page, editor } = initEditorComponents(this.onChange)
		this.page = page
		this.editor = editor
	}

	toggleGrid = (ev) => {
		if (ev.target.checked) {
			this.page.showGrid()
		} else {
			this.page.hideGrid()
		}
	}
	updateGraph = (key: string, value: any) => {
		this.editor.executeCommand(() => {
			const selectedItems = this.page.getSelected()
			selectedItems.forEach((item) => {
				const updateModel = {}
				updateModel[key] = value
				this.page.update(item, updateModel)
			})
		})
	}

	onChange = (change) => {
		this.setState(change)
	}
	render() {
		const { tempModel, selectedModel } = this.state
		const model = tempModel !== null ? tempModel : selectedModel
		return (
			<div id="editor">
				<Toolbar />
				<div style={{ height: '42px' }} />
				<div className="bottom-container">
					<ContextMenu />
					<div id="itempannel">
						<ul>
							{items.map((item) => (
								<li
									key={item.key}
									className="getItem"
									data-shape={item.key}
									data-type="node"
									data-size={item.size}>
									<span className={item.class} />
									{item.label}
								</li>
							))}
						</ul>
					</div>
					<div id="detailpannel">
						<div
							data-status="node-selected"
							className="pannel"
							id="node_detailpannel">
							<div className="pannel-title">State</div>
							<div className="block-container">
								<DetailsState
									model={model}
									onChange={this.onChange}
									updateGraph={this.updateGraph}
								/>
							</div>
						</div>
						<div
							data-status="edge-selected"
							className="pannel"
							id="edge_detailpannel">
							<div className="pannel-title">Transition</div>
							<div className="block-container">
								<DetailsTransition
									model={model}
									onChange={this.onChange}
									updateGraph={this.updateGraph}
								/>
							</div>
						</div>
						<div
							data-status="group-selected"
							className="pannel"
							id="node_detailpannel">
							<div className="pannel-title">Group</div>
							<div className="block-container">
								<DetailsState
									model={model}
									onChange={this.onChange}
									updateGraph={this.updateGraph}
								/>
							</div>
						</div>
						<div
							data-status="canvas-selected"
							className="pannel"
							id="canvas_detailpannel">
							<div className="pannel-title">Canvas</div>
							<div className="block-container">
								<DetailsCanvas toggleGrid={this.toggleGrid} />
							</div>
						</div>
					</div>
					<Zoom>
						{({ zoom, minZoom, maxZoom }) => (
							<Navigator
								zoom={zoom}
								minZoom={minZoom}
								maxZoom={maxZoom}
								changeZoom={(change) => this.page.zoom(change)}
							/>
						)}
					</Zoom>
					<Page />
				</div>
			</div>
		)
	}
}

export default Editor