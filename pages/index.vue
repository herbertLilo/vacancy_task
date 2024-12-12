<template lang="pug">
  <VacancyOverview></VacancyOverview>
</template>

<script>
import VacancyOverview from '~/components/vacancy_overview.vue';
import Vue from 'vue'

export default Vue.extend({
  components: {
    VacancyOverview
  },
  name: 'IndexPage'
})
