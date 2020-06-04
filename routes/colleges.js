const router = require('express').Router();

const {
    getDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment
} = require('./DepartmentController');

router.get('/departments', getDepartments);
router.post('/department', addDepartment);
router.patch('/department/:id', updateDepartment);
router.delete('/department/:id', deleteDepartment);

module.exports = router;