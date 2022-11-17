<template>
  <div id="app">
    <router-view></router-view>   
  </div>
</template>

<script>
import Gps from './components/Gps'

export default {
  name: 'App',
  components: {
    Gps
  }
}
</script>

