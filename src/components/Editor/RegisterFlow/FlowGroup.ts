import { IKeyShape } from '@antv/g6'
import { IFlow } from '@antv/g6-editor'
import anchor from './anchor'

export default (Flow: IFlow) => {
	Flow.registerGroup('flow-group', {
		draw(this: any, item: any): IKeyShape {
			const model = item.getModel()
			const group = item.getGraphicGroup()
			// console.log('group', group)
			const childBox = item.getChildrenBBox()

			const padding = 20
			const paddingTop = 30
			const width = childBox.maxX - childBox.minX + padding * 2
			const height = childBox.maxY - childBox.minY + padding * 2 + paddingTop

			// const collapsed = model.collapsed

			// group container
			const keyShape: IKeyShape = group.addShape('rect', {
				attrs: {
					x: childBox.x - padding,
					y: childBox.y - (padding + paddingTop),
					width,
					height,
					radius: 4,
					fill: '#F7F9FB',
					stroke: '#CED4D9',
				},
			})

			// group title
			group.addShape('text', {
				attrs: {
					text: model.label ? model.label : this.label || 'Group',
					x: childBox.minX + padding,
					y: childBox.minY - paddingTop,
					textAlign: 'center',
					textBaseline: 'top',
					fill: 'rgba(0,0,0,0.65)',
				},
			})

			// parallel icon
			const isParallel = model.parallel || this.parallel || false
			group.addShape('image', {
				attrs: {
					img: isParallel ? '/assets/icons/parallel.svg' : null,
					x: childBox.maxX - padding,
					y: childBox.minY - paddingTop,
					width: 16,
					height: 16,
				},
			})

			const isInitial = model.initial || this.initial || false
			group.addShape('image', {
				attrs: {
					img: isInitial ? '/assets/icons/initial-state.svg' : null,
					x: childBox.minX + width / 2 - 29,
					y: childBox.minY - paddingTop - 60,
					width: 19,
					height: 40,
				},
			})

			return keyShape
		},
		anchor,
	})
}
