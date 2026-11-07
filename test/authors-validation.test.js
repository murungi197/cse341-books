import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidAuthorId,
  getCreateAuthorBody,
  getUpdateAuthorBody,
} from '../src/validation/authors.js';
import openApiSpec from '../src/openapi.js';

test('author IDs accept only 1-64 letters, digits, hyphens, and underscores', () => {
  assert.equal(isValidAuthorId('a1'), true);
  assert.equal(isValidAuthorId(`a${'1'.repeat(63)}`), true);
  assert.equal(isValidAuthorId(''), false);
  assert.equal(isValidAuthorId('a'.repeat(65)), false);
  assert.equal(isValidAuthorId('author name'), false);
  assert.equal(isValidAuthorId('a.1'), false);
});

test('create author validation trims strings and requires exactly documented fields', () => {
  assert.deepEqual(getCreateAuthorBody({
    id: ' a1 ',
    firstName: ' Maya ',
    lastName: ' Rivera ',
  }), {
    id: 'a1',
    firstName: 'Maya',
    lastName: 'Rivera',
  });
  assert.equal(getCreateAuthorBody({ id: 'a1', firstName: 'Maya' }), null);
  assert.equal(getCreateAuthorBody({
    id: 'a1',
    firstName: 'Maya',
    lastName: 'Rivera',
    _id: 'forbidden',
  }), null);
  assert.equal(getCreateAuthorBody({
    id: 'a.1',
    firstName: 'Maya',
    lastName: 'Rivera',
  }), null);
  assert.equal(getCreateAuthorBody({
    id: 'a1',
    firstName: '  ',
    lastName: 'Rivera',
  }), null);
  assert.equal(getCreateAuthorBody([]), null);
});

test('update author validation rejects immutable IDs and trims mutable fields', () => {
  assert.deepEqual(getUpdateAuthorBody({
    firstName: ' Jordan ',
    lastName: ' Morgan ',
  }), {
    firstName: 'Jordan',
    lastName: 'Morgan',
  });
  assert.equal(getUpdateAuthorBody({
    id: 'a1',
    firstName: 'Jordan',
    lastName: 'Morgan',
  }), null);
  assert.equal(getUpdateAuthorBody({
    firstName: 'Jordan',
    lastName: '',
  }), null);
});

test('Swagger documents all five author routes and their error responses', () => {
  assert.deepEqual(openApiSpec.components.schemas.Author.oneOf, [
    { $ref: '#/components/schemas/CurrentAuthor' },
    { $ref: '#/components/schemas/LegacyAuthor' },
  ]);
  assert.deepEqual(openApiSpec.components.schemas.LegacyAuthor.required, [
    'id',
    'name',
    'birthYear',
  ]);
  assert.deepEqual(Object.keys(openApiSpec.paths['/authors']).sort(), ['get', 'post']);
  assert.deepEqual(Object.keys(openApiSpec.paths['/authors/{id}']).sort(), [
    'delete',
    'get',
    'put',
  ]);
  assert.ok(openApiSpec.paths['/authors'].get.responses['500']);
  assert.ok(openApiSpec.paths['/authors'].post.responses['400']);
  assert.ok(openApiSpec.paths['/authors'].post.responses['409']);
  for (const method of ['get', 'put', 'delete']) {
    assert.ok(openApiSpec.paths['/authors/{id}'][method].responses['400']);
    assert.ok(openApiSpec.paths['/authors/{id}'][method].responses['404']);
    assert.ok(openApiSpec.paths['/authors/{id}'][method].responses['500']);
  }
  assert.ok(openApiSpec.paths['/authors/{id}'].delete.responses['409']);
});
