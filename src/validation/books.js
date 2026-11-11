const customIdPattern = /^[A-Za-z0-9_-]{1,64}$/;

const isValidCustomId = (value) => {
  if (typeof value !== 'string') {
    return false;
  }

  return customIdPattern.test(value.trim());
};

const isValidDateString = (value) => {
  if (typeof value !== 'string') {
    return false;
  }

  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return false;
  }

  const date = new Date(`${trimmed}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date.toISOString().slice(0, 10) === trimmed;
};

const getBookBody = (body, expectedFields) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return null;
  }

  const keys = Object.keys(body);
  if (keys.length !== expectedFields.length
    || !expectedFields.every((field) => {
      return keys.includes(field);
    })) {
    return null;
  }

  const book = {};
  for (const field of expectedFields) {
    if (typeof body[field] !== 'string') {
      return null;
    }

    const trimmedValue = body[field].trim();
    if (!trimmedValue) {
      return null;
    }

    book[field] = trimmedValue;
  }

  if (Object.hasOwn(book, 'id') && !isValidCustomId(book.id)) {
    return null;
  }

  if (Object.hasOwn(book, 'authorId') && !isValidCustomId(book.authorId)) {
    return null;
  }

  if (Object.hasOwn(book, 'publicationDate') && !isValidDateString(book.publicationDate)) {
    return null;
  }

  return book;
};

const getCreateBookBody = (body) => {
  return getBookBody(body, ['id', 'authorId', 'title', 'publicationDate']);
};

const getUpdateBookBody = (body) => {
  return getBookBody(body, ['authorId', 'title', 'publicationDate']);
};

export {
  isValidCustomId,
  isValidDateString,
  getCreateBookBody,
  getUpdateBookBody,
};
