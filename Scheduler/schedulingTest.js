const _getTimeSlots = () => {
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
        name: "SE_Lab_CCI_Bld",
        isLab: true,
    }
];

const courses = [
    {
        name: "Information Security",
        teacher: "Adugna A.",
        totalCreditHours: 4,
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
        teacher: "Adugna A.",
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
            return {
                room, booked: booked.map(b => {
                    const { day, hours } = b;
                    if (b.day === dayofTheWeek) {
                        return { day, hours: [...hours, hour] }
                    }
                    return b;
                })
            };
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

const _makeTimeForDisplay = (time = []) => {
    if (time.length <= 0) return "";
    const t = time.reduce((acc, red) => {
        const first = acc.split(" ");
        const second = red.split(" ");
        if (first[0] === second[0]) {
            return `${first[0]} ${first[1]}-${second[1]}`
        }
        return acc + " " + red;
    })

    let long = t.split("-");
    if (long.length > 1) {
        return `${long[0]}-${long[long.length - 1]}`
    }

    return t;

}

const getSchedule = (course) => {
    const _slots = _getTimeSlots()
    const allocateTime = (room, crdthrs) => {
        const time = [];
        for (let i = 0; i < crdthrs; i++) {
            for (const slot of _slots) {
                for (const hour of slot.hours) {
                    if (!_isRoomBooked(room, slot.day, hour)
                        && !_isTeacherBooked(course.teacher, slot.day, hour)) {
                        time.push(slot.day + " " + hour);
                        markRoomBooked(room, slot.day, hour);
                        markTeacherBooked(course.teacher, slot.day, hour);
                        if (time.length >= crdthrs) return _makeTimeForDisplay(time);
                    }
                }
            }
        }
        return _makeTimeForDisplay(time);
    }
    
    const _getTime = (totalCreditHours, labCreditHours = 0) => {
        const lessonCreditHours = totalCreditHours - labCreditHours;
        const labRoom = rooms[1].name;
        const lessonRoom = rooms[0].name;

        return {
            lessonTime: allocateTime(lessonRoom, lessonCreditHours),
            labTime: allocateTime(labRoom, labCreditHours)
        };
    }

    let room = rooms[0].name;
    const { totalCreditHours, labCreditHours } = course;
    if (labCreditHours) {
        room = room + "/" + rooms.filter(r => r.isLab)[0].name
    }

    const { lessonTime, labTime } = _getTime(totalCreditHours, labCreditHours);

    return {
        lessonTime,
        labTime,
        room,
    }
}

const start = () => {
    const schedules = [];
    console.time()
    for (const course of courses) {
        const { lessonTime, labTime, room } = getSchedule(course);
        schedules.push({
            course: course.name,
            crdthrs: course.totalCreditHours,
            // lessonTime,
            // labTime,
            time: lessonTime + "\n" + labTime,
            room,
            teacher: course.teacher,
        })

    }
    console.table(schedules)
    console.timeEnd();
}

start();