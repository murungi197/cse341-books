const customIdPattern = /^[A-Za-z0-9_-]{1,64}$/;

const isValidAuthorId = (id) => {
  return typeof id === 'string' && customIdPattern.test(id);
};

const getAuthorBody = (body, expectedFields) => {
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

  const author = {};
  for (const field of expectedFields) {
    if (typeof body[field] !== 'string') {
      return null;
    }

    author[field] = body[field].trim();
    if (!author[field]) {
      return null;
    }
  }

  if (Object.hasOwn(author, 'id') && !isValidAuthorId(author.id)) {
    return null;
  }

  return author;
};

const getCreateAuthorBody = (body) => {
  return getAuthorBody(body, ['id', 'firstName', 'lastName']);
};

const getUpdateAuthorBody = (body) => {
  return getAuthorBody(body, ['firstName', 'lastName']);
};

export {
  isValidAuthorId,
  getCreateAuthorBody,
  getUpdateAuthorBody,
};
