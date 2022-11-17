import Vue from 'vue'
import Router from 'vue-router'

import Index from './views/Index.vue'
import Home from './views/Home.vue'
import MapHome from './views/MapHome.vue'
import ol_FeatureEdit from './views/OpenLayers/ol_FeatureEdit'
import ol_GpsManage from './views/OpenLayers/ol_GpsManage'
import ol_QueryPosition from './views/OpenLayers/ol_QueryPosition'
import ol_SatelliteSynchronous from './views/OpenLayers/ol_SatelliteSynchronous'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/index',
      component: Index,
      children: [
        {
          path: '/home', 
          name:'home', 
          component: Home
        },
        {
          path: '/map', 
          name: 'map', 
          component: MapHome
        },
        {
          path: '/ol_FeatureEdit', 
          name: 'ol_FeatureEdit',
          component: ol_FeatureEdit
        },
        {
          path:'/ol_GpsManage',
          name:'ol_GpsManage',
          component:ol_GpsManage
        },
        {
          path:'/ol_QueryPosition',
          name:'ol_QueryPosition',
          component:ol_QueryPosition
        },
        {
          path:'/ol_SatelliteSynchronous',
          name:'ol_SatelliteSynchronous',
          component:ol_SatelliteSynchronous
        }
      ]
    },
    {
      path:'*',
      redirect:'/home'
    }
  ]
})

export default router