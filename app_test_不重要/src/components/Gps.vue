<template>
  <div>
    <div id="map" class="map"></div>
  </div>
</template>
  
<script>
    import "ol/ol.css";
    import GeoJSON from "ol/format/GeoJSON";
    import Map from "ol/Map";
    import View from "ol/View";
    import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
    import { OSM, Vector as VectorSource } from "ol/source";
    import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";

    import Vue from "vue";

    //定义标签样式
    var image = new CircleStyle({
        radius: 5,
        fill: new Fill({
            color: "rgba(255, 0, 0, 1)",
        }),
        stroke: new Stroke({ color: "red", width: 1 }),
    });

    var styles = {
        Point: new Style({
            image: image,
        }),
    };

    var styleFunction = function (feature) {
        return styles[feature.getGeometry().getType()];
    };

    //模拟GeoJSON数据
    var geojsonObject = {
        type: "FeatureCollection",
        features: [
            {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [0, 0],
            },
            },
        ],
    };
    //还可以添加更多feature

    //创建vectorLayer
    //读取GeoJSON,，将其作为vectorSource的数据源
    var vectorSource = new VectorSource({
        features:new GeoJSON().readFeatures(geojsonObject),
    });

    var vectorLayer = new VectorLayer({
        source: vectorSource,
        style: styleFunction,
    });

    //创建vue实例并向外暴露
    export default Vue.extend({
        name: "Gps",
        data(){
            return{
                map:{},
            };
        },
        mounted() {
            //实例化Map对象
            this.map = new Map({
                layers: [
                    new TileLayer({
                        source: new OSM({
                            url:"http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=" + "acd48023c7052b05498944b04ffa7b29",
                            wraps:false
                        }),
                    }),
                    vectorLayer,
                ],
                target: "map",
                view: new View({
                    center: [0, 0],
                    zoom: 2,
                }),
            });

            setInterval(this.translate, 500);
        },

        methods:{
            translate(){
                vectorSource.forEachFeature(function(f){
                    console.log("translate");
                    var x = Math.random() * 1000000;
                    var y = Math.random() * 1000000;
                    f.getGeometry().translate(x, y);
                });
                },
        },
    });
</script>

<style>
    .map {
    width: 100%;
    height: 600px;
    }
</style>
