<template>
  <div class="home">
    <h3>stickybits demo</h3>
    <div id="nav">
      <ul>
        <li>
          <router-link to="/about">自定义scrollEl</router-link>
        </li>
        <li>
          <router-link to="/multiple">多个实例</router-link>
        </li>
        <li>
          <router-link to="/windowFixed">基于window的fixed</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src


export default {
  name: 'home',
  components: {
    
  }
}
</script>
