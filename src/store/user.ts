export default defineStore('user', {
  state: () => ({
    userInfo: null as unknown as (Record<string, any> | null),
  }),
  getters: {
    getUserInfo: (state) => {
      if (!state.userInfo) {
        const userInfo = useLocalStorage('userInfo', null);
        state.userInfo = userInfo.value ? JSON.parse(userInfo.value) : null;
        return state.userInfo;
      }
      return state.userInfo;
    },
  },
  actions: {
    resetUserInfo() {
      this.userInfo = null;
      const userInfo = useLocalStorage('userInfo', null);
      userInfo.value = null;
      localStorage.removeItem('userInfo')
    },
    setUserInfo(user: Record<string, any>) {
      this.userInfo = user;
      const userInfo = useLocalStorage('userInfo', '');
      userInfo.value = JSON.stringify(user);
    },
  },
});
