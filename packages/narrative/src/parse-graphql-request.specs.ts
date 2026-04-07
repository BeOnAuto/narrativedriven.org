import { describe, expect, it } from 'vitest';
import { parseGraphQlRequest, parseMomentRequest } from './parse-graphql-request';

describe('parseGraphQlRequest', () => {
  it('parses a query operation', () => {
    const request = `query GetUsers($status: String) {
      users(status: $status) {
        id
        name
      }
    }`;

    expect(parseGraphQlRequest(request)).toEqual({
      operationName: 'users',
      args: [{ name: 'status', tsType: 'string', graphqlType: 'String', nullable: true }],
    });
  });

  it('parses a mutation operation', () => {
    const request = `mutation SubmitAnswer($input: SubmitAnswerInput!) {
      submitQuestionnaireAnswer(input: $input) {
        success
      }
    }`;

    expect(parseGraphQlRequest(request)).toEqual({
      operationName: 'submitQuestionnaireAnswer',
      args: [{ name: 'input', tsType: 'SubmitAnswerInput', graphqlType: 'SubmitAnswerInput', nullable: false }],
    });
  });

  it('parses a nullable list of non-null scalars [String!]', () => {
    const request = `mutation AddPlace($amenities: [String!]) {
      addPlace(amenities: $amenities) { id }
    }`;

    expect(parseGraphQlRequest(request)).toEqual({
      operationName: 'addPlace',
      args: [{ name: 'amenities', tsType: 'string[]', graphqlType: 'String', nullable: true }],
    });
  });

  it('parses a non-null list of non-null scalars [String!]!', () => {
    const request = `mutation AddPlace($amenities: [String!]!) {
      addPlace(amenities: $amenities) { id }
    }`;

    expect(parseGraphQlRequest(request)).toEqual({
      operationName: 'addPlace',
      args: [{ name: 'amenities', tsType: 'string[]', graphqlType: 'String', nullable: false }],
    });
  });

  it('parses a nullable list of custom types [CustomType]', () => {
    const request = `query GetItems($filters: [CustomType]) {
      items(filters: $filters) { id }
    }`;

    expect(parseGraphQlRequest(request)).toEqual({
      operationName: 'items',
      args: [{ name: 'filters', tsType: 'CustomType[]', graphqlType: 'CustomType', nullable: true }],
    });
  });
});

describe('parseMomentRequest', () => {
  it('returns parsed operation when request is present', () => {
    const slice = {
      request: `query GetItems { items { id } }`,
    };

    expect(parseMomentRequest(slice)).toEqual({
      operationName: 'items',
      args: [],
    });
  });

  it('returns undefined when request is absent', () => {
    expect(parseMomentRequest({})).toEqual(undefined);
  });

  it('returns undefined when request is undefined', () => {
    expect(parseMomentRequest({ request: undefined })).toEqual(undefined);
  });
});
