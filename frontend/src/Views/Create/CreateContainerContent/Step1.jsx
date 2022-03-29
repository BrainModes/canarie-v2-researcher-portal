import React, { useEffect } from "react";

import ReactDOM from "react-dom";
import { Form, Input, Typography } from "antd";

import G6 from "@antv/g6";
import { data } from "./data";
import _ from "lodash";
import { getChildren } from "../../../APIs";

const { Text } = Typography;

function Step1({ form }) {
	const ref = React.useRef(null);

	let graph = null;
	const apiConfig = {
		level: 1,
		start: true,
	};
	useEffect(() => {
		//Get first level children
		getChildren(apiConfig).then((res) => {
			console.log("res", res?.data?.result?.node);
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
			console.log("data.children", data.children);
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

	const COLLAPSE_ICON = function COLLAPSE_ICON(x, y, r) {
		return [
			["M", x - r, y - r],
			["a", r, r, 0, 1, 0, r * 2, 0],
			["a", r, r, 0, 1, 0, -r * 2, 0],
			["M", x + 2 - r, y - r],
			["L", x + r - 2, y - r],
		];
	};
	const EXPAND_ICON = function EXPAND_ICON(x, y, r) {
		return [
			["M", x - r, y - r],
			["a", r, r, 0, 1, 0, r * 2, 0],
			["a", r, r, 0, 1, 0, -r * 2, 0],
			["M", x + 2 - r, y - r],
			["L", x + r - 2, y - r],
			["M", x, y - 2 * r + 2],
			["L", x, y - 2],
		];
	};

	function getColor(type) {
		console.log("getColor -> type", type);
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

				// add marker icon
				group.addShape("marker", {
					attrs: {
						x: 120 - w / 2,
						y: 26 - h / 2,
						r: 6,
						stroke: "#73d13d",
						fill: "#ffffff",
						cursor: "pointer",
						symbol: EXPAND_ICON,
					},
					name: "add-item",
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
					name: "container-item",
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

	G6.registerNode(
		"new-container-node",
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
						fill: "#FCF0F0",
						stroke: "#BD5555",
					},
					name: "new-item",
				});

				// add icon

				group.addShape("marker", {
					attrs: {
						x: -w / 2,
						y: 26 - h / 2,
						r: 6,
						stroke: "#ff4d4f",
						cursor: "pointer",
						fill: "#ffffff",
						symbol: COLLAPSE_ICON,
					},
					name: "remove-item",
				});

				//New contaienr Tag
				group.addShape("rect", {
					attrs: {
						x: 3 - w / 2,
						y: 3 - h / 2,
						width: 67,
						height: 12,
						fill: "#F8D5D5", //red
						radius: 6,
					},
				});
				group.addShape("text", {
					attrs: {
						...labelCfg.style,
						text: "New Container",
						x: 10 - w / 2,
						y: 13 - h / 2,
						fontSize: 8,
					},
				});
				// end of New contaienr Tag
				// Type Tag
				group.addShape("rect", {
					attrs: {
						x: 73 - w / 2,
						y: 3 - h / 2,
						width: 45,
						height: 12,
						fill: getColor(form.current.getFieldValue("type")),
						radius: 6,
					},
				});
				group.addShape("text", {
					attrs: {
						...labelCfg.style,
						text: form.current.getFieldValue("type"),
						x: 80 - w / 2,
						y: 13 - h / 2,
						fontSize: 8,
					},
				});
				// end of type Tag

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
						// "drag-canvas",
						// "zoom-canvas",
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
				const { item, target } = evt;
				const targetType = target.get("type");
				const name = target.get("name");

				// 增加元素
				if (targetType === "marker") {
					const model = item.getModel();
					//Add new node when click on add-item
					if (name === "add-item") {
						graph.removeChild(`new-node-${counter}`);
						counter++;
						const containerName = form.current.getFieldValue(
							"name",
						);

						if (!model.children) {
							model.children = [];
						}
						const id = `new-node-${counter}`;
						model.children.push({
							id,
							label: `${containerName}`,
							type: "new-container-node",
						});
						form.current.setFieldsValue({
							parent_id: model.containerId,
							parent_name: model.name,
						});
						graph.updateChild(model, model.id);
						graph.fitView();
					} else if (name === "remove-item") {
						graph.removeChild(model.id);
					}
				} else if (targetType === "rect" && name !== "new-item") {
					//Get child
					const model = item.getModel();
					if (!model.children) {
						model.children = [];
					}

					fetchChildren(model.containerId).then((res) => {
						console.log("fetched res", res);
						const children = res.map((item) => {
							return {
								name: item.name,
								id: item.id.toString(), //name is not unique
								label: item.name,
								containerId: item.id,
								containerType: item.labels[0],
							};
						});
						model.children = children;

						graph.updateChild(model, model.id);
						graph.fitView();
					});
				}
			});
		}
		G6.Util.traverseTree(data, function (item) {
			item.id = item.name;
			item.label = item.name;
		});

		console.log(data);
		graph.data(data);
		graph.render();
		graph.fitView();
	}, []);

	return (
		<>
			<p>
				<small>
					Click on a container to open up the child containers, and
					click on plus sign to add the new container.
				</small>
			</p>
			{form.current && (
				<Text type="danger">
					{form.current.getFieldError("parent_id")}
				</Text>
			)}
			<div
				ref={ref}
				style={{ maxWidth: "980px", margin: "0 auto 0 -110px" }}
			></div>
			<Form.Item
				label="Parent container"
				name="parent_id"
				rules={[
					{
						required: true,
						message: "Please select a parent.",
					},
				]}
				style={{ position: "absolute", visibility: "hidden" }}
			>
				<Input />
			</Form.Item>
			<Form.Item
				label="Parent name"
				name="parent_name"
				style={{ position: "absolute", visibility: "hidden" }}
			>
				<Input />
			</Form.Item>
		</>
	);
}

export default Step1;
