const { timeSlots, getDepartmentByHead } = require('./scheduleData');
let rooms = [];
const _slots = timeSlots();

let _timeTeacherBooked = [
    {
        teacher: "Adugna A",
        booked: [
            {
                day: "Thusday",
                hours: ['8:30AM']
            }
        ]
    }
];

let _timesRoomBooked = [
    {
        room: "VII7-7",
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
    console.table(_timesRoomBooked[0].booked[0].hours);
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
    const allocateTime = (room, crdthrs) => {
        const time = [];
        for (let i = 0; i < crdthrs; i++) {
            for (const slot of _slots) {
                for (const hour of slot.hours) {
                    const teacher = course.teacher ? course.teacher.name : 'TBA';
                    // if (!_isRoomBooked(room, slot.day, hour)
                    //     && !_isTeacherBooked(teacher, slot.day, hour)) {
                    //     time.push(slot.day + " " + hour);
                    //     markRoomBooked(room, slot.day, hour);
                    //     markTeacherBooked(teacher, slot.day, hour);
                    //     if (time.length >= crdthrs) return _makeTimeForDisplay(time);
                    // }

                    if(!_isRoomBooked(room, slot.day, hour)){
                        markRoomBooked(room, slot.day, hour);
                        time.push(slot.day + " " + hour);
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

const schedule = async id => {
    try {
        console.time()
        // const data = await getDepartmentByHead("5fefba02ae17b0194cfb8459");
        // rooms = data.rooms;
        const schedules = [];
        // for (const batch of data.batches) {
        //     for(const semester of batch.semesters){
        //         for(const course of semester.courses){
        //             const { lessonTime, labTime, room } = getSchedule(course);
        //             schedules.push({
        //                 course: course.name,
        //                 crdthrs: course.totalCreditHours,
        //                 // lessonTime,
        //                 // labTime,
        //                 time: lessonTime + "\n" + labTime,
        //                 room,
        //                 teacher: course.teacher ? course.teacher.name : 'TBA',
        //             })
        //         }
        //     }
        // }
        // console.table(schedules)
        console.timeEnd();
        return schedules;
    } catch(e){
        console.log(e);
    }
}
// schedule();

module.exports = schedule;