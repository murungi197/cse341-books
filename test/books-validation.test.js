import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidCustomId,
  isValidDateString,
  getCreateBookBody,
  getUpdateBookBody,
} from '../src/validation/books.js';
import openApiSpec from '../src/openapi.js';

test('custom IDs and dates follow the required rules for books', () => {
  assert.equal(isValidCustomId('b1'), true);
  assert.equal(isValidCustomId('a_1'), true);
  assert.equal(isValidCustomId('a b'), false);
  assert.equal(isValidCustomId(''), false);
  assert.equal(isValidDateString('2026-01-15'), true);
  assert.equal(isValidDateString('2026-02-30'), false);
  assert.equal(isValidDateString('2026/01/15'), false);
});

test('create book validation trims values and rejects invalid or extra fields', () => {
  assert.deepEqual(getCreateBookBody({
    id: ' b4 ',
    authorId: ' a1 ',
    title: ' Example Book Title ',
    publicationDate: ' 2026-01-15 ',
  }), {
    id: 'b4',
    authorId: 'a1',
    title: 'Example Book Title',
    publicationDate: '2026-01-15',
  });

  assert.equal(getCreateBookBody({
    id: 'b4',
    authorId: 'a1',
    title: 'Example',
  }), null);

  assert.equal(getCreateBookBody({
    id: 'b.4',
    authorId: 'a1',
    title: 'Example',
    publicationDate: '2026-01-15',
  }), null);

  assert.equal(getCreateBookBody({
    id: 'b4',
    authorId: 'a1',
    title: ' ',
    publicationDate: '2026-01-15',
  }), null);
});

test('update book validation allows only mutable fields', () => {
  assert.deepEqual(getUpdateBookBody({
    authorId: ' a2 ',
    title: ' Updated Book Title ',
    publicationDate: ' 2026-02-20 ',
  }), {
    authorId: 'a2',
    title: 'Updated Book Title',
    publicationDate: '2026-02-20',
  });

  assert.equal(getUpdateBookBody({
    id: 'b4',
    authorId: 'a2',
    title: 'Updated Book Title',
    publicationDate: '2026-02-20',
  }), null);

  assert.equal(getUpdateBookBody({
    authorId: 'a2',
    title: 'Updated Book Title',
    publicationDate: '2026-02-99',
  }), null);
});

test('OpenAPI includes all five book routes and the required error models', () => {
  assert.ok(openApiSpec.paths['/books']);
  assert.ok(openApiSpec.paths['/books/{id}']);
  assert.equal(Object.keys(openApiSpec.paths['/books']).sort().join(','), 'get,post');
  assert.equal(Object.keys(openApiSpec.paths['/books/{id}']).sort().join(','), 'delete,get,put');
  assert.ok(openApiSpec.paths['/books'].get.responses['500']);
  assert.ok(openApiSpec.paths['/books/{id}'].get.responses['404']);
  assert.ok(openApiSpec.paths['/books/{id}'].delete.responses['404']);
  assert.ok(openApiSpec.components.schemas.Book);
  assert.ok(openApiSpec.components.schemas.BookCreate);
  assert.ok(openApiSpec.components.schemas.BookUpdate);
});
