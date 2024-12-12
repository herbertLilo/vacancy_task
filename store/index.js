export const state = () => ({
    vacancies: []
})

export const mutations = {
    get_vacancies(state) {
        if (process.client) {
            const saved_vacancies = localStorage.getItem('system_vacancies')
            state.vacancies = saved_vacancies ? JSON.parse(saved_vacancies) : []
        }
    },
    create_vacancies(state, vacancy) {
        console.log('aaa', vacancy)
        state.vacancies.push(vacancy)
        if (process.client) {
            localStorage.setItem('system_vacancies', JSON.stringify(state.vacancies))
        }
    },
    update_vacancy(state, updated_vacancy) {
        const vac_index = state.vacancies.findIndex(
            (vac) => vac.id == updated_vacancy.id
        )
        if (vac_index != -1) {
            state.vacancies.splice(vac_index, 1, updated_vacancy)
            if (process.client) {
                localStorage.setItem('system_vacancies', JSON.stringify(state.vacancies))
            }
        }
    },
    remove_vacancy(state, vac_id) {
        state.vacancies = state.vacancies.filter(v => v.id != vac_id)
        if (process.client) {
            localStorage.setItem('system_vacancies', JSON.stringify(state.vacancies))
        }
    }
}

export const actions = {
    get_vacancies({ commit }) {
        commit('get_vacancies')
    },
    update_vacancy({ commit }, vacancy) {
        commit('update_vacancy', vacancy)
    },
    create_vacancies({ commit }, vacancy) {
        commit('create_vacancies', vacancy)
    },
    remove_vacancy({ commit }, id) {
        commit('remove_vacancy', id)
    }

}

export const getters = {
    all_vacancies(state) {
        return state.vacancies
    }
}