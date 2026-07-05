export const validateTodo = (values) => {
  const errors = {};

  if (!values.title || !values.title.trim()) {
    errors.title = 'Tiêu đề không được để trống';
  } else if (values.title.trim().length > 200) {
    errors.title = 'Tiêu đề tối đa 200 ký tự';
  }

  if (values.description && values.description.length > 1000) {
    errors.description = 'Mô tả tối đa 1000 ký tự';
  }

  const validPriorities = ['low', 'medium', 'high'];
  if (values.priority && !validPriorities.includes(values.priority)) {
    errors.priority = 'Mức ưu tiên không hợp lệ';
  }

  if (values.dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(values.dueDate);
    if (due < today && !values._id) {
      errors.dueDate = 'Ngày hạn phải từ hôm nay trở đi';
    }
  }

  return errors;
};

export const hasErrors = (errors) => Object.keys(errors).length > 0;
