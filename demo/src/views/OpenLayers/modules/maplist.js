import XYZ from "ol/source/XYZ";
/*
let source_gaode, source_gaodesat, source_gaodesatlabel;  //定义高德地图源地址
let source_tiandi, source_tiandisat, source_tiandilabel;  //定义天地图源地址
let source_geoq_ChinaOnlineCommunity, source_geoq_ChinaOnlineStreetWarm, source_geoq_ChinaOnlineStreetGray, source_geoq_ChinaOnlineStreetPurplishBlue; //定义geoq智图在线地图服务

*/
//********************加载在线天地图*************************//
let source_tiandi = new XYZ({
    url:"http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=" + "acd48023c7052b05498944b04ffa7b29"
})

//********************加载在线天地卫星影像地图*************************//
let source_tiandisat = new XYZ({
    url:"http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=" + "acd48023c7052b05498944b04ffa7b29"
})

//天地图labels图层,天地图所有图层都要用
let source_tdtlabeldz = new XYZ({
    url:"http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=" + "acd48023c7052b05498944b04ffa7b29"
})
let source_tdtlabelwx = new XYZ({
    url:"http://t0.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=" + "acd48023c7052b05498944b04ffa7b29"
})

//********************加载在线高德地图*************************//
let source_gaode = new XYZ({
    url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
})

//********************加载在线高德卫星影像地图*************************//
let source_gaodesat = new XYZ({
    url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=6&x={x}&y={y}&z={z}'
})

let source_gaodesatlabel = new XYZ({
    url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
})



//********************geoq智图在线地图服务*************************//
let source_geoq_ChinaOnlineCommunity = new XYZ({
    url: 'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}'
})
let source_geoq_ChinaOnlineStreetGray = new XYZ({
    url: 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}'
})
let source_geoq_ChinaOnlineStreetWarm = new XYZ({
    url: 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetWarm/MapServer/tile/{z}/{y}/{x}'
})
let source_geoq_ChinaOnlineStreetPurplishBlue = new XYZ({
    url: 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'
})

let mapLabel = [
    {
        label: '在线天地图',
        options: [
            {
                value: 'tdtdz',
                label: '天地图电子地图'
            },
            {
                value: 'tdtwx',
                label: '天地图卫星图'
            }
        ]
    },
    {
        label: '在线高德地图',
        options: [
            {
                value: 'gaodedz',
                label: '高德电子地图'
            },
            {
                value: 'gaodewx',
                label: '高德卫星图'
            }
        ]
    },
    {
        label: '智图在线地图（ArcGIS REST）',
        options: [
            {
                value: 'geoqcs',
                label: '彩色地图'
            },
            {
                value: 'geoqns',
                label: '暖色地图'
            },
            {
                value: 'geoqhs',
                label: '灰色地图'
            },
            {
                value: 'geoqlh',
                label: '蓝黑地图'
            }
        ]
    }
]

let maplist ={
    basemapLabel: mapLabel,    
    tdtdz: source_tiandi,
    tdtlabeldz: source_tdtlabeldz,
    tdtwx: source_tiandisat,
    tdtlabelwx: source_tdtlabelwx,
    gaodedz: source_gaode,
    gaodewx: source_gaodesat,
    gaodelabelwx: source_gaodesatlabel,
    geoqcs: source_geoq_ChinaOnlineCommunity,
    geoqns: source_geoq_ChinaOnlineStreetWarm,
    geoqhs: source_geoq_ChinaOnlineStreetGray,
    geoqlh: source_geoq_ChinaOnlineStreetPurplishBlue
}
export default maplist