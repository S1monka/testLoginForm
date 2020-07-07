<template lang="pug">
      .container
       .row
        div(class="col-sm-10 col-md-8 col-lg-5 m-auto")
          form(class="form-signin text-center p-1 d-flex flex-column justify-content-between" @submit.prevent="getUser")
            h1(class="h3 mb-3 font-weight-normal") Login form
            input( class="form-control" placeholder="Login" required autofocus v-model.lazy="userName")
            input( type="password" class="form-control" placeholder="Password" required v-model.lazy="password" )
            div(class="alert alert-danger my-1 p-1" role="alert" v-if="loginError")
             p(class="mb-0" v-if="this.$route.params.message") You need to login first
             p(class="mb-0" v-else) Invalid username or login... Please try again
            button( class="btn btn-lg btn-primary btn-block mt-3" type="submit") Sign in
</template>

<script>
export default {
  data: () => ({
    userName: "",
    password: ""
  }),
  computed: {
    loginError() {
      return (
        this.$route.params.message != undefined ||
        this.$store.state.isLogin == "error"
      );
    }
  },
  methods: {
    async getUser() {
      const { userName, password } = this;
      await this.$store.dispatch("getUser", { userName, password });
      this.loginError ? "" : this.$router.push({ name: "profilePage" });
    }
  }
};
</script>

<style lang="scss" scoped>
.row {
  min-height: 100vh;
}
</style>
