<template>
	<div id="olmap" ref="olmap" style="width: 100%; height: 100%;">
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
	</div>
</template>

<script>
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import { transform } from 'ol/proj'
import mapSources from './modules/maplist'
import OverviewMap from 'ol/control/OverviewMap'

export default {
	components: {},
	data() {
		return {
			options: mapSources.basemapLabel,
			value: '',    
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
			mapLayerlabel: null
		}
	},
	mounted() {
      //初始化地图
      this.map = new Map({
          target: 'olmap',  //目标容器
          projection: this.proj,  //定义wgs84地图坐标系
          view: new View({
              center: transform(
                [101.46912, 36.24274],
                this.proj,
                this.proj_m
              ),
          zoom: 5
        })
      })
      //初始化地图图层
      this.mapLayer = new TileLayer({
        source: this.tdtdz,
      })
      //初始化标签图层
      this.mapLayerlabel = new TileLayer({
        source: this.tdtlabelwx,
        // projection: this.proj
      })
      //将图层加载到地图对象
      this.map.addLayer(this.mapLayer)
      this.map.addLayer(this.mapLayerlabel)


      //实例化一个自定义样式的鹰眼空间并加入地图中
      // this.map.addControl(
      //   new OverviewMap({
      //       //鹰眼控件样式 overviewmap-custom
      //       className:'ol-overviewmap ol-custom-overviewmap',
      //       //鹰眼中加载同坐标系下不同数据源的图层
      //       layers:[this.mapLayer],                               //要获取当前图层
      //       //鹰眼控件展开时功能按钮上的标识(网页的JS字符编码)
      //       collapseLabel:'\u00BB',
      //       //鹰眼控件折叠时功能按钮上的标识(网页的JS字符编码)
      //       label:'\u00AB',
      //       //功能按钮的初始显示方式设置为展开
      //       collapsed:false
      //   }))
  },
  methods: {
		/******************地图切换方法***************/
		changeBaseMap: function(value) {
      console.log(value)
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
          break;
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
          break;
        case 'gaodedz':
          this.mapLayer = new TileLayer({
            source: this.gaodedz,
            projection: this.proj
          })
          this.map.addLayer(this.mapLayer)
          break;
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
          break;
        case 'geoqcs':
          this.mapLayer = new TileLayer({
            source: this.geoqcs,
            projection: this.proj
          })
          this.map.addLayer(this.mapLayer)
          break;
        case 'geoqns':
          this.mapLayer = new TileLayer({
            source: this.geoqns,
            projection: this.proj
          })
          this.map.addLayer(this.mapLayer)
          break;
        case 'geoqhs':
          this.mapLayer = new TileLayer({
            source: this.geoqhs,
            projection: this.proj
          })
          this.map.addLayer(this.mapLayer)
          break;
        case 'geoqlh':
          this.mapLayer = new TileLayer({
            source: this.geoqlh,
            projection: this.proj
          })
          this.map.addLayer(this.mapLayer)
          break;
			}
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

/*=S 自定义鹰眼样式 */
.ol-custom-overviewmap, .ol-custom-overviewmap.ol-uncollapsible {
  bottom:auto;
  left:auto;
  /* 右侧显示 */
  right: 0;
  /* 底部显示 */
  bottom:0;
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
