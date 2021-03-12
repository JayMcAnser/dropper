<template>
  <drp-panel
      v-model="dialog"
      @onClose="closeDialog"
  >
    <v-card>
      <v-container>
        <div class="inventory"
             v-show="isElementAdd"
        >
          <v-text-field
              label="Inventory"
              placeholder="Inventory"
              append-icon="mdi-feature-search-outline"
          ></v-text-field>
        </div>

        <v-row
            align="center"
            justify="center"
            v-for="(row, index) in items" :key="index"
        >
          <v-col
              align="center"
              justify="center"
              v-for="item in row" :key="item.id">
            <v-btn
                large
                @click="add(item.id)"
                icon>
              <v-icon>{{item.icon}}</v-icon>
            </v-btn>
            <div
                @click="add(item.id)"
                class="link"
            >
              {{item.caption}}
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </drp-panel>
</template>

<script>
  import DrpPanel from "@/components/drp-panel";
export default {
  name: "dialog-element-new",
  data: function() {
    return {
      items: [
        [
          {id: 'text', caption: 'text', icon: 'mdi-text'},
          {id: 'image', caption: 'image', icon: 'mdi-image'},
          {id: 'video', caption: 'video', icon: 'mdi-video'}
        ],
        [
          {id: 'column', caption: 'column', icon: 'mdi-format-columns'},
          {id: 'container', caption: 'container', icon: 'mdi-contain'},
          {id: 'map', caption: 'map', icon: 'mdi-google-maps'}
        ],
        [
          {id: 'sound', caption: 'music', icon: 'mdi-music'},
          {id: 'link', caption: 'web-link', icon: 'mdi-link'},
          {id: 'file', caption: 'file', icon: 'mdi-file'}
        ]
      ]
    }
  },
  components: {DrpPanel},
  computed: {
    dialog: {
      get: function () {
        return this.$store.getters['status/dialogName'] === 'elementNew'
      },
      set: function (value) {
        this.$store.dispatch('status/dialog', false)
      }
    },
    // the element is added to an other element. So it can be a link
    isElementAdd() {
      return this.$store.getters['status/dialogMode'] === 'element'
    }
  },
  methods: {
    async add(type) {
      this.$emit('add', type);
    },
    closeDialog() {
      this.$store.dispatch('status/dialog', false)
    }

  }
}
</script>

<style scoped>
  .inventory {
    margin: 20px 50px 0 50px;
  }
  .link {
    cursor: pointer;
  }
</style>
