<template>
  <div
    v-if="show_vacancy_form"
    @click.self="close_vacancy_form"
    class="flex justify-end items-center fixed inset-0 bg-slate-500 bg-opacity-50"
  >
    <div class="bg-slate-50 w-2/3 p-2" style="overflow-y: scroll; height: 100vh">
      <div class="flex mb-4">
        <strong>
          {{ vacancy.id ? "Edit Shift" : "Create New Shift" }}
        </strong>
        <button type="button" @click="close_vacancy_form" class="ml-auto font-bold">
          X
        </button>
      </div>
      <form>
        <div v-if="vacancy_validation_errors.length" class="border border-red-600 ">
          <ul>
            <li v-for="(err, index) in vacancy_validation_errors" :key="index">{{ err }}</li>
          </ul>
        </div>

        <div>
          <label>Title</label>
          <input
            v-model="vacancy.title"
            type="text"
            maxlength="100"
            class="w-full border border-slate-400 rounded px-2 py-1"
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            v-model="vacancy.description"
            maxlength="500"
            class="w-full border border-slate-400 rounded px-2 py-1"
          ></textarea>
        </div>

        <div>
          <div class="flex justify-between items-end mb-1">
            <label>Dates</label>
            <a @click.prevent="add_vacancy_shift" class="border rounded border-slate-500 px-1 text-slate-500">
              + Date
            </a>
          </div>
          <div
            v-for="(d, index) in vacancy.dates"
            :key="index"
            class="flex flex-col border rounded bg-slate-500 text-white relative mb-3 p-2"
          >
            <div>
              <label>Date</label>
              <input
                type="date"
                v-model="d.date"
                class="text-black w-full rounded px-1"
                required
              />
            </div>
            <div class="flex justify-between gap-1">
              <div>
                <span>Start Time</span>
                <input
                  type="time"
                  v-model="d.start_time"
                  class="text-black w-full rounded px-1"
                  required
                />
              </div>
              <div>
                <span>End Time</span>
                <input
                  type="time"
                  v-model="d.end_time"
                  class="text-black w-full rounded px-1"
                  required
                />
              </div>
              <div>
                <span>Price</span>
                <input
                  type="number"
                  v-model="d.price"
                  class="text-black w-full rounded px-1"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label>Type</label>
              <select
                v-model="d.type"
                class="w-full border border-gray-300 rounded px-2 py-1 text-black"
                required
              >
                <option value="Consultation">Consultation</option>
                <option value="Telephone">Telephone</option>
                <option value="Ambulance">Ambulance</option>
              </select>
            </div>

            <a @click.prevent="remove_shift(index)" class="absolute top-1 right-2 text-white hover:text-white">x</a>
          </div>
        </div>

        <div class="flex justify my-4">
          <button
            v-if="vacancy.id"
            @click="remove_vacancy(vacancy.id)"
            class="border border-slate-500 rounded w-1/2 mr-2"
          >
            Delete
          </button>
          <button
            @click.prevent="create_vacancy"
            :class="[vacancy.id ? 'w-1/2' : 'w-full']"
            class="border border-slate-500 rounded ml-auto"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
    
</template>

<script>
export default {
    props: {
        vacancy: {
            type: Object,
            required: true,
        },
        show_vacancy_form: {
            type: Boolean,
            required: true,
        },
        vacancy_validation_errors: {
            type: Array,
            default: () => [],
        },
    },
    methods: {
        close_vacancy_form() {
            this.$emit('update:show_vacancy_form', false);
        },
        add_vacancy_shift() {
            if (!this.vacancy.dates) {
                this.vacancy.dates = [];
            }
            this.vacancy.dates.push({
                date: '',
                start_time: '',
                end_time: '',
                price: '',
                type: 'Consultation',
            });
        },
        remove_shift(index) {
            this.vacancy.dates.splice(index, 1);
        },
        create_vacancy() {
            this.$emit('create_vacancy');
        },
        remove_vacancy(id) {
            if (confirm('Delete vacancy?')) {
                this.$emit('remove_vacancy', id);
            }
        },
    }
}
</script>