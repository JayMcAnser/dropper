<template>  
  <div>
    <canvas
      ref="canvas"
    >
    </canvas>
  </div>
</template>

<script>

  const MARKERS = {
    lightning: require('../assets/lightning.jpg') 
  } 

  // import iconAction from '../assets/icon-action-small.jpg'
  export default {
    name: 'element-canvas',  
    data: function() {
      return {
        images: [],
        loadedCount: 0
      }
    },
    props: {
      element: {
        type: Object,
        required: true
      }
    },
    computed: {     
      imageURL() {        
        let url = this.$store.getters['board/publicImageRoot'] + this.element.image      
        return url
      }
    },
    methods: {
      loadImages() {
        console.log('images load: ', this.$store.getters['board/publicImageRoot'])
        let rootDir = this.$store.getters['board/publicImageRoot'];
        let vm = this;
        this.loadedCount = 0;
        this.images = []
        if (this.element.images && this.element.images.length) {
          for (let index = 0; index < this.element.images.length; index++) {
            let marker = this.element.images[index];
            let imgDef = {   
              image: new Image(),         
              x: marker.xPos ? marker.xPos: 0,
              y: marker.yPos ? marker.yPos: 0
            }
            
            imgDef.image.onload = function() {
              console.log('did load')
              vm.loadedCount++;
              if (vm.loadedCount === vm.images.length) {
                console.log('draw', vm.loadedCount, vm.images.length)
                let cvn = vm.$refs.canvas;
                let ctx = cvn.getContext("2d"); 
                for (let index = 0; index < vm.images.length; index++) {
                  console.log(`show image: ${index}`)
                  ctx.drawImage(vm.images[index].image, vm.images[index].x, vm.images[index].y)
                }              
              }
            }
            if (marker.imageURL) {              
              imgDef.image.src = rootDir + marker.imageURL  
               this.images.push(imgDef);              
            } else if (marker.image) {
              if (MARKERS.hasOwnProperty(marker.image)) {
                imgDef.image.src = MARKERS[marker.image]
                 this.images.push(imgDef);
              } else {
                console.error(`unknown marker type in element.${this.element.id}: ${marker.image}`)
              }
            } else {
              console.error(`no image for element ${this.element.id}.markers[${index}]`)
            }            
           //this.images.push(imgDef);
          }
          console.log(`waiting for ${this.images.length} images to load`)
        }
      },
      draw() {
        let cvn = this.$refs.canvas;
        let ctx = cvn.getContext("2d");  
        
        let image = new Image();
        image.src = this.imageURL;
        image.onload = function() {
          console.log('DID CALL DRAW')
          ctx.drawImage(image, 0, 0)
        };
        // let mark = new Image();
        // mark.src = iconAction;
        // mark.onload = function() {
        //   console.log('DID CALL DRAW')
        //   ctx.drawImage(mark, 20 ,0);          
        // };
      }
    },
    async mounted() {
      // await this.$nextTick()
       this.loadImages();
      //this.draw()
    }
  }
</script>
