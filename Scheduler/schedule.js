const _getSlots = () => {
    return ['Monday', 'Thusday', 'Wedensday', 'Thursday', 'Friday'].map(day => ({
        day,
        hours: ['8:30AM', '9:30AM', '10:30AM', '11:30AM', '12:30PM',
            '1:30PM', '2:30PM', '3:30PM', '4:30PM']
    }))
}

const rooms = [
    {
        name: "VII7",
    },
    {
        name: "SE Lab CCI Bld",
        isLab: true,
    }
];

const courses = [
    {
        name: "Information Security",
        teacher: "Adugna A.",
        totalCreditHours: 3,
        labCreditHours: 2
    },
    {
        name: "Human Computer Interaction",
        teacher: "Addis S.",
        totalCreditHours: 3,
        labCreditHours: 2
    },
    {
        name: "Software Requirements Engineering",
        teacher: "Feyisa",
        totalCreditHours: 3
    },
    {
        name: "Probability and Statistics",
        teacher: "TBA",
        totalCreditHours: 3
    },
    {
        name: "Real-time and Embedded Systetms",
        teacher: "Gemechis T",
        totalCreditHours: 3,
        labCreditHours: 2
    },
    {
        name: "Software Design and Architecture",
        teacher: "De. Gavandra",
        totalCreditHours: 3,
    }
];

let _timeTeacherBooked = [
    {
        teacher: "Bededa",
        booked: [
            {
                day: "Monday",
                hours: ['10:30AM']
            }
        ]
    }
];

let _timesRoomBooked = [
    {
        room: "VII7",
        booked: [
            {
                day: "Monday",
                hours: ['8:30AM',],
            }
        ]
    },
    {
        room: "V11",
        booked: [
            {
                day: "Monday",
                hours: ['10:30AM',]
            }
        ]
    }
];

const markRoomBooked = (room, dayofTheWeek, hour) => {
    _timesRoomBooked = _timesRoomBooked.map(r => {
        if (r.room === room) {
            const { room, booked } = r;
            const newObject = {
                room, booked: booked.map(b => {
                    const { day, hours } = b;
                    if (b.day === dayofTheWeek) {
                        return { day, hours: [...hours, hour] }
                    }
                    return b;
                })
            };
            return newObject;
        }
        return r;
    });
}

const markTeacherBooked = (teacher, dayofTheWeek, hour) => {
    _timeTeacherBooked = _timeTeacherBooked.map(r => {
        if (r.teacher === teacher) {
            const { teacher, booked } = r;
            const newObject = {
                teacher, booked: booked.map(b => {
                    const { day, hours } = b;
                    if (b.day === dayofTheWeek) {
                        return { day, hours: [...hours, hour] }
                    }
                    return b;
                })
            };
            return newObject;
        }
        return r;
    });
}

const _isRoomBooked = (room, day, hour) => {
    const roominBooked = _timesRoomBooked.filter(r => r.room === room)[0];
    if (roominBooked) {
        for (const schedule of roominBooked.booked) {
            if (schedule.day === day) {
                for (const _hour of schedule.hours) {
                    if (_hour === hour) {
                        return true;
                    }
                }
            }
        }
    }

    return false;
}

const _isTeacherBooked = (teacher, day, hour) => {
    const teacherinBooked = _timeTeacherBooked.filter(r => r.teacher === teacher)[0];
    if (teacherinBooked) {
        for (const schedule of teacherinBooked.booked) {
            if (schedule.day === day) {
                for (const _hour of schedule.hours) {
                    if (_hour === hour) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

const simplifyTime = time => {
    if (time.length < 0) return [];
    let simplifedTime = "";
    // if (time.length > 1) {
    //     for (let i = 0; i < time.length - 1; i++) {
    //         const first = time[i].split(" ");
    //         const second = time[i + 1].split(" ");
    //         if (first[0] === second[0]) {
    //             simplifedTime += first[0] + " " + first[1] + "-" + second[1] + " ";
    //             time[i + 1] = simplifedTime;
    //         }
    //     }
    // }
    return time;
}

const getSchedule = (course) => {
    const _slots = _getSlots()
    const labRoom = rooms[1];
    const lessonRoom = rooms[0];
    // eslint-disable-next-line no-unused-vars
    const allocateTimeforaRoom = (room, crdthrs) => {
        const time = [];
        for (const slot of _slots) {
            for (const hour of slot.hours) {
                if (!_isRoomBooked(room, slot.day, hour)
                    && !_isTeacherBooked(course.teacher, slot.day, hour)) {
                    time.push(slot.day + " " + hour);
                    markRoomBooked(room, slot.day, hour);
                    markTeacherBooked(course.teacher, slot.day, hour);
                    if (time.length >= crdthrs) return simplifyTime(time);
                }
            }
        }
        return simplifyTime(time);
    }
    const _bookTime = (totalCreditHours, labCreditHours = 0) => {
        let time = [];
        const lessonCreditHours = totalCreditHours - labCreditHours;

        for (let i = 0; i < lessonCreditHours; i++) {
            // time += allocateTimeforaRoom("VII7", lessonCreditHours);
            let lessonTime = [];
            for (const slot of _slots) {
                for (const hour of slot.hours) {
                    if (!_isRoomBooked(lessonRoom, slot.day, hour)
                        && !_isTeacherBooked(course.teacher, slot.day, hour)) {
                        lessonTime.push(slot.day + " " + hour);
                        markRoomBooked(lessonRoom, slot.day, hour);
                        markTeacherBooked(course.teacher, slot.day, hour);
                        if (time.length >= lessonCreditHours) break;
                    }
                }
            }
            console.log(lessonTime);
            time.push(lessonTime);
        }

        for (let i = 0; i < labCreditHours; i++) {
            // time += allocateTimeforaRoom("SE Lab CCI Bld", labCreditHours);
            let lTime = [];
            for (const slot of _slots) {
                for (const hour of slot.hours) {
                    if (!_isRoomBooked(labRoom, slot.day, hour)
                        && !_isTeacherBooked(course.teacher, slot.day, hour)) {
                        lTime.push(slot.day + " " + hour);
                        markRoomBooked(labRoom, slot.day, hour);
                        markTeacherBooked(course.teacher, slot.day, hour);
                        if (time.length >= lessonCreditHours) break;
                    }
                }
            }

            time.push(lTime);
        }
        return simplifyTime(time);
    }

    let room = rooms[0].name;
    const { totalCreditHours, labCreditHours } = course;
    if (labCreditHours) {
        room = room + "/" + rooms.filter(r => r.isLab)[0].name
    }

    const time = _bookTime(totalCreditHours, labCreditHours);

    return {
        time,
        room,
    }
}

const start = () => {
    const schedules = [];
    console.time()
    for (const course of courses) {
        const { time, room } = getSchedule(course);
        schedules.push({
            course: course.name,
            crdthrs: course.totalCreditHours,
            time,
            room,
            teacher: course.teacher,
        })
    }
    console.table(schedules)
    console.timeEnd();
}

start();