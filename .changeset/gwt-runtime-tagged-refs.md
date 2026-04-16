---
'@onauto/narrative': minor
---

GWT steps are now natural-English sentences with runtime-tagged type refs.

**Breaking changes**

- **DSL signature**: the four step builders take a runtime-tagged `TypedRef` as
  the first positional arg and the Gherkin sentence as the second arg:

  ```ts
  // before
  .given<TodoList>({ items: [] })
  .when<AddTodo>({ todoId: 't1', description: 'milk' })
  .then<TodoAdded>({ todoId: 't1', description: 'milk' })

  // after
  .given(TodoList, 'an empty list exists', { items: [] })
  .when(AddTodo, 'the user adds a todo', { todoId: 't1', description: 'milk' })
  .then(TodoAdded, 'the new todo is recorded', { todoId: 't1', description: 'milk' })
  ```

- **Type declarations**: domain types are now declared as runtime values via
  factory functions that return `TypedRef` instances. The factories register
  `(name → classification)` in a process-global registry on module load so the
  pipeline and validator can resolve classification without AST introspection.

  ```ts
  // before
  type AddTodo = Command<'AddTodo', { todoId: string; description: string }>;

  // after
  const AddTodo = defineCommand<{ todoId: string; description: string }>('AddTodo');
  ```

  The `Command<N, D>` / `Event<N, D>` / `State<N, D>` / `Query<N, D>` type
  aliases are still exported for type-level compatibility with external
  consumers, but the internal DSL uses only the factories.

- **`Step` shape changed**: `text` now holds the natural-English sentence (was
  the type name). A new `__typeName: string` field carries the domain type
  name. Both are required on `StepWithDocString`. Error steps (`StepWithError`)
  gained a required `text` field for the sentence.

- **Emitted code** (`modelToNarrative` output): files now declare
  `const X = define<Kind><{...}>('X')` instead of `type X = Command<'X', {...}>`
  and emit `.X(Ref, "sentence", data)` call chains. Cross-module references
  are now value imports rather than `import type`.

- **Removed public APIs**:
  - `setGivenTypesByFile` from `narrative-context`
  - `GivenTypeInfo` type, `parseGivenTypeArguments`, `parseWhenTypeArguments`,
    `parseThenTypeArguments` from `loader/ts-utils`
  - `resolveInferredType`, `resolveFromCandidates`, `tryResolveByExampleData`,
    `tryResolveByExpectedType` from `type-inference`
  - `givenTypesByFile` field on the `getScenes()` and `executeAST()` return
    shapes

- **Removed internal sentinels and dodges**: `'InferredType'` sentinel,
  ordinal-based AST call matcher, alt-resolution retries, shotgun
  `{eventRef, commandRef, stateRef}` assignment.

**New additions**

- `defineCommand` / `defineEvent` / `defineState` / `defineQuery` factories.
- `TypedRef`, `AnyTypedRef`, `DataOf`, `NameOf`, `KindOf`, `Classification`,
  `ClassificationValues` types.
- `registerRef`, `getClassificationFor`, `resetRefRegistry` runtime helpers.
- `schema-validation` module with `validateSceneClassifications` — enforces
  the moment-type classification matrix (command: Given state|event, When
  command, Then event; query: Given state|event, When event|query, Then
  state; react: Given state|event, When event, Then command).
- `transformers/step-traversal` module with a `walkSteps` iterator that
  yields each step alongside its effective `Given`/`When`/`Then` keyword
  (`And` continuations inherit the preceding major keyword).

**Migration**

1. Replace each `type X = Command<'X', {...}>` (or `Event<…>`, `State<…>`,
   `Query<…>`) with `const X = defineCommand<{...}>('X')` (or
   `defineEvent`, `defineState`, `defineQuery`).
2. Replace each `.given<T>(data)` / `.when<T>(data)` / `.then<T>(data)` /
   `.and<T>(data)` call with `.given(T, 'sentence', data)` /
   `.when(T, 'sentence', data)` / etc.
3. Replace each `thenError(type, message?)` call with
   `thenError('sentence', type, message?)`.
4. If you were reading `step.text` expecting the type name, switch to
   `step.__typeName`. `step.text` now stores the sentence.
