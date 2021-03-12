<template>
  <v-card
      elevation="0"
      @click="edit(element)">
    <v-card-title>
      {{ element.title}}
      <v-spacer/>
      {{ element.type }}
      <v-btn
        icon
        @click="showProperties = !showProperties"
      > <v-icon>{{ showProperties ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-title>

    <v-expand-transition>
      <div v-show="showProperties">
        <v-card-text >
          <v-simple-table dense>
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-left">
                  property
                </th>
                <th class="text-left">
                  value
                </th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="(value, key) in stringProps"
              >
                <td>{{ key }}</td>
                <td>{{ value }}</td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
import {debug} from "../vendors/lib/logging";

export default {
  name: "element-unknown",
  data: function() {
    return {
      showProperties: false,
    }
  },
  props: {
    element: {
      type: Object,
      required: true,
      default: {}
    }
  },
  computed: {
    stringProps() {
      let fields = this.element.visibleFields;
      return fields;
    }
  },
  methods: {
    async edit(element) {
      debug(`open elementDialog on ${element.id}`, 'element-unknown')
      await this.$store.dispatch('status/dialog', {dialog: 'elementDialog', id: element.id})
    }
  }
}
</script>

<style scoped>

</style>
