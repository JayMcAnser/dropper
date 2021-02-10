<template>
  <div class="login">
    <login-form
      @login:success="sucess"
    >

    </login-form>
  </div>
</template>

<script>
  
import LoginForm from '../vendors/components/login-form.vue';
  
export default {
  name: 'Login',
  components: {       
    LoginForm
  },
  methods: {
    sucess : function() {      
      this.$router.push('/boards')
    }
  }
}
</script>