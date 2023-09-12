import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    userTokens: null,
    showUsersWithType: '',
    userInUserDetailsPage: null,
    courseInCourseDatailsPage: null,
    stageInLessonPage: null,
    stageInExamPage: null,
    stageInShowAskedProjectPage: null,
    stageInSubmitStagesExamPage: null,
    userInEditUserPage: null,
    currentDashboardDisplayedContent: "ShowUsers",
    currentCourseDisplayedContent: 'CourseDetails',
    currentStage: null,
    ProjectInProjectDatailsPage: null
  },
  getters: {
    isAuthenticated(state) {
      return state.user !== null
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user
      if (user) {
        if (user.userType == 'supervisor') {
          state.currentDashboardDisplayedContent = "ConfirmingProjects";
        }
      } else {
        state.userTokens = null;
        state.showUsersWithType = '';
        state.userInUserDetailsPage = null;
        state.courseInCourseDatailsPage = null;
        state.stageInLessonPage = null;
        state.stageInExamPage = null;
        state.stageInShowAskedProjectPage = null;
        state.stageInSubmitStagesExamPage = null;
        state.currentStage = null;
        state.ProjectInProjectDatailsPage = null;
      }
    },
  },
  actions: {
    login({ commit }, user) {
      // Perform login logic here
      commit('setUser', user)
    },
    logout({ commit }) {
      // Perform logout logic here
      commit('setUser', null)
    }
  }
})
