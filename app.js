Vue.component('popover', {
    props: ['day', 'index', 'showpopup'],
    template: `
            <div class="popover" v-bind:class="{'show': showpopup === index}">
                <div class="day-popover" transition="fade">
                    <button @click.prevent="selectAll()"> <i class="far fa-plus-square"></i> De/Select all {{ day }}</button>
                </div>
            </div>
`,
    methods: {
        selectAll() {
            this.$emit('select-all')
        }
    }
})



const app = new Vue({
    el: '#calendar',
    data() {
        return {
            focusedDay: moment(),
            months: moment.months(),
            year: moment().year(),
            days: {},
            selectionList: [],
            showPopup: null
        }
    },
    mounted() {
        this.calendarDay();
    },
    methods: {
        calendarDay() {
            // load days
            let monthDate = this.focusedDay.startOf('month');
            this.days = [...Array(monthDate.daysInMonth())].map((_, i) => {
                return monthDate.clone().add(i, 'day');
            });
        },
        nextMonth() {
            // button arrow to go to next month
            this.focusedDay = moment(this.focusedDay).add(1, 'months');
        },
        prevMonth() {
            // button arrow to go to previous month
            this.focusedDay = moment(this.focusedDay).subtract(1, 'months');
        },
        column(index) {
            if (index == 0) {
                return this.days[0].day() + 1;
            }
        },
        today(day) {
            return moment().isSame(day, 'day')
        },
        isSelected(day) {
            // compare value of day in v-for loop to add class .selected if in seletionList
            return this.selectionList.includes(day.format('D MMM YY'))
        },
        onMonthChoice(event) {
            // Input watch to set calendarDay
            this.focusedDay = moment().month(event);

            return this.day
        },
        selectDay(val) {
            // Add one by on days to selectionList 
            if (this.selectionList.includes(val)) {
                var index = this.selectionList.indexOf(val);
                this.selectionList.splice(index, 1);
            } else {
                this.selectionList.push(val);
            }

        },
        selectAll(val) {
            // Add recurrent days to selectionList
            var recurrentDay = this.focusedDay.startOf('month').day(val);
            if (recurrentDay.date() > 7) {
                recurrentDay.add(7, 'd');
            };
            var month = recurrentDay.month();
            while (month === recurrentDay.month()) {
                this.selectDay(recurrentDay.format('D MMM YY'));
                recurrentDay = recurrentDay.clone().add(7, 'd');
            }
        }
    },
    watch: {
        focusedDay() {
            this.calendarDay();
        }
    }


})
