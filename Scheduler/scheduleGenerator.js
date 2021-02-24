const { timeSlots, getDepartmentByHead, getCurrentSemester } = require('./scheduleData');
const Schedule = require("../models/Schedule");
const _slots = timeSlots();
let _timesRoomBooked = [];
let _timeTeacherBooked = [];

const markTeacherAsBooked = (teacher, dayofTheWeek, hour) => {
    const isTeacherinBooked = _timeTeacherBooked.find(_ => _.teacher === teacher);
    if (isTeacherinBooked) {
        _timeTeacherBooked = _timeTeacherBooked.map(_ => {
            if (_.teacher === teacher) {
                const { teacher, booked } = _;
                const isDayinBooked = booked.find(_ => _.day === dayofTheWeek);
                if (isDayinBooked) {
                    return {
                        teacher, booked: booked.map(b => {
                            const { day, hours } = b;
                            if (b.day === dayofTheWeek) {
                                return { day, hours: [...hours, hour] }
                            }
                            return b;
                        })
                    }
                } else {
                    return {
                        teacher,
                        booked: [...booked, { day: dayofTheWeek, hours: [hour] }]
                    }
                }
            } else {
                return _;
            }
        })
    } else {
        const booked = [{ day: dayofTheWeek, hours: [hour] }]
        _timeTeacherBooked.push({ teacher, booked });
    }
}
const markRoomAsBooked = (room, dayofTheWeek, hour, batch) => {
    const isRoominBooked = _timesRoomBooked.find(_ => _.room === room);
    if (isRoominBooked) {
        _timesRoomBooked = _timesRoomBooked.map(_ => {
            if (_.room === room) {
                const { room, booked } = _;
                const isDayinBooked = booked.find(_ => _.day === dayofTheWeek);
                if (isDayinBooked) {
                    return {
                        room, booked: booked.map(b => {
                            const { day, hours } = b;
                            if (b.day === dayofTheWeek) {
                                return { day, hours: [...hours, { batch, hour }] }
                            }
                            return b;
                        })
                    };
                } else {
                    return {
                        room,
                        booked: [...booked, { day: dayofTheWeek, hours: [{ batch, hour }] }]
                    }
                }
            } else {
                return _;
            }
        });
    } else {
        const booked = [{
            day: dayofTheWeek, hours: [{
                batch,
                hour,
            }]
        }]
        _timesRoomBooked.push({ room, booked });
    }
}
const _isBatchBooked = (room, day, h, batch) => {
    const roominBooked = _timesRoomBooked.find(r => r.room === room);
    if (roominBooked) {
        for (const schedule of roominBooked.booked) {
            if (schedule.day === day) {
                for (const hour of schedule.hours) {
                    if (hour.hour === h && hour.batch === batch) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

const _isRoomBooked = (room, day, h, batch) => {
    const roominBooked = _timesRoomBooked.find(r => r.room === room);
    if (roominBooked) {
        for (const schedule of roominBooked.booked) {
            if (schedule.day === day) {
                for (const hour of schedule.hours) {
                    if (hour.hour === h) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

const _isTeacherBooked = (teacher, day, hour) => {
    const teacherinBooked = _timeTeacherBooked.find(r => r.teacher === teacher);
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
    const t = time.reduceRight((acc, red) => {
        return acc + " " + red;
    })
    return t;
    // const t = time.reduce((acc, red) => {
    //     const first = acc.split(" ");
    //     const second = red.split(" ");
    //     if (first[0] === second[0]) {
    //         return `${first[0]} ${first[1]}-${second[1]}`
    //     }
    //     return acc + " " + red;
    // })

    // let long = t.split("-");
    // if (long.length > 1) {
    //     return `${long[0]}-${long[long.length - 1]}`
    // }

    return t;
}

const allocateTime = (room, crdthrs, teacher, batch) => {
    const time = [];
    for (let i = 0; i < crdthrs; i++) {
        const s = _slots[Math.floor(Math.random() * _slots.length)];
        const h = s.hours[Math.floor(Math.random() * s.hours.length)];

        if (!_isRoomBooked(room, s.day, h)
            && !_isTeacherBooked(teacher, s.day, h)
            && !_isBatchBooked(room, s.day, h, batch)) {
            time.push(s.day + " " + h);
            markRoomAsBooked(room, s.day, h, batch);
            markTeacherAsBooked(teacher, s.day, h);
            if (time.length >= crdthrs) return _makeTimeForDisplay(time);
        }

        for (const slot of _slots) {
            for (const hour of slot.hours) {
                if (!_isRoomBooked(room, slot.day, hour)
                    && !_isTeacherBooked(teacher, slot.day, hour)
                    && !_isBatchBooked(room, slot.day, hour, batch)) {
                    time.push(slot.day + " " + hour);
                    markRoomAsBooked(room, slot.day, hour);
                    markTeacherAsBooked(teacher, slot.day, hour);
                    if (time.length >= crdthrs) return _makeTimeForDisplay(time);
                }
            }
        }
    }
    return _makeTimeForDisplay(time);
}

const generateScheduleForCourse = ({ teacher, totalCreditHours, labCreditHours },
    { labRoom, classRoom }, batch) => {
    const lessonCreditHours = totalCreditHours - labCreditHours;
    teacher = teacher ? teacher.name : 'TBA';
    return {
        lessonTime: allocateTime(classRoom, lessonCreditHours, teacher, batch),
        labTime: allocateTime(labRoom, labCreditHours, teacher, batch)
    }
}

const schedule = async id => {
    const schedules = [];
    try {
        console.time()
        const department = await getDepartmentByHead(id);
        const isDeletionASuccess = await Schedule.deleteMany({ department: department._id });
        const currentSemester = await getCurrentSemester();

        for (const batch of department.batches) {

            const { labRoom = 'none', classRoom = 'none' } = batch;
            const labRoomName = labRoom.name ? labRoom.name : 'none';
            const classRoomName = classRoom.name ? classRoom.name : 'none';
            const rooms = { labRoom: labRoomName, classRoom: classRoomName };
            const currentSemesters = await batch.semesters.filter(_ => _.name === currentSemester);

            for (const semester of currentSemesters) {
                const semesterSchedule = {
                    semester: semester._id,
                    batch: batch._id,
                    schedule: []
                };

                for (const course of semester.courses) {
                    const { name, totalCreditHours, code } = course;
                    const teacher = course.teacher ? course.teacher.name : 'TBA';

                    let room = classRoom.name;
                    if (course.labCreditHours) {
                        room = room + "/" + labRoom.name;
                    }

                    const { lessonTime, labTime } = generateScheduleForCourse(course, rooms, batch._id);
                    time = lessonTime;
                    if (labTime) {
                        time = time + "  " + labTime + "(Lab)"
                    }
                    let generated = {
                        department: department._id,
                        batch: batch._id,
                        code,
                        course: name,
                        creditHours: totalCreditHours,
                        time,
                        room,
                        teacher,
                        teacherId: course.teacher ? course.teacher._id : 'null'
                    }
                    semesterSchedule.schedule.push(generated)
                    await new Schedule(generated).save();
                }
                schedules.push(semesterSchedule);
            }
        }
        console.timeEnd();
        // console.log(schedules);
        // console.table(schedules);
        // console.table(_timesRoomBooked[0]);
        // console.log(_timesRoomBooked[0]);
        return schedules;
    } catch (e) {
        console.log(e);
    }
}

module.exports = schedule;