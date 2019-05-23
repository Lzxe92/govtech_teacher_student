
/*
ALTER TABLE `teacher_student` ADD CONSTRAINT `teacher_student_student_id_foreign`
FOREIGN KEY (`student_id`) REFERENCES `student`(`student_id`);
ALTER TABLE `teacher_student` ADD CONSTRAINT `teacher_student_teacher_id_foreign`
FOREIGN KEY (`teacher_id`) REFERENCES `teacher`(`teacher_id`);
*/

ALTER TABLE `teacher_student` ADD UNIQUE( `teacher_id`, `student_id`);
