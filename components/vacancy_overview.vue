<template>
    <div clas="p-4">
        <!-- Price filter section -->
        <div class="flex flex-col p-1">
            <p class="subtitle">Filter</p>
            <span>{{ shift_price_filter.min }}</span>
            <input
                type="range"
                :min="shift_price_filter.min"
                :max="shift_price_filter.max"
                v-model="shift_price_filter.current"
                @input="applyshift_price_filter"
                class="slider"
            />
            <span>{{ shift_price_filter.current }}</span>
        </div>

         <!-- Vacancies list section -->
        <div>
            <!-- Vacancies list header -->
            <div class="flex mb-2">
                <p class="subtitle mb-0">
                    Vacancies
                </p>
                <a @click.prevent="open_vacancy_form(0)"
                    href="" class="text-slate-600 border-slate-600 border rounded ml-auto px-1">
                    Create new vacancy
                </a>
            </div>
            <!-- Vacancies list -->
            <div
                v-for="vac in sorted_vacancies"
                :key="vac.id"
                class="flex flex-col border border-slate-300 shadow p-2 mb-2"
            >
                <div class="flex justify-between">
                    <span class="text-lg">
                        {{ vac.title }}
                    </span>
                    <a @click.prevent="edit_vacancy(vac)" class="text-slate-600">
                        <i class="fas fa-edit"></i>
                    </a>
                </div>
                <p>
                    {{ vac.description }}
                </p>
                <div>
                <strong class="mt-2">Dates</strong>
                <ul>
                    <li
                    v-for="(shift, index) in vac.dates"
                    :key="index"
                    class="w-full bg-slate-500 mb-2 text-white flex p-2 space-3 rounded"
                    >
                    <span class="w-48"> {{ shift.date }} </span>
                    <span class="w-32"> {{ shift.startTime }} </span>
                    <span class="w-32"> {{ shift.endTime }} </span>
                    <span class="w-48"> {{ shift.type }} </span>
                    <span class="ml-auto"> {{ shift.price }} </span>
                    </li>
                </ul>
                </div>
            </div>

        </div>

          <ShiftForm 
                :vacancy="selected_vacancy"
                :show_vacancy_form="show_vacancy_form"
                :vacancy_validation_errors="vacancy_validation_errors"
                @update:show_vacancy_form="show_vacancy_form = $event"
                @create_vacancy="create_vacancy"
                @remove_vacancy="remove_vacancy"
          />

    </div>
</template>

<script>

import ShiftForm from "./shift_form.vue";

export default {
    components: {
        ShiftForm,
    },
    data() {
        return {
            show_vacancy_form: false,
            selected_vacancy: {
                dates: [],
            },
            shift_price_filter: {
                min: 0,
                max: 0,
                current: 0,
            },
            vacancy_validation_errors: []
        }
    },
    methods: {
        open_vacancy_form(id) {
            this.show_vacancy_form = true
            if(!id){
                this.selected_vacancy = {
                    dates: [],
                };
            } else {
                this.selected_vacancy = {
                ...(this.vacancies.find((v) => v.id === id) || {}),
                };
            }
        },
        edit_vacancy(v) {
            this.selected_vacancy = JSON.parse(JSON.stringify(v))
            this.show_vacancy_form = true;
        },
        remove_vacancy(id) {
            if (confirm("Delete this vacancy?")) {
                this.$store.dispatch("remove_vacancy", id);
                this.selected_vacancy = {
                    dates: [],
                };
                this.show_vacancy_form = false;
            }
        },
        create_vacancy() {
            // Check fields validation
            if (!this.validate_vacancies_fields(this.selected_vacancy.dates)) {
                return;
            }
            if (this.selected_vacancy.id) {
                this.$store.dispatch("update_vacancy", this.selected_vacancy);
            } else {
                var new_vacancy = {
                ...this.selected_vacancy,
                id: Date.now(),
                };
                console.log('this.selected_vacancy', this.selected_vacancy)
                this.$store.dispatch("create_vacancies", new_vacancy);
            }
            this.show_vacancy_form = false;
        },
        validate_vacancies_fields(d) {
            this.vacancy_validation_errors = [];

            // Dates has at least 1 and at most 10 items
            if (!d || d.length < 1 || d.length > 10) {
                this.vacancy_validation_errors.push(
                "Invalid date format"
                );
            }

            const types = ["Consultation", "Telephone", "Ambulance"];
            const dateMap = {};

            // Loop through each date entry and perform validation
            for (let i = 0; i < d.length; i++) {
                const selected_date = d[i];

                // Validate date format
                if (
                !selected_date.date ||
                !/^\d{4}-\d{2}-\d{2}$/.test(selected_date.date)
                ) {
                this.vacancy_validation_errors.push(
                    `Invalid date format for entry ${i + 1}.`
                );
                }

                // Validate start time format
                if (
                    !selected_date.start_time ||
                    !/^\d{2}:\d{2}$/.test(selected_date.start_time)
                    ) {
                    this.vacancy_validation_errors.push(
                        `Start time is required and must be in HH:mm format for entry ${
                        i + 1
                        }.`
                    );
                }

                // Validate end time format
                if (
                    !selected_date.end_time ||
                    !/^\d{2}:\d{2}$/.test(selected_date.end_time)
                    ) {
                    this.vacancy_validation_errors.push(
                        `End time is required and must be in HH:mm format for entry ${
                        i + 1
                        }.`
                    );
                }

                // end_time is later than start_time
                if (selected_date.start_time >= selected_date.end_time) {
                    this.vacancy_validation_errors.push(
                        `End time must be later than start time for entry ${i + 1}.`
                    );
                }

                // Validate type
                if (!types.includes(selected_date.type)) {
                    this.vacancy_validation_errors.push(
                        `Invalid type for entry ${i + 1}. Must be one of: ${types.join(
                        ", "
                        )}.`
                    );
                }

                // Validate price
                if (
                    isNaN(parseFloat(selected_date.price)) ||
                    parseFloat(selected_date.price) < 0
                ) {
                    this.vacancy_validation_errors.push(
                        `Price must be 0 or a positive number for entry ${i + 1}.`
                    );
                }

                // Check for overlapping times
                const key = `${selected_date.date}-${selected_date.type}`;
                if (!dateMap[key]) {
                    dateMap[key] = [];
                }

                for (const existing of dateMap[key]) {
                    if (
                        selected_date.start_time < existing.end_time &&
                        selected_date.end_time > existing.start_time
                    ) {
                        this.vacancy_validation_errors.push(
                        `Overlapping times detected for type '${selected_date.type}' on ${selected_date.date}.`
                        );
                    }
                }

                dateMap[key].push({
                    start_time: selected_date.start_time,
                    end_time: selected_date.end_time,
                });
            }

            return this.vacancy_validation_errors.length == 0;
        },
        applyshift_price_filter() {},
    },
    computed: {
        vacancies() {
            if (this.$store && this.$store.getters) {
                return this.$store.getters.all_vacancies
            }
        },
        sorted_vacancies() {
            return this.vacancies.filter((v) =>
                v.dates.some((date) => date.price <= this.shift_price_filter.current)
            );
        }
    },
    mounted() {
        this.$store.dispatch("get_vacancies")

        if (this.vacancies.length > 0) {
            this.shift_price_filter.min = Math.min(
                ...this.vacancies.flatMap((vac) => vac.dates.map((date) => date.price))
            )
            this.shift_price_filter.max = Math.max(
                ...this.vacancies.flatMap((vac) => vac.dates.map((date) => date.price))
            )
            this.shift_price_filter.current = this.shift_price_filter.max
        }

    },
}
</script>