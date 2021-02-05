<template> 
  <div class="d-flex flex-row mb-2">
    <div class="d-flex flex-row mb-2">
      <v-card
        class="ma-4"
        max-width="500"
      >
        <v-toolbar>
          <v-app-bar-nav-icon></v-app-bar-nav-icon>
          <v-toolbar-title>Formats</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-checkbox-marked-circle</v-icon>
          </v-btn>
        </v-toolbar>

        <v-list two-line>
          <v-list-item-group
            active-class="gray--text"    
          >
            <template v-for="(phone, index) in phones">
              <v-list-item :key="phone.type" 
                @click="activeStyleIndex=index"
              >
                <template v-slot:default="{ active }">
                  <v-list-item-content>
                    <v-list-item-title v-text="phone.type"></v-list-item-title>
                    <v-list-item-subtitle >({{ phone.width }} x {{ phone.height}})</v-list-item-subtitle>
                  </v-list-item-content>
                  
                </template>
              </v-list-item>
              <v-divider
                v-if="index < [phones].length - 1"
                :key="index"
              ></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
      </v-card>
    </div>
    <div class="d-flex flex-row mb-6">      
      <div class="smartphone">
        <div class="content" :style="canvas">
          <iframe src="/boards" style="width:100%;border:none;height:100%" />
        </div>
      </div>
    </div>  
  </div>
</template>

<script>
export default {
  name: "webview",
  layout: 'blank',
  data: function() {
    return {
      activeStyleIndex: 0,
      active: '',
      phones: [
        {type: 'IPhone XS', width: '414px', height: '896px'},
        {type: 'IPhone 8 Plus', width: '414x', height: '736px'},
        {type: 'IPhone 7', width: '375x', height: '667px'},
        {type: 'One Plus', width: '480px', height: '853px'},
        {type: 'Samsung Galaxy s9', width: '412px', height: '869px' },
        {type: 'Samsung Galaxy s7', width: '360px', height: '640px' },
        {type: 'Samsung Note 10', width: '360px', height: '740px' },
        {type: 'Huawei P20', width: '360px', height: '748px' },
        {type: 'Xiaomi Redme 5', width: '393px', height: '786px' },
      ]
    }
  },
  computed:{
    currentStyle() {
      return this.phones[this.activeStyleIndex].css
    },
    canvas() {
      return { width: this.phones[this.activeStyleIndex].width, height: this.phones[this.activeStyleIndex].height};
    }
  },
}
</script>

<style scoped>
/* The device with borders */
.smartphone {
  position: relative;
  margin: auto;
  border: 16px black solid;
  border-top-width: 60px;
  border-bottom-width: 60px;
  border-radius: 36px;
}
.active {
  font-weight: bold;
}
/* The horizontal line on the top of the device */
.smartphone:before {
  content: '';
  display: block;
  width: 60px;
  height: 5px;
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #333;
  border-radius: 10px;
}

/* The circle on the bottom of the device */
.smartphone:after {
  content: '';
  display: block;
  width: 35px;
  height: 35px;
  position: absolute;
  left: 50%;
  bottom: -65px;
  transform: translate(-50%, -50%);
  background: #333;
  border-radius: 50%;
}


/* The screen (or content) of the device */
.smartphone .content {
  height: 640px;
  background: white;
}
</style>
