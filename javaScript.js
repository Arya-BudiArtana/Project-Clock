window.addEventListener('DOMContentLoaded', () => {
    const clock = new ProgressClock("#clock");
});

class ProgressClock {
    constructor(qs) {
        this.el = document.querySelector(qs);
        this.time = 0;
        this.updateTimeOut = null;
        this.ringTimeOuts = [];
        this.update();
    }

    getDayOfWeek(day){
        switch (day) {
            case 1:
                return "Senin";
            case 2:
                return "Selasa";
            case 3:
                return "Rabu";
            case 4:
                return "Kamis";
            case 5:
                return "Jumat";
            case 6:
                return "Sabtu";
            default:
                return "Minggu";
        }
    }

    getMonthInfo(mo,yr) {
        switch (mo) {
            case 1:
                return {name: "Februari", days: yr % 4 === 0 ? 29 : 28};
            case 2:
                return {name: "Maret", days: 31};
            case 3:
                return {name: "April", days: 30};
            case 4:
                return {name: "Mei", days: 31};
            case 5:
                return {name: "Juni", days: 30};
            case 6:
                return {name: "Juli", days: 31};             
            case 7:
                return {name: "Agustus", days: 31};
            case 8:
                return {name: "September", days: 30};
            case 9:
                return {name: "Oktober", days: 31};
            case 10:
                return {name: "November", days: 30};
            case 11:
                return {name: "Desemeber", days: 31}; 
            default :
                return {name: "Januari", days: 31};
        }
    }

    update() {
        this.time = new Date();

        if (this.el) {
            const dayOfWeek = this.time.getDay();
            const year = this.time.getFullYear();
            const month = this.time.getMonth();
            const day = this.time.getDate();
            const hr = this.time.getHours();
            const min = this.time.getMinutes();
            const sec = this.time.getSeconds();
            const dayOfWeekName = this.getDayOfWeek(dayOfWeek);
            const MonthInfo = this.getMonthInfo(month, year);
            const min_progress = sec / 60;
            const h_progress = (min + min_progress) / 60;
            const d_progress = (hr + h_progress) / 24;
            const mo_progress = ((day-1) + d_progress) / MonthInfo.days;
            const units = [
                {
                    label: "w",
                    value: dayOfWeekName
                },

                {
                    label: "mo",
                    value: MonthInfo.name,
                    progress: mo_progress
                },
                
                {
                    label: "d",
                    value: day,
                    progress: d_progress
                },

                {
                    label: "h",
                    value: hr > 12 ? hr -12: hr,
                    progress: h_progress
                },

                {
                    label: "m",
                    value: min < 10 ? "0" + min : min,
                    progress: min_progress
                },

                {
                    label: "s",
                    value: sec < 10 ? "0" + sec : sec
                },

                {
                    label: "ap",
                    value: hr > 12 ? "PM" : "AM" 
                }
            ];

            this.ringTimeOuts.forEach (t => {
                clearTimeout(t);
            });

            this.ringTimeOuts = [];
            units.forEach( u => {
                const ring = this.el.querySelector(`
                    [data-ring = "${u.label}"]`);
                
                if (ring) {
                    const strokeDashArray = ring.getAttribute("stroke-dasharray");
                    const fill360 = "progress-clock_fill--360";

                    if (strokeDashArray) {
                        const circumference = +strokeDashArray.split(" ")[0];
                        const strokeDashOffsetPct = 1 - u.progress;

                        ring.setAttribute(
                            "stroke-dashoffset",
                            strokeDashOffsetPct * circumference
                        );

                        if (strokeDashOffsetPct === 1) {
                            ring.classList.add(fill360);
                            this.ringTimeOuts.push(
                                setTimeout(() => {
                                    ring.classList.remove(fill360);
                                }, 600),
                            );
                        }
                    }
                }

                const unit = this.el.querySelector (`[data-unit = "${u.label}"]`);
                if (unit) {
                    unit.innerText = u.value;
                }
            }

            )

        }

        clearTimeout(this.updateTimeOut);
        this.updateTimeOut = setTimeout(this.update.bind(this), 1e3);
    }
}

