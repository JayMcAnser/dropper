<template>
  <div>
    <app-bar
    >
     <template v-slot:left>
        <v-btn
          icon
          @click="doCancel"          
        ><v-icon>mdi-close</v-icon></v-btn>
      </template>
      <template v-slot:right>
        <v-btn
          icon
          @click="submit()"
        ><v-icon>mdi-content-save</v-icon></v-btn>
      </template>
    </app-bar>
    <div class="board-form">
    
      <v-form
        @submit.prevent="submit"
          ref="form"
          v-model="valid"
          lazy-validation
        >
        <v-text-field
          v-model="title"
          :counter="100"
          :rules="titleRules"
          label="Title"
          required
        ></v-text-field>      
       <v-text-field
          v-model="name"
          :counter="30"
          label="Name"
          required
        ></v-text-field>   
        <v-textarea
          v-model="description"
          name="description"
          label="Description"
          auto-grow
        ></v-textarea>
      </v-form>
    </div>    
  </div>
</template>
<script>
import appBar from '../components/app-bar.vue'
import {debug, error} from '../vendors/lib/logging'
export default {
  components: { appBar },
  data: function() {
    return {
      id: '',
      isAdd: false,
      valid: true,
      name: '',
      title: '',
      titleRules: [
        v => !!v || 'Title is required',
        v => (v && v.length >= 5) || 'The title must be atleast 5 characters',
      ],
      description: '',
    }
  },
  async mounted() {
    this.id = this.$route.params.id;
    this.isAdd = ! this.id
    if (!this.isAdd) {
      debug(`edit board ${this.id}`)
      let board = await this.$store.dispatch('board/open', {id: this.id})
      this.title = board.title;
      this.description = board.description;
    } else {
      debug(`new board`)
    }
  },  
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        let board = {
          id: this.id,
          title: this.title,
          name: this.name,
          description: this.description
        };
        try {
          let id = await this.$store.dispatch('board/save', board);  
          this.$router.push({name: 'board', params: {id}})
        } catch(e) {
          error(`[board-edit] ${e.message}`)
        }
      }
    },
    doCancel() {      
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped>
  .board-form {
    margin: 8px;
  }
</style>