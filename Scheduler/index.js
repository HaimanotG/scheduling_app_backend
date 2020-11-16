const Department = require("../models/Department");
const Teacher = require("../models/Teacher");

const _getRowData = () =>
    new Promise(async (resolve, reject) => {
        Department.find({})
            .select("batches rooms")
            .populate({
                path: "batches",
                populate: {
                    path: "semesters",
                    populate: {
                        path: "courses"
                    }
                }
            })
            .populate("rooms")
            .exec()
            .then((_departments, error) => {
                if (error) throw error;
                const DAYS_IN_A_WEEK = ['Monday', 'Tuesday', 'Wedensday', 'Thursday', 'Friday'];
                const HOURS_IN_A_DAY = ['2:30', '3:30', '4:30', '5:30', '7:30', '8:30', '9:30', '10:30'];
                
                let sc = [];
                _departments.forEach(department => {
                    const nr = department.rooms.length;
                    _slots = new Array(DAYS_IN_A_WEEK.length * HOURS_IN_A_DAY.length * nr);
                    department.batches.forEach(batch => {
                        batch.semesters.forEach(semester => {
                            const time = Math.floor(Math.random() * HOURS_IN_A_DAY.length) ;
                            const day = Math.floor(Math.random() * DAYS_IN_A_WEEK.length) ;
                            const room = Math.floor(Math.random() * nr) ;
                            const pos = Math.floor(Math.random() * _slots.length);
                            console.log("Pos: ", pos, time, day, room);
                            semester.courses.forEach(course => {
                                console.log(typeof course.teacher);
                                _slots[pos] = {
                                    course: course.name,
                                    teacher: (typeof course.teacher) === 'object' ? course.teacher : null,
                                    room: department.rooms[room] !== undefined ? department.rooms[room].name : null,
                                    day: DAYS_IN_A_WEEK[day],
                                    time: HOURS_IN_A_DAY[time],
                                };
                            });
                            
                        });
                    });
            
                    sc.push({department: department.name, slots: _slots});
                });
                resolve(sc);
            })
            .catch(e => {
                reject(e);
            });
    });


const startSchedule = () => _getRowData();
module.exports = {
    startSchedule
};