<template>
	<div id="olmap" ref="olmap" style="width: 100%; height: 100%;">
		<el-row :gutter="20">
			<el-col :span="6">
				<div class="grid-content bg-purple"></div>
			</el-col>
			<el-col :span="6" :offset="6">
				<div class="grid-content bg-purple"></div>
			</el-col>
		</el-row>
		<el-select class="mapselect" v-model="value" placeholder="切换地图底图" @change="changeBaseMap(value)">
			<el-option-group v-for="group in options" :key="group.label" :label="group.label">
				<el-option
					v-for="item in group.options"
					:key="item.value"
					:label="item.label"
					:value="item.value"
				></el-option>
			</el-option-group>
		</el-select>


		<el-row class="opebutton">
			<el-button type="primary" @click="startDraw()">开始绘制</el-button>
			<el-button type="endDraw" @click="endDraw()">结束绘制</el-button>
			<el-button type="saveDraw" @click="saveDraw()">保存绘制</el-button>
			<el-button type="delectDraw" @click="delectDraw()">删除绘制</el-button>
			<el-button type="danger" @click="editDraw()">编辑绘制</el-button>
		</el-row>

		<!-- <el-checkbox class="isedit" v-model="checked">启用WFS编辑</el-checkbox> -->
	</div>
</template>

<script>
import Map from 'ol/Map'
import View from 'ol/View'
import { Draw, Modify, Snap, Select} from 'ol/interaction'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { OSM, TileArcGISRest, Vector as VectorSource } from 'ol/source'
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style'
import XYZ from 'ol/source/XYZ'
import { transform } from 'ol/proj'
import mapSources from './modules/maplist'
import OverviewMap from 'ol/control/OverviewMap'

export default {
	components: {},
	data() {
		return {
			checked: false,
			geometryType: [
				{
					value: 'Point',
					label: 'Point'
				},
				{
					value: 'LineString',
					label: 'LineString'
				},
				{
					value: 'Polygon',
					label: 'Polygon'
				},
				{
					value: 'Circle',
					label: 'Circle'
				}
			],
			options: mapSources.basemapLabel,
			value: '',
			value1: '',
			tdtdz: mapSources.tdtdz,
			tdtlabeldz: mapSources.tdtlabeldz,
			tdtwx: mapSources.tdtwx,
			tdtlabelwx: mapSources.tdtlabelwx,
			gaodedz: mapSources.gaodedz,
			gaodewx: mapSources.gaodewx,
			gaodelabelwx: mapSources.gaodelabelwx,
			geoqcs: mapSources.geoqcs,
			geoqns: mapSources.geoqns,
			geoqhs: mapSources.geoqhs,
			geoqlh: mapSources.geoqlh,
			proj: 'EPSG:4326', //定义wgs84地图坐标系
			proj_m: 'EPSG:3857', //定义墨卡托地图坐标系
			map: null,
			mapLayer: null,
			mapLayerlabel: null,
			source: null,
			vector: null,
			draw: null,
			snap: null
		}
	},
	mounted() {
		this.initMap()
	},
	methods: {
		initMap() {
			//初始化map对象
			this.map = new Map({
				target: 'olmap',
				projection: this.proj,
				//interactions: ol.interaction.defaults().extend([mapDragInteraction]),
				view: new View({
					center: transform(
						[108.7261669, 34.3347945],
						this.proj,
						this.proj_m
					),
					zoom: 15
				})
			})

			//初始化地图图层
			this.mapLayer = new TileLayer({
				source: this.tdtdz,
				projection: this.proj
			})

			//初始化标签图层
			this.mapLayerlabel = new TileLayer({
				source: this.tdtlabeldz,
				projection: this.proj
			})

			//将图层加载到地图对象
			this.map.addLayer(this.mapLayer)
			this.map.addLayer(this.mapLayerlabel)
			
			//实例化一个自定义样式的鹰眼空间并加入地图中
			// this.map.addControl(
			// new OverviewMap({
			// 	//鹰眼控件样式 overviewmap-custom
			// 	className:'ol-overviewmap ol-custom-overviewmap',
			// 	//鹰眼中加载同坐标系下不同数据源的图层
			// 	layers:[this.mapLayer],
			// 	//鹰眼控件展开时功能按钮上的标识(网页的JS字符编码)
			// 	collapseLabel:'\u00BB',
			// 	//鹰眼控件折叠时功能按钮上的标识(网页的JS字符编码)
			// 	label:'\u00AB',
			// 	//功能按钮的初始显示方式设置为展开
			// 	collapsed:false
			// }))
		},
		/******************地图切换方法***************/
		changeBaseMap: function(value) {
			this.map.removeLayer(this.mapLayer)
			this.map.removeLayer(this.mapLayerlabel)
			switch (value) {
				case 'tdtdz':
					this.mapLayer = new TileLayer({
						source: this.tdtdz,
						projection: this.proj
					})
					this.mapLayerlabel = new TileLayer({
						source: this.tdtlabeldz,
						projection: this.proj
					})
					this.map.addLayer(this.mapLayer)
					this.map.addLayer(this.mapLayerlabel)
					break
				case 'tdtwx':
					this.mapLayer = new TileLayer({
						source: this.tdtwx,
						projection: this.proj
					})
					this.mapLayerlabel = new TileLayer({
						source: this.tdtlabelwx,
						projection: this.proj
					})
					this.map.addLayer(this.mapLayer)
					this.map.addLayer(this.mapLayerlabel)
					break
				case 'gaodedz':
					this.mapLayer = new TileLayer({
						source: this.gaodedz,
						projection: this.proj
					})
					this.map.addLayer(this.mapLayer)
					break
				case 'gaodewx':
					this.mapLayer = new TileLayer({
						source: this.gaodewx,
						projection: this.proj
					})
					this.mapLayerlabel = new TileLayer({
						source: this.gaodelabelwx,
						projection: this.proj
					})
					this.map.addLayer(this.mapLayer)
					this.map.addLayer(this.mapLayerlabel)
					break
				case 'geoqcs':
					this.mapLayer = new TileLayer({
						source: this.geoqcs,
						projection: this.proj
					})
					this.map.addLayer(this.mapLayer)
					break
				case 'geoqns':
					this.mapLayer = new TileLayer({
						source: this.geoqns,
						projection: this.proj
					})
					this.map.addLayer(this.mapLayer)
					break
				case 'geoqhs':
					this.mapLayer = new TileLayer({
						source: this.geoqhs,
						projection: this.proj
					})
					this.map.addLayer(this.mapLayer)
					break
				case 'geoqlh':
					this.mapLayer = new TileLayer({
						source: this.geoqlh,
						projection: this.proj
					})
					this.map.addLayer(this.mapLayer)
					break
			}
		},

		// modifyInteraction
		wfsEdit: function() {
			let modify = new Modify({
				source: this.source
			})
			this.map.addInteraction(modify)
		},

		addInteractions: function(value) {
			this.draw = new Draw({
				source: this.source,
				style: new Style({
					stroke: new Stroke({
						color: '#1E90FF',
						lineDash: [2,4,6,8],
						width: 2
					})
				}),
				type: value
			})
			this.map.addInteraction(this.draw)
			this.snap = new Snap({
				source: this.source
			})
			this.map.addInteraction(this.snap)
		},

		selectInteraction: function(){
			let select = new Select({
				source: this.source
			})
			this.map.addInteraction(select)
		},

		// 开始绘制
		startDraw: function() {
			this.source = new VectorSource()
			this.vector = new VectorLayer({
				source: this.source,
				style: new Style({
					fill: new Fill({
						color: 'rgba(30, 144, 255, 0.3)'
					}),
					stroke: new Stroke({
						color: '#1E90FF',
						width: 2
					})
				})
			})
			this.map.addLayer(this.vector)
			this.wfsEdit()
			this.addInteractions('Polygon')
		},
		// 结束绘制
		endDraw: function() {
			if (this.draw) {
				this.map.removeInteraction(this.draw)
				this.map.removeInteraction(this.snap)
			}
		},
		// 保存绘制
		saveDraw: function() {
			if (this.vector) {
				let features = this.source.getFeatures()
				if (features.length > 0) {
					for (var j = 0; j < features.length; j++) {
						// 将3857坐标转换为4326坐标
						// let geo = features[j].getGeometry().transform(this.proj_m, this.proj)
						let geo = features[j].getGeometry()
						console.log(geo)
						alert(geo)
					}
				}	
			}
		},
		// 删除绘制
		delectDraw: function() {
			if (this.draw) {
				this.map.removeInteraction(this.draw)
				this.map.removeInteraction(this.snap)
			}
			if (this.vector) {
				this.vector.getSource().clear()
				this.map.removeLayer(this.vector)
			}
		},
		// 编辑绘制
		editDraw: function(){
			// this.selectInteraction()
		}
	}
}
</script>

<style scoped>
#olmap {
	position: relative;
	z-index: 1;
}
.mapselect {
	position: absolute;
	top: 3%;
	right: 2%;
	z-index: 2;
}
.geometryType {
	position: absolute;
	top: 3%;
	right: 16%;
	z-index: 2;
}
.opebutton {
	position: absolute;
	top: 3%;
	right: 20%;
	z-index: 2;
}
.isedit {
	position: absolute;
	top: 4%;
	right: 30%;
	z-index: 2;
}

/*=S 自定义鹰眼样式 */
.ol-custom-overviewmap, .ol-custom-overviewmap.ol-uncollapsible {
	bottom:auto;
	left:auto;
	/* 右侧显示 */
	right: 0;
	/* 顶部显示 */
	top:0;
}
	/* 鹰眼控件展开时空间外框的样式 */
	.ol-custom-overviewmap:not(.ol-collapsed){
		border:1px solid black;
	}
	/* 鹰眼控件中地图容器的样式 */
	.ol-custom-overviewmap .ol-overviewmap-map {
		border:none;
		width: 300px;
	}
	/* 鹰眼控件中显示当前窗口中主图区域的边框 */
	.ol-custom-overviewmap .ol-overviewmap-box {
		border:2px solid red
	}
	/* 鹰眼控件展开时其控件按钮图标的样式 */
	.ol-custom-overviewmap:not(.ol-collapsed) button {
		bottom:auto;
		left: auto;
		right:1px;
		top:1px;
	}
</style>
