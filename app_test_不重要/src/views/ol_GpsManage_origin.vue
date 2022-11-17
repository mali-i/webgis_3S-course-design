<template>
    <div class="container">
        <div id="vue-openlayers"></div>
    </div>
</template>
 
<script>
import 'ol/ol.css'	
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import { Draw } from "ol/interaction";
import { Style, Fill, Stroke, Circle, Icon } from "ol/style";
import { transform, fromLonLat, toLonLat } from "ol/proj";
import { Point, LineString } from "ol/geom";
 
import { Map, View, interaction, events } from "ol";
import TileLayer from "ol/layer/Tile";
import { defaults as defaultControls } from "ol/control";
import XYZ from "ol/source/XYZ";
 
export default {
  name:'GpsManage',
  data() {
    return {
      map: {},
      featureMove: {},
      carPoints: [], //车还要走的点
      routeIndex: 0, //当前小车所在的路段
      timer: {},
      coordinates: [
        [10836932.628965743, 4998172.218425438],
        [12866589.707787886, 4510331.792951867],
        [12547385.478774315, 2878174.3200711533],
        [12932839.642111458, 2878174.3800711533],
        [13113521.281175744, 3751468.908881867],
        [13125566.723780029, 4739195.202433295],
        [13691702.526181456, 5425785.43087758],
        [13553179.936232172, 6112375.659321865],
        [12920794.199507171, 5407717.266971151],
        [12065567.774602886, 4974081.3332168665],
        [12788294.330860028, 4995785.956289009],
      ],
      routeLayer: {},
    };
  },
  mounted() {
    this.initMap(); //初始化地图方法
    this.open(); //自动开启功能
  },
  methods: {
    //初始化地图
    initMap() {
      this.map = new Map({
        target: "vue-openlayers",
        layers: [
          new TileLayer({          //底图
            source: new XYZ({
              url: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
            }),
          }),
        ],
        view: new View({
          center: fromLonLat([108.522097, 37.272848]),
          zoom: 4,
        }),
      });
    },
    //添加矢量图层
    async open() {
      //画轨迹线
      await this.drawLine();
      //开始动
      this.moveStart();
    },
    //轨迹线  把每个点连起来
    drawLine() {
      this.routeLayer = new VectorLayer({   
        source: new VectorSource({
          features: [],      //先准备好轨迹线的图层routeLayer、该图层的source、该source具备的feature
        }),
      });
      this.map.addLayer(this.routeLayer);
 
      //准备轨迹图层routerLayer中source的feature(由坐标点成线,new成feature)
      let comDots = [];
      let wireFeature = {};
      this.coordinates.forEach((item) => {
        console.log(item)
        comDots.push(item);
        wireFeature = new Feature({      //画轨迹线，new成feature
          geometry: new LineString(comDots),
        });
        wireFeature.setStyle(     //轨迹线的样式
          new Style({
            stroke: new Stroke({
              color: "rgb(255, 106, 158)", //颜色
              width: 3,   //宽度
            }),
          })
        );
        this.routeLayer.getSource().addFeatures([wireFeature]);
      });
    },
    //创建小车这个要素
    moveStart() {
      //坐标转换
      this.dotsData = this.coordinates.map((item) => {
        return transform(item, "EPSG:3857", "EPSG:4326");
      });
      console.log('坐标转换后小车坐标')
      console.log(this.dotsData)
      //深复制车的位置，不在原数组改变，方便重新播放
      // this.carPoints = JSON.parse(JSON.stringify(this.dotsData));
      this.carPoints = [...this.dotsData];   //解构
 
      //小车最初位置在第一个坐标点
      this.featureMove = new Feature({
        geometry: new Point(this.carPoints[0]),
      });
      this.featureMove.setStyle(   //设置小车的样子
        new Style({
          image: new Icon({
            src: require("@/assets/location.png"),
            scale: 0.85,
            anchor: [0.5, 0.5],
            // rotation: this.countRotate(),
          }),
        })
      );
      //添加车辆元素到图层
      this.routeLayer.getSource().addFeature(this.featureMove);
      this.timeStart();
    },
    //计时器开始
    timeStart() {
      this.timer = setInterval(() => {
        if (this.routeIndex + 1 >= this.carPoints.length) {
          //重头开始
          this.routeIndex = 0;
          //移除要素
          this.routeLayer.getSource().removeFeature(this.featureMove);
          clearInterval(this.timer);
          //重复运动
          this.open(); //自动开启功能
          return;
        }
        //到转折点旋转角度
        if (this.nextPoint() === this.carPoints[this.routeIndex + 1]) {
          this.routeIndex++;
          this.featureMove
            .getStyle()
            .getImage()
            .setRotation(this.countRotate());
        }
        //改变坐标点
        this.featureMove
          .getGeometry()
          .setCoordinates(fromLonLat(this.carPoints[this.routeIndex]));
      }, 20);
    },
    //计算下一个点的位置
    //这里的算法是计算了两点之间的点   两点之间的连线可能存在很多个计算出来的点
    nextPoint() {
      let routeIndex = this.routeIndex;
      let p1 = this.map.getPixelFromCoordinate(
        fromLonLat(this.carPoints[routeIndex])
      ); //获取在屏幕的像素位置
      let p2 = this.map.getPixelFromCoordinate(
        fromLonLat(this.carPoints[routeIndex + 1])
      );
      let dx = p2[0] - p1[0];
      let dy = p2[1] - p1[1];
      //打印可见  在没有走到下一个点之前，下一个点是不变的，前一个点以这个点为终点向其靠近
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= 1) {
        return this.carPoints[routeIndex + 1];
      } else {
        let x = p1[0] + dx / distance;
        let y = p1[1] + dy / distance;
        let coor = transform(
          this.map.getCoordinateFromPixel([x, y]),
          "EPSG:3857",
          "EPSG:4326"
        );
        this.carPoints[routeIndex] = coor; //这里会将前一个点重新赋值  要素利用这个坐标变化进行移动
        return this.carPoints[routeIndex];
      }
    },
    //计算两点之间的角度  算旋转角度
    countRotate() {
      let i = this.routeIndex,
        j = i + 1;
      if (j === this.carPoints.length) {
        i--;
        j--;
      }
      let p1 = this.carPoints[i];
      let p2 = this.carPoints[j];
      return Math.atan2(p2[0] - p1[0], p2[1] - p1[1]);
    },
  },
};
</script>
 
<style scoped>
    .container {
        /* width: 840px;
        height: 520px; */
        top:20px;
        position: fixed;
        width:100%;
        height:100%;
        margin: 50px auto;
        /* border: 1px solid #42B983; */
    }
    #vue-openlayers {
        /* width: 800px;
        height: 400px; */
        width:100%;
        height: 100%;
        margin: 0 auto;
        /* border: 1px solid #42B983; */
        position: relative;
    }
</style>
 
