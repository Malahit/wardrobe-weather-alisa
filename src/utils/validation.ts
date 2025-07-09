// Утилиты для валидации данных

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Пароль должен содержать минимум 8 символов');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну заглавную букву');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну строчную букву');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну цифру');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Удаляем потенциально опасные символы
    .substring(0, 1000); // Ограничиваем длину
};

export const validateFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const validateImageFile = (file: File): {
  isValid: boolean;
  error?: string;
} => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Поддерживаются только файлы JPEG, PNG и WebP'
    };
  }
  
  if (!validateFileSize(file, 10)) {
    return {
      isValid: false,
      error: 'Размер файла не должен превышать 10 МБ'
    };
  }
  
  return { isValid: true };
};