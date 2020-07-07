<template lang="pug">
  .container
    .row
      div(class="col my-5")
        .profile-info(class="jumbotron d-flex align-items-center")
          img(:src="profileImg" 
              class=" rounded mr-5 img-fluid")
          .text-info
            h4 {{fullName}}
            h6 {{email}}
          h5(class="mx-auto" @click="logout") Logout

        .search-contacts
          input( class="form-control" placeholder="Search contacts..." v-model="search")

        .contacts(class="mt-4")
          ul(class="list-group")
            .addItem(
              class="pl-3 pb-3 d-flex align-items-center w-25"
              id="addItem"
              @click="addPressed=true"
              )
              img(src="@/assets/add.svg")
              h6(class="m-0 ml-2") Add contact

            li(class="list-group-item" v-if="addPressed")
              input(class="form-control"
                    ref="add"
                    placeholder="Contact name..."
                    @blur="addPressed=false"
                    @keyup.enter="addContact")

            li(class="list-group-item d-flex align-items-center justify-content-between"
               v-for="(contact, index) in filteredContacts"
               :key="`contact_${index}`")

              input(
                class="form-control w-50"
                ref="edit"
                :value="contact.title"
                @blur="editId = -1"
                @keyup.enter="submitEdit()"
                v-if="editId == contact.id")

              h6(class="mb-0" v-else) {{contact.title}}
              .actions
                img(src="@/assets/edit.svg" class="mr-3" @click="editContact(contact.id)")
                img(src="@/assets/trash.svg" @click="removeContact(contact.id)")
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data: () => ({
    search: "",
    addPressed: false,
    editId: -1
  }),
  computed: {
    ...mapGetters(["fullName"]),
    email() {
      return this.$store.state.currentUser.email;
    },
    profileImg() {
      return this.$store.state.currentUser.avatar;
    },
    contacts() {
      return this.$store.state.currentUser.contacts;
    },
    filteredContacts() {
      return this.contacts.filter(contact => {
        return contact.title.toLowerCase().includes(this.search.toLowerCase());
      });
    }
  },
  methods: {
    editContact(id) {
      this.editId = id;

      this.$nextTick(() => {
        this.$refs.edit[0].focus();
      });
    },
    submitEdit() {
      const newValue = this.$refs.edit[0].value;
      this.$store.commit("editContact", { newValue, id: this.editId });
      this.editId = -1;
    },
    addContact() {
      const title = this.$refs.add.value;
      this.$store.commit("addContact", title);
      this.addPressed = false;
    },
    removeContact(id) {
      this.$store.commit("removeContact", id);
    },
    logout() {
      this.$store.commit("setLogin", false);
      this.$router.push("loginPage");
    }
  },
  beforeDestroy() {
    this.$store.dispatch("postContacts");
  }
};
</script>

<style lang="scss" scoped>
.row {
  min-height: 100vh;
}
.profile-info {
  h3,
  h6 {
    word-break: break-word;
  }
  h5 {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
#addItem {
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
.actions {
  img:hover {
    cursor: pointer;
    transform: scale(1.1);
  }
}
</style>
