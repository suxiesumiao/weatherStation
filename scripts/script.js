Vue.component('weather-details', {
    props: ['data'],
    template: `<tr>
                    <td>{{ data.weatherTitle }}</td>
                    <td>{{ data.weatherDetails }}</td>
               </tr>`
})

let weatherStation = new Vue({
    el: '#weatherStation',
    data: {
        proMain: false,
        proHourly: true,
        begin: 'http://api.openweathermap.org/data/2.5/',
        id: '7c5219469d1d3aa869d2599559d26fc1',
        city: 'Beijing',
        countryCode: '',
        tempImgsrc: '',
        temperature: 'temperature',
        timeNow: '',
        description: 'description',
        weatherTotal: [
            { weatherTitle: "Wind", weatherDetails: "Wind" },
            { weatherTitle: "Cloudiness", weatherDetails: "Cloudiness" },
            { weatherTitle: "Pressure", weatherDetails: "Pressure" },
            { weatherTitle: "Humidity", weatherDetails: "Humidity" },
            { weatherTitle: "Sunrise", weatherDetails: "Sunrise" },
            { weatherTitle: "Sunset", weatherDetails: "Sunset" },
            { weatherTitle: "Geo coords", weatherDetails: "[ ]" }
        ],
        weatherProMain: [],
        weatherProHourly: [],
    },
    created: function () {
        // 初始化
        this.resolu()
    },
    methods: {
        computtA: function () {
            this.proMain = true
            this.proHourly = false
        },
        computtB: function () {
            this.proHourly = true
            this.proMain = false
        },
        getTime: function (number, index) {
            return new Date(number * 1000).toString().split(' ')[index].split(':').splice(0, 2).join(':')
        },
        initArray: function (array, number) {
            return {
                hourly: [
                    array[number]
                ]
            }
        },
        analyArray: function (array) {
            let over = []
            let start = this.initArray(array, 0)
            over.push(start)
            for (let i = 1; i < array.length; i++) {
                if (this.getDay(array[i].dt) === this.getDay(array[i - 1].dt)) {
                    over[over.length - 1].hourly.push(array[i])
                } else {
                    over.push(this.initArray(array, i))
                }
            }
            return over
        },
        getDay: function (string) {
            return new Date(Number(string) * 1000).toString().split(' ')[2]
        },
        getYear: function (number,index) {
            return new Date(number * 1000).toDateString().split(' ').splice(0, index).join(' ')
        },

        resolu: function () {
            let currentUrl = `${this.begin}weather?q=${this.city}&appid=${this.id}&units=metric&lang=zh_cn`
            let myDate = new Date()
            let that = this
            axios.get(currentUrl).then(function (res) {
                let resData = res.data
                let dateSunrise = new Date(resData.sys.sunrise * 1000).toLocaleTimeString()
                let dateSunset = new Date(resData.sys.sunset * 1000).toLocaleTimeString()
                let dataArray = [
                    resData.wind.speed + 'm/s',
                    resData.weather[0].description,
                    resData.main.pressure + ' hPa',
                    resData.main.humidity + ' %',
                    dateSunrise,
                    dateSunset,
                    `[${resData.coord.lat} , ${resData.coord.lon}]`
                ]
                for (let i = 0; i < dataArray.length; i++) {
                    that.weatherTotal[i].weatherDetails = dataArray[i]
                }
                that.tempImgsrc = `http://openweathermap.org/img/w/${resData.weather[0].icon}.png`
                that.temperature = resData.main.temp + '°C'
                that.countryCode = resData.sys.country
                that.description = resData.weather[0].description
                that.timeNow = myDate.toString().split(' ')[0] + 'day-' + myDate.toLocaleDateString() + '-' + myDate.toLocaleTimeString()
            })

            // 每日天气预报Main
            let proMainUrl = `${this.begin}forecast/daily?q=${this.city}&appid=${this.id}&units=metric&lang=zh_cn&cnt=16`
            axios.get(proMainUrl).then(function (res) {
                let resData = res.data
                that.weatherProMain = resData.list
            })

            // 每小时天气预报
            let proHourlyUrl = `${this.begin}forecast?q=${this.city}&appid=${this.id}&units=metric&lang=zh_cn`
            axios.get(proHourlyUrl).then(function (res) {
                let resData = res.data
                that.weatherProHourly = that.analyArray(resData.list)
                console.log(that.weatherProHourly)
            })
        }
    }
})





























// weatherStation.$watch('city', function (newVal, oldVal) {
//     console.log(newVal + oldVal)
// })


