import React, { useEffect, useState } from "react";

import ReactDOM from "react-dom";
import { Card, Spin } from "antd";

import G6 from "@antv/g6";
import { data } from "./data";
import { getChildren } from "../../../APIs";

function ContainerDiagram({ form }) {
	const ref = React.useRef(null);

	let graph = null;
	const apiConfig = {
		level: 1,
		start: true,
	};
	useEffect(() => {
		getChildren(apiConfig).then((res) => {
			const children = res?.data?.result?.node.map((item) => {
				return {
					name: item.name,
					id: item.id.toString(),
					label: item.name,
					containerId: item.id,
					containerType: item.labels[0],
				};
			});
			data.children = children;
			//Re-renders if the graph is already created
			if (graph) {
				graph.data(data);
				graph.render();
				graph.fitView();
			}
		});
	});
	async function fetchChildren(id) {
		const results = await getChildren(apiConfig, id);
		const children = results?.data?.result?.node;

		return children;
	}
	function getColor(type) {
		return type === "study"
			? "#C7D8EC" //Study: blue
			: type === "program"
			? "#FBEFC5" // Program: yellow
			: type === "generic"
			? "#EFFFB9" //generic: yellow green
			: "#A2DCE0"; //Platform: blueish green
	}
	/**
	 * This demo shows how to custom a behavior to allow drag and zoom canvas with two fingers on touchpad and wheel
	 * By Shiwu
	 */
	G6.registerBehavior("double-finger-drag-canvas", {
		getEvents: function getEvents() {
			return {
				wheel: "onWheel",
			};
		},

		onWheel: function onWheel(ev) {
			if (ev.ctrlKey) {
				const canvas = graph.get("canvas");
				const point = canvas.getPointByClient(ev.clientX, ev.clientY);
				let ratio = graph.getZoom();
				if (ev.wheelDelta > 0) {
					ratio = ratio + ratio * 0.05;
				} else {
					ratio = ratio - ratio * 0.05;
				}
				graph.zoomTo(ratio, {
					x: point.x,
					y: point.y,
				});
			} else {
				const x = ev.deltaX || ev.movementX;
				const y = ev.deltaY || ev.movementY;
				graph.translate(-x, -y);
			}
			ev.preventDefault();
		},
	});

	G6.registerNode(
		"container-node",
		{
			options: {
				size: [60, 20],
				stroke: "#91d5ff",
				fill: "#91d5ff",
			},
			draw(cfg, group) {
				const styles = this.getShapeStyle(cfg);
				const { labelCfg = {} } = cfg;

				const w = styles.width;
				const h = styles.height;

				const keyShape = group.addShape("rect", {
					attrs: {
						...styles,
						x: -w / 2,
						y: -h / 2,
					},
				});

				//Contaienr type Tag
				group.addShape("rect", {
					attrs: {
						x: 3 - w / 2,
						y: 3 - h / 2,
						width: 45,
						height: 12,
						fill: getColor(cfg.containerType),
						radius: 6,
					},
				});
				group.addShape("text", {
					attrs: {
						...labelCfg.style,
						text: cfg.containerType,
						x: 10 - w / 2,
						y: 13 - h / 2,
						fontSize: 8,
					},
				});
				// end of Contaienr type Tag

				if (cfg.label) {
					group.addShape("text", {
						attrs: {
							...labelCfg.style,
							text: cfg.label,
							x: 8 - w / 2,
							y: 35 - h / 2,
						},
					});
				}

				return keyShape;
			},
			update: undefined,
		},
		"rect",
	);

	const defaultNodeStyle = {
		fill: "#ffffff",
		stroke: "#40a9ff",
		radius: 5,
	};
	const defaultLabelCfg = {
		style: {
			fill: "#000",
			fontSize: 12,
		},
	};

	useEffect(() => {
		if (!graph) {
			graph = new G6.TreeGraph({
				container: ReactDOM.findDOMNode(ref.current),
				width: 980,
				height: 600,
				style: {},
				modes: {
					default: [
						"click-select",
						"double-finger-drag-canvas",
						"drag-node",
					],
				},
				defaultNode: {
					type: "container-node",
					size: [120, 40],
					style: defaultNodeStyle,
					labelCfg: defaultLabelCfg,
				},
				defaultEdge: {
					type: "cubic-horizontal",
					style: {
						stroke: "#A3B1BF",
						shadowOffsetY: 10,
					},
					sourceAnchor: 1,
					targetAnchor: 0,
				},
				layout: {
					type: "compactBox",
					direction: "LR",
					getId: function getId(d) {
						return d.id;
					},
					getHeight: function getHeight() {
						return 16;
					},
					getWidth: function getWidth() {
						return 16;
					},
					getVGap: function getVGap() {
						return 20;
					},
					getHGap: function getHGap() {
						return 80;
					},
				},
				nodeStateStyles: {
					// The node styles in selected state
					selected: {
						lineWidth: 2,
						fillOpacity: 0.3,
						fill: "rgb(94, 148, 212)",
						stroke: "rgb(94, 148, 212)",
					},
					hover: {
						fillOpacity: 0.1,
						lineWidth: 2,
						fill: "rgb(94, 148, 212)",
						stroke: "rgb(94, 148, 212)",
					},
				},
				autoPaint: true,
			});

			graph.on("node:mouseenter", (evt) => {
				const node = evt.item;
				// 激活该节点的 hover 状态
				graph.setItemState(node, "hover", true);
			});
			// 监听鼠标离开节点事件
			graph.on("node:mouseleave", (evt) => {
				const node = evt.item;
				// 关闭该节点的 hover 状态
				graph.setItemState(node, "hover", false);
			});
			let counter = 0;
			graph.on("node:click", (evt) => {
				const { item } = evt;
				//Get child
				const model = item.getModel();
				if (!model.children) {
					model.children = [];
				}

				fetchChildren(model.containerId).then((res) => {
					const children = res.map((item) => {
						return {
							name: item.name,
							id: item.id.toString(),
							label: item.name,
							containerId: item.id,
							containerType: item.labels[0],
						};
					});
					model.children = children;

					graph.updateChild(model, model.id);
					graph.fitView();
				});
			});
		}
		G6.Util.traverseTree(data, function (item) {
			item.id = item.name;
			item.label = item.name;
		});

		graph.data(data);
		graph.render();
		graph.fitView();
	}, []);

	return (
		<Card>
			<p>
				<small>
					Click on a container to open up the child containers.
				</small>
			</p>
			<div
				ref={ref}
				style={{ maxWidth: "1080px", margin: "0 auto" }}
			></div>
		</Card>
	);
}

export default ContainerDiagram;
