import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const url = "http://localhost:3000/users";

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
  state: {
    isLogin: false,
    currentUser: {},
  },
  mutations: {
    setLogin(state, payload) {
      state.isLogin = payload;
    },
    setUser(state, user) {
      state.currentUser = user;
    },
    addContact(state, title) {
      state.currentUser.contacts.push({
        title: title,
        id: state.currentUser.contacts.length + 1,
      });
    },
    editContact(state, { newValue, id }) {
      state.currentUser.contacts.map((item) => {
        if (item.id == id) {
          item.title = newValue;
        }
      });
    },
    removeContact(state, id) {
      state.currentUser.contacts = state.currentUser.contacts.filter(
        (item) => item.id !== id
      );
    },
  },
  actions: {
    async getUser({ commit }, { userName, password }) {
      const { data } = await axios.get(
        `${url}?userName=${userName}&password=${password}`
      );

      const user = data[0];

      if (data.length > 0) {
        commit("setLogin", true);
        commit("setUser", user);
      } else {
        commit("setLogin", "error");
      }
    },
    async postContacts({ state }) {
      await axios.patch(`${url}/${state.currentUser.id}`, {
        contacts: state.currentUser.contacts,
      });
    },
  },
  getters: {
    fullName: (state) =>
      state.currentUser.firstName + " " + state.currentUser.lastName,
  },
});
